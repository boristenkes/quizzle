import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SignOutButton from '@/features/auth/components/sign-out-button'
import { getSession } from '@/lib/auth'
import { getInitials } from '@/utils/helpers'
import Link from 'next/link'

export default async function UserButton() {
	const session = await getSession()

	if (!session)
		return (
			<Button
				nativeButton={false}
				render={<Link href='/sign-in'>Sign In</Link>}
			/>
		)

	const currentUser = session.user

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant='outline'
						className='relative size-8 rounded-full'
					>
						<Avatar className='size-8'>
							<AvatarImage
								src={currentUser.image!}
								alt={currentUser.name}
							/>
							<AvatarFallback className='bg-primary text-primary-foreground'>
								{getInitials(currentUser.name)}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			/>
			<DropdownMenuContent
				className='w-56 bg-popover'
				align='end'
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						render={
							<Link href={`/users/${currentUser.username ?? currentUser.id}`}>
								Profile
							</Link>
						}
					/>
					<DropdownMenuItem render={<Link href='/settings'>Settings</Link>} />
					<DropdownMenuItem>Help</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						nativeButton={true}
						render={
							<SignOutButton
								unstyled
								className='w-full'
							>
								Sign out
							</SignOutButton>
						}
					/>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
