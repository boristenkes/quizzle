'use client'

import ErrorMessage from '@/components/error-message'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Quiz } from '@/db/schema'
import { deleteQuiz } from '@/features/quizzes/actions'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type QuizDangerZoneProps = {
	quizId: Quiz['id']
}

export default function QuizDangerZone({ quizId }: QuizDangerZoneProps) {
	const router = useRouter()
	const mutation = useMutation({
		mutationKey: ['quiz:delete', quizId],
		mutationFn: () => deleteQuiz(quizId, { throwOnError: true }),
		onSuccess: () => {
			toast.success('Quiz deleted successfully')
			router.replace('/')
		}
	})

	return (
		<Card className='border-destructive/50'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-destructive'>
					<Trash2 className='h-5 w-5' />
					Danger Zone
				</CardTitle>
				<CardDescription>Irreversible actions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5'>
					<div>
						<p className='font-medium'>Delete Quiz</p>
						<p className='text-sm text-muted-foreground'>
							Permanently delete your account and all data
						</p>
					</div>

					<AlertDialog>
						<AlertDialogTrigger
							render={<Button variant='destructive'>Delete Quiz</Button>}
						/>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									You are about to permamently delete this quiz and all data
									related to it. This cannot be undone. Proceed with caution.
								</AlertDialogDescription>

								{mutation.isError && (
									<ErrorMessage message={mutation.error.message} />
								)}

								<AlertDialogFooter className='ml-auto'>
									<AlertDialogCancel
										render={<Button variant='secondary'>Cancel</Button>}
									/>
									<Button
										variant='destructive'
										disabled={mutation.isPending}
										onClick={() => mutation.mutate()}
									>
										{mutation.isPending ? 'Deleting' : 'Delete'}
										{mutation.isPending && <Spinner />}
									</Button>
								</AlertDialogFooter>
							</AlertDialogHeader>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardContent>
		</Card>
	)
}
