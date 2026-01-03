import { BadgeCheckIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export type VerifiedBadgeProps = React.ComponentProps<typeof Tooltip> & {
	triggerProps?: React.ComponentProps<typeof TooltipTrigger>
	contentProps?: React.ComponentProps<typeof TooltipContent>
}

export default function VerifiedBadge({
	triggerProps,
	contentProps,
	...props
}: VerifiedBadgeProps) {
	return (
		<Tooltip {...props}>
			<TooltipTrigger {...triggerProps}>
				<BadgeCheckIcon className='size-4 text-indigo-500' />
			</TooltipTrigger>
			<TooltipContent {...contentProps}>Verified</TooltipContent>
		</Tooltip>
	)
}
