import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getDifficultyColor } from '@/utils/format'
import { cn } from '@/utils/helpers'
import {
	ClockIcon,
	FileTextIcon,
	PlayCircle,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import { GetUserQuizzesQuiz } from '../actions'
import TimeLimit from './time-limit'

export type UserQuizListProps = {
	quizzes: GetUserQuizzesQuiz[]
}

export default function UserQuizList({ quizzes }: UserQuizListProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
			{quizzes.map(quiz => (
				<Card key={quiz.id}>
					<CardHeader className='pb-3'>
						<div className='flex items-start justify-between gap-2'>
							<div className='grow'>
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
							{quiz.category && (
								<Badge variant='outline'>{quiz.category.name}</Badge>
							)}
							<Badge
								className={cn(
									getDifficultyColor(quiz.difficulty),
									'capitalize'
								)}
								variant='outline'
							>
								{quiz.difficulty}
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
