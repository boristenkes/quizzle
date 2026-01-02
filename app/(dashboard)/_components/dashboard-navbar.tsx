// import { NotificationsPopover } from '@/components/NotificationsPopover'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/ui/input-group'
import { SidebarTrigger } from '@/components/ui/sidebar'
import UserButton from '@/components/utils/user-button'
import { SearchIcon } from 'lucide-react'

export default function DashboardNavbar() {
	return (
		<header className='h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40'>
			<div className='h-full px-4 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<SidebarTrigger className='lg:hidden' />

					{/* Search */}
					<div className='hidden md:flex items-center gap-2 max-w-sm'>
						<InputGroup>
							<InputGroupInput
								type='search'
								className='bg-secondary/50'
								placeholder='Search...'
							/>
							<InputGroupAddon>
								<SearchIcon className='size-4 text-muted-foregroun' />
							</InputGroupAddon>
						</InputGroup>
					</div>
				</div>

				{/* Right side */}
				<div className='flex items-center gap-2'>
					{/* <NotificationsPopover /> */}

					<UserButton />
				</div>
			</div>
		</header>
	)
}
