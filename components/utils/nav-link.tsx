'use client'

import { cn } from '@/utils/helpers'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export type NavLinkProps = LinkProps & {
	activeStyles?: string
	className?: string
	children: React.ReactNode
}

export default function NavLink({
	href,
	activeStyles,
	className,
	...props
}: NavLinkProps) {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={cn(className, href === pathname && activeStyles)}
			{...props}
		/>
	)
}
