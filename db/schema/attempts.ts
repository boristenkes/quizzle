import { AttemptQuizData } from '@/features/quiz-game/zod'
import { relations } from 'drizzle-orm'
import {
	boolean,
	index,
	integer,
	json,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle, timestamps } from './_root'
import { attemptQuestionsTable } from './attempt-questions'
import { quizzesTable } from './quizzes'
import { usersTable } from './users'

export const attemptsTable = quizzle.table(
	'quiz_attempts',
	{
		id: text().primaryKey().$defaultFn(ulid),
		score: integer().notNull().default(0),
		maxScore: integer().notNull(),
		startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		submittedAt: timestamp({ withTimezone: true }),
		isCompleted: boolean().notNull().default(false),
		quizData: json().$type<AttemptQuizData>().notNull(),

		quizId: text()
			.notNull()
			.references(() => quizzesTable.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),

		...timestamps
	},
	t => [
		index('quiz_attempts_quiz_idx').on(t.quizId),
		index('quiz_attempts_user_idx').on(t.userId),
		index('quiz_attempts_quiz_is_completed').on(t.quizId, t.isCompleted)
	]
)

export const attemptsRelations = relations(attemptsTable, ({ one, many }) => ({
	quiz: one(quizzesTable, {
		fields: [attemptsTable.quizId],
		references: [quizzesTable.id]
	}),
	user: one(usersTable, {
		fields: [attemptsTable.userId],
		references: [usersTable.id]
	}),
	questions: many(attemptQuestionsTable)
}))

export type Attempt = typeof attemptsTable.$inferSelect
export type NewAttempt = typeof attemptsTable.$inferInsert
