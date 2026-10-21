import { difficulties } from '@/lib/constants'
import { integerSchema } from '@/utils/zod'
import z from 'zod'

export const PAGE_SIZE = 6
export const MAX_QUERY_LENGTH = 50

export const filterQuizzesSchema = z.object({
	page: integerSchema.positive().default(1),
	pageSize: integerSchema.positive().default(PAGE_SIZE),
	query: z.string().trim().max(MAX_QUERY_LENGTH).optional(),
	category: z.string().trim().optional(),
	difficulty: z.enum(difficulties).optional()
})

export type FilterQuizzesSchema = z.infer<typeof filterQuizzesSchema>
