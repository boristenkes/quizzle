'use client'

import { cn } from '@/utils/helpers'
import { HeartIcon, StarIcon, ThumbsUpIcon } from 'lucide-react'
import React, { forwardRef, useState } from 'react'

const iconMap = {
	star: StarIcon,
	heart: HeartIcon,
	thumbsUp: ThumbsUpIcon
} as const

const sizeMap = {
	sm: 'size-5',
	md: 'size-6',
	lg: 'size-8'
} as const

export type RatingProps = React.HTMLAttributes<HTMLDivElement> & {
	value: number
	onChange?: (value: number) => void
	max?: number
	icon?: keyof typeof iconMap
	size?: keyof typeof sizeMap
	readOnly?: boolean
}

export const RatingInput = forwardRef<HTMLDivElement, RatingProps>(
	(
		{
			value,
			onChange,
			max = 5,
			icon = 'star',
			size = 'md',
			readOnly = false,
			className,
			...props
		},
		ref
	) => {
		const [hoverValue, setHoverValue] = useState<number | null>(null)
		const Icon = iconMap[icon]

		const handleMouseEnter = (index: number) => {
			if (!readOnly) {
				setHoverValue(index)
			}
		}

		const handleMouseLeave = () => {
			setHoverValue(null)
		}

		const handleClick = (index: number) => {
			if (!readOnly && onChange) {
				onChange(index)
			}
		}

		return (
			<div
				ref={ref}
				className={cn('flex items-center', className)}
				{...props}
			>
				{[...Array(max)].map((_, index) => {
					const filled = (hoverValue !== null ? hoverValue : value) > index

					return (
						<Icon
							key={index}
							className={cn(
								sizeMap[size],
								'cursor-pointer transition-colors',
								filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300',
								readOnly && 'cursor-default opacity-50'
							)}
							onMouseEnter={() => handleMouseEnter(index + 1)}
							onMouseLeave={handleMouseLeave}
							onClick={() => handleClick(index + 1)}
							aria-hidden={readOnly}
							role={readOnly ? undefined : 'button'}
							tabIndex={readOnly ? -1 : 0}
							aria-label={`Rate ${index + 1} out of ${max}`}
						/>
					)
				})}
			</div>
		)
	}
)

RatingInput.displayName = 'RatingInput'
