'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/ui/input-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useCategories } from '@/context/categories'
import CategoryCombobox from '@/features/quizzes/components/category-combobox'
import { filtersFormSchema, FiltersFormSchema } from '@/features/quizzes/zod'
import { difficulties, Difficulty } from '@/lib/constants'
import { getDirtyValues, isEmpty } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon, XIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function DiscoverPageFilters() {
	const form = useForm<FiltersFormSchema>({
		resolver: zodResolver(filtersFormSchema),
		defaultValues: {
			searchQuery: '',
			categoryId: null,
			difficulty: null
		}
	})
	const categories = useCategories()
	const { isSubmitting, errors, dirtyFields } = form.formState
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		// TODO fix: categoryId is not being inherited from searchParams

		const searchQuery = searchParams.get('query')
		const categorySlug = searchParams.get('category')
		const difficulty = searchParams.get('difficulty') as Difficulty

		const categoryId = categories?.find(c => c.slug === categorySlug)?.id

		const defaultValues: FiltersFormSchema = {
			...(searchQuery && { searchQuery }),
			...(categoryId && { categoryId }),
			...(difficulty && { difficulty })
		}

		Object.entries(defaultValues).forEach(([key, value]) => {
			form.setValue(key as keyof FiltersFormSchema, value, {
				shouldDirty: true
			})
		})
	}, [])

	const onSubmit = async (data: FiltersFormSchema) => {
		if (isEmpty(dirtyFields)) return

		const dirtyValues = getDirtyValues(data, dirtyFields)
		const params = new URLSearchParams(searchParams.toString())

		if (dirtyValues.searchQuery?.trim()) {
			params.set('query', dirtyValues.searchQuery.trim())
		} else {
			params.delete('query')
		}

		if (dirtyValues.categoryId) {
			const targetCategory = categories?.find(
				c => c.id === dirtyValues.categoryId
			)
			if (targetCategory) {
				params.set('category', targetCategory.slug)
			} else {
				params.delete('category')
			}
		} else {
			params.delete('category')
		}

		if (
			dirtyValues.difficulty &&
			difficulties.includes(dirtyValues.difficulty)
		) {
			params.set('difficulty', dirtyValues.difficulty)
		} else {
			params.delete('difficulty')
		}

		router.replace(`?${params.toString()}`, { scroll: false })
	}

	return (
		<Card className='max-lg:hidden'>
			<CardContent>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex gap-4'
				>
					<Controller
						name='searchQuery'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel
									htmlFor={field.name}
									className='sr-only'
								>
									Search term
								</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<SearchIcon className='size-4 text-muted-foreground' />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										value={field.value!}
										type='search'
										placeholder='Search quizzes...'
										className='pl-9'
										id={field.name}
										aria-invalid={fieldState.invalid}
										disabled={isSubmitting}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</InputGroup>
							</Field>
						)}
					/>

					<Controller
						name='categoryId'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel
									htmlFor={field.name}
									className='sr-only'
								>
									Category
								</FieldLabel>
								<CategoryCombobox
									value={field.value}
									setValue={field.onChange}
									disabled={isSubmitting}
								/>
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
							<Field
								orientation='responsive'
								data-invalid={fieldState.invalid}
							>
								<FieldLabel
									htmlFor={field.name}
									className='sr-only'
								>
									Difficulty
								</FieldLabel>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}

								<Select
									value={field.value}
									onValueChange={field.onChange}
									disabled={isSubmitting}
								>
									<SelectTrigger
										id={field.name}
										aria-invalid={fieldState.invalid}
										className='min-w-30'
									>
										<SelectValue className='capitalize'>
											{field.value ?? 'Difficulty'}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{difficulties.map(difficulty => (
											<SelectItem
												key={difficulty}
												value={difficulty.toLowerCase()}
												className='capitalize'
											>
												{difficulty}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<div className='flex'>
						<Button
							type='submit'
							className='grow h-auto px-4 rounded-r-none'
							disabled={isSubmitting || isEmpty(dirtyFields)}
						>
							{isSubmitting ? 'Applying' : 'Apply Filters'}
							{isSubmitting && <Spinner />}
						</Button>
						<Button
							type='button'
							variant='outline'
							size='icon-lg'
							className='rounded-l-none h-auto'
							onClick={() => {
								form.reset()
								router.replace('?')
							}}
						>
							<XIcon />
						</Button>
					</div>
				</form>

				{errors.root && (
					<ErrorMessage
						message={
							errors.root.message ??
							'Failed to filter quizzes. Please try again later.'
						}
						className='mt-4'
					/>
				)}
			</CardContent>
		</Card>
	)
}
