import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewQuizPage() {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	return <main className='container mx-auto px-1 py-6'>NewQuizPage</main>
}
