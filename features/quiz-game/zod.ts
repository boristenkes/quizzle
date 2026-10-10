import { difficulties } from '@/lib/constants'
import { integerSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const attemptQuizData = z.object({
	title: requiredString,
	slug: requiredString,
	description: requiredString,
	difficulty: z.enum(difficulties),
	timeLimitSeconds: integerSchema.gte(0).optional().nullable(),
	totalPoints: integerSchema.positive(),
	questionCount: integerSchema.positive(),
	createdAt: z.coerce.date()
})

export type AttemptQuizData = z.infer<typeof attemptQuizData>

export const attemptQuestionPublic = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('text'),
		prompt: requiredString
	}),
	z.object({
		type: z.enum(['multi_correct', 'single_correct']),
		prompt: requiredString,
		options: z
			.object({
				id: requiredString,
				value: requiredString
			})
			.array()
	})
])

export type AttemptQuestionPublic = z.infer<typeof attemptQuestionPublic>

export const attemptQuestionPrivate = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('text'),
		explanationHTML: z.string(),
		acceptableAnswers: requiredString.array().min(1),
		ignoreCase: z.boolean().default(true),
		trimWhitespace: z.boolean().default(true)
	}),
	z.object({
		type: z.enum(['multi_correct', 'single_correct']),
		explanationHTML: z.string(),
		options: z
			.object({
				id: requiredString,
				value: requiredString,
				isCorrect: z.boolean()
			})
			.array()
	})
])

export type AttemptQuestionPrivate = z.infer<typeof attemptQuestionPrivate>

export const attemptQuestionSubmittedAnswer = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('text'),
		answer: requiredString
	}),
	z.object({
		type: z.literal('single_correct'),
		answerId: requiredString
	}),
	z.object({
		type: z.literal('multi_correct'),
		answerIds: requiredString.array()
	})
])

export type AttemptQuestionSubmittedAnswer = z.infer<
	typeof attemptQuestionSubmittedAnswer
>
