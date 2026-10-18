import React from 'react'

export type LogoProps = React.ComponentProps<'svg'>

export function Logo(props: LogoProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='32'
			height='32'
			viewBox='0 0 32 32'
			{...props}
		>
			<rect
				width='32'
				height='32'
				fill='#6366f1'
				rx='8'
			></rect>
			<g
				fill='none'
				stroke='#fff'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				transform='matrix(.66667 0 0 .66667 8 8)'
			>
				<path d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4M22 4h-4'></path>
				<circle
					cx='4'
					cy='20'
					r='2'
				></circle>
			</g>
		</svg>
	)
}

export type LogoWithTextProps = React.ComponentProps<'svg'>

export function LogoWithText(props: LogoWithTextProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='132'
			height='32'
			fill='none'
			viewBox='0 0 132 32'
			{...props}
		>
			<rect
				width='32'
				height='32'
				fill='#6366f1'
				rx='8'
			></rect>
			<g
				stroke='#fff'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				transform='matrix(.66667 0 0 .66667 8 8)'
			>
				<path d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4M22 4h-4'></path>
				<circle
					cx='4'
					cy='20'
					r='2'
				></circle>
			</g>
			<text
				x='40'
				y='23'
				fill='currentColor'
				fontFamily='Arial, Helvetica, sans-serif'
				fontSize='20'
				fontWeight='700'
			>
				Quizzle
			</text>
		</svg>
	)
}
