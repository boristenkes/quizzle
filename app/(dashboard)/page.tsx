import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import heroImage from '@/public/assets/hero-quiz.jpg'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import RecentQuizzes from './recent-quizzes'

export default async function DashboardPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	return (
		<main className='container mx-auto py-6 px-4 flex-1 overflow-y-auto'>
			<div className='relative overflow-hidden rounded-2xl bg-gradient-hero shadow-elevated mb-8'>
				<div className='absolute inset-0 bg-indigo-500'>
					<Image
						src={heroImage}
						alt=''
						fill
						className='absolute inset-0 object-cover object-center opacity-30'
						preload
					/>
				</div>

				<div className='relative z-10 p-8 md:p-12 text-white'>
					<div className='max-w-2xl'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4 animate-fade-in'>
							Welcome to Quizzle
						</h1>
						<p className='text-xl md:text-2xl mb-8 text-white/90 animate-fade-in'>
							Create intelligent quizzes, engage learners, and track progress
							with AI-powered insights.
						</p>
						<Button
							size='lg'
							className='bg-white text-primary hover:bg-white/90 font-semibold'
							nativeButton={false}
							render={
								<Link href='/quizzes/new'>
									<Plus className='mr-2 h-5 w-5' />
									Create New Quiz
								</Link>
							}
						/>
					</div>
				</div>
			</div>

			<RecentQuizzes
				userId={session.user.id}
				currentUserId={session.user.id}
			/>
		</main>
	)
}
