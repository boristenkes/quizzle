import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import { getUserQuizzes } from '@/features/quizzes/actions'
import QuizList from '@/features/quizzes/components/quiz-list'
import { getSession } from '@/lib/auth'
import { errorMessage } from '@/utils/helpers'
import { BookmarkIcon, FolderOpenIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MyQuizzesPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const sessionUser = session.user

	const response = await getUserQuizzes(sessionUser.id)

	return (
		<div className='container mx-auto py-16 px-4 space-y-6'>
			<div className='flex items-start justify-between'>
				<header>
					<h1 className='text-4xl font-bold'>My Quizzes</h1>
				</header>

				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						nativeButton={false}
						render={<Link href='/quizzes/saved' />}
					>
						<BookmarkIcon />
						Saved
					</Button>
					<Button
						variant='outline'
						nativeButton={false}
						render={<Link href='/quizzes/trash' />}
					>
						<Trash2Icon />
						Trash
					</Button>
				</div>
			</div>

			{response.success ? (
				response.quizzes.length > 0 ? (
					<QuizList quizzes={response.quizzes} />
				) : (
					<MyQuizzesEmpty />
				)
			) : (
				<ErrorMessage message={errorMessage(response.message)} />
			)}
		</div>
	)
}

export function MyQuizzesEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription className='text-balance'>
					This is where you will find quizzes you created.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
