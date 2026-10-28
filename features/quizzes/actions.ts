'use server'

import {
	filterQuizzesSchema,
	FilterQuizzesSchema
} from '@/app/(dashboard)/discover/zod'
import { db } from '@/db'
import {
	attemptsTable,
	bookmarksTable,
	followsTable,
	questionOptionsTable,
	questionsTable,
	Quiz,
	quizCategoriesTable,
	QuizCategory,
	QuizStatistics,
	quizStatisticsTable,
	quizzesTable,
	textQuestionSettingsTable,
	User
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { MAX_PLAYTIME_SECONDS } from '@/lib/constants'
import { sanitizeHTML } from '@/lib/sanitize-html'
import { pickColumns, slugify } from '@/utils/helpers'
import { ServerResponse } from '@/utils/types'
import { and, desc, eq, exists, ilike, isNull, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ulid } from 'ulid'
import z from 'zod'
import { isBookmarkedQuery } from './queries'
import { QuizCardData, quizFormSchema, QuizFormSchema } from './zod'

export async function createQuiz(
	data: QuizFormSchema
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user

		const { questions, ...quizData } = quizFormSchema.parse(data)

		if (quizData.timeLimitMinutes) {
			// @ts-ignore db expects timeLimitSeconds
			quizData.timeLimitSeconds = quizData.timeLimitMinutes * 60
		}
		delete quizData.timeLimitMinutes

		// Insert questions
		await db.transaction(async tx => {
			const [newQuiz] = await tx
				.insert(quizzesTable)
				.values({
					...quizData,
					slug: slugify(quizData.title),
					questionCount: questions.length,
					creatorId: sessionUser.id
				})
				.returning({ id: quizzesTable.id })

			await tx.insert(quizStatisticsTable).values({ quizId: newQuiz.id })

			const baseQuestionsData = questions.map((question, index) => ({
				id: ulid(),
				quizId: newQuiz.id,
				prompt: question.prompt,
				type: question.type,
				explanationHTML: sanitizeHTML(question.explanationHTML),
				difficulty: question.difficulty,
				position: index + 1
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
				await tx.insert(questionOptionsTable).values(optionsToInsert)
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
				await tx.insert(textQuestionSettingsTable).values(textSettingsToInsert)
			}
		})

		return { success: true }
	} catch (error) {
		console.error('[CREATE_QUIZ]:', error)
		return { success: false }
	}
}

export async function getUserQuizzes(
	userId: User['id'],
	{ page = 1, pageSize = 6 } = {}
): Promise<ServerResponse<{ quizzes: QuizCardData[] }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedUserId = z.ulid().parse(userId)

		const quizzes = (await db.query.quizzesTable.findMany({
			where: and(
				or(
					eq(quizzesTable.creatorId, parsedUserId),
					// Get quizzes created by session user's followings
					exists(
						db
							.select({ createdAt: followsTable.createdAt })
							.from(followsTable)
							.where(
								and(
									eq(followsTable.followerId, session.user.id),
									sql`${followsTable.followingId} = "quizzesTable"."creator_id"`
								)
							)
					)
				),
				isNull(quizzesTable.deletedAt)
			),
			columns: pickColumns(
				'id',
				'title',
				'slug',
				'description',
				'timeLimitSeconds',
				'questionCount',
				'difficulty'
			),
			with: {
				creator: {
					columns: pickColumns('id', 'username', 'name', 'image')
				},
				category: {
					columns: pickColumns('name')
				},
				statistics: {
					columns: pickColumns('averageRating', 'attemptsCount', 'averageScore')
				}
			},
			offset: (page - 1) * pageSize,
			limit: pageSize,
			orderBy: desc(quizzesTable.createdAt)
		})) as QuizCardData[]

		return { success: true, quizzes }
	} catch (error) {
		console.error('[GET_USER_QUIZZES]:', error)
		return { success: false }
	}
}

export type GetQuizByIdQuiz = Pick<
	Quiz,
	| 'id'
	| 'slug'
	| 'title'
	| 'description'
	| 'difficulty'
	| 'questionCount'
	| 'timeLimitSeconds'
	| 'createdAt'
