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
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { createQuiz } from '@/features/quizzes/actions'
import CategoryCombobox from '@/features/quizzes/components/category-combobox'
import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { difficulties } from '@/lib/constants'
import {
	ArrowLeftIcon,
	EyeIcon,
	FileText,
	FileTextIcon,
	SettingsIcon
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { PDFDropzone } from './_components/pdf-dropzone'
import QuestionForm from './_components/question-form'
import QuestionList from './_components/question-list'
import QuizPreview from './_components/quiz-preview'
import { quizFormDefaults, useQuizForm } from './_hooks/use-quiz-form'

type Tab = 'settings' | 'questions' | 'preview'

const quizSettingsFormSchema = quizFormSchema.omit({ questions: true })
type QuizSettingsFormSchema = z.infer<typeof quizSettingsFormSchema>

export default function NewQuizForm() {
	const quizForm = useQuizForm()
	const questionsFieldArray = useFieldArray({
		control: quizForm.control,
		name: 'questions'
	})
	const [file, setFile] = useState<File | null>(null)
	const searchParams = useSearchParams()
	const [activeTab, setActiveTab] = useState<Tab>(
		(searchParams.get('tab') ?? 'settings') as Tab
	)
	const router = useRouter()

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
				message:
					response.message ?? 'Something went wrong. Please try again later.'
			})
			return
		}

		setFile(null)
		setActiveTab('settings')
		quizForm.reset(quizFormDefaults)
		toast.success('Quiz created successfully', {
			action: {
				label: 'View Quiz',
				onClick: () => router.push(`/quizzes/${response.quizId}`)
			}
		})
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
								<FieldSet>
									<FieldGroup>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<Controller
												name='title'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={field.name}>
															Quiz Title *
														</FieldLabel>
														<Input
															{...field}
															id={field.name}
															name={field.name}
															aria-invalid={fieldState.invalid}
															placeholder='Enter quiz title...'
														/>
														<FieldDescription>
															Essential for searching and filtering
														</FieldDescription>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>

											<Controller
												name='timeLimitMinutes'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={field.name}>
															Time Limit (minutes)
														</FieldLabel>
														<Input
															{...field}
															type='number'
															min={0}
															step={5}
															id={field.name}
															name={field.name}
															aria-invalid={fieldState.invalid}
															placeholder='20'
														/>
														<FieldDescription>
															Leave at 0 to indicate there is no time limit
														</FieldDescription>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<Controller
												name='categoryId'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={field.name}>
															Category
														</FieldLabel>
														<CategoryCombobox
															value={field.value}
															setValue={field.onChange}
														/>
														<FieldDescription>
															Essential for searching and filtering
														</FieldDescription>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>

											<Controller
												name='difficulty'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={field.name}>
															Difficulty *
														</FieldLabel>
														<Select
															value={field.value}
															onValueChange={field.onChange}
															defaultValue='easy'
															id={field.name}
															name={field.name}
															disabled={field.disabled}
														>
															<SelectTrigger aria-invalid={fieldState.invalid}>
																<SelectValue className='capitalize' />
															</SelectTrigger>
															<SelectContent>
																{difficulties.map(difficulty => (
																	<SelectItem
																		key={difficulty}
																		value={difficulty}
																		className='capitalize'
																	>
																		{difficulty}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
										</div>

										<Controller
											name='description'
											control={quizForm.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														Description *
													</FieldLabel>
													<Textarea
														{...field}
														id={field.name}
														name={field.name}
														aria-invalid={fieldState.invalid}
														placeholder='Describe what this quiz covers...'
														rows={3}
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<Controller
												name='totalPoints'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={field.name}>
															Total Points
														</FieldLabel>
														<Input
															{...field}
															type='number'
															min={0}
															max={100}
															step={5}
															id={field.name}
															name={field.name}
															aria-invalid={fieldState.invalid}
															placeholder='50'
														/>
														<FieldDescription>
															Will auto-distribute across questions
														</FieldDescription>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>

											<Controller
												name='isPublic'
												control={quizForm.control}
												render={({ field, fieldState }) => (
													<Field
														orientation='horizontal'
														data-invalid={fieldState.invalid}
													>
														<FieldContent>
															<FieldLabel htmlFor={field.name}>
																Public Quiz{' '}
															</FieldLabel>
															<FieldDescription>
																Allow others to discover and take this quiz
															</FieldDescription>
															{fieldState.invalid && (
																<FieldError errors={[fieldState.error]} />
															)}
														</FieldContent>
														<Switch
															id={field.name}
															name={field.name}
															checked={field.value}
															onCheckedChange={field.onChange}
															aria-invalid={fieldState.invalid}
														/>
													</Field>
												)}
											/>
										</div>

										<div className='relative my-2'>
											<Separator />
											<span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground'>
												or
											</span>
										</div>

										<PDFDropzone onFileSelect={setFile} />

										<div className='flex justify-end'>
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
									</FieldGroup>
								</FieldSet>
							</CardContent>
						</Card>
					</TabsContent>
				</form>

				{/* Questions Tab */}
				<TabsContent
					value='questions'
					className='space-y-4'
				>
					<QuestionForm questionsFieldArray={questionsFieldArray} />
					<QuestionList questionsFieldArray={questionsFieldArray} />

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
					<QuizPreview
						values={quizForm.getValues()}
						formState={quizForm.formState}
					/>

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
