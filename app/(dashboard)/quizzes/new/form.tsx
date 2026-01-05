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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { quizFormSchema, QuizFormSchema } from '@/features/quizzes/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	EyeIcon,
	FileText,
	FileTextIcon,
	HelpCircleIcon,
	SettingsIcon
} from 'lucide-react'
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import QuestionForm from './question-form'
import QuestionList from './question-list'

type Tab = 'settings' | 'questions' | 'preview'

export default function NewQuizForm() {
	const form = useForm<QuizFormSchema>({
		defaultValues: {
			title: '',
			description: '',
			totalPoints: 100,
			timeLimitMinutes: undefined,
			isPublic: true,
			questions: []
		},
		resolver: zodResolver(quizFormSchema) as any
	})
	const questionsFieldArray = useFieldArray({
		control: form.control,
		name: 'questions'
	})
	const [file, setFile] = useState<File | null>(null)
	const [activeTab, setActiveTab] = useState<Tab>('settings')

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
						<CardContent>
							<FieldSet>
								<FieldGroup>
									{/* Title & Time Limit */}
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<Controller
											name='title'
											control={form.control}
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
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>

										<Controller
											name='timeLimitMinutes'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														Time Limit (minutes)
													</FieldLabel>
													<Input
														{...field}
														type='number'
														min={0}
														id={field.name}
														name={field.name}
														aria-invalid={fieldState.invalid}
														placeholder='20'
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
									</div>

									{/* Description */}
									<Controller
										name='description'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													Description
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

									{/* Total points & Public quiz? */}
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<Controller
											name='totalPoints'
											control={form.control}
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
											control={form.control}
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
								</FieldGroup>
							</FieldSet>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='questions'
					className='space-y-4'
				>
					<QuestionForm questionsFieldArray={questionsFieldArray} />
					<QuestionList questionsFieldArray={questionsFieldArray} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
