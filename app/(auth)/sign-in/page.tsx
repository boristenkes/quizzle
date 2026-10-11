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
import SignInForm from './form'

export const metadata: Metadata = {
	title: 'Sign In'
}

export type SignInPageProps = {
	searchParams: Promise<{ callbackUrl: Nullable<string> }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
	const isAuthenticated = await getSession().then(Boolean)
	const callbackUrl = (await searchParams).callbackUrl

	if (isAuthenticated) redirect(callbackUrl || '/')

	return (
		<Card className='shadow-elevated'>
			<CardHeader className='text-center pb-4'>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Enter your details to sign in to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignInForm callbackUrl={callbackUrl} />

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
