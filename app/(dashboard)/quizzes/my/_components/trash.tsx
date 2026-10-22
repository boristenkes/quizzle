import {
	Empty,
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
import { FolderOpenIcon } from 'lucide-react'
import { getTrashedQuizzes } from '../actions'
import QuizTrashItem from './quiz-trash-item'

export default async function Trash() {
	const response = await getTrashedQuizzes()

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Quiz</TableHead>
					<TableHead>Deletion date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{response.success ? (
					<>
						{response.quizzes.length === 0 && (
							<TableRow>
								<TableCell colSpan={3}>
									<QuizzesTrashEmpty />
								</TableCell>
							</TableRow>
						)}

						{response.quizzes.map(quiz => (
							<QuizTrashItem
								key={quiz.id}
								quiz={quiz}
							/>
						))}
					</>
				) : (
					<QuizzesTrashEmpty />
				)}
			</TableBody>
		</Table>
	)
}

export function QuizzesTrashEmpty() {
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
		</Empty>
	)
}
