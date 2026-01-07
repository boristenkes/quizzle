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
import { QuizFormSchema } from '@/features/quizzes/zod'
import { SaveIcon } from 'lucide-react'
import { FormState } from 'react-hook-form'

export type QuizPreviewProps = {
	values: QuizFormSchema
	formState: FormState<QuizFormSchema>
}

export default function QuizPreview({ values, formState }: QuizPreviewProps) {
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
							{values.title || 'Untitled Quiz'}
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
							{values.timeLimitMinutes ? (
								`${values.timeLimitMinutes} minutes`
							) : (
								<em>No time limit</em>
							)}
						</p>
					</div>
				</div>

				<div className='space-y-2'>
					<Label className='text-sm font-medium'>Description</Label>
					<p className='text-base text-muted-foreground'>
						{values.description || 'No description provided'}
					</p>
				</div>

				<div className='grid grid-cols-3 gap-4 text-center'>
					<div className='p-4 bg-green-50 rounded-lg'>
						<p className='text-2xl font-bold text-green-600'>
							{values.questions.filter(q => q.difficulty === 'easy').length}
						</p>
						<p className='text-sm text-green-600'>Easy Questions</p>
					</div>
					<div className='p-4 bg-yellow-50 rounded-lg'>
						<p className='text-2xl font-bold text-yellow-600'>
							{values.questions.filter(q => q.difficulty === 'medium').length}
						</p>
						<p className='text-sm text-yellow-600'>Medium Questions</p>
					</div>
					<div className='p-4 bg-red-50 rounded-lg'>
						<p className='text-2xl font-bold text-red-600'>
							{values.questions.filter(q => q.difficulty === 'hard').length}
						</p>
						<p className='text-sm text-red-600'>Hard Questions</p>
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
						<SaveIcon className='h-4 w-4 mr-2' />
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
