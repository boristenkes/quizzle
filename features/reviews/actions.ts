'use server'

import { db } from '@/db'
import {
	attemptsTable,
	Quiz,
	quizStatisticsTable,
	quizzesTable,
	Review,
	reviewsTable,
	User
} from '@/db/schema'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/env'
import { pickColumns } from '@/utils/helpers'
import { ServerActionResponse } from '@/utils/types'
import { and, desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import z from 'zod'
import { newReviewSchema, NewReviewSchema } from './zod'

export async function createReview(
	data: NewReviewSchema,
	quizId: Quiz['id'],
	{ path }: { path?: string } = {}
): Promise<ServerActionResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedData = newReviewSchema.parse(data)
		const parsedQuizId = z.ulid().parse(quizId)
		const currentUser = session.user

		const isSelfReview = await db.query.quizzesTable
			.findFirst({
				where: eq(quizzesTable.id, parsedQuizId),
				columns: pickColumns('creatorId')
			})
			.then(quiz => quiz?.creatorId === currentUser.id)

		if (isSelfReview) {
			return {
				success: false,
				message: 'You cannot leave review on your own quiz.'
			}
		}

		const hasAlreadyLeftReview = await db.query.reviewsTable
			.findFirst({
				where: and(
					eq(reviewsTable.userId, currentUser.id),
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

		if (env.NODE_ENV !== 'development') {
			const hasTakenQuiz = await db.query.attemptsTable
				.findFirst({
					where: and(
						eq(attemptsTable.userId, currentUser.id),
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
		}

		await db.transaction(async tx => {
			await tx.insert(reviewsTable).values({
				...parsedData,
				quizId: parsedQuizId,
				userId: currentUser.id
			})

			await tx
				.update(quizStatisticsTable)
				.set({
					averageRating: sql`(
          	(${quizStatisticsTable.averageRating} * ${quizStatisticsTable.reviewsCount} + ${parsedData.rating}) / (${quizStatisticsTable.reviewsCount} + 1)
					)`,
					reviewsCount: sql`${quizStatisticsTable.reviewsCount} + 1`
				})
				.where(eq(quizStatisticsTable.quizId, parsedQuizId))
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
	ServerActionResponse<{
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