> & {
	creator: Pick<User, 'id' | 'name' | 'username' | 'image'>
	category: Pick<QuizCategory, 'name'> | null
	statistics: QuizStatistics | null
	isBookmarked: boolean
}

export async function getQuizById(
	quizId: Quiz['id']
): Promise<ServerResponse<{ quiz: GetQuizByIdQuiz }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedQuizId = z.ulid().parse(quizId)
		const sessionUser = session.user

		const quiz = await db.query.quizzesTable.findFirst({
			where: and(
				eq(quizzesTable.id, parsedQuizId),
				isNull(quizzesTable.deletedAt),
				eq(quizzesTable.isPublished, true)
			),
			columns: pickColumns(
				'id',
				'slug',
				'title',
				'description',
				'difficulty',
				'questionCount',
				'timeLimitSeconds',
				'createdAt'
			),
			with: {
				creator: {
					columns: pickColumns('id', 'name', 'username', 'image')
				},
				category: {
					columns: pickColumns('name')
				},
				statistics: true
			},
			extras: {
				isBookmarked: isBookmarkedQuery(sessionUser.id)
			}
		})

		if (!quiz)
			return {
				success: false,
				message:
					"Quiz not found. It's possible it has been deleted by the author"
			}

		return { success: true, quiz }
	} catch (error) {
		console.error('[GET_QUIZ_BY_ID]:', error)
		return { success: false }
	}
}

export async function filterQuizzes(
	filters: FilterQuizzesSchema
): Promise<ServerResponse<{ quizzes: QuizCardData[]; totalQuizzes: number }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedFilters = await filterQuizzesSchema
			.parseAsync(filters)
			.catch(() => {
				throw new Error('Bad Request')
			})

		const databaseFilters = []
		const words = [
			...new Set(parsedFilters.query?.trim().split(/\s+/).filter(Boolean) ?? [])
		]

		// Filter by search query
		if (words.length > 0) {
			databaseFilters.push(
				or(
					...words.flatMap(word => [
						ilike(quizzesTable.title, `%${word}%`),
						ilike(quizzesTable.description, `%${word}%`)
					])
				)
			)
		}

		// Filter by difficulty
		if (parsedFilters.difficulty) {
			databaseFilters.push(
				eq(quizzesTable.difficulty, parsedFilters.difficulty)
			)
		}

		// Filter by category
		if (parsedFilters.category) {
			const targetCategory = await db.query.quizCategoriesTable.findFirst({
				where: eq(quizCategoriesTable.slug, parsedFilters.category),
				columns: { id: true }
			})

			if (targetCategory) {
				databaseFilters.push(eq(quizzesTable.categoryId, targetCategory.id))
			}
		}

		const [quizzes, totalQuizzes] = await Promise.all([
			db.query.quizzesTable.findMany({
				where: and(isNull(quizzesTable.deletedAt), ...databaseFilters),
				columns: pickColumns(
					'id',
					'title',
					'slug',
					'description',
					'timeLimitSeconds',
					'questionCount',
					'difficulty',
					'createdAt'
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
				},
				limit: parsedFilters.pageSize,
				offset: (parsedFilters.page - 1) * parsedFilters.pageSize,
				orderBy: desc(quizzesTable.createdAt)
			}),
			db.$count(
				quizzesTable,
				and(isNull(quizzesTable.deletedAt), ...databaseFilters)
			)
		])

		// Sort by relevance
		const rankedQuizzes = (
			words.length > 0
				? quizzes
						.map(quiz => {
							const relevance = words.reduce((score, word) => {
								const pattern = word.toLowerCase()

								return (
									score +
									(quiz.title.toLowerCase().includes(pattern) ? 3 : 0) +
									(quiz.description?.toLowerCase().includes(pattern) ? 1 : 0)
								)
							}, 0)

							return { quiz, relevance }
						})
						.sort(
							(a, b) =>
								b.relevance - a.relevance ||
								b.quiz.createdAt.getTime() - a.quiz.createdAt.getTime()
						)
						.map(({ quiz }) => quiz)
				: quizzes
		) as QuizCardData[]

		return { success: true, quizzes: rankedQuizzes, totalQuizzes }
	} catch (error) {
		console.error('[FILTER_QUIZZES]:', error)
		return { success: false }
	}
}

