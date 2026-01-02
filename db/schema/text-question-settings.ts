import { relations } from 'drizzle-orm'
import { boolean, text } from 'drizzle-orm/pg-core'
import { quizzle, tname } from './_root'
import { questions } from './questions'

export const textQuestionSettings = quizzle.table(
	tname('text_question_settings'),
	{
		questionId: text()
			.primaryKey()
			.references(() => questions.id, { onDelete: 'cascade' }),
		acceptableAnswers: text().array().notNull(),
		ignoreCase: boolean().default(true),
		trimWhitespace: boolean().default(true)
	}
)

export const textQuestionSettingsRelations = relations(
	textQuestionSettings,
	({ one }) => ({
		question: one(questions, {
			fields: [textQuestionSettings.questionId],
			references: [questions.id]
		})
	})
)

export type TextQuestionSettings = typeof textQuestionSettings.$inferSelect
export type NewTextQuestionSettings = typeof textQuestionSettings.$inferInsert
