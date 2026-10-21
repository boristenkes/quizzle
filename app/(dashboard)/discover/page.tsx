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
import DynamicPagination from '@/components/utils/dynamic-pagination'
import { filterQuizzes } from '@/features/quizzes/actions'
import QuizList from '@/features/quizzes/components/quiz-list'
import { getSession } from '@/lib/auth'
import { errorMessage } from '@/utils/helpers'
import { integerSchema } from '@/utils/zod'
import { FilterIcon, Globe } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DiscoverPageFilters from './filters'
import { FilterQuizzesSchema, PAGE_SIZE } from './zod'

export const metadata: Metadata = {
	title: 'Discover'
}

export type DiscoverPageProps = {
	searchParams: Promise<FilterQuizzesSchema>
}

export default async function DisoverPage(props: DiscoverPageProps) {
	const isAuthenticated = await getSession().then(Boolean)

	if (!isAuthenticated) redirect('/sign-in')

	const searchParams = await props.searchParams

	const response = await filterQuizzes(searchParams)
	const currentPage = integerSchema.default(1).parse(searchParams.page)

	const totalPages = response.success
		? Math.ceil(response.totalQuizzes / PAGE_SIZE)
		: 0
	const start = response.success
		? response.totalQuizzes === 0
			? 0
			: (currentPage - 1) * PAGE_SIZE + 1
		: 0
	const end = response.success
		? Math.min(currentPage * PAGE_SIZE, response.totalQuizzes)
		: 0

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
				<p className='text-muted-foreground'>
					Showing {start}-{end} of{' '}
					{response.success ? response.totalQuizzes : 0} quizzes
				</p>
				<div className='text-sm text-muted-foreground'>
					Page {currentPage} of {totalPages}
				</div>
			</div>

			{/* Quiz Grid */}
			{response.success ? (
				<QuizList quizzes={response.quizzes} />
			) : (
				<ErrorMessage message={errorMessage(response.message)} />
			)}

			{/* Pagination */}
			{totalPages > 1 && <DynamicPagination totalPages={totalPages} />}
		</div>
	)
}
