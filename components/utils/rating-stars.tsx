import { cn } from '@/utils/helpers'
import { StarIcon } from 'lucide-react'

export type RatingStarsProps = React.ComponentProps<typeof StarIcon> & {
	rating: number
}

export default function RatingStars({
	rating,
	className,
	...props
}: RatingStarsProps) {
	return [1, 2, 3, 4, 5].map(star => (
		<StarIcon
			key={star}
			className={cn(
				'size-5',
				star <= Math.round(rating)
					? 'text-yellow-500 fill-yellow-500'
					: 'text-muted',
				className
			)}
			{...props}
		/>
	))
}
