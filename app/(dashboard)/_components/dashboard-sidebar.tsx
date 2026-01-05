'use client'

import Logo from '@/components/logo'
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

const navigationItems = [
	{ title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
	{ title: 'Create Quiz', url: '/quizzes/new', icon: PlusIcon },
	{ title: 'My Quizzes', url: '/my-quizzes', icon: FileTextIcon },
	{ title: 'Discover', url: '/discover', icon: GlobeIcon },
	{ title: 'Analytics', url: '/analytics', icon: BarChart3Icon },
	{ title: 'Leaderboard', url: '/leaderboard', icon: TrophyIcon }
]

const quickActions = [
	{ title: 'Import PDF', url: '/import', icon: FileTextIcon },
	{ title: 'Settings', url: '/settings', icon: SettingsIcon }
]

export function DashboardSidebar() {
	const { state } = useSidebar()
	const isCollapsed = state === 'collapsed'

	return (
		<Sidebar collapsible='icon'>
			<SidebarContent className='bg-linear-to-b from-background to-secondary/20'>
				<div className='h-16 px-4 border-b border-sidebar-border flex items-center'>
					<Link
						href='/'
						className='flex items-center gap-2'
					>
						<Logo className='size-8' />
						{!isCollapsed && (
							<div>
								<h2 className='font-bold text-lg text-foreground'>Quizzle</h2>
								<p className='text-xs text-muted-foreground'>
									Smart Quiz Platform
								</p>
							</div>
						)}
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
												{!isCollapsed && <span>{item.title}</span>}
											</NavLink>
										}
									/>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className='px-2'>
					<SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{quickActions.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										render={
											<NavLink
												href={item.url}
												className='text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors'
												activeStyles='bg-primary text-primary-foreground font-medium shadow-sm'
											>
												<item.icon className='h-4 w-4' />
												{!isCollapsed && <span>{item.title}</span>}
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
