import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getSession } from '@/lib/auth'
import { Nullable } from '@/utils/types'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignUpForm from './form'

export const metadata: Metadata = {
	title: 'Sign Up'
}

export type SignUpPageProps = {
	searchParams: Promise<{ callbackUrl: Nullable<string> }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
	const isAuthenticated = await getSession().then(Boolean)
	const callbackUrl = (await searchParams).callbackUrl

	if (isAuthenticated) redirect(callbackUrl || '/')

	return (
		<Card className='shadow-elevated'>
			<CardHeader className='text-center pb-4'>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>Get started with your free account</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm callbackUrl={callbackUrl} />

				<p className='text-sm text-center text-muted-foreground mt-6'>
					Already have an account?{' '}
					<Button
						variant='link'
						className='px-0 h-auto text-sm'
						nativeButton={false}
						render={<Link href='/sign-in'>Sign in</Link>}
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
