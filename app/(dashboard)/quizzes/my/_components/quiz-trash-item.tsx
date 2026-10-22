'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { TableCell, TableRow } from '@/components/ui/table'
import { Quiz } from '@/db/schema'
import { deleteQuiz, restoreQuiz } from '@/features/quizzes/actions'
import { timeFormatter } from '@/utils/format'
import { cn } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { RotateCcwIcon, Trash2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export type QuizTrashItemProps = {
	quiz: Pick<Quiz, 'id' | 'slug' | 'title' | 'deletedAt'>
}

export default function QuizTrashItem({ quiz }: QuizTrashItemProps) {
	const path = usePathname()
	const restoreMutation = useMutation({
		mutationKey: ['quiz:restore', quiz.id],
		mutationFn: () => restoreQuiz(quiz.id, { path, throwOnError: true }),
		onSuccess: () => toast.success('Quiz restored successfully')
	})
	const deleteMutation = useMutation({
		mutationKey: ['quiz:delete', quiz.id],
		mutationFn: () => deleteQuiz(quiz.id, { path, throwOnError: true }),
		onSuccess: () => toast.success('Quiz deleted successfully')
	})
	const mutationPending = restoreMutation.isPending || deleteMutation.isPending

	return (
		<TableRow className={cn(mutationPending && 'opacity-50')}>
			<TableCell className='font-medium'>{quiz.title}</TableCell>
			<TableCell>
				<time dateTime={quiz.deletedAt?.toISOString()}>
					{timeFormatter.format(quiz.deletedAt!)}
				</time>
			</TableCell>
			<TableCell className='flex items-center justify-end gap-2'>
				<Button
					variant='outline'
					size='sm'
					disabled={mutationPending}
					onClick={() => restoreMutation.mutate()}
				>
					{restoreMutation.isPending ? <Spinner /> : <RotateCcwIcon />}
				</Button>
				<Button
					variant='destructive'
					size='icon-sm'
					disabled={mutationPending}
					onClick={() => deleteMutation.mutate()}
				>
					{deleteMutation.isPending ? <Spinner /> : <Trash2Icon />}
				</Button>
			</TableCell>
		</TableRow>
	)
}
