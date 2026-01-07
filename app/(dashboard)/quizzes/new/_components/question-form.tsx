import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet
} from '@/components/ui/field'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/ui/input-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
	TagsInput,
	TagsInputClear,
	TagsInputInput,
	TagsInputItem,
	TagsInputList
} from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import {
	BaseQuestionFormSchema,
	ChoiceQuestionFormSchema,
	questionFormSchema,
	QuestionFormSchema,
	TextQuestionFormSchema
} from '@/features/questions/zod'
import { QuizFormSchema } from '@/features/quizzes/zod'
import {
	MAX_QUESTION_OPTIONS,
	MAX_QUIZ_QUESTIONS,
	MIN_QUESTION_OPTIONS,
	questionDifficulties,
	QuestionType,
	questionTypeLabel,
	questionTypes
} from '@/lib/constants'
import { TagsInputItemDelete, TagsInputItemText } from '@diceui/tags-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, SparklesIcon, TriangleAlertIcon, XIcon } from 'lucide-react'
import {
	Control,
	Controller,
	useFieldArray,
	UseFieldArrayReturn,
	useForm,
	UseFormReturn
} from 'react-hook-form'

const baseQuestionDefaults: BaseQuestionFormSchema = {
	prompt: '',
	explanationHTML: '',
	difficulty: 'easy'
}

const textDefaults: BaseQuestionFormSchema & TextQuestionFormSchema = {
	...baseQuestionDefaults,
	type: 'text',
	acceptableAnswers: [],
	ignoreCase: true,
	trimWhitespace: true
}

const choiceDefaults: BaseQuestionFormSchema & ChoiceQuestionFormSchema = {
	...baseQuestionDefaults,
	type: 'multi_correct',
	options: [
		{ text: '', isCorrect: false },
		{ text: '', isCorrect: false }
	]
}

