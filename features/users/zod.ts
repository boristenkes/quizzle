import { usernameSchema } from '@/features/auth/zod'
import { pickColumns } from '@/utils/helpers'
import { requiredString } from '@/utils/zod'
import z from 'zod'

export const userSchema = z.object({
	id: z.ulid(),
	username: usernameSchema.optional(),
	email: z.email(),
	emailVerified: z.boolean(),
	name: requiredString,
	role: z.enum(['user', 'admin']).default('user'),
	image: z.url().optional().nullable(),
	displayUsername: requiredString.optional(),
	bio: z
		.string()
		.optional()
		.nullable()
		.transform(v => v?.toString()),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type UserSchema = z.infer<typeof userSchema>

export const editUserSchema = userSchema
	.pick(pickColumns('name', 'username', 'email', 'bio', 'image'))
	.partial()

export type EditUserSchema = z.infer<typeof editUserSchema>

export const userImageFileSchema = z
	.file()
	.max(4 * 1024 * 1024) // 4MB
	.mime(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
