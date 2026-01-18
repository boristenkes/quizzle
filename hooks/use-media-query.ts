'use client'

import { useCallback, useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
	const [isMatch, setIsMatch] = useState(false)

	const updateIsMatch = useCallback(
		(e: MediaQueryListEvent) => {
			setIsMatch(e.matches)
		},
		[setIsMatch]
	)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const media = window.matchMedia(query)
		media.addEventListener('change', updateIsMatch)

		if (media.matches) {
			setIsMatch(true)
		}

		return () => media.removeEventListener('change', updateIsMatch)
	}, [query, updateIsMatch])

	return isMatch
}
