import { relations } from 'drizzle-orm'
import { boolean, index, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, tname } from './_root'
import { questions } from './questions'

export const questionOptions = quizzle.table(
	tname('question_options'),
	{
		id: text().primaryKey().$defaultFn(ulid),
		label: text().notNull(),
		value: text().notNull(),
		isCorrect: boolean().notNull().default(false), // SERVER-ONLY

		questionId: text()
			.notNull()
			.references(() => questions.id, { onDelete: 'cascade' })
	},
	t => [index('question_options_question_idx').on(t.questionId)]
)

export const questionOptionsRelations = relations(
	questionOptions,
	({ one }) => ({
		question: one(questions, {
			fields: [questionOptions.questionId],
			references: [questions.id]
		})
	})
)

export type QuestionOption = typeof questionOptions.$inferSelect
export type NewQuestionOption = typeof questionOptions.$inferInsert
