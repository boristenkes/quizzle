import { Logo } from '@/components/logo'
import { ThemeSwitch } from '@/components/theme-switch'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen p-4 bg-linear-to-br from-accent/10 via-secondary/30 to-accent/20'>
			<ThemeSwitch />

			<main className='w-full max-w-md space-y-6 mx-auto py-4'>
				{/* Logo */}
				<div className='flex items-center justify-center gap-4'>
					<Logo className='size-10' />

					<div>
						<h1 className='text-3xl font-bold'>Quizzle</h1>
						<p className='text-muted-foreground'>
							Create and share intelligent quizzes
						</p>
					</div>
				</div>

				{children}
			</main>
		</div>
	)
}
