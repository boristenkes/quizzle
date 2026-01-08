import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, SparklesIcon } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen p-4 bg-linear-to-br from-accent/10 via-secondary/30 to-accent/20'>
			<Button
				variant='outline'
				className='m-4'
				nativeButton={false}
				render={
					<Link href='/'>
						<ArrowLeftIcon className='mr-2 h-4 w-4' />
						Back to Home
					</Link>
				}
			/>

			<main className='w-full max-w-md space-y-6 mx-auto py-4'>
				{/* Logo */}
				<div className='flex items-center gap-4'>
					<SparklesIcon className='text-indigo-500 size-8' />
					<div>
						<h1 className='text-3xl font-bold'>Quizzle</h1>
						<p className='text-muted-foreground'>
							Create and share intelligent quizzes
						</p>
					</div>
				</div>

				{children}
			</main>
		</div>
	)
}
