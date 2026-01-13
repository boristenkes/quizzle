import { relations } from 'drizzle-orm'
import { index, text, timestamp } from 'drizzle-orm/pg-core'
import { quizzle, timestamps } from './_root'
import { usersTable } from './users'

export const sessionsTable = quizzle.table(
	'sessions',
	{
		id: text().primaryKey(),
		expiresAt: timestamp({ withTimezone: true }).notNull(),
		token: text().notNull().unique(),
		ipAddress: text(),
		userAgent: text(),
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),

		...timestamps
	},
	table => [index('sessions_userId_idx').on(table.userId)]
)

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id]
	})
}))

export type Session = typeof sessionsTable.$inferSelect
export type NewSession = typeof sessionsTable.$inferInsert

export const accountsTable = quizzle.table(
	'accounts',
	{
		id: text().primaryKey(),
		accountId: text().notNull(),
		providerId: text().notNull(),
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
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

export const accountsRelations = relations(accountsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [accountsTable.userId],
		references: [usersTable.id]
	})
}))

export type Account = typeof accountsTable.$inferSelect
export type NewAccount = typeof accountsTable.$inferInsert

export const verificationsTable = quizzle.table(
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

export type Verification = typeof verificationsTable.$inferSelect
export type NewVerification = typeof verificationsTable.$inferInsert
