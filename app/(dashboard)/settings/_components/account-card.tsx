'use client'

import GoogleLogo from '@/components/icons/google-logo'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import VerifiedBadge from '@/components/verified-badge'
import { authClient } from '@/lib/auth.client'
import { cn } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { Account, User } from 'better-auth'
import { LockIcon } from 'lucide-react'
import { toast } from 'sonner'

export type AccountCardProps = React.ComponentProps<'div'> & {
	account: Pick<Account, 'id' | 'providerId'> & {
		user: Pick<User, 'email' | 'emailVerified'>
	}
	numberOfAccounts: number
}

export default function AccountCard({
	account,
	numberOfAccounts
}: AccountCardProps) {
	const mutation = useMutation({
		mutationKey: ['account:unlink', account.id],
		mutationFn: () => authClient.unlinkAccount(account, { throw: true }),

		onSuccess: () => toast.success('Account disconnected successfully'),
		onError: error => {
			console.error(error)
			toast.error(
				'Failed to disconnect account',
				error.message ? { description: error.message } : {}
			)
		}
	})

	if (mutation.isSuccess) return null

	return (
		<div
			className={cn(
				'flex items-center justify-between p-4 border rounded-lg',
				mutation.isPending && 'opacity-50'
			)}
		>
			<div className='flex items-center gap-3'>
				<div className='p-2 bg-secondary rounded-full'>
					<AccountIcon
						providerId={account.providerId}
						className='size-5'
					/>
				</div>
				<div>
					<p className='font-medium capitalize'>{account.providerId}</p>
					<p className='text-sm text-muted-foreground flex items-center gap-2'>
						{account.user.email}
						{account.user.emailVerified && (
							<VerifiedBadge disabled={mutation.isPending} />
						)}
					</p>
				</div>
			</div>

			{numberOfAccounts > 1 && (
				<Button
					variant='outline'
					size='sm'
					disabled={mutation.isPending}
					className='disabled:opacity-100'
					onClick={() => mutation.mutate()}
				>
					{mutation.isPending ? 'Disconnecting' : 'Disconnect'}
					{mutation.isPending && <Spinner />}
				</Button>
			)}
		</div>
	)
}

function AccountIcon({
	providerId,
	...props
}: React.ComponentProps<'svg'> & { providerId: Account['providerId'] }) {
	if (providerId === 'google') return <GoogleLogo {...props} />

	return <LockIcon {...props} />
}
