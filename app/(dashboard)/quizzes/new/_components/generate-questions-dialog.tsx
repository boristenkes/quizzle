'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger
} from '@/components/utils/responsive-dialog'
import {
	GenerateQuestionsFormSchema,
	generateQuestionsFormSchema,
	pdfFileSchema
} from '@/features/ai/zod'
import { QuestionFormSchema } from '@/features/questions/zod'
import { MAX_QUIZ_QUESTIONS, MIN_QUIZ_QUESTIONS } from '@/lib/constants'
import { scrollToElement } from '@/utils/helpers'
import { Nullable } from '@/utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SparklesIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { useQuizForm } from '../_context/quiz-form'
import { PDFDropzone } from './pdf-dropzone'

type GenerateQuestionsDialogProps = React.ComponentProps<
	typeof ResponsiveDialog
> & {
	onGenerate: (questions: QuestionFormSchema | QuestionFormSchema[]) => any
}

export default function GenerateQuestionsDialog({
	children,
	onGenerate,
	...props
}: GenerateQuestionsDialogProps) {
	const form = useForm<GenerateQuestionsFormSchema>({
		defaultValues: {
			questionCount: 5,
			difficultyDistribution: [2, 4],
			typeDistribution: [2, 4]
		},
		resolver: zodResolver(generateQuestionsFormSchema) as any
	})
	const { isSubmitting, errors } = form.formState
	const questionCount = form.watch('questionCount')
	const [pdfFile, setPDFFile] = useState<Nullable<File>>(null)
	const [isOpen, setIsOpen] = useState(false)
	const { setIsGenerating, controller } = useQuizForm()

	const onSubmit = async (data: GenerateQuestionsFormSchema) => {
		const difficultyDistribution = getDistributionObj(
			data.difficultyDistribution,
			questionCount,
			['easy', 'medium', 'hard']
		)
		const typeDistribution = getDistributionObj(
			data.typeDistribution,
			questionCount,
			['text', 'single_correct', 'multi_correct']
		)

		const pdfValidation = pdfFileSchema.safeParse(pdfFile)

		if (!pdfValidation.success) {
			return form.setError('root', {
				message: z.prettifyError(pdfValidation.error)
			})
		}

		const formData = new FormData()
		formData.append('pdf', pdfValidation.data)
		formData.append(
			'config',
			JSON.stringify({
				questionCount: data.questionCount,
				difficultyDistribution,
				typeDistribution
			})
		)

		setIsOpen(false)
		setIsGenerating(true)
		scrollToElement('new-quiz-form:question-list')

		const response = await fetch('/api/ai/generate-questions', {
			method: 'POST',
			body: formData,
			signal: controller.signal
		})

		const reader = response.body!.getReader()
		const decoder = new TextDecoder()

		let buffer = ''

		while (true) {
			const { value, done } = await reader.read()

			if (done) break

			buffer += decoder.decode(value, { stream: true })

			let newlineIndex: number
			while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
				const line = buffer.slice(0, newlineIndex).trim()
				buffer = buffer.slice(newlineIndex + 1)

				if (!line) continue

				const question = JSON.parse(line) as QuestionFormSchema
				onGenerate(question)
			}
		}

		toast.success('Questions generated successfully')
		setIsGenerating(false)
	}

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={setIsOpen}
			{...props}
		>
			<ResponsiveDialogTrigger>{children}</ResponsiveDialogTrigger>
			<ResponsiveDialogContent className='px-8'>
				<ResponsiveDialogHeader className='gap-0'>
					<ResponsiveDialogTitle>AI Response Settings</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Let AI know what output you want.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>

				<PDFDropzone onFileSelect={setPDFFile} />

				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name='questionCount'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor={field.name}
										className='-mb-1.5'
									>
										Number of questions
									</FieldLabel>
									<FieldDescription>
										How many questions should be generated?
									</FieldDescription>
									<Input
										{...field}
										value={field.value}
										onChange={field.onChange}
										type='number'
										id={field.name}
										aria-invalid={fieldState.invalid}
										min={MIN_QUIZ_QUESTIONS}
										max={MAX_QUIZ_QUESTIONS}
										disabled={isSubmitting}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name='difficultyDistribution'
							control={form.control}
							render={({ field }) => {
								const { easy, medium, hard } = getDistributionObj(
									field.value,
									questionCount,
									['easy', 'medium', 'hard']
								)

								return (
									<Field>
										<FieldLabel
											htmlFor={field.name}
											className='-mb-1.5'
										>
											Difficulty distribution
										</FieldLabel>
										<FieldDescription>
											Adjust the balance of easy, medium and hard questions
										</FieldDescription>

										<div className='space-y-3'>
											<Slider
												min={0}
												max={questionCount}
												step={1}
												value={field.value}
												onValueChange={field.onChange}
												id={field.name}
												disabled={isSubmitting}
											/>

											<div className='flex justify-between text-sm text-muted-foreground'>
												<span>Easy: {easy}</span>
												<span>Medium: {medium}</span>
												<span>Hard: {hard}</span>
											</div>
										</div>
									</Field>
								)
							}}
						/>

						<Controller
							name='typeDistribution'
							control={form.control}
							render={({ field }) => {
								const { text, singleCorrect, multiCorrect } =
									getDistributionObj(field.value, questionCount, [
										'text',
										'singleCorrect',
										'multiCorrect'
									])

								return (
									<Field>
										<FieldLabel className='-mb-1.5'>
											Question type distribution
										</FieldLabel>
										<FieldDescription>
											Adjust the balance of question types
										</FieldDescription>

										<div className='space-y-3'>
											<Slider
												min={0}
												max={questionCount}
												step={1}
												value={field.value}
												onValueChange={field.onChange}
												disabled={isSubmitting}
											/>

											<div className='flex justify-between text-sm text-muted-foreground'>
												<span>Text: {text}</span>
												<span>Single correct: {singleCorrect}</span>
												<span>Multiple correct: {multiCorrect}</span>
											</div>
										</div>
									</Field>
								)
							}}
						/>

						{errors.root && <ErrorMessage message={errors.root.message!} />}

						<Button
							type='submit'
							disabled={isSubmitting}
						>
							{!isSubmitting && <SparklesIcon />}
							{isSubmitting ? 'Generating' : 'Generate Questions'}
							{isSubmitting && <Spinner />}
						</Button>
					</FieldGroup>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}

function getDistributionObj(
	distTuple: [number, number],
	limit: number,
	keys: [string, string, string]
): Record<(typeof keys)[number], number> {
	const [key1, key2, key3] = keys
	const [tupleStart, tupleEnd] = distTuple

	return {
		[key1]: tupleStart,
		[key2]: tupleEnd - tupleStart,
		[key3]: limit - tupleEnd
	}
}