export default function QuestionForm({
	questionsFieldArray
}: {
	questionsFieldArray: UseFieldArrayReturn<QuizFormSchema, 'questions'>
}) {
	const form = useForm<QuestionFormSchema>({
		defaultValues: choiceDefaults,
		resolver: zodResolver(questionFormSchema) as any, // TS being too weird
		disabled: questionsFieldArray.fields.length >= MAX_QUIZ_QUESTIONS
	})
	const optionsField = useFieldArray({
		control: form.control,
		name: 'options'
	})
	const selectedType = form.watch('type')

	const onSubmit = async (data: QuestionFormSchema) => {
		questionsFieldArray.append(data)
		form.reset()
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center gap-2'>
					<CardTitle>Add Question</CardTitle>
					<Button
						variant='outline'
						size='sm'
						className='ml-auto'
					>
						<SparklesIcon className='size-4 mr-2' />
						AI Generate
					</Button>
				</div>
				<CardDescription>
					Create multiple choice or free text questions
				</CardDescription>
			</CardHeader>
			<CardContent>
				{questionsFieldArray.fields.length >= MAX_QUIZ_QUESTIONS && (
					<Alert
						variant='warning'
						className='mb-6'
					>
						<TriangleAlertIcon />
						<AlertTitle>Question limit reached</AlertTitle>
						<AlertDescription>
							This quiz already contains the maximum allowed number of questions
							({MAX_QUIZ_QUESTIONS}). To add a new question, remove or edit an
							existing one.{' '}
							<a href='#new-quiz-form:question-list'>See questions</a>
						</AlertDescription>
					</Alert>
				)}

				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldSet>
						<FieldGroup>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<Controller
									name='type'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Question Type *
											</FieldLabel>
											<Select
												value={field.value}
												onValueChange={value => {
													const type = value as QuestionType
													field.onChange(type)

													if (type === 'text') {
														form.reset(textDefaults)
													} else {
														form.reset({ ...choiceDefaults, type })
													}
												}}
												id={field.name}
												name={field.name}
												disabled={field.disabled}
											>
												<SelectTrigger aria-invalid={fieldState.invalid}>
													<SelectValue>
														{questionTypeLabel[field.value] ?? 'Select type'}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													{questionTypes.map(type => (
														<SelectItem
															key={type}
															value={type}
														>
															{questionTypeLabel[type]}
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

								<Controller
									name='difficulty'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Difficulty</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												id={field.name}
												name={field.name}
												disabled={field.disabled}
											>
												<SelectTrigger aria-invalid={fieldState.invalid}>
													<SelectValue className='capitalize' />
												</SelectTrigger>
												<SelectContent>
													{questionDifficulties.map(difficulty => (
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
								name='prompt'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Question Text *
										</FieldLabel>
										<Textarea
											{...field}
											id={field.name}
											placeholder='Enter your question...'
											rows={3}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{selectedType === 'text' ? (
								<TextQuestionFields control={form.control} />
							) : (
								<ChoiceQuestionFields
									form={form}
									optionsField={optionsField}
									type={selectedType}
								/>
							)}

							<Controller
								name='explanationHTML'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Explanation</FieldLabel>
										<Textarea
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder='This is correct because...'
										/>
										<FieldDescription>
											Explanation displayed after answering
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<div className='flex justify-end'>
								<Button
									type='submit'
									disabled={form.formState.disabled}
								>
									<PlusIcon className='size-4 mr-2' />
									Add Question
								</Button>
							</div>
						</FieldGroup>
					</FieldSet>
				</form>
			</CardContent>
		</Card>
	)
}

function ChoiceQuestionFields({
	form,
	optionsField,
	type
}: {
	form: UseFormReturn<QuestionFormSchema>
	optionsField: UseFieldArrayReturn<QuestionFormSchema, 'options'>
	type: 'single_correct' | 'multi_correct'
}) {
	return (
		<FieldSet>
			<FieldLegend variant='label'>Available Choices *</FieldLegend>
			<FieldDescription>
				Click the checkboxes to mark correct answers
			</FieldDescription>
			<FieldGroup className='gap-2'>
				<ol
					type='A'
					className='list-[upper-alpha] pl-5 space-y-2'
				>
					{optionsField.fields.map((field, idx) => (
						<li
							key={field.id}
							className='pl-3'
						>
							<Field
								orientation='horizontal'
								className='data-invalid:border-red-500'
							>
								<FieldContent className='flex flex-row items-center'>
									<Controller
										name={`options.${idx}.isCorrect`}
										control={form.control}
										render={({ field: checkboxField }) => {
											if (type === 'single_correct') {
												return (
													<input
														type='radio'
														name='single_choice_options'
														checked={checkboxField.value}
														onChange={() => {
															// ensure only this option is marked correct
															optionsField.fields.forEach((_, i) =>
																form.setValue(
																	`options.${i}.isCorrect`,
																	i === idx
																)
															)
														}}
														className='size-6 border-2'
														disabled={checkboxField.disabled}
													/>
												)
											}

											return (
												<Checkbox
													checked={checkboxField.value}
													onCheckedChange={checkboxField.onChange}
													className='size-6 border-2'
													disabled={checkboxField.disabled}
												/>
											)
										}}
									/>
									<Controller
										name={`options.${idx}.text`}
										control={form.control}
										render={({ field: inputField, fieldState }) => (
											<InputGroup>
												<InputGroupInput
													{...inputField}
													placeholder={`Enter option ${String.fromCharCode(
														65 + idx
													)}`}
												/>
												{optionsField.fields.length > MIN_QUESTION_OPTIONS && (
													<InputGroupAddon align='inline-end'>
														<InputGroupButton
															onClick={() => optionsField.remove(idx)}
															size='icon-xs'
														>
															<XIcon />
														</InputGroupButton>
													</InputGroupAddon>
												)}
											</InputGroup>
										)}
									/>
								</FieldContent>
							</Field>
						</li>
					))}
				</ol>
				{form.getFieldState('options').invalid && (
					<FieldError errors={[form.getFieldState('options').error]} />
				)}
				{optionsField.fields.length < MAX_QUESTION_OPTIONS && (
					<Button
						variant='secondary'
						onClick={() => optionsField.append({ text: '', isCorrect: false })}
						className='ml-14'
						disabled={form.formState.disabled}
					>
						Add option <PlusIcon />
					</Button>
				)}
			</FieldGroup>
		</FieldSet>
	)
}

function TextQuestionFields({
	control
}: {
	control: Control<QuestionFormSchema>
}) {
	return (
		<>
			<Controller
				control={control}
				name='acceptableAnswers'
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>
							Acceptable Answers (separated by Enter) *
						</FieldLabel>
						<TagsInput
							id={field.name}
							value={field.value}
							onValueChange={field.onChange}
							ref={field.ref}
							disabled={field.disabled}
						>
							<TagsInputList>
								{field.value.map(answer => (
									<TagsInputItem
										key={answer}
										value={answer}
									>
										<TagsInputItemText />
										<TagsInputItemDelete />
									</TagsInputItem>
								))}
								<TagsInputInput />
								<TagsInputClear />
							</TagsInputList>
						</TagsInput>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<div className='grid grid-cols-2 gap-2 -mt-5'>
				<Controller
					name='ignoreCase'
					control={control}
					render={({ field, fieldState }) => (
						<Field
							orientation='horizontal'
							data-invalid={fieldState.invalid}
							className='border border-input p-3 rounded-sm'
						>
							<FieldContent>
								<FieldLabel htmlFor={field.name}>Ignore case</FieldLabel>
								<FieldDescription>
									Treats uppercase and lowercase letters as the same when
									checking answers. (e.g. <q>Apple</q> and <q>apple</q> are
									considered same)
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
								disabled={field.disabled}
							/>
						</Field>
					)}
				/>
				<Controller
					name='trimWhitespace'
					control={control}
					render={({ field, fieldState }) => (
						<Field
							orientation='horizontal'
							data-invalid={fieldState.invalid}
							className='border p-3 rounded-sm'
						>
							<FieldContent>
								<FieldLabel htmlFor={field.name}>Trim whitespace</FieldLabel>
								<FieldDescription>
									Ignores extra spaces at the beginning or end of answers when
									checking them.
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
								disabled={field.disabled}
							/>
						</Field>
					)}
				/>
			</div>
		</>
	)
}
