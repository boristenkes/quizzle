'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useCategories } from '@/context/categories'
import TimeLimit from '@/features/quizzes/components/time-limit'
import { QuizFormSchema } from '@/features/quizzes/zod'
import { SaveIcon } from 'lucide-react'
import { FormState } from 'react-hook-form'

export type QuizPreviewProps = {
	values: QuizFormSchema
	formState: FormState<QuizFormSchema>
}

export default function QuizPreview({ values, formState }: QuizPreviewProps) {
	const categories = useCategories()
	const chosenCategory = categories?.find(
		category => category.id === values.categoryId
	)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quiz Review</CardTitle>
				<CardDescription>Review your quiz before publishing</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Title</Label>
						<p className='text-base text-muted-foreground'>
							{values.title || <em>Untitled Quiz</em>}
						</p>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Questions</Label>
						<p className='text-base text-muted-foreground'>
							{values.questions.length}
						</p>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Time Limit</Label>
						<p className='text-base text-muted-foreground'>
							<TimeLimit limit={(values.timeLimitMinutes ?? 0) * 60} />
						</p>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Difficulty</Label>
						<p className='text-base text-muted-foreground capitalize'>
							{values.difficulty}
						</p>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Category</Label>
						<p className='text-base text-muted-foreground capitalize'>
							{chosenCategory?.name ?? <em>No category provided</em>}
						</p>
					</div>
				</div>

				<div className='space-y-2'>
					<Label className='text-sm font-medium'>Description</Label>
					<p className='text-base text-muted-foreground'>
						{values.description || <em>No description provided</em>}
					</p>
				</div>

				<div className='grid grid-cols-3 gap-4 text-center'>
					<div className='p-4 bg-green-50 text-green-600 rounded-lg dark:bg-green-600/40 dark:text-green-200'>
						<p className='text-2xl font-bold'>
							{values.questions.count(q => q.difficulty === 'easy')}
						</p>
						<p className='text-sm'>Easy Questions</p>
					</div>
					<div className='p-4 bg-yellow-50 text-yellow-600 rounded-lg dark:bg-yellow-600/50 dark:text-yellow-200'>
						<p className='text-2xl font-bold '>
							{values.questions.count(q => q.difficulty === 'medium')}
						</p>
						<p className='text-sm'>Medium Questions</p>
					</div>
					<div className='p-4 bg-red-50 text-red-600 rounded-lg  dark:bg-red-500/40 dark:text-red-200'>
						<p className='text-2xl font-bold'>
							{values.questions.count(q => q.difficulty === 'hard')}
						</p>
						<p className='text-sm'>Hard Questions</p>
					</div>
				</div>

				{formState.errors.root && (
					<ErrorMessage message={formState.errors.root.message!} />
				)}

				<div className='flex gap-4'>
					<Button
						variant='outline'
						className='flex-1'
						type='button'
						disabled={formState.isSubmitting}
					>
						<SaveIcon className='size-4 mr-2' />
						Save Draft
					</Button>
					<Button
						className='flex-1'
						type='submit'
						form='new-quiz-form'
						disabled={formState.isSubmitting}
					>
						{!formState.isSubmitting && <SaveIcon className='size-4 mr-2' />}

						{formState.isSubmitting ? 'Publishing' : 'Publish Quiz'}

						{formState.isSubmitting && <Spinner className='size-4 ml-2' />}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
