import { ExternalLinkIcon, SparklesIcon } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='container mx-auto mt-16'>
			<div className='px-6 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand */}
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<div className='h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center'>
								<SparklesIcon className='h-4 w-4 text-white' />
							</div>
							<span className='font-bold text-lg text-foreground'>Quizzle</span>
						</div>
						<p className='text-sm text-muted-foreground'>
							Create, share, and discover AI-powered quizzes.
						</p>
					</div>

					{/* Product */}
					<div className='space-y-3'>
						<h4 className='font-semibold text-foreground'>Product</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='/discover'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Discover
								</Link>
							</li>
							<li>
								<Link
									href='/quizzes/new'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Create Quiz
								</Link>
							</li>
							<li>
								<Link
									href='/'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Dashboard
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div className='space-y-3'>
						<h4 className='font-semibold text-foreground'>Support</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Help Center
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									FAQ
								</a>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className='space-y-3'>
						<h4 className='font-semibold text-foreground'>Legal</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-muted-foreground hover:text-foreground transition-colors'
								>
									Cookie Policy
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-sm text-muted-foreground'>
						&copy; {new Date().getFullYear()} Quizzle. All rights reserved.
					</p>
					<div className='flex items-center gap-4'>
						<p className='text-sm text-muted-foreground'>
							Created by{' '}
							<a
								href='https://boristenkes.com'
								target='_blank'
								className='inline-flex items-start gap-1 hover:underline underline-offset-2'
							>
								Boris Tenkeš
								<ExternalLinkIcon className='size-3.5' />
							</a>
						</p>
						<a
							href='https://github.com/boristenkes/quizzle'
							target='_blank'
							className='text-muted-foreground hover:text-foreground transition-colors'
						>
							<svg
								className='h-5 w-5'
								fill='currentColor'
								viewBox='0 0 24 24'
							>
								<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
