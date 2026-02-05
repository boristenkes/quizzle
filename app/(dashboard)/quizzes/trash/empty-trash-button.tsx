'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { pruneDeletedQuizzes } from '@/features/quizzes/actions'
import { useMutation } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export type EmptyTrashButtonProps = ButtonProps

export default function EmptyTrashButton({
	onClick,
	disabled,
	...props
}: EmptyTrashButtonProps) {
	const path = usePathname()
	const mutation = useMutation({
		mutationKey: ['quiz:prune'],
		mutationFn: () => pruneDeletedQuizzes({ path, throwOnError: true })
	})

	return (
		<Button
			variant='destructive'
			size='lg'
			disabled={mutation.isPending || disabled}
			onClick={e => {
				onClick?.(e)
				mutation.mutate()
			}}
			{...props}
		>
			{mutation.isPending ? <Spinner /> : <Trash2Icon />}
			{mutation.isPending ? 'Emptying' : 'Empty Trash'}
		</Button>
	)
}
