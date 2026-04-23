/**
 * Unlocked Refills Schema
 * 
 * Tracks which custom blends a user has unlocked for refill purchases.
 * When a user buys a custom blend, it becomes available for refill in larger sizes.
 */

import { pgTable, text, timestamp, jsonb, index, integer, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Custom blend refills unlocked by users
 * Created when user purchases a custom blend from Mixing Atelier
 */
export const unlockedRefills = pgTable(
  'unlocked_refills',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    
    // Reference to original order/blend
    originalOrderId: text('original_order_id').notNull(),
    originalOrderItemId: text('original_order_item_id'), // Specific line item
    
    // Blend details (preserved from original purchase)
    name: text('name').notNull(), // The name user gave their blend
    description: text('description'),
    intendedUse: text('intended_use'),
    tags: text('tags').array(),
    
    // The normalized recipe (percentages, not absolute amounts)
    // This allows perfect scaling to 50ml or 100ml
    recipe: jsonb('recipe').$type<{
      mode: 'pure' | 'carrier'
      oils: Array<{
        oilId: string
        oilName: string
        percentage: number  // Percentage of essential oil blend
      }>
      carrierRatio?: number  // For carrier blends: % that's essential oils
      totalVolume: number    // Original volume (5, 10, 15, 30)
      
      // Safety data preserved
      safetyScore: number
      safetyRating: string
      safetyWarnings: string[]
    }>().notNull(),
    
    // Refill availability
    availableSizes: jsonb('available_sizes').$type<Array<{
      size: 50 | 100
      price: number  // in cents
      isAvailable: boolean
      lastPurchasedAt?: string
    }>>().notNull().default([]),
    
    // Usage tracking
    refillCount: integer('refill_count').notNull().default(0),
    lastRefilledAt: timestamp('last_refilled_at', { mode: 'date' }),
    
    // Brand ambassador (if user shared this blend)
    shareCode: text('share_code'), // Links to userBlends table
    
    // Status
    isActive: boolean('is_active').default(true),
    isDeleted: boolean('is_deleted').default(false),
    
    // Timestamps
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('unlocked_refill_user_id_idx').on(table.userId),
    orderIdIdx: index('unlocked_refill_order_id_idx').on(table.originalOrderId),
    activeIdx: index('unlocked_refill_active_idx').on(table.isActive),
    shareCodeIdx: index('unlocked_refill_share_code_idx').on(table.shareCode),
  })
)

/**
 * Relations
 */
export const unlockedRefillsRelations = relations(unlockedRefills, ({ one }) => ({
  // Could add relation to userBlends if needed
}))

/**
 * Type exports
 */
export type UnlockedRefill = typeof unlockedRefills.$inferSelect
export type InsertUnlockedRefill = typeof unlockedRefills.$inferInsert
