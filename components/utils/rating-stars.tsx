import { StarIcon } from 'lucide-react'

export type RatingStarsProps = {
	rating: number
}

export default function RatingStars({ rating }: RatingStarsProps) {
	return [1, 2, 3, 4, 5].map(star => (
		<StarIcon
			key={star}
			className={`size-5 ${
				star <= Math.round(rating)
					? 'text-yellow-500 fill-yellow-500'
					: 'text-muted'
			}`}
		/>
	))
}
