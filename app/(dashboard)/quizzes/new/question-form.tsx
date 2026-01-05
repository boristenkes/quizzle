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
import { Input } from '@/components/ui/input'
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
import { QuestionType, questionTypeLabel, questionTypes } from '@/lib/constants'
import { TagsInputItemDelete, TagsInputItemText } from '@diceui/tags-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

const baseQuestionDefaults: BaseQuestionFormSchema = {
	prompt: '',
	explanationHTML: '',
	points: 5
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
	type: 'multi_choice',
	options: [
		{ text: '', isCorrect: false },
		{ text: '', isCorrect: false }
	]
}

export default function QuestionForm() {
	const form = useForm<QuestionFormSchema>({
		defaultValues: choiceDefaults,
		resolver: zodResolver(questionFormSchema) as any // TS being too weird
	})
	const optionsField = useFieldArray({
		control: form.control,
		name: 'options'
	})
	const selectedType = form.watch('type')

	const onSubmit = async (data: QuestionFormSchema) => {
		console.log(data)
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
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldSet>
						<FieldGroup>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* Type */}
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

								{/* Points */}
								<Controller
									name='points'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Points</FieldLabel>
											<Input
												{...field}
												type='number'
												id={field.name}
												min='0'
												step='5'
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							{/* Points */}
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

							{/* Question options */}
							{(selectedType === 'multi_choice' ||
								selectedType === 'single_choice') && (
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
																render={({ field: checkboxField }) => (
																	<Checkbox
																		checked={checkboxField.value}
																		onCheckedChange={checkboxField.onChange}
																		className='size-6 border-2'
																	/>
																)}
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
																		<InputGroupAddon align='inline-end'>
																			<InputGroupButton
																				onClick={() => optionsField.remove(idx)}
																				size='icon-xs'
																			>
																				<XIcon />
																			</InputGroupButton>
																		</InputGroupAddon>
																	</InputGroup>
																)}
															/>
														</FieldContent>
													</Field>
												</li>
											))}
										</ol>
										<Button
											variant='secondary'
											onClick={() =>
												optionsField.append({ text: '', isCorrect: false })
											}
											className='ml-14'
										>
											Add option <PlusIcon />
										</Button>
									</FieldGroup>
								</FieldSet>
							)}

							{/* Acceptable Answers & Ignore case? & Trim whitespace? */}
							{selectedType === 'text' && (
								<>
									<Controller
										control={form.control}
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
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>

									<div className='grid grid-cols-2 gap-2 -mt-5'>
										<Controller
											name='ignoreCase'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													orientation='horizontal'
													data-invalid={fieldState.invalid}
													className='border border-input p-3 rounded-sm'
												>
													<FieldContent>
														<FieldLabel htmlFor={field.name}>
															Ignore case
														</FieldLabel>
														<FieldDescription>
															Treats uppercase and lowercase letters as the same
															when checking answers. (e.g. <q>Apple</q> and{' '}
															<q>apple</q> are considered same)
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
										<Controller
											name='trimWhitespace'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													orientation='horizontal'
													data-invalid={fieldState.invalid}
													className='border p-3 rounded-sm'
												>
													<FieldContent>
														<FieldLabel htmlFor={field.name}>
															Trim whitespace
														</FieldLabel>
														<FieldDescription>
															Ignores extra spaces at the beginning or end of
															answers when checking them.
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
								</>
							)}

							{/* Explanation HTML */}
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
								<Button type='submit'>
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
