import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { env } from './env'

export const authClient = createAuthClient({
	baseURL: env.BETTER_AUTH_URL,
	plugins: [usernameClient()]
})
