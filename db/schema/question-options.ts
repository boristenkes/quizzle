import { relations } from 'drizzle-orm'
import { boolean, index, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { questionsTable } from './questions'

export const questionOptionsTable = quizzle.table(
	'question_options',
	{
		id: text().primaryKey().$defaultFn(ulid),
		value: text().notNull(),
		isCorrect: boolean().notNull().default(false), // SERVER-ONLY

		questionId: text()
			.notNull()
			.references(() => questionsTable.id, { onDelete: 'cascade' })
	},
	t => [index('question_options_question_idx').on(t.questionId)]
)

export const questionOptionsRelations = relations(
	questionOptionsTable,
	({ one }) => ({
		question: one(questionsTable, {
			fields: [questionOptionsTable.questionId],
			references: [questionsTable.id]
		})
	})
)

export type QuestionOption = typeof questionOptionsTable.$inferSelect
export type NewQuestionOption = typeof questionOptionsTable.$inferInsert
