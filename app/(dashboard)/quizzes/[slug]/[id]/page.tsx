import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BackButton from '@/components/utils/back-button'
import RatingStars from '@/components/utils/rating-stars'
import { getQuizById } from '@/features/quizzes/actions'
import TimeLimit from '@/features/quizzes/components/time-limit'
import { getSession } from '@/lib/auth'
import { dateFormatter, getDifficultyColor } from '@/utils/format'
import { cn } from '@/utils/helpers'
import {
	ArrowLeftIcon,
	BookmarkIcon,
	ClockIcon,
	FileTextIcon,
	PlayCircleIcon,
	Share2Icon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import QuizReviews from './quiz-reviews'
import QuizStatistics from './quiz-statistics'

export type QuizDetailsPageProps = {
	params: Promise<{ slug: string; id: string }>
}

export default async function QuizDetailsPage({
	params
}: QuizDetailsPageProps) {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const { slug, id } = await params
	const response = await getQuizById(id)

	if (!response.success) {
		return (
			<ErrorMessage
				message={
					response.message ?? 'Something went wrong. Please try again later.'
				}
				className='container m-6'
			/>
		)
	}

	const { quiz } = response

	return (
		<div className='container mx-auto p-6 space-y-8 max-w-6xl'>
			{/* Back Button */}
			<BackButton
				variant='ghost'
				className='mb-4'
			>
				<ArrowLeftIcon className='mr-2 h-4 w-4' />
				Back
			</BackButton>

			{/* Quiz Header */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2 space-y-6'>
					<div>
						<div className='flex items-center gap-3 mb-4'>
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
								<Badge variant='secondary'>{quiz.category.name}</Badge>
							)}
						</div>
						<h1 className='text-3xl md:text-4xl font-bold mb-4'>
							{quiz.title}
						</h1>
						<p className='text-lg text-muted-foreground mb-6'>
							{quiz.description}
						</p>

						<div className='flex items-center gap-4 mb-6'>
							<Link href={`/users/${quiz.creator.id}`}>
								<Avatar>
									<AvatarImage
										src={quiz.creator.image!}
										alt={quiz.creator.name}
									/>
									<AvatarFallback />
								</Avatar>
							</Link>
							<div>
								<p className='font-medium'>
									Created by{' '}
									<Link
										href={`/users/${quiz.creator.id}`}
										className='hover:underline underline-offset-2'
									>
										{quiz.creator.name}
									</Link>
								</p>
								<p className='text-sm text-muted-foreground'>
									{dateFormatter.format(quiz.createdAt)}
								</p>
							</div>
						</div>

						<p>
							<em>* Tag list goes here (maybe) *</em>
						</p>
						{/* <div className='flex flex-wrap gap-2'>
							{(quiz.topics ?? ['Variables', 'Functions', 'Closures']).map(
								(topic: string) => (
									<Badge
										key={topic}
										variant='outline'
										className='text-xs'
									>
										{topic}
									</Badge>
								)
							)}
						</div> */}
					</div>
				</div>

				{/* Start Quiz Card */}
				<Card className='h-fit shadow-elevated'>
					<CardContent className='p-6 space-y-6'>
						<div className='flex items-center gap-2'>
							<RatingStars rating={quiz.averageRating} />
							<span className='font-semibold'>{quiz.averageRating}</span>
							<span className='text-muted-foreground'>
								({quiz.totalReviews} ratings)
							</span>
						</div>

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

						<Button
							className='w-full'
							size='lg'
							nativeButton={false}
							render={
								<Link href={`/quiz/${id}/play`}>
									<PlayCircleIcon className='mr-2 h-5 w-5' />
									Start Quiz
								</Link>
							}
						/>

						<div className='flex gap-2'>
							<Button
								variant='outline'
								className='flex-1'
							>
								<BookmarkIcon className='mr-2 h-4 w-4' />
								Save
							</Button>
							<Button
								variant='outline'
								className='flex-1'
							>
								<Share2Icon className='mr-2 h-4 w-4' />
								Share
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Statistics */}
			<QuizStatistics />

			{/* Reviews */}
			<QuizReviews totalReviews={quiz.totalReviews} />
		</div>
	)
}
