'use client'

import PersistedTabs from '@/components/persisted-tabs'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createQuiz } from '@/features/quizzes/actions'
import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { errorMessage } from '@/utils/helpers'
import {
	ArrowLeftIcon,
	EyeIcon,
	FileText,
	FileTextIcon,
	SettingsIcon
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import QuestionForm from './_components/question-form'
import QuestionList from './_components/question-list'
import QuizConfiguration from './_components/quiz-configuration'
import QuizPreview from './_components/quiz-preview'
import { quizFormDefaults, useQuizForm } from './_context/quiz-form'

type Tab = 'settings' | 'questions' | 'preview'

const quizSettingsFormSchema = quizFormSchema.omit({ questions: true })
type QuizSettingsFormSchema = z.infer<typeof quizSettingsFormSchema>

export default function NewQuizForm() {
	const { quizForm, questionsFieldArray } = useQuizForm()
	const searchParams = useSearchParams()
	const [activeTab, setActiveTab] = useState<Tab>(
		(searchParams.get('tab') ?? 'settings') as Tab
	)

	async function switchTab(
		tab: Tab,
		fieldsToValidate: Parameters<typeof quizForm.trigger>[0]
	) {
		const isValid = await quizForm.trigger(fieldsToValidate, {
			shouldFocus: true
		})

		if (isValid) setActiveTab(tab)
	}

	const onSubmit = async (data: QuizFormSchema) => {
		const response = await createQuiz(data)

		if (!response.success) {
			quizForm.setError('root', {
				message: errorMessage(response.message)
			})
			return
		}

		setActiveTab('settings')
		quizForm.reset(quizFormDefaults)
		toast.success('Quiz created successfully')
	}

	return (
		<div>
			<PersistedTabs
				value={activeTab}
				onValueChange={setActiveTab}
				defaultValue='settings'
			>
				<TabsList className='grid w-full grid-cols-3 bg-indigo-100/10'>
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
						Questions ({questionsFieldArray.fields.length})
					</TabsTrigger>
					<TabsTrigger
						value='preview'
						className='flex items-center gap-2'
					>
						<EyeIcon className='size-4' />
						Preview
					</TabsTrigger>
				</TabsList>

				{/* Settings Tab */}
				<form
					onSubmit={quizForm.handleSubmit(onSubmit)}
					id='new-quiz-form'
				>
					<TabsContent value='settings'>
						<Card>
							<CardHeader>
								<CardTitle>Quiz Configuration</CardTitle>
								<CardDescription>
									Set up the basic information for your quiz
								</CardDescription>
							</CardHeader>
							<CardContent>
								<QuizConfiguration />

								<div className='flex justify-end mt-8'>
									<Button
										size='lg'
										type='button'
										onClick={() => {
											const fieldsToValidate = Object.keys(
												quizSettingsFormSchema.shape
											) as (keyof QuizSettingsFormSchema)[]

											switchTab('questions', fieldsToValidate)
										}}
									>
										Next: Add Questions
										<FileText className='ml-2 h-4 w-4' />
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</form>

				{/* Questions Tab */}
				<TabsContent
					value='questions'
					className='space-y-4'
				>
					<QuestionForm />
					<QuestionList />

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							size='lg'
							onClick={() => setActiveTab('settings')}
						>
							<ArrowLeftIcon />
							Back to Settings
						</Button>
						<Button
							type='button'
							onClick={() => switchTab('preview', 'questions')}
							size='lg'
						>
							Next: Preview <EyeIcon />
						</Button>
					</div>
				</TabsContent>

				{/* Preview Tab */}
				<TabsContent value='preview'>
					<QuizPreview />

					<Button
						variant='outline'
						size='lg'
						type='button'
						onClick={() => setActiveTab('questions')}
						className='mt-4'
					>
						<ArrowLeftIcon />
						Back to Questions
					</Button>
				</TabsContent>
			</PersistedTabs>
		</div>
	)
}
