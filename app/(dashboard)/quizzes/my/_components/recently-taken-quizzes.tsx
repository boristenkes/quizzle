import ErrorMessage from '@/components/error-message'
import { Card, CardContent } from '@/components/ui/card'
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'
import { dateFormatter } from '@/utils/format'
import { cn, errorMessage } from '@/utils/helpers'
import { BanIcon, DotIcon, FolderOpenIcon } from 'lucide-react'
import Link from 'next/link'
import { getScoreColor } from '../../results/[attemptId]/page'
import { getRecentAttempts } from '../actions'

export default async function RecentlyAttempts() {
	const response = await getRecentAttempts()

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	if (!response.attempts.length) return <RecentAttemptsEmpty />

	return (
		<ul className='space-y-4'>
			{response.attempts.map(attempt => (
				<Card key={attempt.id}>
					<CardContent className='flex items-center justify-between gap-4'>
						<div className='flex-1 min-w-0'>
							<div>
								<Link
									href={`/quizzes/results/${attempt.id}`}
									className='text-lg font-medium hover:text-primary transition-colors line-clamp-1'
								>
									{attempt.quizData.title}
								</Link>
								{attempt.quiz ? (
									<p className='text-sm text-muted-foreground'>
										by{' '}
										{attempt.quiz && attempt.quiz.creator ? (
											<Link
												href={`/users/${attempt.quiz.creator.username}`}
												className='hover:text-primary hover:underline'
											>
												{attempt.quiz.creator.name}
											</Link>
										) : (
											<em>Deleted User</em>
										)}
										<DotIcon className='inline-block mb-1' />
										{dateFormatter.format(attempt.createdAt)}
									</p>
								) : (
									<p>This quiz has been deleted</p>
								)}
							</div>
							{!attempt.quiz && (
								<p className='flex items-center gap-2 mt-2 text-muted-foreground'>
									<BanIcon className='size-4' /> Original quiz has been deleted
								</p>
							)}
						</div>
						<div className='text-right shrink-0'>
							<p
								className={cn(
									'text-lg font-bold text-primary',
									getScoreColor(attempt.score)
								)}
							>
								{((attempt.score / attempt.maxScore) * 100).toFixed(2)}%
							</p>
							<p className='text-xs text-muted-foreground'>
								{attempt.score} / {attempt.maxScore}
							</p>
						</div>
					</CardContent>
				</Card>
			))}
		</ul>
	)
}

export function RecentAttemptsEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<FolderOpenIcon />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
				<EmptyDescription className='text-balance'>
					This is where you will find your recently taken quizzes.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
