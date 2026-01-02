import { requiredString } from '@/utils/zod'
import z from 'zod'

export const usernameRegex = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/

export const usernameSchema = requiredString.regex(usernameRegex, {
	error: 'Invalid username'
})

export const signUpSchema = z
	.object({
		name: requiredString
			.min(2, { error: 'Min 2 characters' })
			.max(20, { error: 'Max 20 characters' }),
		username: usernameSchema,
		email: z.email(),
		password: requiredString
			.min(8, { error: 'Min 8 characters' })
			.max(128, { error: 'Max 128 characters' }),
		confirmPassword: requiredString
	})
	.refine(values => values.password === values.confirmPassword, {
		error: "Passwords don't match",
		path: ['confirmPassword']
	})

export type SignUpSchema = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
	identifier: z.email().or(requiredString),
	password: requiredString
})

export type SignInSchema = z.infer<typeof signInSchema>
