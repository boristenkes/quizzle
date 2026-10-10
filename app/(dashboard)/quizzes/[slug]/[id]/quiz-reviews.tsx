import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import RatingStars from '@/components/utils/rating-stars'
import { Quiz } from '@/db/schema'
import { getQuizReviews } from '@/features/reviews/actions'
import QuizReviewForm from '@/features/reviews/components/review-form'
import { dateFormatter } from '@/utils/format'
import { errorMessage } from '@/utils/helpers'
import { MessageSquareIcon, ThumbsUpIcon } from 'lucide-react'

export type QuizReviewsProps = {
	quizId: Quiz['id']
	totalReviews: number
}

export default function QuizReviews({
	quizId,
	totalReviews
}: QuizReviewsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<MessageSquareIcon className='h-5 w-5 text-primary' />
					Reviews & Comments
				</CardTitle>
				<CardDescription>
					{totalReviews} reviews from quiz takers
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6'>
				{/* Add Review */}
				<QuizReviewForm quizId={quizId} />

				{/* Review List */}
				<ReviewList quizId={quizId} />
			</CardContent>
		</Card>
	)
}

async function ReviewList({ quizId }: { quizId: Quiz['id'] }) {
	const response = await getQuizReviews(quizId)

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	if (response.reviews.length === 0)
		return <p className='text-center py-16'>No reviews</p>

	return (
		<div className='space-y-6'>
			{response.reviews.map(review => (
				<div
					key={review.id}
					className='space-y-3'
				>
					<div className='flex items-start justify-between'>
						<div className='flex items-center gap-3'>
							<Avatar className='size-10'>
								<AvatarImage
									src={review.user.image!}
									alt={review.user.name}
								/>
								<AvatarFallback />
							</Avatar>
							<div>
								<div className='flex items-center gap-2'>
									<p className='font-medium'>{review.user.name}</p>
									<div className='flex'>
										<RatingStars
											rating={review.rating}
											className='size-4'
										/>
									</div>
								</div>
								<span className='text-xs text-muted-foreground'>
									{dateFormatter.format(review.createdAt)}
								</span>
							</div>
						</div>
						<Button
							variant='ghost'
							size='sm'
							className='text-muted-foreground'
						>
							<ThumbsUpIcon className='size-4 mr-1' />0
						</Button>
					</div>
					<p className='text-muted-foreground pl-13'>{review.comment}</p>
				</div>
			))}
		</div>
	)
}