export async function toggleQuizBookmark(
	quizId: Quiz['id']
): Promise<ServerResponse<{ isBookmarked: boolean }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const deleteResponse = await db
			.delete(bookmarksTable)
			.where(
				and(
					eq(bookmarksTable.userId, sessionUser.id),
					eq(bookmarksTable.quizId, parsedQuizId)
				)
			)

		let isBookmarked = false

		if (deleteResponse.rowCount === 0) {
			await db.insert(bookmarksTable).values({
				userId: sessionUser.id,
				quizId: parsedQuizId
			})
			isBookmarked = true
		}

		return { success: true, isBookmarked }
	} catch (error) {
		console.error('[TOGGLE_QUIZ_BOOKMARK]:', error)
		return { success: false }
	}
}

export async function restoreQuiz(
	quizId: Quiz['id'],
	{ path, throwOnError = false }: { path?: string; throwOnError?: boolean } = {}
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const targetQuiz = await db.query.quizzesTable.findFirst({
			where: eq(quizzesTable.id, parsedQuizId),
			columns: pickColumns('creatorId')
		})

		if (!targetQuiz) return { success: false, message: 'Quiz not found' }

		if (sessionUser.role !== 'admin' && targetQuiz.creatorId !== sessionUser.id)
			throw new Error('Unauthorized')

		await db
			.update(quizzesTable)
			.set({ deletedAt: null })
			.where(eq(quizzesTable.id, parsedQuizId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[RESTORE_QUIZ]:', error)

		if (throwOnError)
			throw new Error('Failed to move quiz to trash. Please try again later')

		return { success: false }
	}
}

export async function softDeleteQuiz(
	quizId: Quiz['id'],
	{ path, throwOnError = false }: { path?: string; throwOnError?: boolean } = {}
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const targetQuiz = await db.query.quizzesTable.findFirst({
			where: eq(quizzesTable.id, parsedQuizId),
			columns: pickColumns('creatorId')
		})

		if (!targetQuiz) return { success: false, message: 'Quiz not found' }

		if (sessionUser.role !== 'admin' && targetQuiz.creatorId !== sessionUser.id)
			throw new Error('Unauthorized')

		await db
			.update(quizzesTable)
			.set({ deletedAt: new Date() })
			.where(eq(quizzesTable.id, parsedQuizId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[SOFT_DELETE_QUIZ]:', error)

		if (throwOnError)
			throw new Error('Failed to move quiz to trash. Please try again later')

		return { success: false }
	}
}

export async function deleteQuiz(
	quizId: Quiz['id'],
	{ path, throwOnError = false }: { path?: string; throwOnError?: boolean } = {}
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedQuizId = z.ulid().parse(quizId)

		const targetQuiz = await db.query.quizzesTable.findFirst({
			where: eq(quizzesTable.id, parsedQuizId),
			columns: pickColumns('id', 'timeLimitSeconds', 'creatorId')
		})

		if (!targetQuiz) return { success: false, message: 'Quiz not found' }

		if (sessionUser.role !== 'admin' && targetQuiz.creatorId !== sessionUser.id)
			throw new Error('Unauthorized')

		const isSomeonePlaying = await db.query.attemptsTable
			.findFirst({
				where: and(
					eq(attemptsTable.quizId, parsedQuizId),
					isNull(attemptsTable.submittedAt),
					// Check if time is up, fallback for unsubmitted attempts
					sql`
						${attemptsTable.startedAt} +
						(COALESCE(${targetQuiz.timeLimitSeconds}, ${MAX_PLAYTIME_SECONDS}) * INTERVAL '1 second')
						> NOW()
					`
				),
				columns: { id: true }
			})
			.then(Boolean)

		if (isSomeonePlaying)
			return {
				success: false,
				message:
					'Someone is currently playing this quiz. Please come back and delete it later'
			}

		await db.delete(quizzesTable).where(eq(quizzesTable.id, parsedQuizId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_QUIZ]:', error)

		if (throwOnError) {
			throw new Error('Failed to delete quiz.')
		}

		return { success: false }
	}
}
