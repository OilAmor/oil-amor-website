// =============================================================================
// Refill System Database Schema (Drizzle ORM)
// =============================================================================
// Defines tables for the Forever Bottle refill system
// =============================================================================

import { pgTable, uuid, varchar, integer, jsonb, timestamp, boolean, decimal, text, index } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// =============================================================================
// FOREVER BOTTLES TABLE
// =============================================================================

export const foreverBottles = pgTable('forever_bottles', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: varchar('order_id', { length: 255 }).notNull(),
  orderNumber: varchar('order_number', { length: 50 }),
  customerId: varchar('customer_id', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  bottleSku: varchar('bottle_sku', { length: 100 }).notNull(),
  bottleSize: varchar('bottle_size', { length: 20 }).notNull(),
  bottleMaterial: varchar('bottle_material', { length: 20 }).default('Glass').notNull(),
  oilType: varchar('oil_type', { length: 100 }).notNull(),
  totalCredits: integer('total_credits').default(6).notNull(),
  creditsRemaining: integer('credits_remaining').default(6).notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  crystalVialType: varchar('crystal_vial_type', { length: 50 }),
  purchasedAt: timestamp('purchased_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  notes: text('notes'),
  tags: text('tags').array().default([]),
}, (table) => ({
  customerIdIdx: index('idx_forever_bottles_customer_id').on(table.customerId),
  customerEmailIdx: index('idx_forever_bottles_customer_email').on(table.customerEmail),
  orderIdIdx: index('idx_forever_bottles_order_id').on(table.orderId),
  statusIdx: index('idx_forever_bottles_status').on(table.status),
}))

export const foreverBottlesRelations = relations(foreverBottles, ({ many }) => ({
  refillOrders: many(refillOrders),
  credits: many(customerCredits),
}))

// =============================================================================
// REFILL ORDERS TABLE
// =============================================================================

export const refillOrders = pgTable('refill_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  bottleId: uuid('bottle_id').references(() => foreverBottles.id, { onDelete: 'set null' }),
  oilType: varchar('oil_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  
  // Return label (JSON with trackingNumber, labelUrl, etc.)
  returnLabel: jsonb('return_label').$type<{
    trackingNumber: string
    labelUrl: string
    consignmentId: string
    createdAt: string
  }>(),
  
  // Shipping address
  customerAddress: jsonb('customer_address').$type<{
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    postcode: string
    country: string
    phone?: string
  }>().notNull(),
  
  // Order pricing
  standardPrice: decimal('standard_price', { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal('discounted_price', { precision: 10, scale: 2 }).notNull(),
  creditApplied: decimal('credit_applied', { precision: 10, scale: 2 }).default('5').notNull(),
  finalPrice: decimal('final_price', { precision: 10, scale: 2 }).notNull(),
  
  // Tracking
  trackingNumber: varchar('tracking_number', { length: 100 }),
  trackingStatus: varchar('tracking_status', { length: 50 }),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  labelGeneratedAt: timestamp('label_generated_at', { withTimezone: true }),
  receivedAt: timestamp('received_at', { withTimezone: true }),
  inspectedAt: timestamp('inspected_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  
  // Inspection results
  inspectionResult: varchar('inspection_result', { length: 20 }),
  inspectionNotes: text('inspection_notes'),
  
  // Shopify order reference
  shopifyOrderId: varchar('shopify_order_id', { length: 255 }),
}, (table) => ({
  customerIdIdx: index('idx_refill_orders_customer_id').on(table.customerId),
  bottleIdIdx: index('idx_refill_orders_bottle_id').on(table.bottleId),
  statusIdx: index('idx_refill_orders_status').on(table.status),
  trackingNumberIdx: index('idx_refill_orders_tracking').on(table.trackingNumber),
  createdAtIdx: index('idx_refill_orders_created_at').on(table.createdAt),
}))

export const refillOrdersRelations = relations(refillOrders, ({ one }) => ({
  bottle: one(foreverBottles, {
    fields: [refillOrders.bottleId],
    references: [foreverBottles.id],
  }),
}))

// =============================================================================
// CUSTOMER CREDITS TABLE
// =============================================================================

export const customerCredits = pgTable('customer_credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  bottleId: uuid('bottle_id').references(() => foreverBottles.id, { onDelete: 'cascade' }),
  orderId: varchar('order_id', { length: 255 }),
  creditNumber: integer('credit_number').notNull(),
  status: varchar('status', { length: 20 }).default('available').notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  usedForOrderId: varchar('used_for_order_id', { length: 255 }),
  oilSelections: jsonb('oil_selections').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
}, (table) => ({
  bottleIdIdx: index('idx_customer_credits_bottle_id').on(table.bottleId),
  customerIdIdx: index('idx_customer_credits_customer_id').on(table.customerId),
  statusIdx: index('idx_customer_credits_status').on(table.status),
  orderIdIdx: index('idx_customer_credits_order_id').on(table.orderId),
}))

// =============================================================================
// CREDIT RESERVATIONS TABLE
// =============================================================================

export const creditReservations = pgTable('credit_reservations', {
  id: varchar('id', { length: 255 }).primaryKey(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  committedAt: timestamp('committed_at', { withTimezone: true }),
  releasedAt: timestamp('released_at', { withTimezone: true }),
}, (table) => ({
  customerIdIdx: index('idx_credit_reservations_customer_id').on(table.customerId),
  statusIdx: index('idx_credit_reservations_status').on(table.status),
}))

// =============================================================================
// CUSTOMER REWARDS TABLE
// =============================================================================

export const customerRewards = pgTable('customer_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: varchar('customer_id', { length: 255 }).notNull().unique(),
  currentTier: varchar('current_tier', { length: 50 }).default('amber').notNull(),
  accountCredit: decimal('account_credit', { precision: 10, scale: 2 }).default('0').notNull(),
  reservedCredit: decimal('reserved_credit', { precision: 10, scale: 2 }).default('0').notNull(),
  refillUnlocked: boolean('refill_unlocked').default(false).notNull(),
  totalPurchases: integer('total_purchases').default(0).notNull(),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  customerIdIdx: index('idx_customer_rewards_customer_id').on(table.customerId),
  tierIdx: index('idx_customer_rewards_tier').on(table.currentTier),
}))

// =============================================================================
// NOTIFICATIONS TABLE
// =============================================================================

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  customerIdIdx: index('idx_notifications_customer_id').on(table.customerId),
  readIdx: index('idx_notifications_read').on(table.read),
  createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
}))

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ForeverBottle = typeof foreverBottles.$inferSelect
export type NewForeverBottle = typeof foreverBottles.$inferInsert

export type RefillOrder = typeof refillOrders.$inferSelect
export type NewRefillOrder = typeof refillOrders.$inferInsert

export type CustomerCredit = typeof customerCredits.$inferSelect
export type NewCustomerCredit = typeof customerCredits.$inferInsert

export type CreditReservation = typeof creditReservations.$inferSelect
export type NewCreditReservation = typeof creditReservations.$inferInsert

export type CustomerRewards = typeof customerRewards.$inferSelect
export type NewCustomerRewards = typeof customerRewards.$inferInsert

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
