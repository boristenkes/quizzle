import { relations, sql } from 'drizzle-orm'
import { check, index, integer, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { quizzes } from './quizzes'
import { users } from './users'

export const reviews = quizzle.table(
	'reviews',
	{
		id: text().primaryKey().$defaultFn(ulid),
		comment: text(),
		rating: integer().notNull(),

		quizId: text()
			.notNull()
			.references(() => quizzes.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		...timestamps
	},
	t => [
		check('reviews_rating_check', sql`${t.rating} between 1 and 5`),
		index('reviews_quiz_idx').on(t.quizId),
		index('reviews_user_idx').on(t.userId),
		uniqueIndex('reviews_quiz_user_uidx').on(t.quizId, t.userId)
	]
)

export const reviewsRelations = relations(reviews, ({ one }) => ({
	quiz: one(quizzes, {
		fields: [reviews.quizId],
		references: [quizzes.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	})
}))

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
