'use server'

import { db } from '@/db'
import { User, usersTable } from '@/db/schema'
import { getSession } from '@/lib/auth'
import { omitColumns } from '@/utils/helpers'
import { ServerActionResponse } from '@/utils/types'
import { eq, or } from 'drizzle-orm'
import { quizCountQuery, totalAttemptsQuery } from './queries'

export type GetUserUser = Omit<
	User,
	'emailVerified' | 'displayUsername' | 'updatedAt'
> & {
	quizCount: number
	totalAttempts: number
}

export async function getUser(
	identifier: User['id'] | User['username']
): Promise<ServerActionResponse<{ user: GetUserUser }>> {
	try {
		const session = await getSession()

		if (!session) throw new Error('Unauthroized')

		if (!identifier) throw new Error('Bad Request: identifier not provided')

		const user = await db.query.usersTable.findFirst({
			where: or(
				eq(usersTable.id, identifier),
				eq(usersTable.username, identifier)
			),
			columns: omitColumns('emailVerified', 'displayUsername', 'updatedAt'),
			extras: {
				quizCount: quizCountQuery,
				totalAttempts: totalAttemptsQuery
			}
		})

		if (!user) return { success: false, message: 'notFound' }

		return { success: true, user }
	} catch (error) {
		console.error('[GET_USER]:', error)
		return { success: false }
	}
}
