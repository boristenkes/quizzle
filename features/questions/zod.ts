import {
	MAX_QUESTION_OPTIONS,
	MIN_QUESTION_OPTIONS,
	questionDifficulties
} from '@/lib/constants'
import { booleanSchema, requiredString } from '@/utils/zod'
import z from 'zod'

export const questionOptionFormSchema = z.object({
	text: requiredString,
	isCorrect: booleanSchema.default(false)
})

export const choiceQuestionFormSchema = z
	.object({
		type: z.enum(['multi_correct', 'single_correct']),
		options: questionOptionFormSchema
			.array()
			.min(MIN_QUESTION_OPTIONS, {
				error: `Question must have at least ${MIN_QUESTION_OPTIONS} options`
			})
			.max(MAX_QUESTION_OPTIONS, {
				error: `Question can have up to ${MAX_QUESTION_OPTIONS} options`
			})
	})
	.superRefine((data, ctx) => {
		const correctCount = data.options.count(opt => opt.isCorrect)

		if (data.type === 'single_correct' && correctCount !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Single choice questions must have exactly one correct option',
				path: ['options']
			})
		} else if (data.type === 'multi_correct' && correctCount < 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Multi choice questions must have at least 2 correct options',
				path: ['options']
			})
		}
	})

export const textQuestionFormSchema = z.object({
	type: z.literal('text'),
	acceptableAnswers: requiredString.array().nonempty({ error: 'Required' }),
	ignoreCase: booleanSchema.optional().default(true),
	trimWhitespace: booleanSchema.optional().default(true)
})

export const baseQuestionFormSchema = z.object({
	prompt: requiredString,
	explanationHTML: requiredString,
	difficulty: z.enum(questionDifficulties)
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
