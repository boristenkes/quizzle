import 'server-only'

import { env } from '@/lib/env'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
	connectionString: env.DATABASE_URL
})

export const db = drizzle({
	client: pool,
	casing: 'snake_case',
	// logger: true,
	schema
})
