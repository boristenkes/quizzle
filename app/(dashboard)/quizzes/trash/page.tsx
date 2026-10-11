import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import BackButton from '@/components/utils/back-button'
import { db } from '@/db'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'
import { ArrowLeftIcon, FolderOpenIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import EmptyTrashButton from './empty-trash-button'
import QuizTrashItem from './quiz-trash-item'

export default async function QuizzesTrashPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in')

	const sessionUser = session.user
	const quizzes = await db.query.quizzesTable.findMany({
		where: (table, { eq, and, isNotNull }) =>
			and(eq(table.creatorId, sessionUser.id), isNotNull(table.deletedAt)),
		columns: pickColumns('id', 'slug', 'title', 'deletedAt'),
		orderBy: (table, { desc }) => desc(table.deletedAt)
	})

	return (
		<div className='container mx-auto py-16 px-4 space-y-6'>
			<div className='flex items-start justify-between'>
				<header className='space-y-2'>
					<div className='flex items-center gap-2'>
						<BackButton
							variant='ghost'
							size='icon-lg'
							aria-label='Back'
						>
							<ArrowLeftIcon />
						</BackButton>
						<h1 className='text-4xl font-bold'>Quiz Trash</h1>
					</div>
					<p className='text-muted-foreground'>
						This is where you will find recently deleted quizzes
					</p>
				</header>

				<EmptyTrashButton disabled={quizzes.length === 0} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Deleted Quizzes</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Quiz</TableHead>
								<TableHead>Deletion date</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{quizzes.length === 0 && (
								<TableRow>
									<TableCell colSpan={3}>
										<QuizzesTrashEmpty />
									</TableCell>
								</TableRow>
							)}

							{quizzes.map(quiz => (
								<QuizTrashItem
									key={quiz.id}
									quiz={quiz}
								/>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

function QuizzesTrashEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>Trash Empty</EmptyTitle>
				<EmptyDescription>
					You haven&apos;t deleted any quizzes recently
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent></EmptyContent>
		</Empty>
	)
}
