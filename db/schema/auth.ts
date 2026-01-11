import { relations } from 'drizzle-orm'
import { index, text, timestamp } from 'drizzle-orm/pg-core'
import { quizzle, timestamps } from './_root'
import { users } from './users'

export const sessions = quizzle.table(
	'sessions',
	{
		id: text().primaryKey(),
		expiresAt: timestamp({ withTimezone: true }).notNull(),
		token: text().notNull().unique(),
		ipAddress: text(),
		userAgent: text(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		...timestamps
	},
	table => [index('sessions_userId_idx').on(table.userId)]
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}))

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export const accounts = quizzle.table(
	'accounts',
	{
		id: text().primaryKey(),
		accountId: text().notNull(),
		providerId: text().notNull(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		accessToken: text(),
		refreshToken: text(),
		idToken: text(),
		accessTokenExpiresAt: timestamp({ withTimezone: true }),
		refreshTokenExpiresAt: timestamp({ withTimezone: true }),
		scope: text(),
		password: text(),

		...timestamps
	},
	table => [index('accounts_userId_idx').on(table.userId)]
)

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}))

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export const verifications = quizzle.table(
	'verifications',
	{
		id: text().primaryKey(),
		identifier: text().notNull(),
		value: text().notNull(),
		expiresAt: timestamp({ withTimezone: true }).notNull(),

		...timestamps
	},
	table => [index('verifications_identifier_idx').on(table.identifier)]
)

export type Verification = typeof verifications.$inferSelect
export type NewVerification = typeof verifications.$inferInsert
