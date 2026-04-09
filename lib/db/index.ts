// =============================================================================
// Database Connection
// =============================================================================
// Drizzle ORM database connection for Oil Amor
// =============================================================================

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as refillSchema from './schema-refill'

// Database connection string from environment
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create postgres client
const client = postgres(connectionString, {
  prepare: false, // Required for Supabase/Neon compatibility
  max: 10, // Connection pool size
})

// Create Drizzle database instance
export const db = drizzle(client, {
  schema: {
    ...refillSchema,
  },
})

// Export schema for use in other files
export * from './schema-refill'

// Export type helper
export type Database = typeof db
