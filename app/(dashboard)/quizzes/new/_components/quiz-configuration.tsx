'use client'

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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import CategoryCombobox from '@/features/quizzes/components/category-combobox'
import { difficulties } from '@/lib/constants'
import { Controller } from 'react-hook-form'
import { useQuizForm } from '../_context/quiz-form'

export default function QuizConfiguration() {
	const { form } = useQuizForm()

	return (
		<FieldSet>
			<FieldGroup>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Controller
						name='title'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Quiz Title *</FieldLabel>
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
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Category</FieldLabel>
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
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Difficulty *</FieldLabel>
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
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Description *</FieldLabel>
							<Textarea
								{...field}
								id={field.name}
								name={field.name}
								aria-invalid={fieldState.invalid}
								placeholder='Describe what this quiz covers...'
								rows={3}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Controller
						name='totalPoints'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Total Points</FieldLabel>
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
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								orientation='horizontal'
								data-invalid={fieldState.invalid}
							>
								<FieldContent>
									<FieldLabel htmlFor={field.name}>Public Quiz </FieldLabel>
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
			</FieldGroup>
		</FieldSet>
	)
}
