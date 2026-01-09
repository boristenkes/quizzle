import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { GetQuizzesQuiz } from '@/features/quizzes/actions'
import {
	ClockIcon,
	FileTextIcon,
	PlayCircleIcon,
	StarIcon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import TimeLimit from './time-limit'

export default function QuizCard({ quiz }: { quiz: GetQuizzesQuiz }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<div>
						<Link
							href={`/quizzes/${quiz.id}`}
							className='hover:text-primary transition-colors'
						>
							<CardTitle className='text-lg line-clamp-2'>
								{quiz.title}
							</CardTitle>
							<CardDescription className='line-clamp-2'>
								{quiz.description}
							</CardDescription>
						</Link>
						<div className='text-xs text-muted-foreground mt-2'>
							<Link
								href={`/users/${quiz.creator.id}`}
								className='hover:text-indigo-500 hover:underline transition-colors inline-flex items-center gap-2'
							>
								<Avatar size='sm'>
									<AvatarImage
										src={quiz.creator.image!}
										alt={quiz.creator.name}
									/>
									<AvatarFallback />
								</Avatar>
								{quiz.creator.name}
							</Link>
						</div>
					</div>
					<div className='flex items-center gap-1 text-sm'>
						<StarIcon className='size-4 fill-yellow-400 text-yellow-400' />
						<span>4.5</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className='flex flex-col gap-4 h-full'>
				<div className='grid grid-cols-2 gap-3 text-sm'>
					<div className='flex items-center gap-2'>
						<FileTextIcon className='size-4 text-muted-foreground' />
						<span>{quiz.questionCount} questions</span>
					</div>
					<div className='flex items-center gap-2'>
						<ClockIcon className='size-4 text-muted-foreground' />
						<span>
							<TimeLimit limit={quiz.timeLimitSeconds} />
						</span>
					</div>
					<div className='flex items-center gap-2'>
						<UsersIcon className='size-4 text-muted-foreground' />
						<span>15,420 attempts</span>
					</div>
					<div className='flex items-center gap-2'>
						<TrendingUpIcon className='size-4 text-muted-foreground' />
						<span>73% avg</span>
					</div>
				</div>

				<div className='flex gap-2 grow items-end'>
					<Button
						variant='outline'
						size='sm'
						nativeButton={false}
						render={<Link href={`/quizzes/${quiz.id}`}>View Details</Link>}
					/>

					<Button
						size='sm'
						className='flex-1'
						nativeButton={false}
						render={
							<Link href={`/quiz/${quiz.id}/play`}>
								<PlayCircleIcon className='mr-2 size-4' />
								Start Quiz
							</Link>
						}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
