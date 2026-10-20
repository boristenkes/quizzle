import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { type QuizStatistics } from '@/db/schema'
import { millisToMMSS } from '@/utils/format'
import { BarChart3Icon } from 'lucide-react'

export type QuizStatisticsProps = {
	statistics: QuizStatistics
}

export default function QuizStatistics({ statistics }: QuizStatisticsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<BarChart3Icon className='h-5 w-5 text-primary' />
					Quiz Statistics
				</CardTitle>
				<CardDescription>
					Performance insights from all attempts
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{statistics.averageScore.toFixed(2)}%
						</p>
						<p className='text-sm text-muted-foreground'>Average Score</p>
					</div>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{millisToMMSS(statistics.averageTimeMs)}
						</p>
						<p className='text-sm text-muted-foreground'>Average Time Spent</p>
					</div>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{millisToMMSS(statistics.fastestTimeMs)}
						</p>
						<p className='text-sm text-muted-foreground'>Fastest Completion</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
