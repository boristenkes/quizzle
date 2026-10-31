'use server'

import { db } from '@/db'
import {
	attemptsTable,
	notificationsTable,
	Quiz,
	quizStatisticsTable,
	quizzesTable,
	Review,
	reviewsTable,
	User
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'
import { ServerResponse } from '@/utils/types'
import { and, desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import z from 'zod'
import { newReviewSchema, NewReviewSchema } from './zod'

export async function createReview(
	data: NewReviewSchema,
	quizId: Quiz['id'],
	{ path }: { path?: string } = {}
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedData = newReviewSchema.parse(data)
		const parsedQuizId = z.ulid().parse(quizId)
		const sessionUser = session.user

		const targetQuiz = await db.query.quizzesTable.findFirst({
			where: eq(quizzesTable.id, parsedQuizId),
			columns: pickColumns('creatorId')
		})

		if (!targetQuiz) return { success: false, message: 'Quiz not found' }

		if (targetQuiz.creatorId === session.user.id) {
			return {
				success: false,
				message: 'You cannot leave review on your own quiz.'
			}
		}

		const hasAlreadyLeftReview = await db.query.reviewsTable
			.findFirst({
				where: and(
					eq(reviewsTable.userId, sessionUser.id),
					eq(reviewsTable.quizId, parsedQuizId)
				),
				columns: pickColumns('id')
			})
			.then(Boolean)

		if (hasAlreadyLeftReview) {
			return {
				success: false,
				message: 'You already left review for this quiz.'
			}
		}

		const hasTakenQuiz = await db.query.attemptsTable
			.findFirst({
				where: and(
					eq(attemptsTable.userId, sessionUser.id),
					eq(attemptsTable.quizId, parsedQuizId)
				),
				columns: pickColumns('id')
			})
			.then(Boolean)

		if (!hasTakenQuiz) {
			return {
				success: false,
				message: 'You must take this quiz before leaving a review.'
			}
		}

		await db.transaction(async tx => {
			const [newReview] = await tx
				.insert(reviewsTable)
				.values({
					...parsedData,
					quizId: parsedQuizId,
					userId: sessionUser.id
				})
				.returning({ id: reviewsTable.id })

			const updateQuizStatsPromise = tx
				.update(quizStatisticsTable)
				.set({
					averageRating: sql`
						ROUND(
							(
								${quizStatisticsTable.averageRating} *
								${quizStatisticsTable.reviewsCount} +
								${parsedData.rating}
							) / (${quizStatisticsTable.reviewsCount} + 1)
						)
					`,
					reviewsCount: sql`${quizStatisticsTable.reviewsCount} + 1`
				})
				.where(eq(quizStatisticsTable.quizId, parsedQuizId))

			const sendNotificationPromise = tx.insert(notificationsTable).values({
				issuerId: session.user.id,
				recipientId: targetQuiz.creatorId,
				type: 'new_review',
				quizId: parsedQuizId,
				reviewId: newReview.id
			})

			await Promise.all([updateQuizStatsPromise, sendNotificationPromise])
		})

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_REVIEW]:', error)
		return { success: false }
	}
}

export type GetQuizReviewsReview = Review & {
	user: Pick<User, 'username' | 'name' | 'image'>
}

export async function getQuizReviews(quizId: Quiz['id']): Promise<
	ServerResponse<{
		reviews: GetQuizReviewsReview[]
	}>
> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedQuizId = z.ulid().parse(quizId)

		const reviews = await db.query.reviewsTable.findMany({
			where: eq(reviewsTable.quizId, parsedQuizId),
			with: {
				user: {
					columns: pickColumns('name', 'username', 'image')
				}
			},
			orderBy: desc(reviewsTable.createdAt)
		})

		return { success: true, reviews }
	} catch (error) {
		console.error('[GET_QUIZ_REVIEWS]:', error)
		return { success: false }
	}
}
