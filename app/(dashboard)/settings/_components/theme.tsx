'use client'

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
import { useTheme } from 'next-themes'

export default function Theme() {
	const { theme, setTheme, themes } = useTheme()

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
					<Select
						value={theme}
						onValueChange={value => setTheme(value!)}
					>
						<SelectTrigger
							className='w-full sm:w-50'
							suppressHydrationWarning
						>
							<SelectValue
								className='capitalize'
								suppressHydrationWarning
							>
								<span className='hidden dark:inline'>Dark</span>
								<span className='dark:hidden'>Light</span>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{themes.map(t => (
								<SelectItem
									key={t}
									value={t}
									className='capitalize'
								>
									{t}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	)
}
