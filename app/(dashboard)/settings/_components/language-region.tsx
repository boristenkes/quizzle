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
import { Globe } from 'lucide-react'

export default function LanguageRegion() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Globe className='h-5 w-5' />
					Language & Region
				</CardTitle>
				<CardDescription>Set your language and timezone</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div className='space-y-2'>
						<Label>Language</Label>
						<Select defaultValue='en'>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='en'>English</SelectItem>
								<SelectItem value='es'>Español</SelectItem>
								<SelectItem value='fr'>Français</SelectItem>
								<SelectItem value='de'>Deutsch</SelectItem>
								<SelectItem value='ja'>日本語</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-2'>
						<Label>Timezone</Label>
						<Select defaultValue='America/Los_Angeles'>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='America/Los_Angeles'>
									Pacific Time (PT)
								</SelectItem>
								<SelectItem value='America/Denver'>
									Mountain Time (MT)
								</SelectItem>
								<SelectItem value='America/Chicago'>
									Central Time (CT)
								</SelectItem>
								<SelectItem value='America/New_York'>
									Eastern Time (ET)
								</SelectItem>
								<SelectItem value='Europe/London'>London (GMT)</SelectItem>
								<SelectItem value='Europe/Paris'>Paris (CET)</SelectItem>
								<SelectItem value='Asia/Tokyo'>Tokyo (JST)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
