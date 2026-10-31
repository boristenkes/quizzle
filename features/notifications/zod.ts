import { requiredString } from '@/utils/zod'
import z from 'zod'

const baseNotificationSchema = z.object({
	id: z.ulid(),
	readAt: z.date().nullable(),
	createdAt: z.date(),
	issuer: z.object({
		id: z.ulid(),
		name: requiredString,
		username: requiredString,
		image: z.url().trim().optional().nullable()
	})
})

const quizSchema = z.object({
	id: z.ulid(),
	title: requiredString,
	slug: requiredString
})

export const notificationSchema = z.discriminatedUnion('type', [
	baseNotificationSchema.extend({
		type: z.literal('new_follower')
	}),
	baseNotificationSchema.extend({
		type: z.literal('new_review'),
		quiz: quizSchema,
		reviewId: z.ulid()
	}),
	baseNotificationSchema.extend({
		type: z.literal('new_attempt'),
		quiz: quizSchema,
		attemptId: z.ulid()
	})
])

export type NotificationSchema = z.infer<typeof notificationSchema>
