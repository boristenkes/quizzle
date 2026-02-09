import { integerSchema } from '@/utils/zod'
import z from 'zod'

export const newReviewSchema = z.object({
	comment: z.string().trim().optional(),
	rating: integerSchema.min(1).max(5)
})

export type NewReviewSchema = z.infer<typeof newReviewSchema>
