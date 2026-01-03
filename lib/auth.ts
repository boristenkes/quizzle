import { db } from '@/db'
import { users } from '@/db/schema'
import { accounts, sessions, verifications } from '@/db/schema/auth'
import { usernameSchema } from '@/features/auth/zod'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'
import { ulid } from 'ulid'
import { env } from './env'

export const auth = betterAuth({
	appName: 'Quizzle',
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		camelCase: false,
		usePlural: true,
		schema: { users, sessions, accounts, verifications }
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
		deleteUser: { enabled: true }
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
