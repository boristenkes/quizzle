'use server'

import { db } from '@/db'
import {
	Attempt,
	AttemptQuestion,
	attemptQuestionsTable,
	attemptsTable,
	questionsTable,
	Quiz,
	quizzesTable
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { ServerActionResponse } from '@/utils/types'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import z from 'zod'
import {
	attemptQuestionPrivate,
	AttemptQuestionPublic,
	attemptQuestionPublic,
	attemptQuestionSubmittedAnswer,
	AttemptQuestionSubmittedAnswer,
	attemptQuizData
} from './zod'

export async function createQuizSession(
	quizId: Quiz['id']
): Promise<ServerActionResponse<{ attemptId: Attempt['id'] }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const activeSession = await db.query.attemptsTable.findFirst({
			where: and(
				eq(attemptsTable.userId, sessionUser.id),
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

		if (!quiz.isPublic && quiz.creatorId !== sessionUser.id) {
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
					userId: sessionUser.id,
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

export type AttemptQuestionData = {
	question: AttemptQuestionPublic | null
	attemptQuestionId?: AttemptQuestion['id']
	order?: number
}

export async function getInitialQuestion(
	attemptId: Attempt['id']
): Promise<ServerActionResponse<AttemptQuestionData>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedAttemptId = z.ulid().parse(attemptId)

		const targetAttempt = await db.query.attemptsTable.findFirst({
			where: and(
				eq(attemptsTable.id, parsedAttemptId),
				eq(attemptsTable.userId, sessionUser.id)
			),
			columns: {
				submittedAt: true
			}
		})

		if (!targetAttempt)
			return { success: false, message: "You haven't taken this quiz yet" }
		if (targetAttempt.submittedAt)
			return redirect(`/quizzes/results/${parsedAttemptId}`)

		const initialQuestion = await db.query.attemptQuestionsTable.findFirst({
			where: and(
				eq(attemptQuestionsTable.attemptId, parsedAttemptId),
				isNull(attemptQuestionsTable.submittedAnswer)
			),
			orderBy: (table, { asc }) => [asc(table.order)],
			columns: { id: true, order: true, questionPublic: true }
		})

		if (!initialQuestion) return { success: true, question: null }

		return {
			success: true,
			question: initialQuestion.questionPublic,
			attemptQuestionId: initialQuestion.id,
			order: initialQuestion.order
		}
	} catch (error) {
		console.error('[GET_INITIAL_QUESTION]:', error)
		return { success: false }
	}
}

export async function getNextQuestion(
	attemptId: Attempt['id']
): Promise<ServerActionResponse<AttemptQuestionData>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedAttemptId = z.ulid().parse(attemptId)

		const isSessionUserAttemptOwner = await db.query.attemptsTable
			.findFirst({
				where: and(
					eq(attemptsTable.id, parsedAttemptId),
					eq(attemptsTable.userId, sessionUser.id)
				),
				columns: { id: true }
			})
			.then(Boolean)

		if (!isSessionUserAttemptOwner) throw new Error('Unauthorized')

		const attemptQuestion = await db.query.attemptQuestionsTable.findFirst({
			where: and(
				eq(attemptQuestionsTable.attemptId, parsedAttemptId),
				isNull(attemptQuestionsTable.submittedAnswer)
			),
			orderBy: (table, { asc }) => [asc(table.order)],
			columns: { id: true, order: true, questionPublic: true }
		})

		if (!attemptQuestion) {
			return { success: true, question: null }
		}

		return {
			success: true,
			question: attemptQuestion.questionPublic,
			attemptQuestionId: attemptQuestion.id,
			order: attemptQuestion.order
		}
	} catch (error) {
		console.error('[GET_NEXT_QUESTION]:', error)
		return { success: false }
	}
}

export async function submitAnswer(
	attemptQuestionId: Attempt['id'],
	answerData: AttemptQuestionSubmittedAnswer
): Promise<ServerActionResponse<AttemptQuestionData>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user

		const parsedAttemptQuestionId = z.ulid().parse(attemptQuestionId)
		const parsedAnswer = attemptQuestionSubmittedAnswer.parse(answerData)

		const targetAttemptQuestion =
			await db.query.attemptQuestionsTable.findFirst({
				where: and(eq(attemptQuestionsTable.id, parsedAttemptQuestionId)),
				columns: { id: true },
				with: {
					attempt: {
						columns: {
							id: true,
							userId: true,
							submittedAt: true
						}
					}
				}
			})

		if (!targetAttemptQuestion) throw new Error('Not found')

		if (targetAttemptQuestion.attempt.userId !== sessionUser.id)
			throw new Error('Unauthorized')

		if (targetAttemptQuestion.attempt.submittedAt)
			return { success: false, message: 'You have already completed this quiz' }

		// Submit user's answer
		await db
			.update(attemptQuestionsTable)
			.set({ submittedAnswer: parsedAnswer })
			.where(eq(attemptQuestionsTable.id, parsedAttemptQuestionId))

		// Get next question (might not exist, which is expected)
		const nextQuestion = await db.query.attemptQuestionsTable.findFirst({
			where: and(
				eq(attemptQuestionsTable.attemptId, targetAttemptQuestion.attempt.id),
				isNull(attemptQuestionsTable.submittedAnswer)
			),
			orderBy: [asc(attemptQuestionsTable.order)],
			columns: { id: true, order: true, questionPublic: true }
		})

		if (!nextQuestion) return { success: true, question: null }

		return {
			success: true,
			question: nextQuestion.questionPublic,
			attemptQuestionId: nextQuestion.id,
			order: nextQuestion.order
		}
	} catch (error) {
		console.error('[SUBMIT_ANSWER]:', error)
		return { success: false }
	}
}
