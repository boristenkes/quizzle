import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
		<Card className='flex flex-col gap-3'>
			<CardHeader className='grow'>
				<div className='flex items-start justify-between gap-2'>
					<div>
						<Link
							href={`/quizzes/${quiz.slug}/${quiz.id}`}
							className='hover:text-primary transition-colors space-y-2'
						>
							<CardTitle className='text-lg line-clamp-2'>
								{quiz.title}
							</CardTitle>
							<CardDescription className='line-clamp-2'>
								{quiz.description}
							</CardDescription>
						</Link>
						<div className='text-xs text-muted-foreground mt-4'>
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
						<span>{quiz.averageRating}</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
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
						<span>{quiz.totalAttempts} attempts</span>
					</div>
					<div className='flex items-center gap-2'>
						<TrendingUpIcon className='size-4 text-muted-foreground' />
						<span>{quiz.averageScore}% avg</span>
					</div>
				</div>

				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						nativeButton={false}
						render={
							<Link href={`/quizzes/${quiz.slug}/${quiz.id}`}>
								View Details
							</Link>
						}
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

export function QuizCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<div>
						<div className='hover:text-primary transition-colors'>
							{/* Title */}
							<Skeleton className='w-80 h-7 rounded-lg mb-2' />

							{/* Description */}
							<Skeleton className='w-96 h-4 rounded-lg mb-1' />
							<Skeleton className='w-72 h-4 rounded-lg' />
						</div>
						<div className='text-xs text-muted-foreground mt-2'>
							<div className='inline-flex items-center gap-2'>
								{/* Avatar */}
								<Skeleton className='size-6 rounded-full' />
								{/* Creator name */}
								<Skeleton className='w-14 h-4 rounded-lg' />
							</div>
						</div>
					</div>
					{/* Rating */}
					<Skeleton className='w-10 h-5 rounded-lg' />
				</div>
			</CardHeader>
			<CardContent className='flex flex-col gap-4 h-full'>
				{/* Statistics */}
				<div className='grid grid-cols-2 gap-3 text-sm'>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-4 rounded-lg' />
						<Skeleton className='w-21.25 h-5 rounded-lg' />
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-4 rounded-lg' />
						<Skeleton className='w-21.25 h-5 rounded-lg' />
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-4 rounded-lg' />
						<Skeleton className='w-21.25 h-5 rounded-lg' />
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-4 rounded-lg' />
						<Skeleton className='w-21.25 h-5 rounded-lg' />
					</div>
				</div>

				{/* Action buttons */}
				<div className='flex gap-2 grow items-end'>
					<Skeleton className='h-8 rounded-lg basis-1/4' />
					<Skeleton className='h-8 rounded-lg flex-1' />
				</div>
			</CardContent>
		</Card>
	)
}
