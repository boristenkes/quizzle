import { questionTypes } from '@/lib/constants'
import { relations } from 'drizzle-orm'
import { index, integer, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { timestamps } from './_utils'
import { questionOptions } from './question-options'
import { quizzes } from './quizzes'

export const questionTypeEnum = quizzle.enum('question_type', questionTypes)

export const questions = quizzle.table(
	'questions',
	{
		id: text().primaryKey().$defaultFn(ulid),
		prompt: text().notNull(),
		type: questionTypeEnum().notNull(),
		explanationHTML: text(),
		quizId: text()
			.notNull()
			.references(() => quizzes.id, { onDelete: 'cascade' }),
		order: integer().notNull(),

		...timestamps()
	},
	t => [index('questions_quiz_idx').on(t.quizId)]
)

export const questionsRelations = relations(questions, ({ one, many }) => ({
	quiz: one(quizzes, {
		fields: [questions.quizId],
		references: [quizzes.id]
	}),
	options: many(questionOptions)
}))

export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
