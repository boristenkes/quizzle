'use server'

import { db } from '@/db'
import {
	questionOptions,
	questions as questionsTable,
	Quiz,
	quizzes,
	textQuestionSettings,
	User
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { ServerActionResponse } from '@/utils/types'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ulid } from 'ulid'
import { questionCountQuery } from './drizzle'
import { quizFormSchema, QuizFormSchema } from './zod'

export async function createQuiz(
	data: QuizFormSchema
): Promise<ServerActionResponse<{ quizId: Quiz['id'] }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const currentUser = session.user

		const { questions, ...quizData } = quizFormSchema.parse(data)

		if (quizData.timeLimitMinutes) {
			// @ts-ignore db expects timeLimitSeconds
			quizData.timeLimitSeconds = quizData.timeLimitMinutes * 60
		}
		delete quizData.timeLimitMinutes

		let quizId: Quiz['id'] = ''

		// Insert questions
		await db.transaction(async tx => {
			const [newQuiz] = await tx
				.insert(quizzes)
				.values({
					...quizData,
					creatorId: currentUser.id
				})
				.returning({ id: quizzes.id })

			quizId = newQuiz.id

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

		return { success: true, quizId }
	} catch (error) {
		console.error('[CREATE_QUIZ]:', error)
		return { success: false }
	}
}

export type GetQuizzesQuiz = Pick<
	Quiz,
	'id' | 'title' | 'description' | 'timeLimitSeconds'
> & {
	creator: Pick<User, 'id' | 'username' | 'name' | 'image'>
	questionCount: number
}

export async function getQuizzes(): Promise<
	ServerActionResponse<{ quizzes: GetQuizzesQuiz[] }>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const results = await db.query.quizzes.findMany({
			where: and(eq(quizzes.isPublished, true), isNull(quizzes.deletedAt)),
			columns: {
				id: true,
				title: true,
				description: true,
				timeLimitSeconds: true
			},
			with: {
				creator: {
					columns: { id: true, username: true, name: true, image: true }
				}
			},
			extras: {
				questionCount: questionCountQuery
				// TODO: averageRating, totalAttempts, averageScore,
			},
			orderBy: desc(quizzes.createdAt)
		})

		return { success: true, quizzes: results }
	} catch (error) {
		console.error('[GET_QUIZZES]:', error)
		return { success: false }
	}
}
