import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AttemptQuestion } from '@/db/schema'
import { getQuizResults } from '@/features/quiz-game/actions'
import { formatElapsedTime } from '@/utils/format'
import { cn, errorMessage } from '@/utils/helpers'
import {
	ArrowLeftIcon,
	CheckCircle2Icon,
	CheckIcon,
	ClockIcon,
	RotateCcwIcon,
	TargetIcon,
	TrophyIcon,
	XCircleIcon,
	XIcon
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import z from 'zod'

export type QuizResultsPageProps = {
	params: Promise<{ attemptId: string }>
}

export const getScoreColor = (score: number) => {
	if (score >= 80) return 'text-green-600'
	if (score >= 40) return 'text-yellow-600'
	return 'text-red-600'
}

export const getScoreLabel = (score: number) => {
	if (score >= 90) return 'Excellent!'
	if (score >= 70) return 'Great job!'
	if (score >= 50) return 'Good work!'
	if (score >= 40) return 'Not bad!'
	return 'Keep practicing!'
}

export default async function QuizResultsPage({
	params
}: QuizResultsPageProps) {
	const { attemptId } = await params

	const parseResult = z.ulid().safeParse(attemptId)

	if (!parseResult.success) return notFound()

	const response = await getQuizResults(parseResult.data)

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	const { results } = response

	const correctCount = results.questions.reduce((prev, curr) => {
		return prev + (curr.isCorrect ? 1 : 0)
	}, 0)
	const correctPercentage =
		(correctCount / results.quizData.questionCount) * 100

	return (
		<main className='p-8 space-y-8'>
			{/* Score Summary */}
			<Card className='shadow-elevated'>
				<CardContent className='p-8 text-center space-y-6'>
					<TrophyIcon className='h-16 w-16 mx-auto text-yellow-500' />
					<div>
						<h1 className='text-4xl md:text-5xl font-bold mb-2'>
							<span className={getScoreColor(results.score)}>
								{correctPercentage.toFixed(2)}%
							</span>
						</h1>
						<p className='text-xl text-muted-foreground'>
							{getScoreLabel(correctPercentage)}
						</p>
					</div>

					<div className='flex justify-center gap-8 text-sm'>
						<div className='flex items-center gap-2'>
							<TargetIcon className='h-4 w-4 text-muted-foreground' />
							<span>
								{correctCount} / {results.questions.length} correct
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<ClockIcon className='h-4 w-4 text-muted-foreground' />
							<span>
								{formatElapsedTime(results.startedAt, results.submittedAt!)}
							</span>
						</div>
					</div>

					<Progress
						value={correctPercentage}
						className='h-3 max-w-md mx-auto'
					/>

					<div className='flex justify-center gap-3 pt-2'>
						<Button
							variant='outline'
							nativeButton={false}
							render={
								<Link
									href={`/quizzes/${results.quizData.slug}/${results.quizId}`}
								>
									<ArrowLeftIcon className='mr-2 h-4 w-4' />
									Back to Quiz
								</Link>
							}
						/>
						<Button
							nativeButton={false}
							render={
								<Link href={`/play/${results.quizData.slug}/${results.quizId}`}>
									<RotateCcwIcon className='mr-2 h-4 w-4' />
									Retry Quiz
								</Link>
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Question Review */}
			<Card>
				<CardHeader>
					<CardTitle>Question Review</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					{results.questions.map((q, i) => {
						const wasSkipped = q.submittedAnswer === null

						return (
							<div
								key={q.id}
								className={cn(
									'p-5 rounded-lg border space-y-3',
									q.isCorrect
										? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20'
										: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
								)}
							>
								<div className='flex items-start gap-3'>
									{q.isCorrect ? (
										<CheckCircle2Icon className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-600 mt-0.5 shrink-0' />
									)}
									<div className='space-y-2 flex-1'>
										<p className='font-medium'>
											Q{i + 1}: {q.questionPublic.prompt}
										</p>
										<div className='space-y-4 text-sm'>
											{q.submittedAnswer?.type === 'text' ? (
												<>
													<p className='flex items-start gap-2'>
														<strong>Your answer:</strong>

														<span className='font-medium'>
															{q.submittedAnswer ? (
																<q>{q.submittedAnswer.answer}</q>
															) : (
																<span className='italic text-muted-foreground'>
																	Not answered
																</span>
															)}
														</span>
													</p>

													<div className='flex items-start gap-2'>
														<strong>Acceptable answers:</strong>

														<ul className='flex items-center gap-2 flex-wrap'>
															{q.questionPrivate.type === 'text' &&
																q.questionPrivate.acceptableAnswers.map(
																	answer => (
																		<li key={answer}>
																			<Badge variant='outline'>
																				<q className='text-green-600 font-medium'>
																					{answer}
																				</q>
																			</Badge>
																		</li>
																	)
																)}
														</ul>
													</div>
												</>
											) : (
												q.questionPrivate.type !== 'text' && (
													<QuestionOptions
														questionPrivate={q.questionPrivate}
														submittedAnswer={q.submittedAnswer}
													/>
												)
											)}
										</div>

										<div className='mt-4'>
											<p>
												<strong>Explanation:</strong>
											</p>
											<p
												className='text-sm text-muted-foreground mt-2 rich-text'
												dangerouslySetInnerHTML={{
													__html: q.questionPrivate.explanationHTML
												}}
											/>
										</div>
									</div>
									<Badge
										variant='outline'
										className={cn(
											'shrink-0',
											q.isCorrect
												? 'border-green-300 text-green-700'
												: 'border-red-300 text-red-700'
										)}
									>
										{wasSkipped
											? 'Skipped'
											: q.isCorrect
												? 'Correct'
												: wasSkipped
													? 'Skipped'
													: 'Wrong'}
									</Badge>
								</div>
							</div>
						)
					})}
				</CardContent>
			</Card>
		</main>
	)
}

function QuestionOptions({
	questionPrivate,
	submittedAnswer
}: Pick<AttemptQuestion, 'questionPrivate' | 'submittedAnswer'>) {
	if (!questionPrivate || questionPrivate.type === 'text') {
		return null
	}

	const selectedIds =
		submittedAnswer?.type === 'single_correct'
			? [submittedAnswer.answerId]
			: submittedAnswer?.type === 'multi_correct'
				? submittedAnswer.answerIds
				: []

	return (
		<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 my-6'>
			{questionPrivate.options.map(option => {
				const isSelected = selectedIds.includes(option.id)
				const isCorrect = option.isCorrect
				const isWrongSelection = isSelected && !isCorrect

				return (
					<div
						key={option.id}
						className={cn('flex items-center gap-3 rounded-lg border p-4', {
							// Correct option, whether selected or not
							'border-green-500 bg-green-500/10': isCorrect,

							// User selected an incorrect option
							'border-red-500 bg-red-500/10': isWrongSelection,

							// Neither selected nor correct
							'border-border': !isSelected && !isCorrect
						})}
					>
						<span
							className={cn(
								'flex size-6 shrink-0 items-center justify-center rounded-full border',
								{
									'border-green-600 bg-green-600 text-white': isCorrect,
									'border-red-600 bg-red-600 text-white': isWrongSelection,
									'border-muted-foreground/40': !isSelected && !isCorrect
								}
							)}
						>
							{isCorrect ? (
								<CheckIcon className='size-4' />
							) : isWrongSelection ? (
								<XIcon className='size-4' />
							) : null}
						</span>

						<span className='flex-1'>{option.value}</span>

						{isSelected && (
							<span className='text-xs font-medium text-muted-foreground'>
								Your answer
							</span>
						)}
					</div>
				)
			})}
		</div>
	)
}
