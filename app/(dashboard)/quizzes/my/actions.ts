'use server'

import { db } from '@/db'
import {
	Attempt,
	attemptsTable,
	Quiz,
	QuizCategory,
	QuizStatistics,
	quizzesTable,
	User
} from '@/db/schema'
import { QuizCardData } from '@/features/quizzes/zod'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'
import { ServerActionResponse } from '@/utils/types'
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'

export type GetUserQuizStats = {
	totalQuizzes: number
	totalAttempts: number
	averageScore: number
}

export async function getUserQuizStats(): Promise<
	ServerActionResponse<GetUserQuizStats>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const totalQuizzesQuery = db.$count(
			quizzesTable,
			and(
				eq(quizzesTable.creatorId, session.user.id),
				isNull(quizzesTable.deletedAt)
			)
		)
		const totalAttemptsQuery = db.$count(
			attemptsTable,
			and(
				eq(attemptsTable.userId, session.user.id),
				isNotNull(attemptsTable.submittedAt)
			)
		)
		const averageScoreQuery = db
			.select({
				value: sql<number>`
            coalesce(
              sum(${attemptsTable.score})::float
              / nullif(sum(${attemptsTable.maxScore}), 0)
              * 100,
              0
            )
          `
			})
			.from(attemptsTable)
			.where(
				and(
					eq(attemptsTable.userId, session.user.id),
					isNotNull(attemptsTable.submittedAt)
				)
			)
			.then(rows => rows[0]?.value ?? 0)

		const [totalQuizzes, totalAttempts, averageScore] = await Promise.all([
			totalQuizzesQuery,
			totalAttemptsQuery,
			averageScoreQuery
		])

		return { success: true, totalQuizzes, totalAttempts, averageScore }
	} catch (error) {
		console.error('[GET_USER_QUIZ_STATS]:', error)
		return { success: false }
	}
}

export type MyQuiz = Pick<
	Quiz,
	| 'id'
	| 'slug'
	| 'title'
	| 'description'
	| 'isPrivate'
	| 'isPublished'
	| 'difficulty'
	| 'questionCount'
	| 'timeLimitSeconds'
	| 'createdAt'
> & {
	category: Pick<QuizCategory, 'name' | 'slug'> | null
	statistics: Pick<QuizStatistics, 'attemptsCount' | 'averageScore'>
}

export async function getMyQuizzes(): Promise<
	ServerActionResponse<{ quizzes: MyQuiz[] }>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const quizzes = (await db.query.quizzesTable.findMany({
			where: and(
				eq(quizzesTable.creatorId, session.user.id),
				isNull(quizzesTable.deletedAt)
			),
			columns: pickColumns(
				'id',
				'slug',
				'title',
				'description',
				'isPrivate',
				'isPublished',
				'difficulty',
				'questionCount',
				'timeLimitSeconds',
				'createdAt'
			),
			with: {
				category: {
					columns: { name: true, slug: true }
				},
				statistics: {
					columns: {
						attemptsCount: true,
						averageScore: true
					}
				}
			}
		})) as MyQuiz[]

		return { success: true, quizzes }
	} catch (error) {
		console.error('[GET_MY_QUIZZES]:', error)
		return { success: false }
	}
}

export type RecentAttempt = Pick<
	Attempt,
	'id' | 'score' | 'maxScore' | 'createdAt' | 'quizData'
> & {
	quiz: {
		creator: Pick<User, 'name' | 'username'> | null
	} | null
}

export async function getRecentAttempts(): Promise<
	ServerActionResponse<{ attempts: RecentAttempt[] }>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const attempts = await db.query.attemptsTable.findMany({
			where: and(
				eq(attemptsTable.userId, session.user.id),
				isNotNull(attemptsTable.submittedAt)
			),
			columns: pickColumns('id', 'score', 'maxScore', 'createdAt', 'quizData'),
			with: {
				quiz: {
					with: {
						creator: {
							columns: {
								name: true,
								username: true
							}
						}
					}
				}
			}
		})

		return { success: true, attempts }
	} catch (error) {
		console.error('[GET_RECENTLY_PLAYED_QUIZZES]:', error)
		return { success: false }
	}
}

export async function getSavedQuizzes(): Promise<
	ServerActionResponse<{ quizzes: QuizCardData[] }>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const quizzes = await db.query.bookmarksTable
			.findMany({
				where: (table, { eq }) => eq(table.userId, session.user.id),
				columns: {},
				with: {
					quiz: {
						columns: pickColumns(
							'id',
							'title',
							'slug',
							'description',
							'timeLimitSeconds',
							'questionCount',
							'difficulty',
							'deletedAt'
						),
						with: {
							creator: {
								columns: pickColumns('id', 'username', 'name', 'image')
							},
							category: {
								columns: pickColumns('name')
							},
							statistics: {
								columns: pickColumns(
									'averageRating',
									'attemptsCount',
									'averageScore'
								)
							}
						}
					}
				},
				orderBy: (table, { desc }) => desc(table.createdAt)
			})
			.then(bookmarks => bookmarks.map(bm => bm.quiz))

		const visibleQuizzes = quizzes.filter(
			quiz => !quiz.deletedAt
		) as QuizCardData[]

		return { success: true, quizzes: visibleQuizzes }
	} catch (error) {
		console.error('[GET_SAVED_QUIZZES]:', error)
		return { success: false }
	}
}

export type TrashedQuiz = Pick<Quiz, 'id' | 'slug' | 'title' | 'deletedAt'>

export async function getTrashedQuizzes(): Promise<
	ServerActionResponse<{ quizzes: TrashedQuiz[] }>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const quizzes = await db.query.quizzesTable.findMany({
			where: and(
				eq(quizzesTable.creatorId, session.user.id),
				isNotNull(quizzesTable.deletedAt)
			),
			columns: pickColumns('id', 'slug', 'title', 'deletedAt'),

			orderBy: (table, { desc }) => desc(table.createdAt)
		})

		return { success: true, quizzes }
	} catch (error) {
		console.error('[GET_TRASHED_QUIZZES]:', error)
		return { success: false }
	}
}
