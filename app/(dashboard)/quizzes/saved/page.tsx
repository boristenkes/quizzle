import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import BackButton from '@/components/utils/back-button'
import { db } from '@/db'
import QuizCard from '@/features/quizzes/components/quiz-card'
import {
	averageRatingQuery,
	averageScoreQuery,
	totalAttemptsQuery
} from '@/features/quizzes/queries'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'
import { ArrowLeftIcon, FolderOpenIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function QuizzesSavedPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const currentUser = session.user

	const bookmarks = await db.query.bookmarksTable.findMany({
		where: (table, { eq }) => eq(table.userId, currentUser.id),
		columns: {},
		with: {
			quiz: {
				columns: pickColumns(
					'id',
					'title',
					'slug',
					'description',
					'timeLimitSeconds',
					'questionCount',
					'difficulty'
				),
				with: {
					creator: {
						columns: pickColumns('id', 'username', 'name', 'image')
					},
					category: {
						columns: pickColumns('name')
					}
				},
				extras: {
					averageRating: averageRatingQuery,
					totalAttempts: totalAttemptsQuery,
					averageScore: averageScoreQuery
				}
			}
		},
		orderBy: (table, { desc }) => desc(table.createdAt)
	})

	return (
		<div className='container mx-auto py-16 px-4 space-y-6'>
			<header>
				<div className='flex items-center gap-2'>
					<BackButton
						variant='ghost'
						size='icon-lg'
						aria-label='Back'
					>
						<ArrowLeftIcon />
					</BackButton>
					<h1 className='text-4xl font-bold'>Saved Quizzes</h1>
				</div>
			</header>

			{bookmarks.length > 0 ? (
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
					{bookmarks.map(({ quiz }) => (
						<QuizCard
							key={quiz.id}
							quiz={quiz}
						/>
					))}
				</div>
			) : (
				<QuizzesSavedEmpty />
			)}
		</div>
	)
}

export function QuizzesSavedEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription className='text-balance'>
					This is where you will find your bookmarked quizzes.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
