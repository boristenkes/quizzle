'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Quiz } from '@/db/schema'
import { useMutation } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import { toast } from 'sonner'
import { softDeleteQuiz } from '../actions'

export type MoveToTrashButtonProps = ButtonProps & {
	quizId: Quiz['id']
}

export default function MoveToTrashButton({
	quizId,
	onClick,
	...props
}: MoveToTrashButtonProps) {
	const router = useRouter()
	const mutation = useMutation({
		mutationKey: ['quiz:trash', quizId],
		mutationFn: () => softDeleteQuiz(quizId, { throwOnError: true }),
		onSuccess: () => {
			toast.success('Moved to trash successfully')
			router.replace('/')
		}
	})

	return (
		<Button
			variant='destructive'
			onClick={e => {
				mutation.mutate()
				onClick?.(e)
			}}
			disabled={mutation.isPending}
			{...props}
		>
			{mutation.isPending ? 'Moving' : 'Move to Trash'}
			{mutation.isPending ? (
				<Spinner className='size-4' />
			) : (
				<Trash2Icon className='size-4' />
			)}
		</Button>
	)
}
