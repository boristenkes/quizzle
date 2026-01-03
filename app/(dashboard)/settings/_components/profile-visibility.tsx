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
import { Eye } from 'lucide-react'

export default function ProfileVisibility() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Eye className='h-5 w-5' />
					Profile Visibility
				</CardTitle>
				<CardDescription>Control who can see your information</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Public Profile</Label>
						<p className='text-sm text-muted-foreground'>
							Allow others to view your profile page
						</p>
					</div>
					<Switch />
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div className='space-y-0.5'>
						<Label>Show Quiz Scores</Label>
						<p className='text-sm text-muted-foreground'>
							Display your quiz scores on public leaderboards
						</p>
					</div>
					<Switch />
				</div>
			</CardContent>
		</Card>
	)
}
