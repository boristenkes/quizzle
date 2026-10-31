'use server'

import { db } from '@/db'
import { followsTable, notificationsTable, User, usersTable } from '@/db/schema'
import { getSession } from '@/lib/auth'
import { omitColumns } from '@/utils/helpers'
import { ServerResponse } from '@/utils/types'
import { and, eq, isNull, or } from 'drizzle-orm'
import z from 'zod'
import {
	followerCountQuery,
	followingCountQuery,
	quizCountQuery,
	totalAttemptsQuery
} from './queries'

export type GetUserUser = Omit<
	User,
	'emailVerified' | 'displayUsername' | 'updatedAt'
> & {
	quizCount: number
	totalAttempts: number
	followerCount: number
	followingCount: number
}

export async function getUser(
	identifier: User['id'] | User['username']
): Promise<ServerResponse<{ user: GetUserUser }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthroized')

		if (!identifier) throw new Error('Bad Request: identifier not provided')

		const user = await db.query.usersTable.findFirst({
			where: or(
				eq(usersTable.id, identifier),
				eq(usersTable.username, identifier)
			),
			columns: omitColumns('emailVerified', 'displayUsername', 'updatedAt'),
			extras: {
				quizCount: quizCountQuery,
				totalAttempts: totalAttemptsQuery,
				followerCount: followerCountQuery,
				followingCount: followingCountQuery
			}
		})

		if (!user) return { success: false, message: 'notFound' }

		return { success: true, user }
	} catch (error) {
		console.error('[GET_USER]:', error)
		return { success: false }
	}
}

export async function getFollowState(targetUserId: User['id']) {
	const session = await getSession()

	if (!session) throw new Error('Unauthorized')

	const sessionUser = session.user
	targetUserId = z.ulid().parse(targetUserId)

	const isFollowing = await db.query.followsTable
		.findFirst({
			where: and(
				eq(followsTable.followerId, sessionUser.id),
				eq(followsTable.followingId, targetUserId)
			)
		})
		.then(Boolean)

	return isFollowing
}

export async function toggleFollow(targetUserId: User['id']) {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const sessionUser = session.user
		const parsedTargetUserId = z.ulid().parse(targetUserId)

		const isFollowing = await db.query.followsTable
			.findFirst({
				where: and(
					eq(followsTable.followerId, sessionUser.id),
					eq(followsTable.followingId, parsedTargetUserId)
				)
			})
			.then(Boolean)

		if (isFollowing) {
			// Unfollow
			const unfollowPromise = db
				.delete(followsTable)
				.where(
					and(
						eq(followsTable.followerId, sessionUser.id),
						eq(followsTable.followingId, parsedTargetUserId)
					)
				)

			// Delete notification if not already read
			const deleteNotifPromise = db
				.delete(notificationsTable)
				.where(
					and(
						eq(notificationsTable.issuerId, session.user.id),
						eq(notificationsTable.recipientId, parsedTargetUserId),
						eq(notificationsTable.type, 'new_follower'),
						isNull(notificationsTable.readAt)
					)
				)

			await Promise.all([unfollowPromise, deleteNotifPromise])
		} else {
			const followPromise = db.insert(followsTable).values({
				followerId: sessionUser.id,
				followingId: parsedTargetUserId
			})
			const sendNotificationPromise = db
				.insert(notificationsTable)
				.values({
					issuerId: session.user.id,
					recipientId: targetUserId,
					type: 'new_follower'
				})
				.onConflictDoNothing()

			await Promise.all([followPromise, sendNotificationPromise])
		}
	} catch (error) {
		console.error('[TOGGLE_FOLLOW]:', error)
		throw new Error('Failed to toggle follow')
	}
}
