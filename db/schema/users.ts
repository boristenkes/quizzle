import { userRoles } from '@/lib/constants'
import { relations } from 'drizzle-orm'
import { boolean, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { accounts, sessions } from './auth'
import { quizzes } from './quizzes'

export const userRoleEnum = quizzle.enum('user_role', userRoles)

export const users = quizzle.table(
	'users',
	{
		id: text().primaryKey().$defaultFn(ulid),
		username: text().unique(),
		email: text().notNull().unique(),
		emailVerified: boolean().default(false).notNull(),
		name: text().notNull(),
		passwordHash: text(),
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

export const usersRelations = relations(users, ({ many }) => ({
	quizzes: many(quizzes),
	sessions: many(sessions),
	accounts: many(accounts)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
