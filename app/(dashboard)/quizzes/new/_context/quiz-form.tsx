'use client'

import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { Difficulty } from '@/lib/constants'
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
	form: UseFormReturn<QuizFormSchema>
	questionsFieldArray: UseFieldArrayReturn<QuizFormSchema, 'questions'>
	isGenerating: boolean
	setIsGenerating: SetState<boolean>
	controller: AbortController
}

export const QuizFormContext = createContext<QuizFormContextReturn | null>(null)

export const STORAGE_KEY = 'quizzle:new-quiz-form'

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

export function useQuizForm() {
	const context = useContext(QuizFormContext)

	if (!context)
		throw new Error('useQuizForm must be used within QuizFormProvider')

	return context
}

export function QuizFormProvider({ children }: { children: React.ReactNode }) {
	const form = useForm<QuizFormSchema>({
		defaultValues: quizFormDefaults,
		resolver: zodResolver(quizFormSchema) as any
	})
	const questionsFieldArray = useFieldArray({
		control: form.control,
		name: 'questions'
	})
	const [isGenerating, setIsGenerating] = useState(false)
	const [controller] = useState(new AbortController())

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) {
				const parsed = JSON.parse(raw)
				form.reset({
					...form.getValues(),
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

		const subscription = form.watch(values => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
			}, 1000)

			return () => {
				clearTimeout(timeoutId)
				subscription.unsubscribe()
			}
		})

		return () => subscription.unsubscribe?.()
	}, [form])

	const reset = (...args: Parameters<typeof form.reset>) => {
		localStorage.removeItem(STORAGE_KEY)
		form.reset(...args)
	}

	return (
		<QuizFormContext.Provider
			value={{
				form: { ...form, reset },
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
