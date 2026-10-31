'use server'

import { db } from '@/db'
import { Notification, notificationsTable } from '@/db/schema'
import { getSession } from '@/lib/auth'
import { ServerResponse } from '@/utils/types'
import { and, eq, isNull, sql } from 'drizzle-orm'
import z from 'zod'
import { NotificationSchema, notificationSchema } from './zod'

export type LatestNotificationsResponse = {
	notifications: NotificationSchema[]
	unreadCount: number
}

export async function getLatestNotifications(): Promise<LatestNotificationsResponse> {
	const session = await getSession()

	if (!session) throw new Error('Unauthorized')

	const notificationsPromise = db.query.notificationsTable
		.findMany({
			where: eq(notificationsTable.recipientId, session.user.id),
			columns: {
				id: true,
				readAt: true,
				createdAt: true,
				type: true,
				reviewId: true,
				attemptId: true
			},
			with: {
				issuer: {
					columns: {
						id: true,
						name: true,
						username: true,
						image: true
					}
				},
				quiz: {
					columns: {
						id: true,
						slug: true,
						title: true
					}
				}
			},
			orderBy: (table, { desc }) => desc(table.createdAt)
		})
		.then(results => notificationSchema.array().parse(results))

	const unreadCountPromise = db.$count(
		notificationsTable,
		and(
			eq(notificationsTable.recipientId, session.user.id),
			isNull(notificationsTable.readAt)
		)
	)

	const [notifications, unreadCount] = await Promise.all([
		notificationsPromise,
		unreadCountPromise
	])

	return { notifications, unreadCount }
}

export async function markNotificationAsRead(
	notificationId: Notification['id']
): Promise<ServerResponse<{ readAt: Date }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedNotifId = z.ulid().parse(notificationId)

		const targetNotification = await db.query.notificationsTable.findFirst({
			where: eq(notificationsTable.id, parsedNotifId),
			columns: { recipientId: true, readAt: true }
		})

		if (!targetNotification) throw new Error('Notification not found')

		if (targetNotification.recipientId !== session.user.id)
			throw new Error('Unauthorized')

		if (targetNotification.readAt)
			return { success: true, readAt: targetNotification.readAt }

		const [updatedNotification] = await db
			.update(notificationsTable)
			.set({
				readAt: sql`now()`
			})
			.where(eq(notificationsTable.id, parsedNotifId))
			.returning({ readAt: notificationsTable.readAt })

		return { success: true, readAt: updatedNotification.readAt! }
	} catch (error) {
		console.error('[MARK_NOTIFICATION_AS_READ]:', error)
		return { success: false }
	}
}

export async function deleteNotification(
	notificationId: Notification['id']
): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		const parsedNotifId = z.ulid().parse(notificationId)

		const targetNotification = await db.query.notificationsTable.findFirst({
			where: eq(notificationsTable.id, parsedNotifId),
			columns: { recipientId: true }
		})

		if (!targetNotification)
			return { success: false, message: 'Notification not found' }

		if (targetNotification.recipientId !== session.user.id)
			throw new Error('Unauthorized')

		await db
			.delete(notificationsTable)
			.where(eq(notificationsTable.id, parsedNotifId))

		return { success: true }
	} catch (error) {
		console.error('[DELETE_NOTIFICATION]:', error)
		return { success: false }
	}
}

export async function clearMyNotifications(): Promise<ServerResponse> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthorized')

		await db
			.delete(notificationsTable)
			.where(eq(notificationsTable.recipientId, session.user.id))

		return { success: true }
	} catch (error) {
		console.error('[CLEAR_MY_NOTIFICATIONS]:', error)
		return { success: false }
	}
}
