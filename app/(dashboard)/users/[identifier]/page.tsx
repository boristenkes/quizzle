import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BackButton from '@/components/utils/back-button'
import { getUser } from '@/features/users/actions'
import FollowButton from '@/features/users/components/follow-button'
import { getSession } from '@/lib/auth'
import { dateFormatter } from '@/utils/format'
import { ArrowLeft, Calendar, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import UserDetailsPageQuizList, {
	UserDetailsPageQuizListSkeleton
} from './quiz-list'
import UserStatistics from './user-statistics'

export type UserDetailsPageProps = {
	params: Promise<{ identifier: string }>
}

export default async function UserDetailsPage({
	params
}: UserDetailsPageProps) {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const { identifier } = await params

	const response = await getUser(identifier)

	if (!response.success) {
		if (response.message === 'notFound') notFound()

		return (
			<ErrorMessage
				message={
					response.message ?? 'Failed to get user data. Please try again later.'
				}
			/>
		)
	}

	const { user } = response

	return (
		<div className='container mx-auto p-6 space-y-6'>
			{/* Back Button */}
			<BackButton
				variant='ghost'
				className='mb-4'
			>
				<ArrowLeft className='mr-2 size-4' />
				Back
			</BackButton>

			<div className='flex max-xl:flex-col gap-4'>
				{/* Profile Header */}
				<Card className='basis-2/3'>
					<CardContent className='p-6'>
						<div className='flex flex-col md:flex-row gap-6 items-start'>
							<Avatar className='size-32'>
								<AvatarImage
									src={user.image!}
									alt={user.name}
									width={128}
									height={128}
								/>
								<AvatarFallback />
							</Avatar>

							<div className='flex-1 space-y-3'>
								<div>
									<h1 className='text-3xl font-bold mb-1'>{user.name}</h1>
									<p className='text-muted-foreground'>@{user.username}</p>
								</div>
								{user.bio && (
									<pre className='font-[inherit] text-sm'>{user.bio}</pre>
								)}
								<span className='flex items-center gap-1 text-muted-foreground'>
									<Calendar className='size-4' />
									Joined{' '}
									<time dateTime={user.createdAt.toISOString()}>
										{dateFormatter.format(user.createdAt)}
									</time>
								</span>

								{/* Badges */}
								<p>
									<em>* Badges/Awards goes here *</em>
								</p>
								{/* <div className='flex flex-wrap gap-2'>
								{badges.map(badge => (
									<Badge
										key={badge.name}
										variant='secondary'
										className='flex items-center gap-1'
									>
										<badge.icon className={`h-3 w-3 ${badge.color}`} />
										{badge.name}
									</Badge>
								))}
							</div> */}
							</div>

							<div className='flex items-center gap-2'>
								{session.user.id === user.id ? (
									<Button
										variant='outline'
										size='lg'
										nativeButton={false}
										render={
											<Link href='/settings?tab=profile'>
												Edit Profile <SettingsIcon />
											</Link>
										}
									/>
								) : (
									<FollowButton
										currentUserId={session.user.id}
										targetUserId={user.id}
									/>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats */}
				<UserStatistics
					user={user}
					className='basis-1/3'
				/>
			</div>

			{/* Tabs */}
			<Suspense fallback={<UserDetailsPageQuizListSkeleton />}>
				<UserDetailsPageQuizList
					userId={user.id}
					currentUserId={session.user.id}
				/>
			</Suspense>
		</div>
	)
}
