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
import { getCategories } from '@/features/categories/actions'
import CategoryCombobox from '@/features/quizzes/components/category-combobox'
import { getSession } from '@/lib/auth'
import { difficulties } from '@/lib/constants'
import { Filter, Globe, SearchIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import QuizList, { QuizListSkeleton } from './quiz-list'

export const metadata: Metadata = {
	title: 'Discover'
}

export default async function DisoverPage() {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	const categories = await getCategories()

	return (
		<div className='container mx-auto py-6 px-4 space-y-6'>
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

						{/* @ts-ignore TODO */}
						<CategoryCombobox categories={categories} />
						{/* <Select>
							<SelectTrigger>
								<SelectValue>Category</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{categories.map(category => (
									<SelectItem
										key={category.id}
										value={category.id}
									>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select> */}

						<Select>
							<SelectTrigger>
								<SelectValue>Difficulty</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{difficulties.map(difficulty => (
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
			<Suspense fallback={<QuizListSkeleton />}>
				<QuizList />
			</Suspense>

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
