import PersistedTabs from '@/components/persisted-tabs'
import { Button } from '@/components/ui/button'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSession } from '@/lib/auth'
import { BellIcon, PaletteIcon, Save, ShieldIcon, UserIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import * as Section from './_components'

export const metadata: Metadata = {
	title: 'Settings'
}

export default async function SettingsPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const currentUser = session.user

	return (
		<div className='container mx-auto py-6 px-4 max-w-4xl space-y-8'>
			<div>
				<h1 className='text-3xl font-bold'>Settings</h1>
				<p className='text-muted-foreground'>
					Manage your account settings and preferences
				</p>
			</div>

			<PersistedTabs
				defaultValue='profile'
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-indigo-100/10'>
					<TabsTrigger
						value='profile'
						className='gap-2'
					>
						<UserIcon className='size-4' />
						<span className='hidden sm:inline'>Profile</span>
					</TabsTrigger>
					<TabsTrigger
						value='notifications'
						className='gap-2'
					>
						<BellIcon className='size-4' />
						<span className='hidden sm:inline'>Notifications</span>
					</TabsTrigger>
					<TabsTrigger
						value='privacy'
						className='gap-2'
					>
						<ShieldIcon className='size-4' />
						<span className='hidden sm:inline'>Privacy</span>
					</TabsTrigger>
					<TabsTrigger
						value='appearance'
						className='gap-2'
					>
						<PaletteIcon className='size-4' />
						<span className='hidden sm:inline'>Appearance</span>
					</TabsTrigger>
				</TabsList>

				{/* Profile tab */}
				<TabsContent
					value='profile'
					className='space-y-6'
				>
					<Section.ProfileInfo user={currentUser} />
					<Section.ConnectedAccounts />
				</TabsContent>

				{/* Notifications tab */}
				<TabsContent
					value='notifications'
					className='space-y-6'
				>
					<Section.EmailNotifications />
					<Section.PushNotifications />
					<div className='flex justify-end'>
						<Button>
							<Save className='mr-2 h-4 w-4' />
							Save Preferences
						</Button>
					</div>
				</TabsContent>

				{/* Privacy tab */}
				<TabsContent
					value='privacy'
					className='space-y-6'
				>
					<Section.ProfileVisibility />
					<Section.Security />
					<Section.DangerZone userName={currentUser.name} />
				</TabsContent>

				{/* Appearance tab */}
				<TabsContent value='appearance'>
					<Section.Theme />
				</TabsContent>
			</PersistedTabs>
		</div>
	)
}
