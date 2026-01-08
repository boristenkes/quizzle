'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Tabs } from './ui/tabs'

export type PeristedTabsProps = React.ComponentProps<typeof Tabs>

export default function PersistedTabs({
	onValueChange,
	...props
}: PeristedTabsProps) {
	const searchParams = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		searchParams.get('tab') ?? props.defaultValue
	)

	useEffect(() => {
		const url = new URL(window.location.href)
		url.searchParams.set('tab', activeTab)
		window.history.replaceState({}, '', url)
	}, [activeTab])

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value, event) => {
				setActiveTab(value)
				onValueChange?.(value, event)
			}}
			{...props}
		/>
	)
}
