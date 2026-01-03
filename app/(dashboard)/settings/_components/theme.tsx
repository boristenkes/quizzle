import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Palette } from 'lucide-react'

export default function Theme() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Palette className='h-5 w-5' />
					Theme
				</CardTitle>
				<CardDescription>Customize the look and feel</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label>Color Theme</Label>
					<Select defaultValue='system'>
						<SelectTrigger className='w-full sm:w-50'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='light'>Light</SelectItem>
							<SelectItem value='dark'>Dark</SelectItem>
							<SelectItem value='system'>System</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	)
}
