import { db } from '@/db'
import { usersTable } from '@/db/schema'
import {
	accountsTable,
	sessionsTable,
	verificationsTable
} from '@/db/schema/auth'
import { usernameSchema } from '@/features/auth/zod'
import { getUploadthingKey } from '@/utils/helpers'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'
import { ulid } from 'ulid'
import { env } from './env'
import { uploadthing } from './uploadthing'

export const auth = betterAuth({
	appName: 'Quizzle',
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		camelCase: false,
		usePlural: true,
		schema: {
			users: usersTable,
			sessions: sessionsTable,
			accounts: accountsTable,
			verifications: verificationsTable
		}
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			prompt: 'select_account'
		}
	},
	advanced: {
		database: {
			generateId: () => ulid()
		}
	},
	plugins: [
		username({
			usernameValidator: username => {
				const { success } = usernameSchema.safeParse(username)

				if (!success) console.error('[INVALID_USERNAME]:', username)

				return success
			}
		})
	],
	user: {
		additionalFields: {
			bio: { type: 'string', input: true, required: false },
			role: { type: 'string', defaultValue: 'user' }
		},
		deleteUser: {
			enabled: true,
			async afterDelete(user) {
				const imageKey = getUploadthingKey(user.image)

				if (!imageKey) return

				const response = await uploadthing.deleteFiles(imageKey)

				if (!response.success)
					console.error('[DELETE_USER_IMAGE]:', { response, imageKey })
			}
		},
		changeEmail: {
			enabled: true,
			updateEmailWithoutVerification: true
		}
	}
})

export type GetSessionProps = Omit<
	Parameters<typeof auth.api.getSession>[0],
	'headers'
>

export const getSession = cache(async (props: GetSessionProps = {}) => {
	const session = await auth.api.getSession({
		headers: await headers(),
		...props
	})

	return session
})
