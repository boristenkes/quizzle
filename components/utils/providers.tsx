'use client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

export const queryClient = new QueryClient()

export type ProvidersProps = { children: React.ReactNode }

export default function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				<TooltipProvider>
					{children}

					<Toaster
						theme='light'
						richColors
					/>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
