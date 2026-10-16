'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useQuiz } from '@/context/quiz'
import { Attempt } from '@/db/schema'
import {
	getQuestionByPosition,
	submitAnswer,
	submitQuiz
} from '@/features/quiz-game/actions'
import { AttemptQuestionSubmittedAnswer } from '@/features/quiz-game/zod'
import { cn, errorMessage } from '@/utils/helpers'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type QuizPlayerProps = {
	attemptId: Attempt['id']
}

export default function QuizPlayer({ attemptId }: QuizPlayerProps) {
	const quiz = useQuiz()
	const [error, setError] = useState<string | null>(null)
	const [answer, setAnswer] = useState<AttemptQuestionSubmittedAnswer | null>(
		null
	)
	const router = useRouter()

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)

		if (!answer) return setError('Choose an answer to continue')

		const submitResponse = await submitAnswer(quiz.currentQuestion.id, answer)

		if (!submitResponse.success) {
			setError(errorMessage(submitResponse.message))
			console.error('[QUESTION_SUBMIT_RESPONSE]:', submitResponse.message)
			return
		}

		if (!submitResponse.question) {
			const { success } = await submitQuiz(attemptId)

			if (!success) return setError('Failed to submit quiz')

			return router.replace(`/quizzes/results/${attemptId}`)
		}

		setAnswer(null)
		quiz.setCurrentQuestion(submitResponse.question)
		await quiz.refetch()
	}

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
		<form
			className='max-w-4xl mx-auto'
			onSubmit={onSubmit}
		>
			<header className='mb-8 grid gap-2'>
				<h1 className='text-2xl text-pretty'>{quiz.currentQuestion.prompt}</h1>
				<p className='text-muted-foreground text-left text-md'>
					{quiz.currentQuestion.type === 'single_correct'
						? 'You can select only one option'
						: quiz.currentQuestion.type === 'multi_correct'
							? 'You can select multiple options'
							: 'Enter your answer in textarea field below'}
				</p>
			</header>

			{error && (
				<div className='p-4'>
					<ErrorMessage message={errorMessage(error)} />
				</div>
			)}

			<section className='gap-4'>
				{quiz.currentQuestion.type === 'multi_correct' && (
					<div className='grid gap-4'>
						{quiz.currentQuestion.options.map(option => (
							<Label
								key={option.id}
								htmlFor={option.id}
								className='flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-neutral-700/20 has-checked:border-primary has-checked:bg-primary/10 has-checked:ring-1 has-checked:ring-primary/50'
							>
								<Checkbox
									id={option.id}
									checked={
										answer?.type === 'multi_correct' &&
										answer.answerIds.includes(option.id)
									}
									onCheckedChange={checked => {
										setAnswer(prev => {
											const answerIds =
												prev?.type === 'multi_correct' ? prev.answerIds : []

											return {
												type: 'multi_correct',
												answerIds: checked
													? [...answerIds, option.id]
													: answerIds.filter(id => id !== option.id)
											}
										})
									}}
								/>
								<span className='font-normal'>{option.value}</span>
							</Label>
						))}
					</div>
				)}

				{quiz.currentQuestion.type === 'single_correct' && (
					<RadioGroup
						className='gap-4'
						value={answer?.type === 'single_correct' ? answer.answerId : ''}
						onValueChange={answerId => {
							setAnswer({
								type: 'single_correct',
								answerId: answerId as string
							})
						}}
					>
						{quiz.currentQuestion.options.map(option => (
							<Label
								key={option.id}
								htmlFor={option.id}
								className='flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-neutral-700/20 has-checked:border-primary has-checked:bg-primary/10 has-checked:ring-1 has-checked:ring-primary/50'
							>
								<RadioGroupItem
									id={option.id}
									value={option.id}
								/>
								<span className='font-normal'>{option.value}</span>
							</Label>
						))}
					</RadioGroup>
				)}

				{quiz.currentQuestion.type === 'text' && (
					<div className='grid gap-2'>
						<Label htmlFor={attemptId}>Your answer:</Label>
						<Textarea
							id={attemptId}
							rows={10}
							value={answer?.type === 'text' ? answer.answer : ''}
							onChange={e =>
								setAnswer({
									type: 'text',
									answer: e.target.value
								})
							}
						/>
						<p className='text-sm text-muted-foreground'>
							Shorter answers are more commonly accepted by our system.
						</p>
					</div>
				)}
			</section>

			{quiz.currentQuestion && (
				<div className='flex items-center justify-between gap-4 mt-4'>
					<Button
						type='button'
						variant='outline'
						size='lg'
						className={cn(
							'px-4',
							quiz.currentQuestion.position === 1 && 'invisible'
						)}
						onClick={() =>
							navigateToQuestion(quiz.currentQuestion.position - 1)
						}
					>
						<ArrowLeft />
						Previous
					</Button>

					<Button
						type='submit'
						size='lg'
						className='px-4'
					>
						Next
					</Button>
				</div>
			)}
		</form>
	)
}
