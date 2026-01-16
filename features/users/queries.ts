import { attemptsTable, followsTable, quizzesTable } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const quizCountQuery = sql<number>`(
  select count(*) from ${quizzesTable}
  where ${quizzesTable}."creator_id" = "usersTable"."id"
)::integer`.as('quiz_count')

export const totalAttemptsQuery = sql<number>`(
  select count(*) from ${attemptsTable}
  where ${attemptsTable}."user_id" = "usersTable"."id"
)::integer`.as('total_attempts')

export const followerCountQuery = sql<number>`(
  select count(*) from ${followsTable}
  where ${followsTable}."following_id" = "usersTable"."id"
)::integer`.as('follower_count')

export const followingCountQuery = sql<number>`(
  select count(*) from ${followsTable}
  where ${followsTable}."follower_id" = "usersTable"."id"
)::integer`.as('following_count')
