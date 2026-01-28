import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.fixedWindow(5, '1d'),
	prefix: 'quizzle'
})
