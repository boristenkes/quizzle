import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getSession } from '@/lib/auth'
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
						render={<Link href='/sign-up'>Sign up</Link>}
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
	)
}
