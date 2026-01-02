import { pgSchema } from 'drizzle-orm/pg-core'

export const TABLE_NAME_PREFIX = 'quizzle__'
export const tname = (name: string) => TABLE_NAME_PREFIX + name

export const quizzle = pgSchema('quizzle')
