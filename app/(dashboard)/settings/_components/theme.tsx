'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/utils/helpers'
import { MonitorIcon, MoonIcon, PaletteIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

const themeOptions = [
	{ value: 'light', label: 'Light', icon: SunIcon },
	{ value: 'dark', label: 'Dark', icon: MoonIcon },
	{ value: 'system', label: 'System', icon: MonitorIcon }
] as const

export default function Theme() {
	const { theme, setTheme } = useTheme()
	const mounted = useIsMounted()

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<PaletteIcon className='h-5 w-5' />
					Theme
				</CardTitle>
				<CardDescription>Customize the look and feel</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label>Color Theme</Label>

					<div className='grid grid-cols-3 gap-3'>
						{themeOptions.map(option => {
							const Icon = option.icon
							const isSelected = mounted && theme === option.value

							return (
								<button
									key={option.value}
									type='button'
									onClick={() => setTheme(option.value)}
									aria-pressed={isSelected}
									className={cn(
										'group min-w-0 rounded-lg border-2 p-2 text-left transition-colors',
										'hover:bg-accent/50',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
										isSelected
											? 'border-primary bg-accent/50'
											: 'border-transparent bg-muted/50 hover:border-border'
									)}
								>
									<ThemePreview theme={option.value} />

									<div className='mt-2 flex items-center justify-center gap-1.5'>
										<Icon className='size-4 shrink-0 text-muted-foreground' />
										<span className='text-sm font-medium'>{option.label}</span>
									</div>
								</button>
							)
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function PreviewContent({ dark }: { dark: boolean }) {
	return (
		<div
			className={cn(
				'flex h-full w-full flex-col gap-2 p-2',
				dark ? 'bg-zinc-950' : 'bg-zinc-100'
			)}
		>
			{/* Navbar */}
			<div className='flex items-center justify-between'>
				<div
					className={cn(
						'h-1.5 w-6 rounded-full',
						dark ? 'bg-zinc-500' : 'bg-zinc-400'
					)}
				/>
				<div className='flex gap-1'>
					<div
						className={cn(
							'h-1.5 w-2 rounded-full',
							dark ? 'bg-zinc-600' : 'bg-zinc-300'
						)}
					/>
					<div
						className={cn(
							'h-1.5 w-2 rounded-full',
							dark ? 'bg-zinc-600' : 'bg-zinc-300'
						)}
					/>
				</div>
			</div>

			{/* Main content */}
			<div
				className={cn(
					'flex flex-1 flex-col rounded-sm border p-1.5',
					dark ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-200 bg-white'
				)}
			>
				<div
					className={cn(
						'h-1.5 w-2/3 rounded-full',
						dark ? 'bg-zinc-600' : 'bg-zinc-200'
					)}
				/>

				<div className='mt-2 flex gap-1'>
					<div
						className={cn(
							'h-5 flex-1 rounded-sm',
							dark ? 'bg-zinc-700' : 'bg-zinc-100'
						)}
					/>
					<div
						className={cn(
							'h-5 flex-1 rounded-sm',
							dark ? 'bg-zinc-700' : 'bg-zinc-100'
						)}
					/>
				</div>
			</div>

			{/* Footer */}
			<div className='flex gap-1'>
				<div
					className={cn(
						'h-1 w-1/3 rounded-full',
						dark ? 'bg-zinc-600' : 'bg-zinc-300'
					)}
				/>
				<div
					className={cn(
						'h-1 w-1/4 rounded-full',
						dark ? 'bg-zinc-600' : 'bg-zinc-300'
					)}
				/>
			</div>
		</div>
	)
}

function ThemePreview({ theme }: { theme: 'light' | 'dark' | 'system' }) {
	const isSystem = theme === 'system'
	const isDark = theme === 'dark'

	return (
		<div className='relative aspect-[1.55] w-full overflow-hidden rounded-md border'>
			{/* Base preview */}
			<PreviewContent dark={isDark} />

			{/* Dark overlay for system theme */}
			{isSystem && (
				<div
					className='absolute inset-0'
					style={{
						clipPath: 'polygon(72% 0, 100% 0, 100% 100%, 28% 100%)'
					}}
				>
					<PreviewContent dark />
				</div>
			)}
		</div>
	)
}
