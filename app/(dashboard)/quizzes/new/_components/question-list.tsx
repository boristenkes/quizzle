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
import { QuizFormSchema } from '@/features/quizzes/zod'
import { questionTypeLabel } from '@/lib/constants'
import { getDifficultyColor } from '@/utils/format'
import { cn } from '@/utils/helpers'
import { CheckIcon, GripVerticalIcon, Trash2Icon } from 'lucide-react'
import { UseFieldArrayReturn } from 'react-hook-form'

export default function QuestionList({
	questionsFieldArray
}: {
	questionsFieldArray: UseFieldArrayReturn<QuizFormSchema, 'questions'>
}) {
	if (questionsFieldArray.fields.length === 0) return null

	return (
		<Card id='new-quiz-form:question-list'>
			<CardHeader>
				<CardTitle>Questions ({questionsFieldArray.fields.length})</CardTitle>
				<CardDescription>Drag to reorder questions</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{questionsFieldArray.fields.map((question, index) => (
					<div
						key={question.id}
						className='flex items-start gap-4 p-4 border rounded-lg'
					>
						<GripVerticalIcon className='h-5 w-5 text-muted-foreground mt-1' />
						<div className='flex-1 space-y-2'>
							<div className='flex items-start justify-between'>
								<div className='flex-1 flex items-start gap-2 flex-wrap'>
									<h4 className='font-medium'>
										Q{index + 1}: {question.prompt}
									</h4>
									<div className='flex items-center gap-2'>
										<Badge variant='outline'>
											<strong>type:</strong> {questionTypeLabel[question.type]}
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
							{(question.type === 'multi_correct' ||
								question.type === 'single_correct') && (
								<div className='grid grid-cols-2 gap-2 text-sm'>
									{question.options.map((option, optIdx) => (
										<div
											key={option.text + optIdx}
											className={`p-2 rounded border ${
												option.isCorrect
													? 'bg-green-50 border-green-200 text-green-800'
													: 'bg-gray-50 border-gray-200'
											}`}
										>
											{String.fromCharCode(65 + optIdx)}: {option.text}
										</div>
									))}
								</div>
							)}

							{question.type === 'text' && (
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
							)}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
