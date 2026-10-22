import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type QuizCardData } from '@/features/quizzes/zod'
import { getDifficultyColor } from '@/utils/format'
import { cn } from '@/utils/helpers'
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

export default function QuizCard({ quiz }: { quiz: QuizCardData }) {
	return (
		<Card className='flex flex-col gap-3'>
			<CardHeader className='grow'>
				<div>
					<div className='flex items-center justify-between gap-4'>
						<Link
							href={`/quizzes/${quiz.slug}/${quiz.id}`}
							className='hover:text-primary transition-colors'
						>
							<CardTitle className='text-lg line-clamp-2'>
								{quiz.title}
							</CardTitle>
						</Link>

						<div className='flex items-start mb-2 gap-2 flex-wrap flex-row-reverse'>
							<div className='flex items-center gap-1 text-sm'>
								<StarIcon className='size-4 fill-yellow-400 text-yellow-400' />
								<span>{quiz.statistics.averageRating.toFixed(2)}</span>
							</div>
							<Badge
								className={cn(
									getDifficultyColor(quiz.difficulty),
									'capitalize'
								)}
								variant='outline'
							>
								{quiz.difficulty}
							</Badge>
							{quiz.category && (
								<Badge variant='outline'>{quiz.category.name}</Badge>
							)}
						</div>
					</div>

					<CardDescription className='line-clamp-2 mt-2'>
						{quiz.description}
					</CardDescription>
					<div className='text-xs text-muted-foreground mt-4'>
						<Link
							href={`/users/${quiz.creator.username}`}
							className='hover:text-indigo-500 font-medium transition-colors inline-flex items-center gap-2'
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
						<span>{quiz.statistics.attemptsCount} attempts</span>
					</div>
					<div className='flex items-center gap-2'>
						<TrendingUpIcon className='size-4 text-muted-foreground' />
						<span>{quiz.statistics.averageScore.toFixed(2)}% avg</span>
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
							<Link href={`/play/${quiz.slug}/${quiz.id}`}>
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
