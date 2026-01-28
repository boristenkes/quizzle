'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { questionTypeLabel } from '@/lib/constants'
import { getDifficultyColor } from '@/utils/format'
import { cn } from '@/utils/helpers'
import { CheckIcon, GripVerticalIcon, Trash2Icon } from 'lucide-react'
import { useQuizForm } from '../_context/quiz-form'

export default function QuestionList() {
	const { questionsFieldArray, isGenerating, controller } = useQuizForm()

	return (
		<Card
			id='new-quiz-form:question-list'
			className='relative'
		>
			<CardHeader>
				<CardTitle>Questions ({questionsFieldArray.fields.length})</CardTitle>
				<CardDescription>Drag to reorder questions</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{questionsFieldArray.fields.length === 0 && (
					<p className='text-center py-16'>Your questions will appear here</p>
				)}

				{isGenerating && (
					<div className='absolute inset-0 bg-neutral-900/90 z-20 flex items-center py-24 flex-col gap-2'>
						<h2 className='text-2xl font-semibold'>Working on it!</h2>
						<p className='flex items-center gap-4'>
							Your questions are being generated
						</p>
						<Spinner className='size-8 my-2' />
						<Button
							variant='secondary'
							onClick={() => controller.abort()}
						>
							Cancel
						</Button>
					</div>
				)}

				{questionsFieldArray.fields.map((question, index) => (
					<div
						key={question.id}
						className='p-4 border rounded-lg'
					>
						<div className='flex items-start gap-4 '>
							<GripVerticalIcon className='h-5 w-5 text-muted-foreground mt-1' />
							<div className='flex-1 space-y-2'>
								<div className='flex items-start justify-between'>
									<div className='flex-1 flex items-start gap-2 flex-wrap'>
										<h4 className='font-medium'>
											Q{index + 1}: {question.prompt}
										</h4>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>
												<strong>type:</strong>{' '}
												{questionTypeLabel[question.type]}
											</Badge>
											<Badge
												className={cn(
													getDifficultyColor(question.difficulty),
													'capitalize font-semibold'
												)}
												variant='outline'
											>
												{question.difficulty}
											</Badge>
										</div>
									</div>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => questionsFieldArray.remove(index)}
										className='text-destructive hover:text-destructive'
									>
										<Trash2Icon className='h-4 w-4' />
									</Button>
								</div>
								{question.type === 'text' ? (
									<div className='flex flex-wrap gap-2'>
										{question.acceptableAnswers.map((answer, optIdx) => (
											<Badge
												key={answer + optIdx}
												variant='outline'
												className='rounde-sm'
											>
												{answer} <CheckIcon />
											</Badge>
										))}
									</div>
								) : (
									<div className='grid grid-cols-2 gap-2 text-sm'>
										{question.options.map((option, optIdx) => (
											<div
												key={option.value + optIdx}
												className={`p-2 rounded border ${
													option.isCorrect
														? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-800/80 dark:text-neutral-50'
														: 'bg-gray-50 border-gray-200 dark:bg-gray-900/80 dark:border-gray-700'
												}`}
											>
												{String.fromCharCode(65 + optIdx)}: {option.value}
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<details className='mt-4'>
							<summary className='mb-2'>Explanation</summary>
							<div
								dangerouslySetInnerHTML={{
									__html: question.explanationHTML
								}}
							/>
						</details>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
