// @ts-nocheck TODO
'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'

export type SignOutButtonProps =
	| ({ unstyled?: true } & React.ComponentProps<'button'>)
	| ({ unstyled?: false } & ButtonProps)

export default function SignOutButton({
	unstyled = false,
	onClick,
	...props
}: SignOutButtonProps) {
	const router = useRouter()

	const handleClick = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		await authClient.signOut()
		router.replace('/auth/sign-in')
		onClick?.(e)
	}

	if (unstyled)
		return (
			<button
				onClick={handleClick}
				{...props}
			/>
		)

	return (
		<Button
			onClick={handleClick}
			{...props}
		/>
	)
}
