import { relations } from 'drizzle-orm'
import { index, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { quizzesTable } from './quizzes'

export const quizCategoriesTable = quizzle.table(
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
	quizCategoriesTable,
	({ many }) => ({
		quizzes: many(quizzesTable)
	})
)

export type QuizCategory = typeof quizCategoriesTable.$inferSelect
export type NewQuizCategory = typeof quizCategoriesTable.$inferInsert
