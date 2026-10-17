'use client'

import ErrorMessage from '@/components/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuiz } from '@/context/quiz'
import { Attempt } from '@/db/schema'
import { submitQuiz } from '@/features/quiz-game/actions'
import { cn, errorMessage } from '@/utils/helpers'
import { ClockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

function formatTime(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function QuizTimer({ attemptId }: { attemptId: Attempt['id'] }) {
	const quiz = useQuiz()
	const [now, setNow] = useState(() => Date.now())
	const router = useRouter()
	const submittedRef = useRef(false)

	const startedAt = quiz.data?.startedAt
	const timeLimitSeconds = quiz.data?.timeLimitSeconds

	useEffect(() => {
		if (!startedAt || timeLimitSeconds == null) return

		const intervalId = setInterval(() => setNow(Date.now()), 1000)

		return () => clearInterval(intervalId)
	}, [startedAt, timeLimitSeconds])

	const startTime = startedAt ? new Date(startedAt).getTime() : 0
	const elapsedSeconds = Math.floor((now - startTime) / 1000)
	const remainingSeconds =
		timeLimitSeconds == null
			? 0
			: Math.max(0, timeLimitSeconds - elapsedSeconds)
	const timeRatio = remainingSeconds / timeLimitSeconds!

	const isUrgent = remainingSeconds <= 10

	const timerColor = isUrgent
		? 'text-red-500'
		: timeRatio > 0.5
			? 'text-green-500'
			: timeRatio > 0.2
				? 'text-yellow-500'
				: 'text-red-500'

	useEffect(() => {
		if (
			!startedAt ||
			timeLimitSeconds == null ||
			remainingSeconds > 0 ||
			submittedRef.current
		) {
			return
		}

		submittedRef.current = true

		submitQuiz(attemptId)
			.then(() => {
				router.replace(`/quizzes/results/${attemptId}`)
			})
			.catch(error => {
				console.error('Failed to submit quiz after timeout:', error)
				submittedRef.current = false
			})
	}, [attemptId, remainingSeconds, router, startedAt, timeLimitSeconds])

	if (quiz.isLoading || !quiz.data) return <QuizTimerSkeleton />

	if (quiz.isError)
		return <ErrorMessage message={errorMessage(quiz.error.message)} />

	if (timeLimitSeconds == null) return null

	return (
		<div
			role='timer'
			aria-label={`Time remaining: ${formatTime(remainingSeconds)}`}
			aria-live={isUrgent ? 'assertive' : 'off'}
			className={cn(
				'relative inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 font-mono text-sm tabular-nums transition-colors duration-500',
				timerColor
			)}
		>
			<ClockIcon className='size-4 shrink-0' />
			<span>{formatTime(remainingSeconds)}</span>

			{/* Ping animation */}
			{isUrgent && (
				<div className='absolute rounded-full inset-0.5 -z-10 bg-red-500/50 animate-ping' />
			)}
		</div>
	)
}

export type QuizTimerSkeletonProps = React.ComponentProps<typeof Skeleton>

export function QuizTimerSkeleton({
	className,
	...props
}: QuizTimerSkeletonProps) {
	return (
		<Skeleton
			className={cn('w-22 h-8 rounded-full', className)}
			{...props}
		/>
	)
}
