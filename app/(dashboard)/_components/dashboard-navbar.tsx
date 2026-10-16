// import { NotificationsPopover } from '@/components/NotificationsPopover'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/ui/input-group'
import { SidebarTrigger } from '@/components/ui/sidebar'
import UserButton from '@/components/utils/user-button'
import { MAX_QUERY_LENGTH } from '@/lib/constants'
import { SearchIcon } from 'lucide-react'
import Form from 'next/form'

export default function DashboardNavbar() {
	return (
		<header className='h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40'>
			<div className='h-full px-4 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<SidebarTrigger size='icon' />

					{/* Search */}
					<Form action='/discover'>
						<InputGroup className='hidden md:flex items-center max-w-sm'>
							<InputGroupInput
								type='search'
								name='query'
								className='bg-secondary/50'
								placeholder='Type to search...'
								maxLength={MAX_QUERY_LENGTH}
							/>
							<InputGroupAddon align='inline-start'>
								<SearchIcon className='size-4 text-muted-foregroun' />
							</InputGroupAddon>
							<InputGroupAddon align='inline-end'>
								<Button
									type='submit'
									size='xs'
									variant='secondary'
								>
									Search
								</Button>
							</InputGroupAddon>
						</InputGroup>
					</Form>
				</div>

				{/* Right side */}
				<div className='flex items-center gap-2'>
					{/* <NotificationsPopover /> */}

					<ThemeSwitch />
					<UserButton />
				</div>
			</div>
		</header>
	)
}
