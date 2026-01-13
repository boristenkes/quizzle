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
	categories: Nullable<Category[]>
	value: Nullable<Category['id']>
	setValue: SetState<Nullable<Category['id']>>
	props?: Partial<{
		popoverContent: React.ComponentProps<typeof PopoverContent>
	}>
}

export default function CategoryCombobox({
	value,
	setValue,
	props = {}
}: CategoryComboboxProps) {
	const [open, setOpen] = useState(false)
	const searchParams = useSearchParams()
	const categories = useCategories()

	const getCategory = (identifier: string | null) => {
		return categories?.find(c => [c.id, c.slug].includes(identifier!))
	}

	useEffect(() => {
		if (searchParams.has('category')) {
			const targetCategory = getCategory(searchParams.get('category'))
			setValue(targetCategory?.id)
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
									data-checked={value === category.id}
									onSelect={currentValue => {
										setValue(
											currentValue === value
												? null
												: getCategory(currentValue)?.id
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
