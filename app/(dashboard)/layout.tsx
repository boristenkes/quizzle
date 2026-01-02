// import { NotificationsPopover } from '@/components/NotificationsPopover'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import DashboardNavbar from './_components/dashboard-navbar'
import { DashboardSidebar } from './_components/dashboard-sidebar'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<div className='min-h-screen flex w-full bg-background'>
				<DashboardSidebar />

				<div className='flex flex-col flex-1'>
					<DashboardNavbar />

					<div className='bg-neutral-100 h-full w-full'>{children}</div>
				</div>
			</div>
		</SidebarProvider>
	)
}
