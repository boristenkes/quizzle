import { getSession } from '@/lib/auth'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { QuizFormProvider } from './_context/quiz-form'
import NewQuizForm from './form'

export const metadata: Metadata = {
	title: 'Create New Quiz'
}

export default async function NewQuizPage() {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	return (
		<main className='px-4 py-16 space-y-8'>
			<header className='container mx-auto max-w-4xl space-y-2'>
				<h1 className='text-3xl font-bold flex items-center gap-2'>
					<PlusIcon className='h-8 w-8 text-primary' />
					Create New Quiz
				</h1>
				<p className='text-muted-foreground'>
					Build engaging quizzes with AI assistance
				</p>
			</header>

			<div className='container mx-auto max-w-4xl space-y-6'>
				<QuizFormProvider>
					<NewQuizForm />
				</QuizFormProvider>
			</div>
		</main>
	)
}
