import { userRoles } from '@/lib/constants'
import { relations } from 'drizzle-orm'
import { boolean, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { accountsTable, sessionsTable } from './auth'
import { followsTable } from './follows'
import { quizzesTable } from './quizzes'

export const userRoleEnum = quizzle.enum('user_role', userRoles)

export const usersTable = quizzle.table(
	'users',
	{
		id: text().primaryKey().$defaultFn(ulid),
		username: text().unique(),
		email: text().notNull().unique(),
		emailVerified: boolean().default(false).notNull(),
		name: text().notNull(),
		role: userRoleEnum().notNull().default('user'),
		image: text(),
		displayUsername: text('display_username'), // required by better-auth
		bio: text(),

		...timestamps
	},
	t => [
		uniqueIndex('users_username_uidx').on(t.username),
		uniqueIndex('users_email_uidx').on(t.email)
	]
)

export const usersRelations = relations(usersTable, ({ many }) => ({
	quizzes: many(quizzesTable),
	sessions: many(sessionsTable),
	accounts: many(accountsTable),
	followers: many(followsTable, { relationName: 'followers' }),
	followings: many(followsTable, { relationName: 'followings' })
}))

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
