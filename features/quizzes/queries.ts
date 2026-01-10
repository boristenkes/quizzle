import { attempts, questions, quizzes, reviews } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const questionCountQuery = sql<number>`(
	select count(*) from ${questions}
	where ${questions}."quiz_id" = ${quizzes.id}
)::integer`.as('question_count')

export const averageRatingQuery = sql<number>`(
	select coalesce(avg(${reviews}."rating"), 0)
	from ${reviews}
	where ${reviews}."quiz_id" = ${quizzes.id}
)::float`.as('average_rating')

export const totalReviewsQuery = sql<number>`(
	select count(*) from ${reviews}
	where ${reviews}."quiz_id" = ${quizzes.id}
)::integer`.as('total_reviews')

export const totalAttemptsQuery = sql<number>`(
	select count(*) from ${attempts}
	where ${attempts}."quiz_id" = ${quizzes.id}
)::integer`.as('total_attempts')

export const averageScoreQuery = sql<number>`(
	select coalesce(avg(${attempts}."score"), 0)
	from ${attempts}
	where ${attempts}."quiz_id" = ${quizzes.id} and 
				${attempts}."is_completed" = true
)::float`.as('average_score')
