import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { User } from '@/db/schema'
import { getUserQuizzes } from '@/features/quizzes/actions'
import UserQuizList from '@/features/quizzes/components/user-quiz-list'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'

export type RecentQuizzesProps = {
	userId: User['id']
}

export default async function RecentQuizzes({ userId }: RecentQuizzesProps) {
	const response = await getUserQuizzes(userId, { pageSize: 3 })

	if (!response.success)
		return (
			<ErrorMessage
				message={
					response.message ?? 'Something went wrong. Please try again later.'
				}
			/>
		)

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Recent Quizzes</h2>
				<Button
					variant='outline'
					render={
						<Link href='/my-quizzes'>
							View All
							<BarChart3 className='ml-2 h-4 w-4' />
						</Link>
					}
				/>
			</div>

			<UserQuizList quizzes={response.quizzes} />
		</div>
	)
}
