'use server'

import { db } from '@/db'
import {
	questionOptions,
	questions as questionsTable,
	quizzes,
	textQuestionSettings
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { ServerActionResponse } from '@/utils/types'
import { ulid } from 'ulid'
import { quizFormSchema, QuizFormSchema } from './zod'

export async function createQuiz(
	data: QuizFormSchema
): Promise<ServerActionResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const currentUser = session.user

		const { questions, ...quizData } = quizFormSchema.parse(data)

		// Insert questions
		await db.transaction(async tx => {
			const [newQuiz] = await tx
				.insert(quizzes)
				.values({
					...quizData,
					creatorId: currentUser.id
				})
				.returning({ id: quizzes.id })

			const baseQuestionsData = questions.map((question, index) => ({
				id: ulid(),
				quizId: newQuiz.id,
				prompt: question.prompt,
				type: question.type,
				explanationHTML: question.explanationHTML,
				difficulty: question.difficulty,
				order: index + 1
			}))

			await tx.insert(questionsTable).values(baseQuestionsData)

			// Handle choice question options
			const optionsToInsert = questions.flatMap((question, index) => {
				if (question.type === 'text') return []

				const questionId = baseQuestionsData[index].id

				return question.options.map(option => ({
					questionId,
					value: option.value,
					isCorrect: option.isCorrect
				}))
			})

			if (optionsToInsert.length > 0) {
				await tx.insert(questionOptions).values(optionsToInsert)
			}

			// Handle text questions settings
			const textSettingsToInsert = questions.flatMap((question, index) => {
				if (question.type !== 'text') return []

				return {
					questionId: baseQuestionsData[index].id,
					acceptableAnswers: question.acceptableAnswers,
					ignoreCase: question.ignoreCase,
					trimWhitespace: question.trimWhitespace
				}
			})

			if (textSettingsToInsert.length > 0) {
				await tx.insert(textQuestionSettings).values(textSettingsToInsert)
			}
		})

		return { success: true }
	} catch (error) {
		console.error('[CREATE_QUIZ]:', error)
		return { success: false }
	}
}
