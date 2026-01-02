'use client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export type ProvidersProps = { children: React.ReactNode }

export default function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				{children}

				<Toaster
					theme='light'
					richColors
				/>
			</TooltipProvider>
		</QueryClientProvider>
	)
}
