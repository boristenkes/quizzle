'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { User } from '@/db/schema'
import { getFollowState, toggleFollow } from '@/features/users/actions'
import { cn } from '@/utils/helpers'
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryResult
} from '@tanstack/react-query'
import { BanIcon } from 'lucide-react'
import { toast } from 'sonner'

export type FollowButtonProps = ButtonProps & {
	currentUserId: User['id']
	targetUserId: User['id']
}

export default function FollowButton({
	currentUserId,
	targetUserId,
	className,
	...props
}: FollowButtonProps) {
	const queryClient = useQueryClient()
	const queryKey = ['follow:state', targetUserId]
	const query = useQuery({
		queryKey,
		queryFn: () => getFollowState(targetUserId)
		// staleTime: 5 * 60 * 1000 // cache for 5min
	})
	const isFollowing = query.data

	const mutation = useMutation({
		mutationKey: ['follow:toggle', targetUserId],
		mutationFn: () => toggleFollow(targetUserId),

		async onMutate() {
			await queryClient.cancelQueries({ queryKey })
			const previousValue = queryClient.getQueryData(queryKey)

			// Optimistically toggle the boolean
			queryClient.setQueryData(queryKey, (prev: boolean) => !prev)

			return { previousValue }
		},

		onSuccess(result) {
			queryClient.setQueryData(queryKey, result)
		},
		onError(_error, _variables, context) {
			queryClient.setQueryData(queryKey, !!context?.previousValue)
			const action = context?.previousValue ? 'unfollow' : 'follow'
			toast.error(`Failed to ${action}. Please try again later`, {
				position: 'top-center'
			})
		}
	})

	if (query.isError) {
		return <ErrorContent error={query.error} />
	}

	return (
		<Button
			size='lg'
			variant={isFollowing ? 'secondary' : 'default'}
			className={cn('px-4', className)}
			disabled={query.isLoading || query.isError}
			onClick={() => mutation.mutate()}
			{...props}
		>
			{query.isLoading ? <Spinner /> : isFollowing ? 'Following' : 'Follow'}
		</Button>
	)
}

function ErrorContent({ error }: { error: UseQueryResult['error'] }) {
	console.error('[FOLLOW_BUTTON]:', error)

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						className='flex items-center gap-2 cursor-not-allowed! opacity-50'
						variant='outline'
					>
						Error <BanIcon className='size-4' />
					</Button>
				}
			/>
			<TooltipContent>
				Unable to load follow status. Please try again later.
			</TooltipContent>
		</Tooltip>
	)
}
