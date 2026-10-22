import PersistedTabs from '@/components/persisted-tabs'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSession } from '@/lib/auth'
import {
	BookmarkIcon,
	BookOpenIcon,
	FolderOpenIcon,
	PlayIcon,
	PlusIcon,
	Trash2Icon
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import MyQuizzes from './_components/my-quizzes'
import RecentlyAttempts from './_components/recently-taken-quizzes'
import SavedQuizzes from './_components/saved-quizzes'
import Trash from './_components/trash'
import UserQuizStats, {
	UserQuizStatsSkeleton
} from './_components/user-quiz-stats'

export default async function MyQuizzesPage() {
	const session = await getSession()

	if (!session) redirect('/sign-in?callbackUrl=/quizzes/my')

	return (
		<div className='container mx-auto py-16 px-4 space-y-6'>
			<header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-bold flex items-center gap-4'>
						<BookOpenIcon className='h-8 w-8 text-primary' />
						My Quizzes
					</h1>
					<p className='text-muted-foreground'>
						Manage quizzes you've created and track quizzes you've taken
					</p>
				</div>
				<Button
					nativeButton={false}
					size='lg'
					render={
						<Link href='/quizzes/new'>
							<PlusIcon className='mr-2 h-4 w-4' />
							Create New Quiz
						</Link>
					}
				/>
			</header>

			<Suspense fallback={<UserQuizStatsSkeleton />}>
				<UserQuizStats />
			</Suspense>

			<PersistedTabs defaultValue='created'>
				<TabsList className='grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-indigo-100/10 mb-4'>
					<TabsTrigger value='created'>
						<PlusIcon /> Created
					</TabsTrigger>
					<TabsTrigger value='taken'>
						<PlayIcon />
						Recently Taken
					</TabsTrigger>
					<TabsTrigger value='saved'>
						<BookmarkIcon /> Saved
					</TabsTrigger>
					<TabsTrigger value='trash'>
						<Trash2Icon />
						Trash
					</TabsTrigger>
				</TabsList>

				<TabsContent value='created'>
					<MyQuizzes />
				</TabsContent>

				<TabsContent value='taken'>
					<RecentlyAttempts />
				</TabsContent>

				<TabsContent value='saved'>
					<SavedQuizzes />
				</TabsContent>

				<TabsContent value='trash'>
					<Trash />
				</TabsContent>
			</PersistedTabs>
		</div>
	)
}

export function MyQuizzesEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription className='text-balance'>
					This is where you will find quizzes you created.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
