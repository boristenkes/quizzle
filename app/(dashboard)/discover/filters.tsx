'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { QuizCategory } from '@/db/schema'
import CategoryCombobox from '@/features/quizzes/components/category-combobox'
import { difficulties } from '@/lib/constants'
import { Nullable } from '@/utils/types'
import { Filter, SearchIcon } from 'lucide-react'
import { useState } from 'react'

export default function DiscoverPageFilters() {
	const [categoryId, setCategoryId] =
		useState<Nullable<QuizCategory['id']>>(null)

	return (
		<Card className='max-lg:hidden'>
			<CardContent>
				<div className='flex gap-4'>
					<InputGroup>
						<InputGroupAddon>
							<SearchIcon className='size-4 text-muted-foreground' />
						</InputGroupAddon>
						<InputGroupInput
							placeholder='Search quizzes...'
							className='pl-9'
						/>
					</InputGroup>

					<CategoryCombobox
						value={categoryId}
						setValue={setCategoryId}
					/>
					{/* <Select>
                <SelectTrigger>
                  <SelectValue>Category</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

					<Select>
						<SelectTrigger>
							<SelectValue>Difficulty</SelectValue>
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

					<Button
						variant='outline'
						className='flex items-center gap-2 grow h-auto'
					>
						<Filter className='size-4' />
						More Filters
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
