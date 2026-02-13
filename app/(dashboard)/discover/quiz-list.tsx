import ErrorMessage from '@/components/error-message'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import {
	filterQuizzes,
	FilterQuizzesFilters,
	getQuizzes
} from '@/features/quizzes/actions'
import QuizCard, {
	QuizCardSkeleton
} from '@/features/quizzes/components/quiz-card'
import { cn } from '@/utils/helpers'
import { FolderOpenIcon } from 'lucide-react'

export type QuizListProps = React.HTMLAttributes<HTMLElement> & {
	filters?: FilterQuizzesFilters
}

export default async function QuizList({
	className,
	filters,
	...props
}: QuizListProps) {
	const response = await (filters ? filterQuizzes(filters) : getQuizzes())

	if (!response.success)
		return (
			<ErrorMessage
				message={
					response.message ?? 'Something went wrong. Please try again later'
				}
			/>
		)

	if (response.quizzes.length === 0) return <QuizListEmptyState />

	return (
		<div
			className={cn(
				'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6',
				className
			)}
			{...props}
		>
			{response.quizzes.map(quiz => (
				<QuizCard
					key={quiz.id}
					quiz={quiz}
				/>
			))}
		</div>
	)
}

export function QuizListEmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription className='text-balance'>
					We couldn&apos;t find any quizzes that match your filters. <br />
					Try adjusting your filters to be less strict.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}

export function QuizListSkeleton({ itemCount = 6 }) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{Array.from({ length: itemCount }).map((_, idx) => (
				<QuizCardSkeleton key={idx} />
			))}
		</div>
	)
}
