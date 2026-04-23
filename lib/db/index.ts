/**
 * Database Connection
 * 
 * Central database client for all refill modules and services.
 * Uses Drizzle ORM with node-postgres for type-safe database access.
 */

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Validate required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

/**
 * PostgreSQL connection pool with optimized settings for production
 * 
 * SSL/TLS is controlled entirely by the DATABASE_URL connection string.
 * Managed providers (Neon, Supabase, Vercel Postgres, AWS RDS, etc.)
 * include SSL parameters in their connection strings. We do NOT override
 * ssl here because:
 *  1. It breaks connection-string SSL configuration
 *  2. rejectUnauthorized: false enables MITM attacks
 *  3. ssl: true can fail with self-signed certs without proper CA config
 * 
 * If you need custom SSL (e.g. private CA), append ?sslmode=verify-ca&sslrootcert=/path/to/ca.crt
 * to your DATABASE_URL or set the PGSSLROOTCERT environment variable.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
