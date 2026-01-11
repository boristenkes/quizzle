import ErrorMessage from '@/components/error-message'
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
import { Textarea } from '@/components/ui/textarea'
import BackButton from '@/components/utils/back-button'
import { getQuizById } from '@/features/quizzes/actions'
import TimeLimit from '@/features/quizzes/components/time-limit'
import { getSession } from '@/lib/auth'
import { dateFormatter, getDifficultyColor } from '@/utils/format'
import {
	ArrowLeftIcon,
	BarChart3Icon,
	BookmarkIcon,
	ClockIcon,
	FileTextIcon,
	MessageSquareIcon,
	PlayCircleIcon,
	Share2Icon,
	StarIcon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
								className={getDifficultyColor('hard')}
								variant='outline'
							>
								{'Hard'}
							</Badge>
							<Badge variant='secondary'>
								{quiz.category ?? 'Computer Science'}
							</Badge>
						</div>
						<h1 className='text-3xl md:text-4xl font-bold mb-4'>
							{quiz.title}
						</h1>
						<p className='text-lg text-muted-foreground mb-6'>
							{quiz.description}
						</p>

						<div className='flex items-center gap-4 mb-6'>
							<Avatar>
								<AvatarImage
									src={quiz.creator.image!}
									alt={quiz.creator.name}
								/>
								<AvatarFallback />
							</Avatar>
							<div>
								<p className='font-medium'>Created by {quiz.creator.name}</p>
								<p className='text-sm text-muted-foreground'>
									{dateFormatter.format(quiz.createdAt)}
								</p>
							</div>
						</div>

						<div className='flex flex-wrap gap-2'>
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
						</div>
					</div>
				</div>

				{/* Start Quiz Card */}
				<Card className='h-fit shadow-elevated'>
					<CardContent className='p-6 space-y-6'>
						<div className='flex items-center gap-2'>
							{[1, 2, 3, 4, 5].map(star => (
								<StarIcon
									key={star}
									className={`h-5 w-5 ${
										star <= Math.round(quiz.averageRating)
											? 'text-yellow-500 fill-yellow-500'
											: 'text-muted'
									}`}
								/>
							))}
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
								{quiz.averageScore}%
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
							<p className='text-sm text-muted-foreground'>
								Fastest Completion
							</p>
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

			{/* Reviews */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<MessageSquareIcon className='h-5 w-5 text-primary' />
						Reviews & Comments
					</CardTitle>
					<CardDescription>
						{quiz.totalReviews} reviews from quiz takers
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Add Review */}
					<div className='space-y-4 pb-6 border-b'>
						<Textarea
							placeholder='Share your experience with this quiz...'
							rows={3}
						/>
						<div className='flex justify-between items-center'>
							<div className='flex items-center gap-1'>
								<span className='text-sm text-muted-foreground mr-2'>
									Your rating:
								</span>
								{[1, 2, 3, 4, 5].map(star => (
									<StarIcon
										key={star}
										className='h-5 w-5 text-muted hover:text-yellow-500 cursor-pointer transition-colors'
									/>
								))}
							</div>
							<Button>Submit Review</Button>
						</div>
					</div>

					{/* Review List */}
					<p>
						<em>* Review list goes here *</em>
					</p>
					{/* <div className='space-y-6'>
						{reviews.map(review => (
							<div
								key={review.id}
								className='space-y-3'
							>
								<div className='flex items-start justify-between'>
									<div className='flex items-center gap-3'>
										<Avatar className='h-10 w-10'>
											<AvatarImage src={review.user.avatar} />
											<AvatarFallback>{review.user.initials}</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-medium'>{review.user.name}</p>
											<div className='flex items-center gap-2'>
												<div className='flex'>
													{[1, 2, 3, 4, 5].map(star => (
														<Star
															key={star}
															className={`h-3 w-3 ${
																star <= review.rating
																	? 'text-yellow-500 fill-yellow-500'
																	: 'text-muted'
															}`}
														/>
													))}
												</div>
												<span className='text-xs text-muted-foreground'>
													{review.date}
												</span>
											</div>
										</div>
									</div>
									<Button
										variant='ghost'
										size='sm'
										className='text-muted-foreground'
									>
										<ThumbsUp className='h-4 w-4 mr-1' />
										{review.likes}
									</Button>
								</div>
								<p className='text-muted-foreground pl-13'>{review.comment}</p>
							</div>
						))}
					</div> */}
				</CardContent>
			</Card>
		</div>
	)
}
