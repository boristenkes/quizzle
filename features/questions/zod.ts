import { booleanSchema, integerSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const questionOptionFormSchema = z.object({
	text: requiredString,
	isCorrect: booleanSchema.default(false)
})

export const choiceQuestionFormSchema = z
	.object({
		type: z.enum(['multi_choice', 'single_choice']),
		options: questionOptionFormSchema.array().min(2).max(4)
	})
	.superRefine((data, ctx) => {
		const correctCount = data.options.count(opt => opt.isCorrect)

		if (data.type === 'single_choice' && correctCount !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Single choice questions must have exactly one correct option',
				path: ['options']
			})
		} else if (data.type === 'multi_choice' && correctCount < 2) {
			ctx.addIssue({
				code: 'custom',
				message: 'Multi choice questions must have at least 2 correct options',
				path: ['options']
			})
		}
	})

export const textQuestionFormSchema = z.object({
	type: z.literal('text'),
	acceptableAnswers: requiredString.array().min(1),
	ignoreCase: booleanSchema.optional().default(true),
	trimWhitespace: booleanSchema.optional().default(true)
})

export const baseQuestionFormSchema = z.object({
	prompt: requiredString,
	points: integerSchema
		.positive({ error: 'Points must be positive number' })
		.default(5),
	explanationHTML: requiredString
})

export const questionFormSchema = z.discriminatedUnion('type', [
	baseQuestionFormSchema.extend(textQuestionFormSchema.shape),
	baseQuestionFormSchema.extend(choiceQuestionFormSchema.shape)
])

export type QuestionOptionFormSchema = z.infer<typeof questionOptionFormSchema>
export type ChoiceQuestionFormSchema = z.infer<typeof choiceQuestionFormSchema>
export type TextQuestionFormSchema = z.infer<typeof textQuestionFormSchema>
export type BaseQuestionFormSchema = z.infer<typeof baseQuestionFormSchema>
export type QuestionFormSchema = z.infer<typeof questionFormSchema>
