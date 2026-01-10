import { relations } from 'drizzle-orm'
import { index, integer, json, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { attempts } from './attempts'
import { questions } from './questions'

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

export const attemptQuestions = quizzle.table(
	'quiz_attempt_questions',
	{
		id: text().primaryKey().$defaultFn(ulid),
		attemptId: text()
			.notNull()
			.references(() => attempts.id, { onDelete: 'cascade' }),
		questionId: text().references(() => questions.id, { onDelete: 'set null' }),

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
	attemptQuestions,
	({ one }) => ({
		attempt: one(attempts, {
			fields: [attemptQuestions.attemptId],
			references: [attempts.id]
		}),
		question: one(questions, {
			fields: [attemptQuestions.questionId],
			references: [questions.id]
		})
	})
)

export type AttemptQuestion = typeof attemptQuestions.$inferSelect
export type PublicAttemptQuestion = Omit<AttemptQuestion, 'questionPrivate'>
export type NewAttemptQuestion = typeof attemptQuestions.$inferInsert
