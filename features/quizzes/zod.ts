import { questionFormSchema } from '@/features/questions/zod'
import { booleanSchema, integerSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const quizFormSchema = z.object({
	title: requiredString
		.min(5, { error: 'Min 5 characters' })
		.max(32, { error: 'Max 32 characters' }),
	description: requiredString
		.min(16, { error: 'Min 16 characters' })
		.max(256, { error: 'Max 256 characters' }),
	timeLimitMinutes: integerSchema.optional(),
	totalPoints: integerSchema.positive(),
	isPublic: booleanSchema.default(true),
	questions: questionFormSchema
		.array()
		.min(3, { error: 'Quiz must have at least 3 questions' })
		.max(50, { error: 'Quiz can have up to 50 questions' })
})

export type QuizFormSchema = z.infer<typeof quizFormSchema>
