'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Attempt } from '@/db/schema'
import { AttemptQuestionData, submitAnswer } from '@/features/quiz-game/actions'
import {
	AttemptQuestionPublic,
	AttemptQuestionSubmittedAnswer
} from '@/features/quiz-game/zod'
import { errorMessage } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type QuizPlayerProps = {
	attemptId: Attempt['id']
	initialQuestionResponse: AttemptQuestionData
}

export default function QuizPlayer({
	attemptId,
	initialQuestionResponse
}: QuizPlayerProps) {
	const [currentQuestion, setCurrentQuestion] = useState<AttemptQuestionPublic>(
		initialQuestionResponse.question!
	)
	const [currentQuestionId, setCurrentQuestionId] = useState(
		initialQuestionResponse.attemptQuestionId!
	)
	const [error, setError] = useState<string | null>(null)
	const [answer, setAnswer] = useState<AttemptQuestionSubmittedAnswer | null>(
		null
	)
	const router = useRouter()

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)

		if (!answer) return setError('Choose an answer to continue')

		const submitResponse = await submitAnswer(currentQuestionId, answer)

		if (!submitResponse.success) {
			setError(errorMessage(submitResponse.message))
			console.error('[QUESTION_SUBMIT_RESPONSE]:', submitResponse.message)
			return
		}

		if (!submitResponse.question) {
			return router.replace(`/quizzes/results/${attemptId}`)
		}

		setAnswer(null)
		setCurrentQuestion(submitResponse.question)
		setCurrentQuestionId(submitResponse.attemptQuestionId!)
	}

	return (
		<form
			className='max-w-4xl mx-auto'
			onSubmit={onSubmit}
		>
			<header className='mb-8 grid gap-2'>
				<h1 className='text-2xl text-pretty'>{currentQuestion.prompt}</h1>
				<p className='text-muted-foreground text-left text-md'>
					{currentQuestion.type === 'single_correct'
						? 'You can select only one option'
						: currentQuestion.type === 'multi_correct'
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
				{currentQuestion.type === 'multi_correct' && (
					<div className='grid gap-4'>
						{currentQuestion.options.map(option => (
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

				{currentQuestion.type === 'single_correct' && (
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
						{currentQuestion.options.map(option => (
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

				{currentQuestion.type === 'text' && (
					<div className='grid gap-2'>
						<Label htmlFor={attemptId}>Your answer:</Label>
						<Textarea
							id={attemptId}
							rows={4}
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

			<Button
				type='submit'
				size='lg'
				className='block mt-4 ml-auto px-4'
			>
				Next
			</Button>
		</form>
	)
}
