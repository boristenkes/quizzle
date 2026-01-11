import { difficulties } from '@/lib/constants'
import { pgSchema, timestamp } from 'drizzle-orm/pg-core'

export const quizzle = pgSchema('quizzle')

export const difficultyEnum = quizzle.enum('difficulty', difficulties)

export const timestamps = {
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
}
