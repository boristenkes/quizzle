import { questionTypes } from '@/lib/constants'
import { relations } from 'drizzle-orm'
import { index, integer, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { difficultyEnum, quizzle, timestamps } from './_root'
import { questionOptionsTable } from './question-options'
import { quizzesTable } from './quizzes'
import { textQuestionSettingsTable } from './text-question-settings'

export const questionTypeEnum = quizzle.enum('question_type', questionTypes)

export const questionsTable = quizzle.table(
	'questions',
	{
		id: text().primaryKey().$defaultFn(ulid),
		prompt: text().notNull(),
		type: questionTypeEnum().notNull(),
		explanationHTML: text(),
		quizId: text()
			.notNull()
			.references(() => quizzesTable.id, { onDelete: 'cascade' }),
		order: integer().notNull(),
		difficulty: difficultyEnum().notNull().default('easy'),

		...timestamps
	},
	t => [index('questions_quiz_idx').on(t.quizId)]
)

export const questionsRelations = relations(
	questionsTable,
	({ one, many }) => ({
		quiz: one(quizzesTable, {
			fields: [questionsTable.quizId],
			references: [quizzesTable.id]
		}),
		textQuestionSettings: one(textQuestionSettingsTable),
		options: many(questionOptionsTable)
	})
)

export type Question = typeof questionsTable.$inferSelect
export type NewQuestion = typeof questionsTable.$inferInsert
