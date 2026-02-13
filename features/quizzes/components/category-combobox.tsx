'use client'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { useCategories } from '@/context/categories'
import { QuizCategory } from '@/db/schema'
import { cn } from '@/utils/helpers'
import { Nullable, SetState } from '@/utils/types'
import { ChevronsUpDownIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Category = Pick<QuizCategory, 'id' | 'name' | 'slug'>

export type CategoryComboboxProps = {
	value: Nullable<Category['id']>
	setValue: SetState<Nullable<Category['id']>>
	useSlug?: boolean
	disabled?: boolean
	props?: Partial<{
		popoverContent: React.ComponentProps<typeof PopoverContent>
	}>
}

export default function CategoryCombobox({
	value,
	setValue,
	useSlug = false,
	disabled = false,
	props = {}
}: CategoryComboboxProps) {
	const [open, setOpen] = useState(false)
	const searchParams = useSearchParams()
	const categories = useCategories()
	const identifier = useSlug ? 'slug' : 'id'

	const getCategory = (id: string | null) => {
		return categories?.find(c => [c.id, c.slug].includes(id!))
	}

	useEffect(() => {
		if (searchParams.has('category')) {
			const targetCategory = getCategory(searchParams.get('category'))
			setValue(targetCategory?.[identifier])
		}
	}, [])

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger
				render={
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='h-11 w-50 justify-between'
					>
						{value ? getCategory(value)?.name : 'Category'}
						<ChevronsUpDownIcon className='opacity-50' />
					</Button>
				}
				disabled={disabled}
			/>
			<PopoverContent
				className={cn('w-50 p-0', props.popoverContent?.className)}
				{...props.popoverContent}
			>
				<Command value={value ?? ''}>
					<CommandInput
						placeholder='Search category...'
						className='h-9'
					/>
					<CommandList>
						<CommandEmpty>No category found.</CommandEmpty>
						<CommandGroup>
							{categories?.map(category => (
								<CommandItem
									key={category.slug}
									value={category.slug}
									data-checked={value === category[identifier]}
									onSelect={currentValue => {
										setValue(
											currentValue === value
												? null
												: getCategory(currentValue)?.[identifier]
										)
										setOpen(false)
									}}
								>
									{category.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
