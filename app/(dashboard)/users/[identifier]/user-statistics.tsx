'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GetUserUser } from '@/features/users/actions'
import { cn } from '@/utils/helpers'
import {
	FileTextIcon,
	TargetIcon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'

export type UserStatisticsProps = React.HTMLAttributes<HTMLDivElement> & {
	user: GetUserUser
}

export default function UserStatistics({
	user,
	className,
	...props
}: UserStatisticsProps) {
	return (
		<div
			className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}
			{...props}
		>
			<Card>
				<CardContent className='p-4 text-center'>
					<FileTextIcon className='h-5 w-5 mx-auto mb-2 text-primary' />
					<p className='text-2xl font-bold'>{user.quizCount}</p>
					<p className='text-xs text-muted-foreground'>Quizzes Created</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-4 text-center'>
					<UsersIcon className='h-5 w-5 mx-auto mb-2 text-primary' />
					<p className='text-2xl font-bold'>{user.totalAttempts}</p>
					<p className='text-xs text-muted-foreground'>Total Attempts</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-4 text-center'>
					<TrendingUpIcon className='h-5 w-5 mx-auto mb-2 text-green-500' />
					<p className='text-2xl font-bold'>{user.followerCount}</p>
					<p className='text-xs text-muted-foreground'>Followers</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-4 text-center'>
					<TargetIcon className='h-5 w-5 mx-auto mb-2 text-blue-500' />
					<p className='text-2xl font-bold'>{user.followingCount}</p>
					<p className='text-xs text-muted-foreground'>Following</p>
				</CardContent>
			</Card>
		</div>
	)
}
