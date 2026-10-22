import ErrorMessage from '@/components/error-message'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { intFormatter } from '@/utils/format'
import { errorMessage } from '@/utils/helpers'
import { FileTextIcon, TrendingUpIcon, UsersIcon } from 'lucide-react'
import { getUserQuizStats } from '../actions'

export default async function UserQuizStats() {
	const response = await getUserQuizStats()

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	return (
		<div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<FileTextIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight'>
							{intFormatter.format(response.totalQuizzes)}
						</p>
						<p className='text-xs text-muted-foreground'>My Quizzes</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<UsersIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight'>
							{intFormatter.format(response.totalAttempts)}
						</p>
						<p className='text-xs text-muted-foreground'>Total Attempts</p>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<TrendingUpIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight'>
							{response.averageScore.toFixed(2)}%
						</p>
						<p className='text-xs text-muted-foreground'>Average Score</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export function UserQuizStatsSkeleton() {
	return (
		<div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<Skeleton className='size-5' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight mb-2'>
							<Skeleton className='w-8 h-4' />
						</p>
						<p className='text-xs text-muted-foreground'>
							<Skeleton className='w-16 h-2' />
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<Skeleton className='size-5' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight mb-2'>
							<Skeleton className='w-8 h-4' />
						</p>
						<p className='text-xs text-muted-foreground'>
							<Skeleton className='w-16 h-2' />
						</p>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-4 flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-secondary'>
						<Skeleton className='size-5' />
					</div>
					<div>
						<p className='text-xl font-bold leading-tight mb-2'>
							<Skeleton className='w-8 h-4' />
						</p>
						<p className='text-xs text-muted-foreground'>
							<Skeleton className='w-16 h-2' />
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
