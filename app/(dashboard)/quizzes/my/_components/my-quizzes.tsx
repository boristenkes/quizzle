import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import TimeLimit from '@/features/quizzes/components/time-limit'
import { getDifficultyColor } from '@/utils/format'
import { cn, errorMessage } from '@/utils/helpers'
import {
	BarChart3Icon,
	ClockIcon,
	EyeIcon,
	FileTextIcon,
	GlobeIcon,
	LockIcon,
	MoreVerticalIcon,
	PencilIcon,
	PlayCircleIcon,
	Trash2Icon,
	TrendingUpIcon,
	UsersIcon
} from 'lucide-react'
import Link from 'next/link'
import { getMyQuizzes } from '../actions'

export default async function MyQuizzes() {
	const response = await getMyQuizzes()

	if (!response.success)
		return <ErrorMessage message={errorMessage(response.message)} />

	if (!response.quizzes.length)
		return (
			<p className='text-center py-16'>
				This where you will find quizzes you created.
			</p>
		)

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{response.quizzes.map(quiz => (
				<Card
					key={quiz.id}
					className='hover:shadow-lg transition-all duration-300'
				>
					<CardHeader>
						<div className='flex items-start justify-between gap-4'>
							<div className='space-y-2'>
								<Link
									href={`/quizzes/${quiz.slug}/${quiz.id}`}
									className='hover:text-primary transition-colors'
								>
									<CardTitle className='text-lg line-clamp-2'>
										{quiz.title}
									</CardTitle>
								</Link>
								<CardDescription className='line-clamp-2'>
									{quiz.description}
								</CardDescription>
								<div className='flex items-center gap-3 text-xs text-muted-foreground flex-wrap'>
									<span className='flex items-center gap-1'>
										{quiz.isPublic ? (
											<GlobeIcon className='h-3 w-3' />
										) : (
											<LockIcon className='h-3 w-3' />
										)}
										{quiz.isPublic ? 'Public' : 'Private'}
									</span>

									{quiz.category && (
										<Badge variant='outline'>{quiz.category.name}</Badge>
									)}

									<Badge
										className={cn(
											getDifficultyColor(quiz.difficulty),
											'capitalize'
										)}
										variant='outline'
									>
										{quiz.difficulty}
									</Badge>
								</div>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8'
											aria-label={`Actions for ${quiz.title}`}
										>
											<MoreVerticalIcon className='h-4 w-4' />
										</Button>
									}
								/>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										render={
											<Link
												href={`/quizzes/${quiz.slug}/${quiz.id}`}
												className='flex items-center gap-2'
											>
												<EyeIcon className='h-4 w-4' /> View Details
											</Link>
										}
									/>
									<DropdownMenuItem
										render={
											<Link
												href={`/create?edit=${quiz.id}`}
												className='flex items-center gap-2'
											>
												<PencilIcon className='h-4 w-4' /> Edit
											</Link>
										}
									/>
									<DropdownMenuItem
										render={
											<Link
												href={`/analytics`}
												className='flex items-center gap-2'
											>
												<BarChart3Icon className='h-4 w-4' /> Analytics
											</Link>
										}
									/>
									<DropdownMenuItem className='text-destructive focus:text-destructive'>
										<Trash2Icon className='h-4 w-4 mr-2' /> Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardHeader>

					<CardContent className='space-y-4'>
						<div className='grid grid-cols-2 gap-3 text-sm'>
							<div className='flex items-center gap-2'>
								<FileTextIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.questionCount} questions</span>
							</div>
							<div className='flex items-center gap-2'>
								<ClockIcon className='h-4 w-4 text-muted-foreground' />
								<span>
									<TimeLimit limit={quiz.timeLimitSeconds} />
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<UsersIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.statistics.attemptsCount} attempts</span>
							</div>
							<div className='flex items-center gap-2'>
								<TrendingUpIcon className='h-4 w-4 text-muted-foreground' />
								<span>{quiz.statistics.averageScore}% avg</span>
							</div>
						</div>

						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								className='flex-1'
								nativeButton={false}
								render={
									<Link href={`/create?edit=${quiz.id}`}>
										<PencilIcon className='mr-2 h-4 w-4' />
										Edit
									</Link>
								}
							/>
							<Button
								size='sm'
								className='flex-1'
								nativeButton={false}
								render={
									<Link href={`/quiz/${quiz.id}/play`}>
										<PlayCircleIcon className='mr-2 h-4 w-4' />
										Preview
									</Link>
								}
							/>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
