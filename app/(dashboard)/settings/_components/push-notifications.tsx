import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Smartphone, Volume2 } from 'lucide-react'

export default function PushNotifications() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Smartphone className='h-5 w-5' />
					Push Notifications
				</CardTitle>
				<CardDescription>Manage in-app and push notifications</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Quiz Attempts</Label>
						<p className='text-sm text-muted-foreground'>
							Real-time notifications for quiz completions
						</p>
					</div>
					<Switch />
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Comments</Label>
						<p className='text-sm text-muted-foreground'>
							Notifications for new comments
						</p>
					</div>
					<Switch />
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label className='flex items-center gap-2'>
							<Volume2 className='h-4 w-4' />
							Sound Effects
						</Label>
						<p className='text-sm text-muted-foreground'>
							Play sounds for notifications
						</p>
					</div>
					<Switch />
				</div>
			</CardContent>
		</Card>
	)
}
