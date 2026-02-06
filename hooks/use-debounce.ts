'use client'

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delayMs = 250) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)

		return () => clearTimeout(timeoutId)
	}, [value, delayMs])

	return debouncedValue
}
