'use client'

import { User } from '@/db/schema'
import {
	BaseQuestionFormSchema,
	ChoiceQuestionFormSchema,
	questionFormSchema,
	QuestionFormSchema,
	TextQuestionFormSchema
} from '@/features/questions/zod'
import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { Difficulty, MAX_QUIZ_QUESTIONS } from '@/lib/constants'
import { SetState } from '@/utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { createContext, useContext, useEffect, useState } from 'react'
import {
	useFieldArray,
	UseFieldArrayReturn,
	useForm,
	UseFormReturn
} from 'react-hook-form'

type QuizFormContextReturn = {
	quizForm: UseFormReturn<QuizFormSchema>
	questionForm: UseFormReturn<QuestionFormSchema>
	optionsField: UseFieldArrayReturn<QuestionFormSchema, 'options'>
	questionsFieldArray: UseFieldArrayReturn<QuizFormSchema, 'questions'>
	isGenerating: boolean
	setIsGenerating: SetState<boolean>
	controller: AbortController
}

export const QuizFormContext = createContext<QuizFormContextReturn | null>(null)

export const quizFormDefaults = {
	title: '',
	description: '',
	totalPoints: 100,
	timeLimitMinutes: 0,
	isPublic: true,
	categoryId: null,
	difficulty: 'easy' as Difficulty,
	questions: []
} satisfies QuizFormSchema

const baseQuestionDefaults: BaseQuestionFormSchema = {
	prompt: '',
	explanationHTML: '',
	difficulty: 'easy'
}

export const textDefaults: BaseQuestionFormSchema & TextQuestionFormSchema = {
	...baseQuestionDefaults,
	type: 'text',
	acceptableAnswers: [],
	ignoreCase: true,
	trimWhitespace: true
}

export const choiceDefaults: BaseQuestionFormSchema & ChoiceQuestionFormSchema =
	{
		...baseQuestionDefaults,
		type: 'multi_correct',
		options: [
			{ value: '', isCorrect: false },
			{ value: '', isCorrect: false }
		]
	}

export function useQuizForm() {
	const context = useContext(QuizFormContext)

	if (!context)
		throw new Error('useQuizForm must be used within QuizFormProvider')

	return context
}

export function QuizFormProvider({
	userId,
	children
}: {
	userId: User['id']
	children: React.ReactNode
}) {
	const quizForm = useForm<QuizFormSchema>({
		defaultValues: quizFormDefaults,
		resolver: zodResolver(quizFormSchema) as any
	})
	const questionsFieldArray = useFieldArray({
		control: quizForm.control,
		name: 'questions'
	})
	const questionForm = useForm<QuestionFormSchema>({
		defaultValues: choiceDefaults,
		resolver: zodResolver(questionFormSchema) as any, // TS being too weird
		disabled: questionsFieldArray.fields.length >= MAX_QUIZ_QUESTIONS
	})
	const optionsField = useFieldArray({
		control: questionForm.control,
		name: 'options'
	})
	const [isGenerating, setIsGenerating] = useState(false)
	const [controller] = useState(new AbortController())
	const storageKey = `quiz-form:${userId}`

	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey)
			if (raw) {
				const parsed = JSON.parse(raw)
				quizForm.reset({
					...quizForm.getValues(),
					...parsed
				})
			}
		} catch {
			/* ignore parse errors */
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Persist to localStorage on changes
	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const subscription = quizForm.watch(values => {
			// Save changes once 1s has passed since last input
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				localStorage.setItem(storageKey, JSON.stringify(values))
			}, 1000)

			return () => {
				clearTimeout(timeoutId)
				subscription.unsubscribe()
			}
		})

		return () => subscription.unsubscribe?.()
	}, [quizForm])

	const reset = (...args: Parameters<typeof quizForm.reset>) => {
		localStorage.removeItem(storageKey)
		quizForm.reset(...args)
	}

	return (
		<QuizFormContext.Provider
			value={{
				quizForm: { ...quizForm, reset },
				questionForm,
				optionsField,
				questionsFieldArray,
				isGenerating,
				setIsGenerating,
				controller
			}}
		>
			{children}
		</QuizFormContext.Provider>
	)
}
