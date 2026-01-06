import { relations } from 'drizzle-orm'
import { boolean, index, integer, text } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { quizzle } from './_root'
import { timestamps } from './_utils'
import { questions } from './questions'
import { users } from './users'

export const quizzes = quizzle.table(
	'quizzes',
	{
		id: text().primaryKey().$defaultFn(ulid),
		title: text().notNull(),
		description: text().notNull(),

		timeLimitSeconds: integer(),
		totalPoints: integer().notNull().default(100),
		isPublic: boolean().notNull().default(true),
		isPublished: boolean().notNull().default(true),

		creatorId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		...timestamps({ includeDeletedAt: true })
	},
	t => [index('quizzes_creator_idx').on(t.creatorId)]
)

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
	creator: one(users, {
		fields: [quizzes.creatorId],
		references: [users.id]
	}),
	questions: many(questions)
}))

export type Quiz = typeof quizzes.$inferSelect
export type NewQuiz = typeof quizzes.$inferInsert
