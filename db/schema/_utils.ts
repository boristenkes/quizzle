import { timestamp } from 'drizzle-orm/pg-core'

export const timestamps = ({ includeDeletedAt = false } = {}) => ({
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),

	...(includeDeletedAt ? { deletedAt: timestamp({ withTimezone: true }) } : {})
})
