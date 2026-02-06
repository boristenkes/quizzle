import { relations } from 'drizzle-orm'
import { index, primaryKey, text } from 'drizzle-orm/pg-core'
import { quizzle, timestamps } from './_root'
import { quizzesTable } from './quizzes'
import { usersTable } from './users'

export const bookmarksTable = quizzle.table(
	'bookmarks',
	{
		userId: text()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		quizId: text()
			.notNull()
			.references(() => quizzesTable.id, { onDelete: 'cascade' }),
		...timestamps
	},
	t => [
		primaryKey({ columns: [t.userId, t.quizId] }),
		index('bookmarks_quiz_idx').on(t.quizId),
		index('bookmarks_user_idx').on(t.userId)
	]
)

export const bookmarksRelations = relations(bookmarksTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [bookmarksTable.userId],
		references: [usersTable.id]
	}),
	quiz: one(quizzesTable, {
		fields: [bookmarksTable.quizId],
		references: [quizzesTable.id]
	})
}))

export type Bookmark = typeof bookmarksTable.$inferSelect
export type NewBookmark = typeof bookmarksTable.$inferInsert
