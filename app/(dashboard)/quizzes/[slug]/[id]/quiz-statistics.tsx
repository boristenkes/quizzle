import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BarChart3Icon } from 'lucide-react'

export default function QuizStatistics() {
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
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{/* {quiz.averageScore}% */}
							87%
						</p>
						<p className='text-sm text-muted-foreground'>Average Score</p>
					</div>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{/* {stats.avgTimeSpent} */}
							14:32
						</p>
						<p className='text-sm text-muted-foreground'>Avg Time Spent</p>
					</div>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{/* {stats.fastestTime} */}
							8:45
						</p>
						<p className='text-sm text-muted-foreground'>Fastest Completion</p>
					</div>
					<div className='text-center p-4 bg-secondary rounded-lg'>
						<p className='text-3xl font-bold text-primary'>
							{/* {quiz.completionRate}% */}
							78%
						</p>
						<p className='text-sm text-muted-foreground'>Completion Rate</p>
					</div>
				</div>

				<p>
					<em>* Score Distribution goes here *</em>
				</p>

				{/* <div className='space-y-4'>
						<h4 className='font-semibold'>Score Distribution</h4>
						{stats.scoreDistribution.map(item => (
							<div
								key={item.range}
								className='space-y-1'
							>
								<div className='flex justify-between text-sm'>
									<span>{item.range}</span>
									<span className='text-muted-foreground'>
										{item.count} attempts ({item.percentage}%)
									</span>
								</div>
								<Progress
									value={item.percentage}
									className='h-2'
								/>
							</div>
						))}
					</div> */}

				<p>
					<em>* Easiest and Hardest question goes here *</em>
				</p>
				{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t'>
						<div className='p-4 bg-green-50 dark:bg-green-950/20 rounded-lg'>
							<p className='text-sm text-muted-foreground mb-1'>
								Easiest Question
							</p>
							<p className='font-medium'>{stats.easiestQuestion}</p>
						</div>
						<div className='p-4 bg-red-50 dark:bg-red-950/20 rounded-lg'>
							<p className='text-sm text-muted-foreground mb-1'>
								Hardest Question
							</p>
							<p className='font-medium'>{stats.hardestQuestion}</p>
						</div>
					</div> */}
			</CardContent>
		</Card>
	)
}
