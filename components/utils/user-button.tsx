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
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

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
			<DropdownMenuTrigger>
				<Avatar size='lg'>
					<AvatarImage
						src={currentUser.image!}
						alt={currentUser.name}
					/>
					<AvatarFallback />
				</Avatar>
			</DropdownMenuTrigger>
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
