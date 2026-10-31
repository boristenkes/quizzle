'use client'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { clearMyNotifications } from '@/features/notifications/actions'
import { useNotifications } from '@/features/notifications/context'
import { Nullable } from '@/utils/types'
import {
	AlertCircleIcon,
	BellIcon,
	CheckCheckIcon,
	RotateCwIcon,
	Trash2Icon
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import NotificationBody from './notification-body'

export function NotificationsPopover() {
	const {
		query,
		notifications,
		setNotifications,
		unreadCount,
		setUnreadCount
	} = useNotifications()
	const [open, setOpen] = useState(false)

	if (query.isError)
		return <NotificationPopoverError message={query.error.message} />

	const handleClear = async () => {
		setNotifications([])
		setUnreadCount(0)

		const response = await clearMyNotifications()

		if (!response.success) {
			toast.error('Failed to clear notifications')
		}
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger
				render={
					<Button
						variant='outline'
						size='icon'
						className='relative'
					>
						{query.isLoading ? (
							<Spinner />
						) : (
							<>
								<BellIcon className='h-4 w-4' />

								{unreadCount > 0 && (
									<span className='absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center'>
										{unreadCount > 9 ? '9+' : unreadCount}
									</span>
								)}
							</>
						)}
					</Button>
				}
			/>
			<PopoverContent
				className='w-80 p-0 bg-popover border-border gap-0'
				align='end'
				sideOffset={8}
			>
				<div className='flex items-center justify-between p-4 border-b border-border'>
					<h3 className='font-semibold text-foreground'>Notifications</h3>
					{unreadCount > 0 && (
						<Button
							variant='ghost'
							size='sm'
							// onClick={markAllAsRead}
							className='text-xs h-7'
							disabled={query.isLoading}
						>
							<CheckCheckIcon className='h-3 w-3 mr-1' />
							Mark all read
						</Button>
					)}
				</div>

				<ScrollArea className='h-75'>
					{query.isLoading ? (
						<Spinner className='mx-auto my-16 size-6' />
					) : notifications.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full py-8 text-muted-foreground'>
							<BellIcon className='h-8 w-8 mb-2 opacity-50' />
							<p className='text-sm'>No notifications</p>
						</div>
					) : (
						<div className='divide-y divide-border'>
							{notifications.map(notification => (
								<NotificationBody
									key={notification.id}
									notification={notification}
								/>
							))}
						</div>
					)}
				</ScrollArea>

				{notifications.length > 0 && (
					<>
						<Separator />
						<div className='p-2 flex items-center justify-between gap-4'>
							<Button
								variant='ghost'
								size='sm'
								className='text-muted-foreground hover:text-destructive'
								onClick={handleClear}
							>
								<Trash2Icon className='h-3 w-3 mr-2' />
								Clear all notifications
							</Button>

							<Button
								variant='outline'
								size='icon-sm'
								disabled={query.isRefetching}
								onClick={() => query.refetch()}
							>
								<RotateCwIcon className='h-3 w-3' />
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	)
}

export function NotificationPopoverLoading() {
	return (
		<Button
			variant='outline'
			size='icon'
			className='relative'
			disabled
		>
			<Spinner />
		</Button>
	)
}

export function NotificationPopoverError({
	message
}: {
	message?: Nullable<string>
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						variant='outline'
						size='icon'
						className='relative'
					>
						<AlertCircleIcon className='size-4 text-destructive' />
					</Button>
				}
			/>

			<TooltipContent side='bottom'>
				<p>{message ?? 'Failed to load notifications'}</p>
			</TooltipContent>
		</Tooltip>
	)
}
