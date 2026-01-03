'use client'

import ErrorMessage from '@/components/error-message'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth.client'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type DangerZoneProps = {
	userName: string
}

export default function DangerZone({ userName }: DangerZoneProps) {
	const controller = new AbortController()
	const router = useRouter()
	const mutation = useMutation({
		mutationKey: ['delete:self'],
		mutationFn: () =>
			authClient.deleteUser(
				{ callbackURL: '/sign-in' },
				{ throw: true, signal: controller.signal }
			),
		onSuccess: () => router.replace('/sign-in')
	})
	const CONFIRM_MESSAGE = `Delete ${userName}`
	const [message, setMessage] = useState('')

	return (
		<Card className='border-destructive/50'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-destructive'>
					<Trash2 className='h-5 w-5' />
					Danger Zone
				</CardTitle>
				<CardDescription>Irreversible actions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5'>
					<div>
						<p className='font-medium'>Delete Account</p>
						<p className='text-sm text-muted-foreground'>
							Permanently delete your account and all data
						</p>
					</div>

					<AlertDialog>
						<AlertDialogTrigger
							render={<Button variant='destructive'>Delete Account</Button>}
						/>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									You are about to permamently delete your account and all data
									related to you. This cannot be undone. Proceed with caution.
								</AlertDialogDescription>

								<Field className='my-4'>
									<FieldLabel htmlFor='confirmMessage'>
										Confirm Message
									</FieldLabel>
									<Input
										id='confirmMessage'
										autoComplete='off'
										value={message}
										onChange={e => setMessage(e.target.value)}
										disabled={mutation.isPending}
									/>
									<FieldDescription>
										Please enter <strong>{CONFIRM_MESSAGE}</strong> to confirm.
									</FieldDescription>
								</Field>

								{mutation.isError && (
									<ErrorMessage message={mutation.error.message} />
								)}

								<AlertDialogFooter className='ml-auto'>
									<AlertDialogCancel
										render={
											<Button
												variant='secondary'
												onClick={() => mutation.isPending && controller.abort()}
											>
												Cancel
											</Button>
										}
									/>
									<Button
										variant='destructive'
										disabled={message !== CONFIRM_MESSAGE || mutation.isPending}
										onClick={() => mutation.mutate()}
									>
										{mutation.isPending ? 'Deleting' : 'Delete'}
										{mutation.isPending && <Spinner />}
									</Button>
								</AlertDialogFooter>
							</AlertDialogHeader>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardContent>
		</Card>
	)
}
