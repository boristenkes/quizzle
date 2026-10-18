import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_URL: z.url(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		UPLOADTHING_TOKEN: z.string(),
		GEMINI_API_KEY: z.string(),

		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development')
	},
	client: {
		NEXT_PUBLIC_BASE_URL: z.url().default('http://localhost:3000')
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
	}
})
