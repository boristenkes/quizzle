import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/ui/input-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { getQuizzes } from '@/features/quizzes/actions'
import QuizCard from '@/features/quizzes/components/quiz-card'
import { getSession } from '@/lib/auth'
import { questionDifficulties } from '@/lib/constants'
import { Filter, Globe, SearchIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DisoverPage() {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	const response = await getQuizzes()

	if (!response.success)
		return (
			<ErrorMessage
				message={response.message ?? 'Failed to fetch quizzes'}
				className='my-6 ml-6'
			/>
		)

	const { quizzes } = response

	return (
		<div className='container mx-auto p-6 space-y-6'>
			{/* Header */}
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold flex items-center gap-2'>
					<Globe className='h-8 w-8 text-primary' />
					Discover Public Quizzes
				</h1>
				<p className='text-muted-foreground'>
					Explore thousands of quizzes created by our community
				</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent>
					<div className='flex gap-4'>
						<InputGroup>
							<InputGroupAddon>
								<SearchIcon className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								placeholder='Search quizzes...'
								className='pl-9'
							/>
						</InputGroup>

						<Select>
							<SelectTrigger>
								<SelectValue>Category</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{['Programming', 'Science', 'Mathematics'].map(category => (
									<SelectItem
										key={category}
										value={category.toLowerCase()}
									>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select>
							<SelectTrigger>
								<SelectValue>Difficulty</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{questionDifficulties.map(difficulty => (
									<SelectItem
										key={difficulty}
										value={difficulty.toLowerCase()}
										className='capitalize'
									>
										{difficulty}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant='outline'
							className='flex items-center gap-2 grow h-auto'
						>
							<Filter className='size-4' />
							More Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Results Info */}
			<div className='flex items-center justify-between'>
				<p className='text-muted-foreground'>Showing 1-6 of 6 quizzes</p>
				<div className='text-sm text-muted-foreground'>Page 1 of 1</div>
			</div>

			{/* Quiz Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{quizzes.map(quiz => (
					<QuizCard
						key={quiz.id}
						quiz={quiz}
					/>
				))}
			</div>

			{/* Pagination */}
			<p>
				<em>* Pagination goes here *</em>
			</p>
			{/* {totalPages > 1 && (
				<div className='flex items-center justify-center gap-2 mt-8'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className='size-4' />
						Previous
					</Button>

					<div className='flex gap-1'>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
							<Button
								key={page}
								variant={currentPage === page ? 'default' : 'outline'}
								size='sm'
								onClick={() => setCurrentPage(page)}
								className='w-10'
							>
								{page}
							</Button>
						))}
					</div>

					<Button
						variant='outline'
						size='sm'
						onClick={() =>
							setCurrentPage(Math.min(totalPages, currentPage + 1))
						}
						disabled={currentPage === totalPages}
					>
						Next
						<ChevronRight className='size-4' />
					</Button>
				</div>
			)} */}
		</div>
	)
}
