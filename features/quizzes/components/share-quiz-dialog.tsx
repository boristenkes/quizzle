'use client'

import FacebookLogo from '@/components/icons/facebook-logo'
import LinkedInLogo from '@/components/icons/linkedin-logo'
import TwitterLogo from '@/components/icons/twitter-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CopyButton from '@/components/utils/copy-button'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger
} from '@/components/utils/responsive-dialog'

export type ShareQuizDialogProps = React.ComponentProps<
	typeof ResponsiveDialog
> & {
	url: string
	quizTitle: string
}

export default function ShareQuizDialog({
	url,
	quizTitle,
	children,
	...props
}: ShareQuizDialogProps) {
	const encodedUrl = encodeURIComponent(url)

	const socials = [
		{
			name: 'X (Twitter)',
			icon: TwitterLogo,
			url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(`Checkout this quiz: ${quizTitle}`)}`
		},
		{
			name: 'Facebook',
			icon: FacebookLogo,
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
		},
		{
			name: 'LinkedIn',
			icon: LinkedInLogo,
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
		}
	]

	return (
		<ResponsiveDialog {...props}>
			<ResponsiveDialogTrigger>{children}</ResponsiveDialogTrigger>

			<ResponsiveDialogContent className='sm:max-w-md max-sm:px-4 max-sm:pb-4'>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Share Quiz</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Share <q>{quizTitle}</q> with others
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<div className='space-y-4'>
					<div className='flex gap-2'>
						<Input
							value={url}
							readOnly
							className='text-sm'
						/>
						<CopyButton text={url} />
					</div>
					<div className='flex justify-center gap-3'>
						{socials.map(s => (
							<Button
								key={s.name}
								variant='outline'
								className='flex-1'
								onClick={() =>
									window.open(
										s.url,
										'_blank',
										'noopener,noreferrer,width=600,height=400'
									)
								}
							>
								<s.icon
									width={24}
									height={24}
									className='size-4 mr-2'
								/>
								{s.name}
							</Button>
						))}
					</div>
				</div>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
