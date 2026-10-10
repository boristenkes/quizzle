import ErrorMessage from '@/components/error-message'
import { createQuizSession } from '@/features/quiz-game/actions'
import { getSession } from '@/lib/auth'
import { errorMessage } from '@/utils/helpers'
import { redirect } from 'next/navigation'

export type PlayQuizPageProps = {
	params: Promise<{ slug: string; id: string }>
}

export default async function PlayQuizPage({ params }: PlayQuizPageProps) {
	const { slug, id } = await params

	const session = await getSession()

	if (!session) redirect('/sign-in')

	const quizSessionResponse = await createQuizSession(id)

	if (!quizSessionResponse.success) {
		return (
			<div className='p-4'>
				<ErrorMessage message={errorMessage(quizSessionResponse.message)} />
			</div>
		)
	}

	return <main className='p-16'>{quizSessionResponse.attemptId}</main>
}
