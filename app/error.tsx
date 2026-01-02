'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ErrorPage({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const pathname = usePathname()

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold mb-4'>Something went wrong!</h1>
				<p className='text-xl text-gray-600 mb-4'>
					We are sorry you are experiencing this. Please try again later.
				</p>

				<Button
					onClick={reset}
					variant='outline'
					size='lg'
					className='px-8'
				>
					Try again
				</Button>

				{pathname !== '/' && (
					<Link
						href='/'
						className='text-blue-500 hover:text-blue-700 underline block mt-4'
					>
						Return to Home
					</Link>
				)}
			</div>
		</div>
	)
}
