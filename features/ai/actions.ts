'use server'

import {
	chunkText,
	extractTextFromPDF,
	gemini,
	GEMINI_MODEL_NAME
} from '@/features/ai/client'
import {
	generateQuestionsResponseJsonSchema,
	getGenerateQuestionsPrompt
} from '@/features/ai/prompts'
import { getSession } from '@/lib/auth'
import { Difficulty, QuestionType } from '@/lib/constants'
import { ServerActionResponse } from '@/utils/types'
import { QuestionFormSchema } from '../questions/zod'
import { quizFormSchema } from '../quizzes/zod'
import { generateQuestionsConfigSchema, pdfFileSchema } from './zod'

type GenerateQuestionsConfig = {
	questionCount: number
	difficultyDistribution: Record<Difficulty, number>
	typeDistribution: Record<QuestionType, number>
}

const systemInstruction = `
You are a strict, deterministic quiz-question generation API.

Rules:
- Use ONLY the provided PDF text as the source of truth.
- Do NOT use any external knowledge.
- Do NOT invent facts, concepts, or answers.
- Do NOT generate filler or trivial questions.
- Avoid ambiguous or opinion-based questions.
- If the PDF content is insufficient, generate fewer questions rather than inventing content.
- Output must strictly conform to the provided JSON schema.
- Output minified JSON only. No markdown, no comments, no extra text.
`

export async function generateQuestions(
	formData: FormData,
	config: GenerateQuestionsConfig
): Promise<ServerActionResponse<{ questions: QuestionFormSchema[] }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const pdf = pdfFileSchema.parse(formData.get('pdf'))
		const parsedConfig = generateQuestionsConfigSchema.parse(config)

		const pdfText = await extractTextFromPDF(pdf)
		const pdfTextChunks = chunkText(pdfText, 3000)

		const prompt = getGenerateQuestionsPrompt(
			pdfText.slice(0, 5000),
			parsedConfig
		)

		const response = await gemini.models.generateContent({
			model: GEMINI_MODEL_NAME,
			contents: prompt,
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				responseJsonSchema: generateQuestionsResponseJsonSchema,
				temperature: 0.2, // lower hallucinations
				topP: 0.8 // tighter token distribution
				// maxOutputTokens: 2500 // HARD STOP (important)
			}
		})

		let questions: QuestionFormSchema[] = []
		const responseJSON = response.candidates?.[0].content?.parts?.[0].text

		try {
			const quizData = JSON.parse(responseJSON as string)
			questions = quizFormSchema.shape.questions.parse(quizData.questions)
		} catch (error) {
			throw new Error(`AI returned invalid JSON: ${responseJSON}`)
		}

		return { success: true, questions }
	} catch (error) {
		console.error('[GENERATE_QUESTIONS]:', error)
		return { success: false }
	}
}
