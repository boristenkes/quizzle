import { relations } from 'drizzle-orm'
import { boolean, index, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { difficultyEnum, quizzle, timestamps } from './_root'
import { questionsTable } from './questions'
import { quizCategoriesTable } from './quiz-categories'
import { usersTable } from './users'

export const quizzesTable = quizzle.table(
	'quizzes',
	{
		id: text().primaryKey().$defaultFn(ulid),
		title: text().notNull(),
		slug: text().notNull(),
		description: text().notNull(),
		difficulty: difficultyEnum().notNull().default('easy'),

		timeLimitSeconds: integer(),
		totalPoints: integer().notNull().default(100),
		isPublic: boolean().notNull().default(true),
		isPublished: boolean().notNull().default(true),
		questionCount: integer().notNull(),

		creatorId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		categoryId: text().references(() => quizCategoriesTable.id, {
			onDelete: 'set null'
		}),

		...timestamps,
		deletedAt: timestamp({ withTimezone: true })
	},
	t => [
		index('quizzes_creator_idx').on(t.creatorId),
		index('quizzes_category_idx').on(t.categoryId)
	]
)

export const quizzesRelations = relations(quizzesTable, ({ one, many }) => ({
	creator: one(usersTable, {
		fields: [quizzesTable.creatorId],
		references: [usersTable.id]
	}),
	category: one(quizCategoriesTable, {
		fields: [quizzesTable.categoryId],
		references: [quizCategoriesTable.id]
	}),
	questions: many(questionsTable)
}))

export type Quiz = typeof quizzesTable.$inferSelect
export type NewQuiz = typeof quizzesTable.$inferInsert
