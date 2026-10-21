'use client'

import { Logo } from '@/components/logo'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'
import NavLink from '@/components/utils/nav-link'
import { useUpdateEffect } from '@/hooks/use-update-effect'
import { cn } from '@/utils/helpers'
import {
	BarChart3Icon,
	FileTextIcon,
	GlobeIcon,
	LayoutDashboardIcon,
	PlusIcon,
	SettingsIcon,
	TrophyIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
	{ title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
	{ title: 'Create Quiz', url: '/quizzes/new', icon: PlusIcon },
	{ title: 'My Quizzes', url: '/quizzes/my', icon: FileTextIcon },
	{ title: 'Discover', url: '/discover', icon: GlobeIcon },
	{ title: 'Analytics', url: '/analytics', icon: BarChart3Icon },
	{ title: 'Leaderboard', url: '/leaderboard', icon: TrophyIcon },
	{ title: 'Settings', url: '/settings', icon: SettingsIcon }
]

export function DashboardSidebar() {
	const { state, setOpen, setOpenMobile } = useSidebar()
	const pathname = usePathname()
	const isCollapsed = state === 'collapsed'

	useUpdateEffect(() => {
		setOpenMobile(false)
	}, [pathname])

	return (
		<Sidebar collapsible='icon'>
			<SidebarContent className='bg-linear-to-b from-background to-secondary/20'>
				<div
					className={cn(
						'h-16 px-4 border-b border-sidebar-border flex items-center',
						isCollapsed && 'justify-center'
					)}
				>
					<Link href='/'>
						<div className='flex items-center gap-2'>
							<Logo />

							{!isCollapsed && (
								<div>
									<h2 className='font-bold text-lg text-foreground'>Quizzle</h2>
									<p className='text-xs text-muted-foreground'>
										Smart Quiz Platform
									</p>
								</div>
							)}
						</div>
					</Link>
				</div>

				<SidebarGroup className='px-2'>
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										render={
											<NavLink
												href={item.url}
												className='text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors'
												activeStyles='bg-primary text-primary-foreground font-medium shadow-sm'
											>
												<item.icon className='size-4' />
												<span>{item.title}</span>
											</NavLink>
										}
									/>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
