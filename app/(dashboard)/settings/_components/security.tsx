import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Key } from 'lucide-react'

export default function Security() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Key className='h-5 w-5' />
					Security
				</CardTitle>
				<CardDescription>Manage your account security</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex items-center justify-between p-4 border rounded-lg'>
					<div>
						<p className='font-medium'>Password</p>
						<p className='text-sm text-muted-foreground'>
							Last changed 3 months ago
						</p>
					</div>
					<Button variant='outline'>Change Password</Button>
				</div>
				<div className='flex items-center justify-between p-4 border rounded-lg'>
					<div>
						<p className='font-medium'>Two-Factor Authentication</p>
						<p className='text-sm text-muted-foreground'>
							Add an extra layer of security
						</p>
					</div>
					<Button variant='outline'>Enable 2FA</Button>
				</div>
			</CardContent>
		</Card>
	)
}
