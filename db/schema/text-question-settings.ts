import { relations } from 'drizzle-orm'
import { boolean, text } from 'drizzle-orm/pg-core'
import { quizzle } from './_root'
import { questionsTable } from './questions'

export const textQuestionSettingsTable = quizzle.table(
	'text_question_settings',
	{
		questionId: text()
			.primaryKey()
			.references(() => questionsTable.id, { onDelete: 'cascade' }),
		acceptableAnswers: text().array().notNull(),
		ignoreCase: boolean().default(true),
		trimWhitespace: boolean().default(true)
	}
)

export const textQuestionSettingsRelations = relations(
	textQuestionSettingsTable,
	({ one }) => ({
		question: one(questionsTable, {
			fields: [textQuestionSettingsTable.questionId],
			references: [questionsTable.id]
		})
	})
)

export type TextQuestionSettings = typeof textQuestionSettingsTable.$inferSelect
export type NewTextQuestionSettings =
	typeof textQuestionSettingsTable.$inferInsert
