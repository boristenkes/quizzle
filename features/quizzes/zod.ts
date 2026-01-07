import { questionFormSchema } from '@/features/questions/zod'
import { MAX_QUIZ_QUESTIONS, MIN_QUIZ_QUESTIONS } from '@/lib/constants'
import { booleanSchema, integerSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const quizFormSchema = z.object({
	title: requiredString
		.min(5, { error: 'Min 5 characters' })
		.max(50, { error: 'Max 50 characters' }),
	description: requiredString
		.min(16, { error: 'Min 16 characters' })
		.max(256, { error: 'Max 256 characters' }),
	timeLimitMinutes: integerSchema.optional(),
	totalPoints: integerSchema.positive(),
	isPublic: booleanSchema.default(true),
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
