import {
	attemptsTable,
	questionsTable,
	quizzesTable,
	reviewsTable
} from '@/db/schema'
import { sql } from 'drizzle-orm'

export const questionCountQuery = sql<number>`(
	select count(*) from ${questionsTable}
	where ${questionsTable}."quiz_id" = ${quizzesTable.id}
)::integer`.as('question_count')

export const averageRatingQuery = sql<number>`(
	select coalesce(avg(${reviewsTable}."rating"), 0)
	from ${reviewsTable}
	where ${reviewsTable}."quiz_id" = ${quizzesTable.id}
)::float`.as('average_rating')

export const totalReviewsQuery = sql<number>`(
	select count(*) from ${reviewsTable}
	where ${reviewsTable}."quiz_id" = ${quizzesTable.id}
)::integer`.as('total_reviews')

export const totalAttemptsQuery = sql<number>`(
	select count(*) from ${attemptsTable}
	where ${attemptsTable}."quiz_id" = ${quizzesTable.id}
)::integer`.as('total_attempts')

export const averageScoreQuery = sql<number>`(
	select coalesce(avg(${attemptsTable}."score"), 0)
	from ${attemptsTable}
	where ${attemptsTable}."quiz_id" = ${quizzesTable.id} and 
				${attemptsTable}."is_completed" = true
)::float`.as('average_score')
