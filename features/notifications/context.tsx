'use client'

import { SetState } from '@/utils/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { getLatestNotifications, LatestNotificationsResponse } from './actions'
import { NotificationSchema } from './zod'

export type NotificationContextValue = {
	query: UseQueryResult<LatestNotificationsResponse>
	notifications: NotificationSchema[]
	setNotifications: SetState<NotificationSchema[]>
	unreadCount: number
	setUnreadCount: SetState<number>
}

export const NotificationContext =
	createContext<NotificationContextValue | null>(null)

export function useNotifications() {
	const context = useContext(NotificationContext)

	if (!context)
		throw new Error('useNotifications must be used within NotificationProvider')

	return context
}

export function NotificationProvider({
	children
}: {
	children: React.ReactNode
}) {
	const query = useQuery({
		queryKey: ['notifications:latest'],
		queryFn: getLatestNotifications
	})
	const [notifications, setNotifications] = useState<NotificationSchema[]>([])
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		setNotifications(query.data?.notifications ?? [])
		setUnreadCount(query.data?.unreadCount ?? 0)
	}, [query.data])

	return (
		<NotificationContext.Provider
			value={{
				query,
				notifications,
				setNotifications,
				unreadCount,
				setUnreadCount
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}
