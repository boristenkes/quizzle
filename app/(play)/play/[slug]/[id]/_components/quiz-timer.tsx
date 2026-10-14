'use client'

import ErrorMessage from '@/components/error-message'
import { useQuiz } from '@/context/quiz'
import { Attempt } from '@/db/schema'
import { errorMessage } from '@/utils/helpers'
import { ClockIcon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function formatTime(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function QuizTimer({ attemptId }: { attemptId: Attempt['id'] }) {
	const quiz = useQuiz()
	const [now, setNow] = useState(() => Date.now())
	const router = useRouter()

	const startedAt = quiz.data?.startedAt
	const timeLimitSeconds = quiz.data?.timeLimitSeconds

	useEffect(() => {
		if (!startedAt || timeLimitSeconds == null) return

		const intervalId = setInterval(() => setNow(Date.now()), 1000)

		return () => clearInterval(intervalId)
	}, [startedAt, timeLimitSeconds])

	if (quiz.isLoading || !quiz.data)
		return <Loader2Icon className='animate-spin' />

	if (quiz.isError)
		return <ErrorMessage message={errorMessage(quiz.error.message)} />

	const startTime = new Date(startedAt!).getTime()
	const elapsedSeconds = Math.floor((now - startTime) / 1000)
	const remainingSeconds = Math.max(0, timeLimitSeconds! - elapsedSeconds)

	return (
		<div
			role='timer'
			aria-label={`Time remaining: ${formatTime(remainingSeconds)}`}
			className='inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 font-mono text-sm tabular-nums text-muted-foreground'
		>
			<ClockIcon className='size-4 shrink-0' />
			<span>{formatTime(remainingSeconds)}</span>
		</div>
	)
}
