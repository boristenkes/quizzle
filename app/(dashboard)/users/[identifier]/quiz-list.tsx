import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { User } from '@/db/schema'
import { getUserQuizzes } from '@/features/quizzes/actions'
import UserQuizList, {
	UserQuizListSkeleton
} from '@/features/quizzes/components/user-quiz-list'
import { errorMessage } from '@/utils/helpers'
import { BarChart3Icon } from 'lucide-react'
import Link from 'next/link'

export type UserDetailsPageQuizListProps = {
	userId: User['id']
	sessionUserId: User['id']
}

export default async function UserDetailsPageQuizList({
	userId,
	sessionUserId
}: UserDetailsPageQuizListProps) {
	const response = await getUserQuizzes(userId)

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	return (
		<section>
			<div className='mt-8 mb-4 flex items-center justify-between'>
				<h2 className='text-2xl font-semibold'>User Quizzes</h2>
				<Button
					variant='outline'
					nativeButton={false}
					render={
						<Link href='/quizzes/my'>
							View All
							<BarChart3Icon className='ml-2 h-4 w-4' />
						</Link>
					}
				/>
			</div>

			<UserQuizList
				quizzes={response.quizzes}
				sessionUserId={sessionUserId}
			/>
		</section>
	)
}

export function UserDetailsPageQuizListSkeleton() {
	return (
		<section>
			<h2 className='mt-8 mb-4 text-2xl font-semibold'>User Quizzes</h2>
			<UserQuizListSkeleton itemCount={3} />
		</section>
	)
}
