import ErrorMessage from '@/components/error-message'
import { User } from '@/db/schema'
import { getUserQuizzes } from '@/features/quizzes/actions'
import UserQuizList, {
	UserQuizListSkeleton
} from '@/features/quizzes/components/user-quiz-list'

export type UserDetailsPageQuizListProps = {
	userId: User['id']
	currentUserId: User['id']
}

export default async function UserDetailsPageQuizList({
	userId,
	currentUserId
}: UserDetailsPageQuizListProps) {
	const response = await getUserQuizzes(userId)

	if (!response.success)
		return (
			<ErrorMessage
				message={response.message ?? 'Failed to get user quizzes.'}
			/>
		)

	return (
		<section>
			<h2 className='mt-8 mb-4 text-2xl font-semibold'>User Quizzes</h2>
			<UserQuizList
				quizzes={response.quizzes}
				currentUserId={currentUserId}
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
