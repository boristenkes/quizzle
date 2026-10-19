import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import {
	filterQuizzes,
	FilterQuizzesFilters,
	getQuizzes
} from '@/features/quizzes/actions'
import QuizList from '@/features/quizzes/components/quiz-list'
import { getSession } from '@/lib/auth'
import { errorMessage } from '@/utils/helpers'
import { FilterIcon, Globe } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DiscoverPageFilters from './filters'

export const metadata: Metadata = {
	title: 'Discover'
}

export type DiscoverPageProps = {
	searchParams: Promise<FilterQuizzesFilters>
}

export default async function DisoverPage(props: DiscoverPageProps) {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	const searchParams = await props.searchParams

	const response = await (searchParams
		? filterQuizzes(searchParams)
		: getQuizzes())

	return (
		<div className='container mx-auto py-6 px-4 space-y-6'>
			{/* Header */}
			<div className='flex justify-between items-start gap-2'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-bold flex items-center gap-2'>
						<Globe className='h-8 w-8 text-primary' />
						Discover Public Quizzes
					</h1>
					<p className='text-muted-foreground'>
						Explore thousands of quizzes created by our community
					</p>
				</div>

				<Drawer>
					<DrawerTrigger asChild>
						<Button
							variant='outline'
							size='icon-lg'
							className='lg:hidden'
						>
							<FilterIcon className='size-4' />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Filter Quizzes</DrawerTitle>
							<DrawerDescription>
								Filter quizzes by query, category or difficulty
							</DrawerDescription>
						</DrawerHeader>

						<DiscoverPageFilters />
					</DrawerContent>
				</Drawer>
			</div>

			{/* Filters */}
			<Card className='max-lg:hidden'>
				<CardContent>
					<DiscoverPageFilters />
				</CardContent>
			</Card>

			{/* Results Info */}
			<div className='flex items-center justify-between'>
				<p className='text-muted-foreground'>Showing 1-6 of 6 quizzes</p>
				<div className='text-sm text-muted-foreground'>Page 1 of 1</div>
			</div>

			{/* Quiz Grid */}
			{response.success ? (
				<QuizList quizzes={response.quizzes} />
			) : (
				<ErrorMessage message={errorMessage(response.message)} />
			)}

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
