'use server'

import { db } from '@/db'
import { followsTable, User, usersTable } from '@/db/schema'
import { getSession } from '@/lib/auth'
import { omitColumns } from '@/utils/helpers'
import { ServerActionResponse } from '@/utils/types'
import { and, eq, or } from 'drizzle-orm'
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
): Promise<ServerActionResponse<{ user: GetUserUser }>> {
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

	const currentUser = session.user
	targetUserId = z.ulid().parse(targetUserId)

	const isFollowing = await db.query.followsTable
		.findFirst({
			where: and(
				eq(followsTable.followerId, currentUser.id),
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

		const currentUser = session.user
		targetUserId = z.ulid().parse(targetUserId)

		const isFollowing = await db.query.followsTable
			.findFirst({
				where: and(
					eq(followsTable.followerId, currentUser.id),
					eq(followsTable.followingId, targetUserId)
				)
			})
			.then(Boolean)

		if (isFollowing) {
			// Unfollow
			await db
				.delete(followsTable)
				.where(
					and(
						eq(followsTable.followerId, currentUser.id),
						eq(followsTable.followingId, targetUserId)
					)
				)
		} else {
			await db.insert(followsTable).values({
				followerId: currentUser.id,
				followingId: targetUserId
			})
		}
	} catch (error) {
		console.error('[TOGGLE_FOLLOW]:', error)
		throw new Error('Failed to toggle follow')
	}
}
