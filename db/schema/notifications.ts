import { notificationTypes } from '@/lib/constants'
import { relations, sql } from 'drizzle-orm'
import { check, index, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { attemptsTable } from './attempts'
import { quizzesTable } from './quizzes'
import { reviewsTable } from './reviews'
import { usersTable } from './users'

export const notificationTypeEnum = quizzle.enum(
	'notification_type',
	notificationTypes
)

export const notificationsTable = quizzle.table(
	'notifications',
	{
		id: text().primaryKey().$defaultFn(ulid),
		type: notificationTypeEnum().notNull(),

		issuerId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		recipientId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),

		// type: new_review | new_attempt
		quizId: text().references(() => quizzesTable.id, { onDelete: 'cascade' }),

		// type: new_review
		reviewId: text().references(() => reviewsTable.id, { onDelete: 'cascade' }),

		// type: new_attempt
		attemptId: text().references(() => attemptsTable.id, {
			onDelete: 'cascade'
		}),

		readAt: timestamp({ withTimezone: true }),

		...timestamps
	},
	t => [
		// Main query: "my latest notifications"
		index('notifications_recipient_created_idx').on(
			t.recipientId,
			t.createdAt.desc()
		),
		index('notifications_quiz_idx').on(t.quizId),
		// Also covers lookups by issuerId alone (leftmost column)
		index('notifications_issuer_recipient_idx').on(t.issuerId, t.recipientId),

		// Only one follow notification per (issuer, recipient) pair.
		// Insert with `.onConflictDoNothing()` to avoid follow/unfollow spam.
		uniqueIndex('notifications_unique_follower_idx')
			.on(t.issuerId, t.recipientId)
			.where(sql`${t.type} = 'new_follower'`),

		// No notifying yourself
		check('notifications_not_self_chk', sql`${t.issuerId} <> ${t.recipientId}`),

		// Each type must have exactly the fields it needs
		check(
			'notifications_type_fields_chk',
			sql`(
				(${t.type} = 'new_follower'
					AND ${t.quizId} IS NULL
					AND ${t.reviewId} IS NULL
					AND ${t.attemptId} IS NULL)
				OR
				(${t.type} = 'new_review'
					AND ${t.quizId} IS NOT NULL
					AND ${t.reviewId} IS NOT NULL
					AND ${t.attemptId} IS NULL)
				OR
				(${t.type} = 'new_attempt'
					AND ${t.quizId} IS NOT NULL
					AND ${t.attemptId} IS NOT NULL
					AND ${t.reviewId} IS NULL)
			)`
		)
	]
)

export const notificationsRelations = relations(
	notificationsTable,
	({ one }) => ({
		issuer: one(usersTable, {
			fields: [notificationsTable.issuerId],
			references: [usersTable.id],
			relationName: 'notification_issuer'
		}),
		recipient: one(usersTable, {
			fields: [notificationsTable.recipientId],
			references: [usersTable.id],
			relationName: 'notification_recipient'
		}),
		quiz: one(quizzesTable, {
			fields: [notificationsTable.quizId],
			references: [quizzesTable.id]
		}),
		review: one(reviewsTable, {
			fields: [notificationsTable.reviewId],
			references: [reviewsTable.id]
		}),
		attempt: one(attemptsTable, {
			fields: [notificationsTable.attemptId],
			references: [attemptsTable.id]
		})
	})
)

export type Notification = typeof notificationsTable.$inferSelect
export type NewNotification = typeof notificationsTable.$inferInsert
