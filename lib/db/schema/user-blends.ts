/**
 * User Blends Schema
 * Stores blends created or purchased by users
 * Enables re-purchasing and brand ambassador features
 */

import { pgTable, text, timestamp, jsonb, index, integer, boolean, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * User's personal blend library
 * Includes blends they've created, purchased, or saved
 */
export const userBlends = pgTable(
  'user_blends',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    
    // Blend identification
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    shareCode: text('share_code').notNull().unique(), // e.g., "OIL-ABCD-1234"
    
    // Blend data (matches OrderCustomMix structure)
    recipe: jsonb('recipe').$type<{
      mode: 'pure' | 'carrier'
      oils: Array<{
        oilId: string
        oilName: string
        drops: number
        percentage: number
      }>
      carrierRatio?: number
      totalVolume: 5 | 10 | 15 | 20 | 30 | 50 | 100
      safetyScore: number
      safetyRating: string
      safetyWarnings: string[]
    }>().notNull(),
    
    // Metadata
    description: text('description'),
    intendedUse: text('intended_use'),
    tags: text('tags').array(),
    
    // Purchase/creation tracking
    createdFromOrderId: text('created_from_order_id'), // If from purchase
    originalCommunityBlendId: text('original_community_blend_id'), // If saved from community
    
    // Brand ambassador stats
    isBrandAmbassadorEnabled: boolean('is_brand_ambassador_enabled').default(false),
    totalShares: integer('total_shares').default(0),
    totalViews: integer('total_views').default(0),
    totalPurchasesViaShare: integer('total_purchases_via_share').default(0),
    totalCreditsEarned: integer('total_credits_earned').default(0), // in cents
    
    // Status
    isPublic: boolean('is_public').default(false),
    isDeleted: boolean('is_deleted').default(false),
    
    // Timestamps
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
    lastPurchasedAt: timestamp('last_purchased_at', { mode: 'date' }),
  },
  (table) => ({
    userIdIdx: index('user_blend_user_id_idx').on(table.userId),
    shareCodeIdx: uniqueIndex('user_blend_share_code_idx').on(table.shareCode),
    slugIdx: index('user_blend_slug_idx').on(table.slug),
    publicIdx: index('user_blend_public_idx').on(table.isPublic),
  })
)

/**
 * Referral tracking for brand ambassador program
 * Tracks when someone purchases via a shared blend link
 */
export const blendReferrals = pgTable(
  'blend_referrals',
  {
    id: text('id').primaryKey(),
    
    // Referral tracking
    shareCode: text('share_code').notNull(), // The code used
    referrerUserId: text('referrer_user_id').notNull(), // Original creator
    referredUserId: text('referred_user_id'), // Who bought (null if guest)
    
    // Purchase details
    orderId: text('order_id').notNull(),
    blendId: text('blend_id').notNull().references(() => userBlends.id), // The blend that was purchased
    purchaseAmount: integer('purchase_amount').notNull(), // in cents
    
    // Credit calculation
    creditEarned: integer('credit_earned').notNull(), // in cents (e.g., 10% of purchase)
    creditStatus: text('credit_status').$type<'pending' | 'applied' | 'failed'>().default('pending'),
    creditAppliedAt: timestamp('credit_applied_at', { mode: 'date' }),
    
    // Attribution
    referrerIp: text('referrer_ip'), // For fraud detection
    userAgent: text('user_agent'),
    
    // Timestamps
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    shareCodeIdx: index('referral_share_code_idx').on(table.shareCode),
    referrerIdx: index('referral_referrer_idx').on(table.referrerUserId),
    orderIdx: uniqueIndex('referral_order_idx').on(table.orderId),
    statusIdx: index('referral_status_idx').on(table.creditStatus),
  })
)

/**
 * Relations
 */
export const userBlendsRelations = relations(userBlends, ({ many }) => ({
  referrals: many(blendReferrals),
}))

export const blendReferralsRelations = relations(blendReferrals, ({ one }) => ({
  blend: one(userBlends, {
    fields: [blendReferrals.blendId],
    references: [userBlends.id],
  }),
}))

/**
 * Type exports
 */
export type UserBlend = typeof userBlends.$inferSelect
export type InsertUserBlend = typeof userBlends.$inferInsert
export type BlendReferral = typeof blendReferrals.$inferSelect
export type InsertBlendReferral = typeof blendReferrals.$inferInsert
