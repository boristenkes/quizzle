'use server'

import { db } from '@/db'
import {
	Attempt,
	AttemptQuestion,
	attemptQuestionsTable,
	attemptsTable,
	questionsTable,
	Quiz,
	quizStatisticsTable,
	quizzesTable,
	User
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'
import { ServerActionResponse } from '@/utils/types'
import { integerSchema } from '@/utils/zod'
import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import z from 'zod'
import { gradeAnswer } from './utils'
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
				position: question.position,
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

export type AttemptQuestionData = AttemptQuestionPublic & {
	id: AttemptQuestion['id']
	position: number
}

export async function getInitialQuestion(
	attemptId: Attempt['id']
): Promise<ServerActionResponse<{ question: AttemptQuestionData | null }>> {
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

		// Get first unanswered question
		const initialQuestion = await db.query.attemptQuestionsTable.findFirst({
			where: and(
				eq(attemptQuestionsTable.attemptId, parsedAttemptId),
				isNull(attemptQuestionsTable.submittedAnswer)
			),
			orderBy: (table, { asc }) => [asc(table.position)],
			columns: { id: true, position: true, questionPublic: true }
		})

		if (!initialQuestion) return { success: true, question: null }

		return {
			success: true,
			question: {
				id: initialQuestion.id,
				position: initialQuestion.position,
				...initialQuestion.questionPublic
			}
		}
	} catch (error) {
		console.error('[GET_INITIAL_QUESTION]:', error)
		return { success: false }
	}
}

export async function getQuestionByPosition(
	attemptId: Attempt['id'],
	position: AttemptQuestion['position']
): Promise<ServerActionResponse<{ question: AttemptQuestionData }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedAttemptId = z.ulid().parse(attemptId)
		const parsedPosition = integerSchema.positive().parse(position)

		const targetAttempt = await db.query.attemptsTable.findFirst({
			where: and(
				eq(attemptsTable.id, parsedAttemptId),
				eq(attemptsTable.userId, session.user.id)
			),
			columns: { id: true }
		})

		if (!targetAttempt) throw new Error('Attempt not found or unauthorized')

		const targetQuestion = await db.query.attemptQuestionsTable.findFirst({
			where: and(
				eq(attemptQuestionsTable.attemptId, parsedAttemptId),
				eq(attemptQuestionsTable.position, parsedPosition)
			),
			columns: { id: true, position: true, questionPublic: true }
		})

		if (!targetQuestion)
			throw new Error(`Question at position ${parsedPosition} not found`)

		return {
			success: true,
			question: {
				id: targetQuestion.id,
				position: targetQuestion.position,
				...targetQuestion.questionPublic
			}
		}
	} catch (error) {
		console.error('[GET_QUESTION_BY_POSITION]:', error)
		return { success: false }
	}
}

export type AttemptData = {
	userId: User['id']
	startedAt: Date
	timeLimitSeconds: number
	questionCount: number
	questions: {
		position: number
		isAnswered: boolean
	}[]
}

export async function getAttemptData(
	attemptId: Attempt['id']
): Promise<AttemptData> {
	const session = await getSession()

	if (!session) throw new Error('Unauthorized')

	const parsedAttemptId = z.ulid().parse(attemptId)

	const attemptData = await db.query.attemptsTable.findFirst({
		where: and(
			eq(attemptsTable.id, parsedAttemptId),
			eq(attemptsTable.userId, session.user.id)
		),
		columns: {
			userId: true,
			startedAt: true
		},
		extras: {
			timeLimitSeconds: sql<number>`
					(${attemptsTable.quizData}->>'timeLimitSeconds')::int
			`.as('time_limit_seconds'),

			questionCount: sql<number>`
					(${attemptsTable.quizData}->>'questionCount')::int
			`.as('question_count')
		},
		with: {
			questions: {
				columns: { position: true },
				extras: {
					isAnswered:
						sql<boolean>`${attemptQuestionsTable.submittedAnswer} IS NOT NULL`.as(
							'is_answered'
						)
				},
				orderBy: (table, { asc }) => asc(table.position)
			}
		}
	})

	if (!attemptData) throw new Error('Attempt not found or unauthorized')

	return attemptData as AttemptData
}

export type QuizResults = Pick<
	Attempt,
	| 'id'
	| 'maxScore'
	| 'quizData'
	| 'startedAt'
	| 'submittedAt'
	| 'score'
	| 'quizId'
> & {
	questions: (Pick<
		AttemptQuestion,
		'id' | 'position' | 'questionPrivate' | 'questionPublic' | 'submittedAnswer'
	> & { isCorrect: boolean })[]
}

