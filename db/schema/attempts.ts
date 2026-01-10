import { relations } from 'drizzle-orm'
import { boolean, index, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { timestamps } from './_utils'
import { attemptQuestions } from './attempt-questions'
import { quizzes } from './quizzes'
import { users } from './users'

export const attempts = quizzle.table(
	'quiz_attempts',
	{
		id: text().primaryKey().$defaultFn(ulid),
		score: integer().notNull().default(0),
		maxScore: integer().notNull(),
		startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		submittedAt: timestamp({ withTimezone: true }),
		isCompleted: boolean().notNull().default(false),

		quizId: text()
			.notNull()
			.references(() => quizzes.id, { onDelete: 'cascade' }),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		...timestamps
	},
	t => [
		index('quiz_attempts_quiz_idx').on(t.quizId),
		index('quiz_attempts_user_idx').on(t.userId),
		index('quiz_attempts_quiz_is_completed').on(t.quizId, t.isCompleted)
	]
)

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
	quiz: one(quizzes, {
		fields: [attempts.quizId],
		references: [quizzes.id]
	}),
	user: one(users, {
		fields: [attempts.userId],
		references: [users.id]
	}),
	questions: many(attemptQuestions)
}))

export type Attempt = typeof attempts.$inferSelect
export type NewAttempt = typeof attempts.$inferInsert
