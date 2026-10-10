import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import { User } from '@/db/schema'
import { getUserQuizzes } from '@/features/quizzes/actions'
import UserQuizList from '@/features/quizzes/components/user-quiz-list'
import { errorMessage } from '@/utils/helpers'
import { BarChart3, FolderOpenIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'

export type RecentQuizzesProps = {
	userId: User['id']
	currentUserId: User['id']
}

export default async function RecentQuizzes({
	userId,
	currentUserId
}: RecentQuizzesProps) {
	const response = await getUserQuizzes(userId, { pageSize: 3 })

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Recent Quizzes</h2>
				<Button
					variant='outline'
					nativeButton={false}
					render={
						<Link href='/quizzes/my'>
							View All
							<BarChart3 className='ml-2 h-4 w-4' />
						</Link>
					}
				/>
			</div>

			{response.quizzes.length > 0 ? (
				<UserQuizList
					quizzes={response.quizzes}
					currentUserId={currentUserId}
				/>
			) : (
				<RecentQuizzesEmpty />
			)}
		</div>
	)
}

function RecentQuizzesEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription>
					You haven&apos;t published any quizzes recently
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					nativeButton={false}
					render={
						<Link href='/quizzes/new'>
							Create New Quiz <PlusIcon />
						</Link>
					}
				/>
			</EmptyContent>
		</Empty>
	)
}
