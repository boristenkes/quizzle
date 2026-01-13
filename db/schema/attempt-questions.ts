import { relations } from 'drizzle-orm'
import { index, integer, json, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { attemptsTable } from './attempts'
import { questionsTable } from './questions'

type AttemptQuestionsQuestionPublic =
	| {
			type: 'text'
			prompt: string
	  }
	| {
			type: 'multi_correct' | 'single_correct'
			prompt: string
			options: {
				id: string
				value: string
			}[]
	  }

type AttemptQuestionsQuestionPrivate =
	| {
			type: 'text'
			explanationHTML: string
			acceptableAnswers: string[]
			ignoreCase: boolean
			trimWhitespace: boolean
	  }
	| {
			type: 'multi_correct' | 'single_correct'
			explanationHTML: string
			correctOptionIds: string[]
	  }

export const attemptQuestionsTable = quizzle.table(
	'quiz_attempt_questions',
	{
		id: text().primaryKey().$defaultFn(ulid),
		attemptId: text()
			.notNull()
			.references(() => attemptsTable.id, { onDelete: 'cascade' }),
		questionId: text().references(() => questionsTable.id, {
			onDelete: 'set null'
		}),

		questionPublic: json().$type<AttemptQuestionsQuestionPublic>().notNull(),
		questionPrivate: json().$type<AttemptQuestionsQuestionPrivate>().notNull(),

		order: integer().notNull()
	},
	t => [
		index('quiz_attempt_questions__attempt_id').on(t.attemptId),
		index('quiz_attempt_questions__question_id').on(t.questionId)
	]
)

export const attemptQuestionsRelations = relations(
	attemptQuestionsTable,
	({ one }) => ({
		attempt: one(attemptsTable, {
			fields: [attemptQuestionsTable.attemptId],
			references: [attemptsTable.id]
		}),
		question: one(questionsTable, {
			fields: [attemptQuestionsTable.questionId],
			references: [questionsTable.id]
		})
	})
)

export type AttemptQuestion = typeof attemptQuestionsTable.$inferSelect
export type PublicAttemptQuestion = Omit<AttemptQuestion, 'questionPrivate'>
export type NewAttemptQuestion = typeof attemptQuestionsTable.$inferInsert
