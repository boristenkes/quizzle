import Providers from '@/components/utils/providers'
import { inter } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: {
		default: 'Quizzle',
		template: '%s • Quizzle'
	}
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={inter.className}
			suppressHydrationWarning
		>
			<body className={`${inter.className} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
