import { relations } from 'drizzle-orm'
import { boolean, index, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { difficultyEnum, quizzle, timestamps } from './_root'
import { questions } from './questions'
import { quizCategories } from './quiz-categories'
import { users } from './users'

export const quizzes = quizzle.table(
	'quizzes',
	{
		id: text().primaryKey().$defaultFn(ulid),
		title: text().notNull(),
		slug: text(),
		description: text().notNull(),
		difficulty: difficultyEnum().notNull().default('easy'),

		timeLimitSeconds: integer(),
		totalPoints: integer().notNull().default(100),
		isPublic: boolean().notNull().default(true),
		isPublished: boolean().notNull().default(true),
		questionCount: integer().notNull(),

		creatorId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		categoryId: text().references(() => quizCategories.id, {
			onDelete: 'set null'
		}),

		...timestamps,
		deletedAt: timestamp({ withTimezone: true })
	},
	t => [index('quizzes_creator_idx').on(t.creatorId)]
)

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
	creator: one(users, {
		fields: [quizzes.creatorId],
		references: [users.id]
	}),
	category: one(quizCategories, {
		fields: [quizzes.categoryId],
		references: [quizCategories.id]
	}),
	questions: many(questions)
}))

export type Quiz = typeof quizzes.$inferSelect
export type NewQuiz = typeof quizzes.$inferInsert
