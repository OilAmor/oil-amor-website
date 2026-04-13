/**
 * Database Connection
 * 
 * Central database client for all refill modules and services.
 * Uses Drizzle ORM with node-postgres for type-safe database access.
 */

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema-refill'

// Validate required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

/**
 * PostgreSQL connection pool with optimized settings for production
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection not established
} as ConstructorParameters<typeof Pool>[0])

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err)
})

/**
 * Drizzle ORM database client with schema
 * 
 * Usage:
 *   import { db } from '@/lib/db'
 *   const bottles = await db.select().from(foreverBottles)
 */
export const db = drizzle(pool, { schema })

/**
 * Database type for use in function signatures
 * 
 * Usage:
 *   async function getBottles(db: DB) { ... }
 */
export type DB = typeof db

/**
 * Raw pool for transactions or direct queries when needed
 */
export { pool }

/**
 * Graceful shutdown helper
 * Call this when shutting down the application
 */
export async function closeDatabase(): Promise<void> {
  await pool.end()
}
