import { Button } from '@/components/ui/button'
import Anchor from '@/components/utils/anchor'
import BackButton from '@/components/utils/back-button'
import { ArrowLeftIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export type ExternalLinkPageProps = {
	searchParams: Promise<{ href: string }>
}

export default async function ExternalLinkPage({
	searchParams
}: ExternalLinkPageProps) {
	const { href } = await searchParams
	const targetUrl = new URL(decodeURIComponent(href))

	if (!href) redirect('/')

	return (
		<main className='min-h-screen flex items-center justify-center flex-col'>
			<h1 className='text-3xl font-semibold mb-2'>You are leaving Quizzle</h1>
			<p className='mb-8'>
				This link is taking you to the following website:{' '}
				<Anchor
					href={targetUrl.href}
					target='_self'
					className='hover:underline underline-offset-2'
				>
					{targetUrl.host}
				</Anchor>
			</p>

			<div className='flex items-center gap-2'>
				<BackButton>
					<ArrowLeftIcon /> Go Back
				</BackButton>
				<Button
					nativeButton={false}
					render={
						<Anchor
							href={targetUrl.href}
							target='_self'
						/>
					}
				>
					Visit Site
				</Button>
			</div>
		</main>
	)
}
