import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getSession } from '@/lib/auth'
import { ArrowLeftIcon, SparklesIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignInForm from './form'

export const metadata: Metadata = {
	title: 'Sign In'
}

export default async function SignInPage() {
	const isAuthenticated = await getSession().then(Boolean)

	if (isAuthenticated) redirect('/')

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

				<Card className='shadow-elevated'>
					<CardHeader className='text-center pb-4'>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your details to sign in to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInForm />

						<p className='text-sm text-center text-muted-foreground mt-6'>
							Don&apos;t an account?{' '}
							<Button
								variant='link'
								className='px-0 h-auto text-sm'
								nativeButton={false}
								render={<Link href='/auth/sign-up'>Sign up</Link>}
							/>
						</p>

						<p className='text-xs text-center text-muted-foreground mt-4'>
							By continuing, you agree to our{' '}
							<Button
								variant='link'
								className='px-0 h-auto text-xs'
							>
								Terms of Service
							</Button>{' '}
							and{' '}
							<Button
								variant='link'
								className='px-0 h-auto text-xs'
							>
								Privacy Policy
							</Button>
						</p>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
