'use client'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import React, { createContext, useContext } from 'react'

const ResponsiveDialogContext = createContext<{
	isDesktop: boolean
} | null>(null)

export function useResponsiveDialog<TDesktop, TMobile>(
	desktop: TDesktop,
	mobile: TMobile
) {
	const context = useContext(ResponsiveDialogContext)

	if (!context)
		throw new Error('useResponsiveDialog must be used within ResponsiveDialog')

	return context.isDesktop ? desktop : mobile
}

export function ResponsiveDialog({
	breakpoint = 768,
	children,
	...props
}: React.ComponentProps<typeof Drawer> & {
	breakpoint?: number
}) {
	const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`)
	const Root = isDesktop ? Dialog : Drawer

	return (
		<ResponsiveDialogContext.Provider value={{ isDesktop }}>
			<Root {...props}>{children}</Root>
		</ResponsiveDialogContext.Provider>
	)
}

export const ResponsiveDialogTrigger = (
	props: React.ComponentProps<typeof DrawerTrigger>
) => {
	const Trigger = useResponsiveDialog(DialogTrigger, DrawerTrigger)

	return <Trigger {...props} />
}

export const ResponsiveDialogContent = (
	props: React.ComponentProps<typeof DrawerContent>
) => {
	const Content = useResponsiveDialog(DialogContent, DrawerContent)

	return <Content {...props} />
}

export const ResponsiveDialogTitle = (
	props: React.ComponentProps<typeof DrawerTitle>
) => {
	const Title = useResponsiveDialog(DialogTitle, DrawerTitle)

	return <Title {...props} />
}

export const ResponsiveDialogClose = (
	props: React.ComponentProps<typeof DrawerClose>
) => {
	const Close = useResponsiveDialog(DialogClose, DrawerClose)

	return <Close {...props} />
}

export const ResponsiveDialogDescription = (
	props: React.ComponentProps<typeof DrawerDescription>
) => {
	const Description = useResponsiveDialog(DialogDescription, DrawerDescription)

	return <Description {...props} />
}

export const ResponsiveDialogHeader = (
	props: React.ComponentProps<typeof DrawerHeader>
) => {
	const Header = useResponsiveDialog(DialogHeader, DrawerHeader)

	return <Header {...props} />
}

export const ResponsiveDialogFooter = (
	props: React.ComponentProps<typeof DrawerFooter>
) => {
	const Footer = useResponsiveDialog(DialogFooter, DrawerFooter)

	return <Footer {...props} />
}

export const ResponsiveDialogOverlay = (
	props: React.ComponentProps<typeof DrawerOverlay>
) => {
	const Overlay = useResponsiveDialog(DialogOverlay, DrawerOverlay)

	return <Overlay {...props} />
}

export const ResponsiveDialogPortal = (
	props: React.ComponentProps<typeof DrawerPortal>
) => {
	const Portal = useResponsiveDialog(DialogPortal, DrawerPortal)

	// @ts-expect-error
	return <Portal {...props} />
}
