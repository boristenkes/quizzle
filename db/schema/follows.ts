import { ne, relations } from 'drizzle-orm'
import { check, index, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { quizzle } from './_root'
import { usersTable } from './users'

export const followsTable = quizzle.table(
	'follows',
	{
		followerId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		followingId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	t => [
		primaryKey({ columns: [t.followerId, t.followingId] }),
		index('follows_follower_id').on(t.followerId),
		index('follows_following_id').on(t.followingId),
		check('follows_no_self_follow_check', ne(t.followerId, t.followingId))
	]
)

export const followsRelations = relations(followsTable, ({ one }) => ({
	follower: one(usersTable, {
		fields: [followsTable.followerId],
		references: [usersTable.id],
		relationName: 'followers'
	}),
	following: one(usersTable, {
		fields: [followsTable.followingId],
		references: [usersTable.id],
		relationName: 'followings'
	})
}))

export type Follow = typeof followsTable.$inferSelect
export type NewFollow = typeof followsTable.$inferInsert
