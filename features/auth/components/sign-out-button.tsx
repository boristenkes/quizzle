'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { authClient } from '@/lib/auth.client'
import { useRouter } from 'nextjs-toploader/app'

export type SignOutButtonProps =
	| ({ unstyled?: true } & React.ComponentProps<'button'>)
	| ({ unstyled?: false } & ButtonProps)

export default function SignOutButton({
	unstyled = false,
	...props
}: SignOutButtonProps) {
	const router = useRouter()

	const handleClick = async () => {
		await authClient.signOut()
		router.replace('/sign-in')
	}

	if (unstyled)
		return (
			<button
				{...(props as React.ComponentProps<'button'>)}
				onClick={handleClick}
			/>
		)

	return (
		<Button
			{...props}
			onClick={handleClick}
		/>
	)
}
