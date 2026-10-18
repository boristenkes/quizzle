import {
	extractTextFromPDF,
	gemini,
	GEMINI_MODEL_NAME
} from '@/features/ai/client'
import { getGenerateQuestionsPrompt } from '@/features/ai/prompts'
import { generateQuestionsConfigSchema, pdfFileSchema } from '@/features/ai/zod'
import { questionFormSchema } from '@/features/questions/zod'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

const systemInstruction = `
You are a strict, deterministic quiz-question generation API.

Rules:
- Use ONLY the provided PDF text as the source of truth.
- Do NOT use any external knowledge.
- Do NOT invent facts, concepts, or answers.
- Do NOT generate filler or trivial questions.
- Avoid ambiguous or opinion-based questions.
- If the PDF content is insufficient, generate fewer questions rather than inventing content.
- Output must strictly conform to the provided JSONL schema.
- Output minified JSONL only. No markdown, no comments, no extra text.
- Each generated question should be minified and on its own line
`

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: req.headers
		})

		if (!session) return new Response('Unauthorized', { status: 401 })

		const ratelimitResult = rateLimit(`ai:${session.user.id}`, {
			maxRequests: 3,
			windowMs: 24 * 60 * 60 * 1000 // 1d
		})

		if (!ratelimitResult) {
			return new Response('Too Many Requests', { status: 429 })
		}

		console.info(
			`[${new Date().toISOString()}]: ${session.user.name} (${session.user.id}) requested question generation.`
		)

		const encoder = new TextEncoder()
		const formData = await req.formData()

		const pdf = pdfFileSchema.parse(formData.get('pdf'))
		const config = JSON.parse(formData.get('config') as string)
		const parsedConfig = generateQuestionsConfigSchema.parse(config)

		const pdfText = await extractTextFromPDF(pdf)

		const prompt = getGenerateQuestionsPrompt(
			pdfText.slice(0, 5000),
			parsedConfig
		)

		const emitLine = (
			line: string,
			controller: ReadableStreamDefaultController
		) => {
			try {
				const parsed = questionFormSchema.parse(JSON.parse(line))
				controller.enqueue(encoder.encode(JSON.stringify(parsed) + '\n'))
			} catch {
				console.warn(
					'[WARNING]: AI returned invalid question:',
					line,
					'(POST /ai/generate-questions)'
				)
			}
		}

		const stream = new ReadableStream({
			async start(controller) {
				try {
					let buffer = ''

					const response = await gemini.models.generateContentStream({
						model: GEMINI_MODEL_NAME,
						contents: prompt,
						config: {
							systemInstruction,
							abortSignal: req.signal
						}
					})

					for await (const chunk of response) {
						if (req.signal.aborted) {
							controller.close()
							return
						}

						const text = chunk.candidates?.[0].content?.parts?.[0].text ?? ''
						buffer += text

						let newlineIndex: number
						while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
							const line = buffer.slice(0, newlineIndex).trim()
							buffer = buffer.slice(newlineIndex + 1)

							if (!line) continue

							emitLine(line, controller)
						}
					}

					const leftover = buffer.trim()
					if (leftover) emitLine(leftover, controller)

					controller.close()
				} catch (error: any) {
					console.error('[QUESTION_GENERATION_STREAM_ERROR]:', error)
					controller.error(
						'AI failed to generate questions. Please try again later.'
					)
				}
			}
		})

		return new Response(stream, {
			headers: {
				'Content-Type': 'application/x-ndjson',
				'Cache-Control': 'no-cache'
			}
		})
	} catch (error: any) {
		console.error(
			'[QUESTION GENERATION ERROR: /api/ai/generate-questions]:',
			error
		)

		switch (error?.status) {
			case 'RESOURCE_EXHAUSTED':
				return new Response(
					'The AI service is currently handling too many requests. Please wait a moment and try generating questions again.',
					{ status: 429 }
				)

			case 'INVALID_ARGUMENT':
				return new Response(
					"We couldn't process the request. Please make sure the uploaded PDF and settings are valid and try again.",
					{ status: 400 }
				)

			case 'UNAVAILABLE':
				return new Response(
					'The AI service is temporarily unavailable. Please try again later.',
					{ status: 503 }
				)

			default:
				return new Response(
					'Something went wrong while generating questions. Please try again later.',
					{ status: 500 }
				)
		}
	}
}
