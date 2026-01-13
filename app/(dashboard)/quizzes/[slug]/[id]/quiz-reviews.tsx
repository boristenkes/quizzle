'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareIcon, StarIcon } from 'lucide-react'

export type QuizReviewsProps = {
	totalReviews: number
}

export default function QuizReviews({ totalReviews }: QuizReviewsProps) {
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
				<ReviewForm />

				{/* Review List */}
				<ReviewList />
			</CardContent>
		</Card>
	)
}

function ReviewForm() {
	return (
		<div className='space-y-4 pb-6 border-b'>
			<Textarea
				placeholder='Share your experience with this quiz...'
				rows={3}
			/>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-1'>
					<span className='text-sm text-muted-foreground mr-2'>
						Your rating:
					</span>
					{[1, 2, 3, 4, 5].map(star => (
						<StarIcon
							key={star}
							className='h-5 w-5 text-muted hover:text-yellow-500 cursor-pointer transition-colors'
						/>
					))}
				</div>
				<Button>Submit Review</Button>
			</div>
		</div>
	)
}

function ReviewList() {
	const reviews = []

	if (!reviews.length) return <></>

	// return (
	// 	<div className='space-y-6'>
	// 		{reviews.map(review => (
	// 			<div
	// 				key={review.id}
	// 				className='space-y-3'
	// 			>
	// 				<div className='flex items-start justify-between'>
	// 					<div className='flex items-center gap-3'>
	// 						<Avatar className='h-10 w-10'>
	// 							<AvatarImage src={review.user.avatar} />
	// 							<AvatarFallback />
	// 						</Avatar>
	// 						<div>
	// 							<p className='font-medium'>{review.user.name}</p>
	// 							<div className='flex items-center gap-2'>
	// 								<div className='flex'>
	// 									{[1, 2, 3, 4, 5].map(star => (
	// 										<StarIcon
	// 											key={star}
	// 											className={`h-3 w-3 ${
	// 												star <= review.rating
	// 													? 'text-yellow-500 fill-yellow-500'
	// 													: 'text-muted'
	// 											}`}
	// 										/>
	// 									))}
	// 								</div>
	// 								<span className='text-xs text-muted-foreground'>
	// 									{review.date}
	// 								</span>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<Button
	// 						variant='ghost'
	// 						size='sm'
	// 						className='text-muted-foreground'
	// 					>
	// 						<ThumbsUpIcon className='h-4 w-4 mr-1' />
	// 						{review.likes}
	// 					</Button>
	// 				</div>
	// 				<p className='text-muted-foreground pl-13'>{review.comment}</p>
	// 			</div>
	// 		))}
	// 	</div>
	// )
}
