import { relations } from 'drizzle-orm'
import { integer, real, text } from 'drizzle-orm/pg-core'
import { quizzle, timestamps } from './_root'
import { quizzesTable } from './quizzes'

export const quizStatisticsTable = quizzle.table('quiz_statistics', {
	quizId: text()
		.primaryKey()
		.references(() => quizzesTable.id, { onDelete: 'cascade' }),

	attemptsCount: integer().notNull().default(0),
	averageScore: integer().notNull().default(0),
	averageTimeMs: integer().notNull().default(0),
	fastestTimeMs: integer().notNull().default(0),

	averageRating: real().notNull().default(0),
	reviewsCount: integer().notNull().default(0),

	...timestamps
})

export const quizStatisticsRelations = relations(
	quizStatisticsTable,
	({ one }) => ({
		quiz: one(quizzesTable, {
			fields: [quizStatisticsTable.quizId],
			references: [quizzesTable.id]
		})
	})
)

export type QuizStatistics = typeof quizStatisticsTable.$inferSelect
export type NewQuizStatistics = typeof quizStatisticsTable.$inferInsert
