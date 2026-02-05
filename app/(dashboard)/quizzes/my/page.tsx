import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getUserQuizzes } from '@/features/quizzes/actions'
import UserQuizList from '@/features/quizzes/components/user-quiz-list'
import { getSession } from '@/lib/auth'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MyQuizzesPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const currentUser = session.user

	const response = await getUserQuizzes(currentUser.id)

	return (
		<div className='container mx-auto py-16 px-4 space-y-6'>
			<div className='flex items-start justify-between'>
				<header className='space-y-2'>
					<h1 className='text-4xl font-bold'>My Quizzes</h1>
					<p className='text-muted-foreground'>View quizzes you created</p>
				</header>

				<Button
					variant='outline'
					nativeButton={false}
					render={<Link href='/quizzes/trash' />}
				>
					<Trash2Icon />
					Trash
				</Button>
			</div>

			{response.success ? (
				<UserQuizList
					quizzes={response.quizzes}
					currentUserId={currentUser.id}
				/>
			) : (
				<ErrorMessage
					message={
						response.message ?? 'Something went wrong. Please try again later.'
					}
				/>
			)}
		</div>
	)
}
