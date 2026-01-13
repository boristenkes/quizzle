'use client'

import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { Difficulty } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

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
}

type UseQuizFormProps = Parameters<typeof useForm<QuizFormSchema>>[0]

export function useQuizForm(props?: UseQuizFormProps) {
	const form = useForm<QuizFormSchema>({
		defaultValues: quizFormDefaults,
		resolver: zodResolver(quizFormSchema) as any,
		...props
	})

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

	return { ...form, reset }
}
