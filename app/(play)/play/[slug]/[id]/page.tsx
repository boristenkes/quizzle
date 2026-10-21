import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { QuizProvider } from '@/context/quiz'
import {
	createQuizSession,
	getInitialQuestion
} from '@/features/quiz-game/actions'
import { getSession } from '@/lib/auth'
import { errorMessage } from '@/utils/helpers'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import QuizPlayer from './_components/quiz-player'
import QuizProgress from './_components/quiz-progress'
import QuizTimer from './_components/quiz-timer'

export type PlayQuizPageProps = {
	params: Promise<{ slug: string; id: string }>
}

export default async function PlayQuizPage({ params }: PlayQuizPageProps) {
	const { slug, id } = await params

	const session = await getSession()

	if (!session) redirect(`/sign-in?callbackUrl=/play/${slug}/${id}`)

	const quizSessionResponse = await createQuizSession(id)

	if (!quizSessionResponse.success) {
		return (
			<div className='p-4'>
				<ErrorMessage message={errorMessage(quizSessionResponse.message)} />
			</div>
		)
	}

	const initialQuestionResponse = await getInitialQuestion(
		quizSessionResponse.attemptId
	)

	if (!initialQuestionResponse.success) {
		return (
			<div className='p-4'>
				<ErrorMessage message={errorMessage(initialQuestionResponse.message)} />
			</div>
		)
	}

	// No initial question => Quiz completed => Redirect to results page
	if (!initialQuestionResponse.question)
		redirect(`/quizzes/results/${quizSessionResponse.attemptId}`)

	return (
		<main className='p-16 max-lg: px-8'>
			<QuizProvider
				attemptId={quizSessionResponse.attemptId}
				initialQuestion={initialQuestionResponse.question}
			>
				<div className='flex items-start justify-between gap-4 max-w-4xl mx-auto'>
					<Button
						variant='ghost'
						className='shrink-0'
					>
						<ArrowLeft /> Exit Quiz
					</Button>

					<QuizProgress
						attemptId={quizSessionResponse.attemptId}
						className='flex-1 min-w-0 hidden md:block'
						skeletonClassName='hidden md:block'
					/>

					<QuizTimer attemptId={quizSessionResponse.attemptId} />
				</div>

				<QuizProgress
					attemptId={quizSessionResponse.attemptId}
					className='min-w-0 my-4 md:hidden'
					skeletonClassName='md:hidden'
				/>

				<QuizPlayer attemptId={quizSessionResponse.attemptId} />
			</QuizProvider>
		</main>
	)
}
