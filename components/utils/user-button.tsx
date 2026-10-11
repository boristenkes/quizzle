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

	const sessionUser = session.user

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar size='lg'>
					<AvatarImage
						src={sessionUser.image!}
						alt={sessionUser.name}
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
							<Link href={`/users/${sessionUser.username ?? sessionUser.id}`}>
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
