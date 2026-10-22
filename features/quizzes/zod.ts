import { PAGE_SIZE } from '@/app/(dashboard)/discover/zod'
import { Quiz, QuizCategory, QuizStatistics, User } from '@/db/schema'
import { questionFormSchema } from '@/features/questions/zod'
import {
	difficulties,
	MAX_QUIZ_QUESTIONS,
	MIN_QUIZ_QUESTIONS
} from '@/lib/constants'
import { booleanSchema, integerSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const quizFormSchema = z.object({
	title: requiredString
		.min(5, { error: 'Min 5 characters' })
		.max(100, { error: 'Max 100 characters' }),
	description: requiredString
		.min(16, { error: 'Min 16 characters' })
		.max(512, { error: 'Max 512 characters' }),
	timeLimitMinutes: integerSchema
		.min(0, { error: 'Time limit cannot be less than 0' })
		.max(120, { error: 'Max 120 minutes (2h)' })
		.optional(),
	totalPoints: integerSchema.positive(),
	isPublic: booleanSchema.default(true),
	categoryId: z.ulid().optional().nullable(),
	difficulty: z.enum(difficulties).default('easy'),
	questions: questionFormSchema
		.array()
		.min(MIN_QUIZ_QUESTIONS, {
			error: `Quiz must have at least ${MIN_QUIZ_QUESTIONS} questions`
		})
		.max(MAX_QUIZ_QUESTIONS, {
			error: `Quiz can have up to ${MAX_QUIZ_QUESTIONS} questions`
		})
})

export type QuizFormSchema = z.infer<typeof quizFormSchema>

export const filtersFormSchema = z
	.object({
		searchQuery: z.string().trim().nullable(),
		categoryId: z.ulid().nullable(),
		difficulty: z.enum(difficulties).nullable()
	})
	.partial()

export type FiltersFormSchema = z.infer<typeof filtersFormSchema>

export const paginationSchema = z.object({
	page: integerSchema.positive().optional().default(1),
	pageSize: integerSchema.positive().optional().default(PAGE_SIZE)
})

export type QuizCardData = Pick<
	Quiz,
	| 'id'
	| 'slug'
	| 'title'
	| 'description'
	| 'timeLimitSeconds'
	| 'questionCount'
	| 'difficulty'
> & {
	creator: Pick<User, 'id' | 'username' | 'name' | 'image'>
	category: Pick<QuizCategory, 'name'> | null
	statistics: Pick<
		QuizStatistics,
		'averageRating' | 'attemptsCount' | 'averageScore'
	>
}

export type PaginationSchema = z.infer<typeof paginationSchema>
