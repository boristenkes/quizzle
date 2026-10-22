import ErrorMessage from '@/components/error-message'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import QuizList from '@/features/quizzes/components/quiz-list'
import { errorMessage } from '@/utils/helpers'
import { FolderOpenIcon } from 'lucide-react'
import { getSavedQuizzes } from '../actions'

export default async function SavedQuizzes() {
	const response = await getSavedQuizzes()

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	if (!response.quizzes.length) return <SavedQuizzesEmpty />

	return <QuizList quizzes={response.quizzes} />
}

export function SavedQuizzesEmpty() {
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