export async function getQuizResults(
	attemptId: Attempt['id']
): Promise<ServerActionResponse<{ results: QuizResults }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedAttemptId = z.ulid().parse(attemptId)

		const attempt = await db.query.attemptsTable.findFirst({
			where: eq(attemptsTable.id, parsedAttemptId),
			columns: pickColumns(
				'id',
				'maxScore',
				'quizData',
				'startedAt',
				'submittedAt',
				'score',
				'quizId'
			),
			with: {
				questions: {
					columns: pickColumns(
						'id',
						'position',
						'questionPrivate',
						'questionPublic',
						'submittedAnswer'
					),
					orderBy: (table, { asc }) => asc(table.position)
				}
			}
		})

		if (!attempt) return { success: false, message: 'Quiz attempt not found' }

		const results = {
			...attempt,
			questions: attempt.questions.map(question => ({
				...question,
				isCorrect: gradeAnswer(
					question.submittedAnswer,
					question.questionPrivate
				)
			}))
		}

		return { success: true, results }
	} catch (error) {
		console.error('[GET_QUIZ_RESULTS]:', error)
		return { success: false }
	}
}

export async function submitAnswer(
	attemptQuestionId: Attempt['id'],
	answerData: AttemptQuestionSubmittedAnswer
): Promise<ServerActionResponse<{ question: AttemptQuestionData | null }>> {
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
							submittedAt: true,
							startedAt: true,
							quizData: true
						}
					}
				}
			})

		if (!targetAttemptQuestion) throw new Error('Not found')

		if (targetAttemptQuestion.attempt.userId !== sessionUser.id)
			throw new Error('Unauthorized')

		if (targetAttemptQuestion.attempt.submittedAt)
			return { success: false, message: 'You have already completed this quiz' }

		// Reject answers after time runs out
		const { startedAt, quizData } = targetAttemptQuestion.attempt

		if (quizData.timeLimitSeconds) {
			const deadline = startedAt.getTime() + quizData.timeLimitSeconds * 1000

			if (Date.now() >= deadline) {
				return {
					success: false,
					message: 'Time is up. You can no longer submit answers.'
				}
			}
		}

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
			orderBy: [asc(attemptQuestionsTable.position)],
			columns: {
				id: true,
				position: true,
				questionPublic: true
			}
		})

		if (!nextQuestion) return { success: true, question: null }

		return {
			success: true,
			question: {
				id: nextQuestion.id,
				position: nextQuestion.position,
				...nextQuestion.questionPublic
			}
		}
	} catch (error) {
		console.error('[SUBMIT_ANSWER]:', error)
		return { success: false }
	}
}

export async function submitQuiz(attemptId: Attempt['id']) {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedAttemptId = z.ulid().parse(attemptId)

		const targetAttempt = await db.query.attemptsTable.findFirst({
			where: and(
				eq(attemptsTable.id, parsedAttemptId),
				eq(attemptsTable.userId, session.user.id)
			),
			columns: {
				submittedAt: true,
				startedAt: true,
				maxScore: true,
				quizId: true
			},
			with: {
				questions: {
					columns: {
						id: true,
						questionPrivate: true,
						submittedAnswer: true
					}
				}
			}
		})

		if (!targetAttempt) {
			throw new Error('Attempt not found or unauthorized')
		}

		if (targetAttempt.submittedAt) {
			throw new Error('Attempt already submitted')
		}

		const questionCount = targetAttempt.questions.length

		const score = targetAttempt.questions.reduce((prev, curr) => {
			const isCorrect = gradeAnswer(curr.submittedAnswer, curr.questionPrivate)

			return prev + (isCorrect ? targetAttempt.maxScore / questionCount : 0)
		}, 0)

		const submittedAt = new Date()
		const durationMs = Math.max(
			0,
			submittedAt.getTime() - targetAttempt.startedAt.getTime()
		)

		await db.transaction(async tx => {
			// Complete the attempt only if it hasn't already been submitted.
			const [updatedAttempt] = await tx
				.update(attemptsTable)
				.set({
					score,
					isCompleted: true,
					submittedAt
				})
				.where(
					and(
						eq(attemptsTable.id, parsedAttemptId),
						eq(attemptsTable.userId, session.user.id),
						isNull(attemptsTable.submittedAt)
					)
				)
				.returning({ id: attemptsTable.id })

			if (!updatedAttempt) {
				throw new Error('Attempt already submitted')
			}

			// Update quiz statistics.
			await tx
				.update(quizStatisticsTable)
				.set({
					attemptsCount: sql`${quizStatisticsTable.attemptsCount} + 1`,

					averageScore: sql`
						ROUND(
							(
								${quizStatisticsTable.averageScore} *
								${quizStatisticsTable.attemptsCount} +
								${score}
							) / (${quizStatisticsTable.attemptsCount} + 1)
						)
					`,

					averageTimeMs: sql`
						ROUND(
							(
								${quizStatisticsTable.averageTimeMs} *
								${quizStatisticsTable.attemptsCount} +
								${durationMs}
							) / (${quizStatisticsTable.attemptsCount} + 1)
						)
					`,

					fastestTimeMs: sql`
						CASE
							WHEN ${quizStatisticsTable.attemptsCount} = 0
								THEN ${durationMs}
							ELSE LEAST(
								${quizStatisticsTable.fastestTimeMs},
								${durationMs}
							)
						END
					`,

					updatedAt: submittedAt
				})
				.where(
					eq(quizStatisticsTable.quizId, targetAttempt.quizId as Quiz['id'])
				)
		})

		return { success: true }
	} catch (error) {
		console.error('[SUBMIT_QUIZ]:', error)
		return { success: false }
	}
}
