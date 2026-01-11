import { relations } from 'drizzle-orm'
import { index, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { quizzes } from './quizzes'

export const quizCategories = quizzle.table(
	'quiz_categories',
	{
		id: text().primaryKey().$defaultFn(ulid),
		name: text().notNull(),
		slug: text().notNull(),

		...timestamps
	},
	t => [index('quiz_categories_slug').on(t.slug)]
)

export const quizCategoriesRelations = relations(
	quizCategories,
	({ many }) => ({
		quizzes: many(quizzes)
	})
)

export type QuizCategory = typeof quizCategories.$inferSelect
export type NewQuizCategory = typeof quizCategories.$inferInsert
