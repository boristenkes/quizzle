'use server'

import { db } from '@/db'
import { getSession } from '@/lib/auth'
import { pickColumns } from '@/utils/helpers'

export async function getCategories() {
	const isAuthenticated = await getSession()

	if (!isAuthenticated) throw new Error('Unauthorized')

	const categories = await db.query.quizCategoriesTable.findMany({
		columns: pickColumns('id', 'name', 'slug'),
		orderBy: (cols, { asc }) => asc(cols.slug)
	})

	return categories
}
