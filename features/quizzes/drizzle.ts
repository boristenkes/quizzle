import { db } from '@/db'
import { questions, quizzes } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export const questionCountQuery = db
	.$count(questions, eq(sql`${questions}."quiz_id"`, quizzes.id))
	.as('question_count')
