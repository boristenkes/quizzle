'use client'

import { PdfDropZone } from '@/app/(dashboard)/quizzes/new/pdf-dropzone'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	EyeIcon,
	FileText,
	FileTextIcon,
	HelpCircleIcon,
	SettingsIcon
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import QuestionForm from './question-form'

type Tab = 'settings' | 'questions' | 'preview'

export default function NewQuizForm() {
	const form = useForm()
	const [file, setFile] = useState<File | null>(null)
	const [activeTab, setActiveTab] = useState<Tab>('questions')

	return (
		<div>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className='grid w-full grid-cols-4 bg-indigo-100/10'>
					<TabsTrigger
						value='settings'
						className='flex items-center gap-2'
					>
						<SettingsIcon className='size-4' />
						Settings
					</TabsTrigger>
					<TabsTrigger
						value='questions'
						className='flex items-center gap-2'
					>
						<FileTextIcon className='size-4' />
						Questions (0)
					</TabsTrigger>
					<TabsTrigger
						value='review'
						className='flex items-center gap-2'
					>
						<HelpCircleIcon className='size-4' />
						Review
					</TabsTrigger>
					<TabsTrigger
						value='preview'
						className='flex items-center gap-2'
					>
						<EyeIcon className='size-4' />
						Preview
					</TabsTrigger>
				</TabsList>

				<TabsContent value='settings'>
					<Card>
						<CardHeader>
							<CardTitle>Quiz Configuration</CardTitle>
							<CardDescription>
								Set up the basic information for your quiz
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Title & Time Limit */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label htmlFor='title'>Quiz Title *</Label>
									<Input
										id='title'
										placeholder='Enter quiz title...'
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='timeLimit'>Time Limit (minutes)</Label>
									<Input
										id='timeLimit'
										type='number'
										placeholder='20'
									/>
								</div>
							</div>

							{/* Description */}
							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									placeholder='Describe what this quiz covers...'
									rows={3}
								/>
							</div>

							{/* Total points & Public quiz? */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label htmlFor='totalPoints'>Total Points</Label>
									<Input
										id='totalPoints'
										type='number'
										placeholder='100'
									/>
									<p className='text-sm text-muted-foreground'>
										Will auto-distribute across questions
									</p>
								</div>

								<div className='space-y-4'>
									<div className='flex items-center gap-4'>
										<Label htmlFor='public'>Public Quiz</Label>
										<Switch id='public' />
									</div>
									<p className='text-sm text-muted-foreground'>
										Allow others to discover and take this quiz
									</p>
								</div>
							</div>

							<div className='relative my-6'>
								<Separator />
								<span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground'>
									or
								</span>
							</div>

							<PdfDropZone onFileSelect={setFile} />

							<div className='flex justify-end'>
								<Button
									size='lg'
									onClick={() => setActiveTab('questions')}
								>
									Next: Add Questions
									<FileText className='ml-2 h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='questions'>
					<QuestionForm />
				</TabsContent>
			</Tabs>
		</div>
	)
}
