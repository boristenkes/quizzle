'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Quiz } from '@/db/schema'
import { cn } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { BookmarkIcon } from 'lucide-react'
import { useState } from 'react'
import { toggleQuizBookmark } from '../actions'

export type BookmarkButtonProps = ButtonProps & {
	quizId: Quiz['id']
	initialIsBookmarked: boolean
}

export default function BookmarkButton({
	quizId,
	initialIsBookmarked,
	onClick,
	...props
}: BookmarkButtonProps) {
	const mutation = useMutation({
		mutationKey: ['quiz:bookmark', quizId],
		mutationFn: () => toggleQuizBookmark(quizId),
		onMutate: () => {
			setIsBookmarked(prev => !prev) // optimistic update
		},
		onSuccess: data => {
			const response = data as { success: true; isBookmarked: boolean }

			setIsBookmarked(response.isBookmarked)
		},
		onError: () => {
			setIsBookmarked(current => !current) // rollback
		}
	})
	const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)

	return (
		<Button
			variant='outline'
			onClick={e => {
				mutation.mutate()
				onClick?.(e)
			}}
			{...props}
		>
			<BookmarkIcon
				className={cn(
					'mr-2 size-4',
					isBookmarked && 'fill-indigo-500 text-indigo-500'
				)}
			/>
			{isBookmarked ? 'Saved' : 'Save'}
		</Button>
	)
}
