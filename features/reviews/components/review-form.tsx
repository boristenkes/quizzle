'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Quiz } from '@/db/schema'
import { RatingInput } from '@/features/reviews/components/rating-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createReview } from '../actions'
import { NewReviewSchema, newReviewSchema } from '../zod'

export type QuizReviewsFormProps = {
	quizId: Quiz['id']
}

export default function QuizReviewForm({ quizId }: QuizReviewsFormProps) {
	const form = useForm<NewReviewSchema>({
		defaultValues: { comment: '', rating: 0 },
		resolver: zodResolver(newReviewSchema) as any
	})
	const { isSubmitting, errors } = form.formState
	const path = usePathname()

	const onSubmit = async (data: NewReviewSchema) => {
		const response = await createReview(data, quizId, { path })

		if (!response.success) {
			return form.setError('root', {
				message:
					response.message ?? 'Something went wrong. Please try again later'
			})
		}

		toast.success('Review created successfully')
		form.reset()
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='space-y-4 pb-6 border-b'
		>
			<FieldSet>
				{errors.root && <ErrorMessage message={errors.root.message!} />}

				<FieldGroup>
					<Controller
						name='comment'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Comment</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder='Good variety of questions. Some were quite challenging but fair. Would recommend for intermediate learners.'
									className='min-h-20'
									disabled={isSubmitting}
								/>
								<FieldDescription>
									Share your experience with this quiz.
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
			</FieldSet>

			<div className='flex justify-between items-center'>
				<Controller
					name='rating'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<div className='flex items-center gap-2'>
								<FieldLabel htmlFor={field.name}>Rating: </FieldLabel>
								<RatingInput
									{...field}
									readOnly={isSubmitting}
									aria-invalid={fieldState.invalid}
									id={field.name}
									size='sm'
									className='gap-0.5'
								/>
							</div>{' '}
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button
					type='submit'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Submitting' : 'Submit Review'}
					{isSubmitting && <Spinner />}
				</Button>
			</div>
		</form>
	)
}
