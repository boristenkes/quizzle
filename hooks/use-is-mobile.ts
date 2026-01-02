'use client'

import { useEffect, useState } from 'react'

export const useIsMobile = ({ breakpoint = 768 } = {}): boolean => {
	const [isMobile, setIsMobile] = useState<boolean>(false)

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= breakpoint)
		}

		checkIfMobile()

		window.addEventListener('resize', checkIfMobile)

		return () => window.removeEventListener('resize', checkIfMobile)
	}, [])

	return isMobile
}
