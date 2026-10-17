'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuiz } from '@/context/quiz'
import { Attempt } from '@/db/schema'
import { getQuestionByPosition } from '@/features/quiz-game/actions'
import { cn, errorMessage } from '@/utils/helpers'
import React from 'react'

export type QuizProgressProps = React.ComponentProps<'div'> & {
	attemptId: Attempt['id']
	skeletonClassName?: string
}

export default function QuizProgress({
	attemptId,
	className,
	skeletonClassName,
	...props
}: QuizProgressProps) {
	const quiz = useQuiz()

	if (quiz.isLoading)
		return <QuizProgressSkeleton className={skeletonClassName} />

	if (quiz.isError)
		return <ErrorMessage message={errorMessage(quiz.error.message)} />

	const navigateToQuestion = async (position: number) => {
		const cachedQuestion = quiz.questionsCache.find(
			question => question.position === position
		)

		if (cachedQuestion) {
			return quiz.setCurrentQuestion(cachedQuestion)
		}

		const response = await getQuestionByPosition(attemptId, position)

		if (!response.success) return

		quiz.setQuestionsCache(curr => [...curr, response.question])
		quiz.setCurrentQuestion(response.question)
	}

	return (
		<div
			className={cn('min-w-0 flex-1 overflow-x-auto scroll-px-8', className)}
			{...props}
		>
			<ol className='flex w-max min-w-full justify-center items-center mb-8'>
				{quiz.data?.questions.map(question => (
					<li
						key={question.position}
						className='flex shrink-0 items-center'
					>
						<Button
							size='icon-lg'
							variant='secondary'
							className={cn(
								'rounded-full border-2 grid place-items-center',
								question.isAnswered && 'bg-primary/80 hover:bg-primary/70',
								question.position === quiz.currentQuestion.position &&
									'border-primary'
							)}
							onClick={() => navigateToQuestion(question.position)}
						>
							{question.position}
						</Button>

						{question.position !== quiz.data.questionCount && (
							<div className={cn('w-10 h-0.5 bg-neutral-700 shrink-0')} />
						)}
					</li>
				))}
			</ol>
		</div>
	)
}

export type QuizProgressSkeletonProps = React.ComponentProps<'div'> & {
	buttonCount?: number
}

export function QuizProgressSkeleton({
	buttonCount = 6,
	className,
	...props
}: QuizProgressSkeletonProps) {
	return (
		<div
			className={cn('min-w-0 flex-1 overflow-x-auto scroll-px-8', className)}
			{...props}
		>
			<ol className='flex w-max min-w-full justify-center items-center mb-8'>
				{Array.from({ length: buttonCount }).map((_, idx) => (
					<li
						key={idx}
						className='flex shrink-0 items-center'
					>
						<Skeleton className='size-10 rounded-full' />

						{idx !== buttonCount - 1 && (
							<Skeleton className={cn('w-10 h-0.5 shrink-0')} />
						)}
					</li>
				))}
			</ol>
		</div>
	)
}
