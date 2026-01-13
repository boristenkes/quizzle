import { relations, sql } from 'drizzle-orm'
import { check, index, integer, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { quizzesTable } from './quizzes'
import { usersTable } from './users'

export const reviewsTable = quizzle.table(
	'reviews',
	{
		id: text().primaryKey().$defaultFn(ulid),
		comment: text(),
		rating: integer().notNull(),

		quizId: text()
			.notNull()
			.references(() => quizzesTable.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),

		...timestamps
	},
	t => [
		check('reviews_rating_check', sql`${t.rating} between 1 and 5`),
		index('reviews_quiz_idx').on(t.quizId),
		index('reviews_user_idx').on(t.userId),
		uniqueIndex('reviews_quiz_user_uidx').on(t.quizId, t.userId)
	]
)

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
	quiz: one(quizzesTable, {
		fields: [reviewsTable.quizId],
		references: [quizzesTable.id]
	}),
	user: one(usersTable, {
		fields: [reviewsTable.userId],
		references: [usersTable.id]
	})
}))

export type Review = typeof reviewsTable.$inferSelect
export type NewReview = typeof reviewsTable.$inferInsert
