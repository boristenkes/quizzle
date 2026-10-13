'use client'

import { Attempt } from '@/db/schema'
import {
	AttemptData,
	AttemptQuestionData,
	getAttemptData
} from '@/features/quiz-game/actions'
import { SetState } from '@/utils/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'

export type QuizContextValue = UseQueryResult<AttemptData> & {
	currentQuestion: AttemptQuestionData
	setCurrentQuestion: SetState<AttemptQuestionData>
}

export const QuizContext = createContext<QuizContextValue | null>(null)

export function useQuiz() {
	const context = useContext(QuizContext)

	if (!context) throw new Error('useQuiz must be used within QuizProvider')

	return context
}

export type QuizProviderProps = {
	attemptId: Attempt['id']
	initialQuestion: AttemptQuestionData
	children: React.ReactNode
}

export function QuizProvider({
	attemptId,
	initialQuestion,
	children
}: QuizProviderProps) {
	const query = useQuery({
		queryKey: ['quiz:attempt', attemptId],
		queryFn: () => getAttemptData(attemptId)
	})
	const [currentQuestion, setCurrentQuestion] =
		useState<AttemptQuestionData>(initialQuestion)

	return (
		<QuizContext.Provider
			value={{ currentQuestion, setCurrentQuestion, ...query }}
		>
			{children}
		</QuizContext.Provider>
	)
}
