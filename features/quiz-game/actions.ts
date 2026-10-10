'use server'

import { db } from '@/db'
import {
	Attempt,
	attemptQuestionsTable,
	attemptsTable,
	questionsTable,
	Quiz,
	quizzesTable
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { ServerActionResponse } from '@/utils/types'
import { and, eq, isNull } from 'drizzle-orm'
import z from 'zod'
import {
	attemptQuestionPrivate,
	attemptQuestionPublic,
	attemptQuizData
} from './zod'

export async function createQuizSession(
	quizId: Quiz['id']
): Promise<ServerActionResponse<{ attemptId: Attempt['id'] }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const currentUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const activeSession = await db.query.attemptsTable.findFirst({
			where: and(
				eq(attemptsTable.userId, currentUser.id),
				eq(attemptsTable.quizId, parsedQuizId),
				eq(attemptsTable.isCompleted, false)
			),
			columns: { id: true }
		})

		if (activeSession) {
			return { success: true, attemptId: activeSession.id }
		}

		const quiz = await db.query.quizzesTable.findFirst({
			where: and(
				eq(quizzesTable.id, parsedQuizId),
				eq(quizzesTable.isPublished, true),
				isNull(quizzesTable.deletedAt)
			),
			with: {
				questions: {
					with: {
						options: true,
						textQuestionSettings: true
					}
				}
			}
		})

		if (!quiz) {
			return {
				success: false,
				message: 'Quiz not found or it has been deleted'
			}
		}

		if (!quiz.isPublic && quiz.creatorId !== currentUser.id) {
			return {
				success: false,
				message: 'Quiz not found or it has been deleted.'
			}
		}

		const attemptId = await db.transaction(async tx => {
			const [attempt] = await tx
				.insert(attemptsTable)
				.values({
					maxScore: quiz.questionCount * 10, // each question scores 10 points
					quizId: quiz.id,
					userId: currentUser.id,
					quizData: attemptQuizData.parse(quiz)
				})
				.returning({ id: attemptsTable.id })

			const questions = await tx.query.questionsTable
				.findMany({
					where: eq(questionsTable.quizId, quiz.id),
					with: {
						options: true,
						textQuestionSettings: true
					}
				})
				.then(res =>
					res.map(q =>
						q.type === 'text' ? { ...q, ...q.textQuestionSettings } : q
					)
				)

			const attemptQuestionsData = questions.map(question => ({
				attemptId: attempt.id,
				questionId: question.id,
				order: question.order,
				questionPublic: attemptQuestionPublic.parse(question),
				questionPrivate: attemptQuestionPrivate.parse(question)
			}))

			const attemptQuestions = await tx
				.insert(attemptQuestionsTable)
				.values(attemptQuestionsData)
				.returning({ id: attemptQuestionsTable.id })

			if (attemptQuestions.length !== questions.length) {
				return tx.rollback()
			}

			return attempt.id
		})

		return { success: true, attemptId }
	} catch (error) {
		console.error('[CREATE_QUIZ_SESSION]:', error)
		return { success: false }
	}
}
