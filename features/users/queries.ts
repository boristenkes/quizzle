import { attemptsTable, quizzesTable } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const quizCountQuery = sql<number>`(
  select count(*) from ${quizzesTable}
  where ${quizzesTable}."creator_id" = "usersTable"."id"
)::integer`.as('quiz_count')

export const totalAttemptsQuery = sql<number>`(
  select count(*) from ${attemptsTable}
  where ${attemptsTable}."user_id" = "usersTable"."id"
)::integer`.as('total_attempts')
