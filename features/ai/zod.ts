import {
	difficulties,
	MAX_QUIZ_QUESTIONS,
	MIN_QUIZ_QUESTIONS,
	questionTypes
} from '@/lib/constants'
import { integerSchema } from '@/utils/zod'
import z from 'zod'

export const generateQuestionsFormSchema = z.object({
	questionCount: integerSchema
		.min(MIN_QUIZ_QUESTIONS)
		.max(MAX_QUIZ_QUESTIONS)
		.default(5),
	difficultyDistribution: z.tuple([
		integerSchema.min(0).max(100),
		integerSchema.min(0).max(100)
	]),
	typeDistribution: z.tuple([
		integerSchema.min(0).max(100),
		integerSchema.min(0).max(100)
	])
})

export type GenerateQuestionsFormSchema = z.infer<
	typeof generateQuestionsFormSchema
>

export const generateQuestionsConfigSchema = generateQuestionsFormSchema
	.pick({ questionCount: true })
	.extend({
		difficultyDistribution: z.record(z.enum(difficulties), integerSchema),
		typeDistribution: z.record(z.enum(questionTypes), integerSchema)
	})

export type GenerateQuestionsConfigSchema = z.infer<
	typeof generateQuestionsConfigSchema
>

export const pdfFileSchema = z
	.file()
	.max(4 * 1024 * 1024) // 4MB
	.mime('application/pdf')
