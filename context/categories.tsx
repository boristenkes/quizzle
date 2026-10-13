'use client'

import { QuizCategory } from '@/db/schema'
import { getCategories } from '@/features/categories/actions'
import { Nullable } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

export type CategoriesContext = Pick<QuizCategory, 'id' | 'name' | 'slug'>

export type CategoriesContextValue = Nullable<CategoriesContext[]>

export const CategoriesContext = createContext<CategoriesContextValue>(null)

export function useCategories() {
	const context = useContext(CategoriesContext)

	return context
}

export function CategoriesProvider({
	children
}: {
	children: React.ReactNode
}) {
	const query = useQuery({
		queryKey: ['categories:get'],
		queryFn: () => getCategories()
	})

	return (
		<CategoriesContext.Provider value={query.data}>
			{children}
		</CategoriesContext.Provider>
	)
}
