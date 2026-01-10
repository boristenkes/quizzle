import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Quiz } from '@/db/schema'
import { getDifficultyColor } from '@/utils/format'
import {
	ClockIcon,
	FileTextIcon,
	PlayCircle,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import TimeLimit from './time-limit'

export type UserQuizListProps = {
	quizzes: (Quiz & {
		averageRating: number
		totalAttempts: number
		averageScore: number
	})[]
}

export default function UserQuizList({ quizzes }: UserQuizListProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
			{quizzes.map(quiz => (
				<Card key={quiz.id}>
					<CardHeader className='pb-3'>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<Link
									href={`/quizzes/${quiz.slug}/${quiz.id}`}
									className='hover:text-indigo-500 transition-colors'
								>
									<CardTitle className='text-lg line-clamp-1'>
										{quiz.title}
									</CardTitle>
								</Link>
								<CardDescription className='line-clamp-2 mt-1'>
									{quiz.description}
								</CardDescription>
							</div>
							<Badge
								className={getDifficultyColor('hard')}
								variant='outline'
							>
								{'Hard'}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className='space-y-4 flex flex-col justify-end h-full'>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div className='flex items-center gap-2'>
								<FileTextIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.questionCount} questions</span>
							</div>
							<div className='flex items-center gap-2'>
								<ClockIcon className='h-4 w-4 text-muted-foreground' />
								<TimeLimit limit={quiz.timeLimitSeconds} />
							</div>
							<div className='flex items-center gap-2'>
								<UsersIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.totalAttempts} attempts</span>
							</div>
							<div className='flex items-center gap-2'>
								<TrendingUpIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.averageScore}% avg</span>
							</div>
						</div>

						<div className='flex gap-2 pt-2'>
							<Button
								size='sm'
								className='flex-1'
								nativeButton={false}
								render={
									<Link href={`/quizzes/${quiz.id}/play`}>
										<PlayCircle className='mr-2 h-4 w-4' />
										Take Quiz
									</Link>
								}
							/>
							<Button
								variant='outline'
								size='sm'
								nativeButton={false}
								render={<Link href={`/quizzes/${quiz.id}/edit`}>Edit</Link>}
							/>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
