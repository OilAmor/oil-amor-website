/**
 * Database Migration API
 * Adds missing columns to existing tables
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

const MIGRATE_KEY = process.env.DB_SETUP_KEY || 'oil-amor-setup-2024'

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()
    if (key !== MIGRATE_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const results: string[] = []
    
    // Add missing columns to orders table
    const columnsToAdd = [
      { name: 'store_credit_used', type: 'INTEGER NOT NULL DEFAULT 0' },
      { name: 'gift_card_used', type: 'INTEGER NOT NULL DEFAULT 0' },
      { name: 'return_credits_earned', type: 'INTEGER NOT NULL DEFAULT 0' },
      { name: 'return_credits_used', type: 'INTEGER NOT NULL DEFAULT 0' },
    ]
    
    for (const col of columnsToAdd) {
      try {
        await pool.query(`
          ALTER TABLE orders 
          ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}
        `)
        results.push(`Added column: ${col.name}`)
      } catch (e: any) {
        results.push(`Failed to add ${col.name}: ${e?.message}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results,
    })
    
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error?.message },
      { status: 500 }
    )
  }
}
