// import { NotificationsPopover } from '@/components/NotificationsPopover'
import Footer from '@/components/footer'
import { SidebarProvider } from '@/components/ui/sidebar'
import { CategoriesProvider } from '@/context/categories'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { cookies } from 'next/headers'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '../api/uploadthing/core'
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
			<CategoriesProvider>
				<div className='min-h-screen flex w-full bg-background'>
					<DashboardSidebar />

					<div className='flex flex-col flex-1 bg-neutral-100 dark:bg-neutral-900/20'>
						<DashboardNavbar />

						<div className='grow'>{children}</div>

						<Footer />
					</div>
				</div>

				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
			</CategoriesProvider>
		</SidebarProvider>
	)
}
