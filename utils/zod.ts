import z from 'zod'

export const requiredString = z.string().trim().nonempty({ error: 'Required' })

export const integerSchema = z.coerce.number({ error: 'Required' }).int()
