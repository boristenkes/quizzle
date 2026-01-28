import {
	extractTextFromPDF,
	gemini,
	GEMINI_MODEL_NAME
} from '@/features/ai/client'
import { getGenerateQuestionsPrompt } from '@/features/ai/prompts'
import { generateQuestionsConfigSchema, pdfFileSchema } from '@/features/ai/zod'
import { questionFormSchema } from '@/features/questions/zod'
import { auth } from '@/lib/auth'
import { ratelimit } from '@/lib/redis'
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
	const session = await auth.api.getSession({
		headers: req.headers
	})

	if (!session) throw new Error('Unauthorized')

	const ratelimitResult = await ratelimit.limit(session.user.id)

	if (!ratelimitResult.success) {
		return new Response('Too Many Requests', { status: 429 })
	}

	console.log(
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
			if (leftover) {
				emitLine(leftover, controller)
			}

			controller.close()
		}
	})

	return new Response(stream, {
		headers: {
			'Content-Type': 'application/x-ndjson',
			'Cache-Control': 'no-cache'
		}
	})
}
