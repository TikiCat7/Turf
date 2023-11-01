import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const pg = neon(process.env.DATABASE_URL)

export const db = drizzle(pg, { schema: schema })
