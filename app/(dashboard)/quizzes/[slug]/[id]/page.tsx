import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BackButton from '@/components/utils/back-button'
import RatingStars from '@/components/utils/rating-stars'
import { db } from '@/db'
import { getQuizById } from '@/features/quizzes/actions'
import BookmarkButton from '@/features/quizzes/components/bookmark-button'
import MoveToTrashButton from '@/features/quizzes/components/move-to-trash-button'
import ShareQuizDialog from '@/features/quizzes/components/share-quiz-dialog'
import TimeLimit from '@/features/quizzes/components/time-limit'
import { getSession } from '@/lib/auth'
import { dateFormatter, getDifficultyColor } from '@/utils/format'
import { absoluteUrl, cn, errorMessage, pickColumns } from '@/utils/helpers'
import {
	ArrowLeftIcon,
	ClockIcon,
	FileTextIcon,
	PlayCircleIcon,
	Share2Icon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import QuizDangerZone from './quiz-danger-zone'
import QuizReviews from './quiz-reviews'
import QuizStatistics from './quiz-statistics'

export type QuizDetailsPageProps = {
	params: Promise<{ slug: string; id: string }>
}

export async function generateMetadata({
	params
}: QuizDetailsPageProps): Promise<Metadata> {
	const { slug, id } = await params
	const pathname = `/quizzes/${slug}/${id}`

	const quiz = await db.query.quizzesTable.findFirst({
		where: (table, { eq }) => eq(table.id, id),
		columns: pickColumns('title', 'description')
	})

	if (!quiz) notFound()

	return {
		title: quiz.title,
		description: quiz.description,
		openGraph: {
			title: quiz.title,
			description: quiz.description,
			url: absoluteUrl(pathname)
		},
		twitter: {
			title: quiz.title,
			description: quiz.description
		},
		metadataBase: new URL(absoluteUrl(pathname))
	}
}

export default async function QuizDetailsPage({
	params
}: QuizDetailsPageProps) {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const { slug, id } = await params
	const sessionUser = session.user
	const response = await getQuizById(id)

	if (!response.success) {
		return (
			<ErrorMessage
				message={errorMessage(response.message)}
				className='container m-6'
			/>
		)
	}

	const { quiz } = response

	return (
		<div className='container mx-auto py-6 px-4 space-y-8 max-w-6xl'>
			<BackButton
				variant='ghost'
				className='mb-4'
			>
				<ArrowLeftIcon className='mr-2 size-4' />
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
							<Link href={`/users/${quiz.creator.username}`}>
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
										href={`/users/${quiz.creator.username}`}
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
					<CardContent className='px-6 space-y-6'>
						<div className='flex items-center gap-2'>
							<RatingStars rating={quiz.statistics!.averageRating} />
							<span className='font-semibold'>
								{quiz.statistics!.averageRating}
							</span>
							<span className='text-muted-foreground'>
								({quiz.statistics!.reviewsCount} ratings)
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
								<span>{quiz.statistics!.reviewsCount} attempts</span>
							</div>
							<div className='flex items-center gap-2'>
								<TrendingUpIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.statistics!.averageScore}% avg</span>
							</div>
						</div>

						<div className='space-y-2'>
							<Button
								className='w-full'
								size='lg'
								nativeButton={false}
								render={
									<Link href={`/play/${slug}/${id}`}>
										<PlayCircleIcon className='mr-2 size-5' />
										Start Quiz
									</Link>
								}
							/>

							<div className='flex gap-2'>
								{quiz.creator.id === sessionUser.id ? (
									<MoveToTrashButton
										quizId={quiz.id}
										className='flex-1'
									/>
								) : (
									<BookmarkButton
										quizId={quiz.id}
										initialIsBookmarked={quiz.isBookmarked}
										className='flex-1'
									/>
								)}

								<ShareQuizDialog
									url={absoluteUrl(`/quizzes/${quiz.slug}/${quiz.id}`)}
									quizTitle={quiz.title}
								>
									<Button
										variant='outline'
										className='flex-1'
									>
										<Share2Icon className='size-4 mr-2' />
										Share
									</Button>
								</ShareQuizDialog>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Statistics */}
			<QuizStatistics statistics={quiz.statistics!} />

			{/* Reviews */}
			<QuizReviews
				quizId={quiz.id}
				totalReviews={quiz.statistics!.reviewsCount}
			/>

			{quiz.creator.id === sessionUser.id && (
				<QuizDangerZone quizId={quiz.id} />
			)}
		</div>
	)
}
