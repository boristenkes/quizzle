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
import { Mail } from 'lucide-react'

export default function EmailNotifications() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Mail className='h-5 w-5' />
					Email Notifications
				</CardTitle>
				<CardDescription>Manage email notification preferences</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Quiz Attempts</Label>
						<p className='text-sm text-muted-foreground'>
							Get notified when someone takes your quiz
						</p>
					</div>
					<Switch />
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Comments & Reviews</Label>
						<p className='text-sm text-muted-foreground'>
							Receive emails about new comments on your quizzes
						</p>
					</div>
					<Switch />
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Newsletter</Label>
						<p className='text-sm text-muted-foreground'>
							Tips, updates, and platform news
						</p>
					</div>
					<Switch />
				</div>
			</CardContent>
		</Card>
	)
}
