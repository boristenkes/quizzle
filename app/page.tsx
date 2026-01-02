import SignOutButton from '@/features/auth/components/sign-out-button'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/auth/sign-in')

	return (
		<h1>
			Hello <SignOutButton>Sign out</SignOutButton>
		</h1>
	)
}
