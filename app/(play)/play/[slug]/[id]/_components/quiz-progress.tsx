'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/context/quiz'
import { Attempt } from '@/db/schema'
import { getQuestionByPosition } from '@/features/quiz-game/actions'
import { cn, errorMessage } from '@/utils/helpers'
import { Loader2 } from 'lucide-react'

export default function QuizProgress({
	attemptId
}: {
	attemptId: Attempt['id']
}) {
	const quiz = useQuiz()

	if (quiz.isLoading) return <Loader2 className='animate-spin' />

	if (quiz.isError)
		return <ErrorMessage message={errorMessage(quiz.error.message)} />

	const navigateToQuestion = async (position: number) => {
		const response = await getQuestionByPosition(attemptId, position)

		if (!response.success) return

		quiz.setCurrentQuestion(response.question)
	}

	return (
		<div>
			<ol className='flex items-center justify-center mb-8'>
				{quiz.data?.questions.map(question => (
					<li
						key={question.position}
						className='flex items-center'
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
							<div className={cn('w-10 h-0.5 bg-neutral-700')} />
						)}
					</li>
				))}
			</ol>
		</div>
	)
}
