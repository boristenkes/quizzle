'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useRouter } from 'nextjs-toploader/app'

export default function BackButton(props: ButtonProps) {
	const router = useRouter()

	return (
		<Button
			onClick={router.back}
			{...props}
		/>
	)
}
