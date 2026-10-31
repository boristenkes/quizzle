'use client'

import { Button } from '@/components/ui/button'
import { NotificationSchema } from '@/features/notifications/zod'
import { getTimeDistanceFromNow } from '@/utils/format'
import { cn } from '@/utils/helpers'
import {
	MessageSquareIcon,
	PlayIcon,
	Trash2Icon,
	UserPlusIcon
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteNotification, markNotificationAsRead } from '../actions'
import { useNotifications } from '../context'

const getNotificationIcon = (type: NotificationSchema['type']) => {
	switch (type) {
		case 'new_attempt':
			return <PlayIcon className='h-4 w-4 text-blue-500' />
		case 'new_review':
			return <MessageSquareIcon className='h-4 w-4 text-blue-500' />
		case 'new_follower':
			return <UserPlusIcon className='h-4 w-4 text-green-500' />
	}
}

const humanizeString = (str: string) => {
	const result = str
		.split('_')
		.map(word => word.at(0)?.toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')

	return result
}

export type NotificationBodyProps = React.ComponentProps<'div'> & {
	notification: NotificationSchema
}

export default function NotificationBody({
	notification,
	className,
	...props
}: NotificationBodyProps) {
	const { notifications, setNotifications, setUnreadCount } = useNotifications()
	const [isRead, setIsRead] = useState(!!notification.readAt)

	const handleMarkAsRead = async () => {
		setIsRead(true)
		setUnreadCount(prev => prev - 1)

		const response = await markNotificationAsRead(notification.id)

		if (!response.success) {
			setIsRead(false)
			setUnreadCount(prev => prev + 1)
			toast.error('Failed to mark notification as read.')
			return
		}

		setNotifications(prev =>
			prev.map(curr =>
				curr.id === notification.id
					? { ...curr, readAt: response.readAt }
					: curr
			)
		)
	}

	const handleDelete = async () => {
		setNotifications(prev => prev.filter(notif => notif.id !== notification.id))
		setUnreadCount(
			notifications.reduce((count, notif) => count + (!notif.readAt ? 1 : 0), 0)
		)

		const response = await deleteNotification(notification.id)

		if (!response.success)
			toast.error(response.message ?? 'Failed to delete notification')
	}

	return (
		<div
			key={notification.id}
			className={cn(
				'p-4 hover:bg-secondary/50 transition-colors cursor-pointer group',
				!isRead && 'bg-primary/5',
				className
			)}
			{...props}
			onMouseEnter={isRead ? undefined : handleMarkAsRead}
		>
			<div className='flex gap-3'>
				<div className='mt-0.5'>{getNotificationIcon(notification.type)}</div>
				<div className='flex-1 min-w-0'>
					<div className='flex items-start justify-between gap-2'>
						<p
							className={cn(
								'text-sm line-clamp-1',
								!isRead ? 'font-semibold text-foreground' : 'text-foreground'
							)}
						>
							{humanizeString(notification.type)}
						</p>
						<Button
							variant='ghost'
							size='icon'
							className='h-6 w-6 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={e => {
								e.stopPropagation()
								handleDelete()
							}}
						>
							<Trash2Icon className='h-3 w-3' />
						</Button>
					</div>
					<p className='text-sm text-muted-foreground line-clamp-2 mt-0.5'>
						<NotificationMessage notification={notification} />
					</p>

					<p className='text-xs text-muted-foreground mt-1'>
						{getTimeDistanceFromNow(notification.createdAt!)}
					</p>
				</div>
			</div>
		</div>
	)
}

function NotificationMessage({
	notification
}: {
	notification: NotificationSchema
}) {
	switch (notification.type) {
		case 'new_attempt':
			return (
				<>
					<Link
						href={`/users/${notification.issuer.username}`}
						className='underline underline-offset-2'
					>
						{notification.issuer.name}
					</Link>{' '}
					has just taken your quiz:{' '}
					<Link
						href={`/quizzes/${notification.quiz.slug}/${notification.quiz.id}`}
					>
						<q>{notification.quiz.title}</q>
					</Link>
				</>
			)

		case 'new_follower':
			return (
				<>
					<Link href={`/users/${notification.issuer.username}`}>
						{notification.issuer.name}
					</Link>{' '}
					started following you.
				</>
			)

		case 'new_review':
			return (
				<Link
					href={`/quizzes/${notification.quiz.slug}/${notification.quiz.id}?highlight=${notification.reviewId}`}
				>
					{notification.issuer.name} left a review on your quiz{' '}
					<q>{notification.quiz.title}</q>
				</Link>
			)
	}
}
