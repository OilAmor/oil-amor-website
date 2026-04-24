/**
 * Oil Amor — Unified Order Types
 * Enterprise-grade type system for all order variants
 */

import { OrderStatus, OrderCustomMix, OrderAttachment, ShippingAddress, ShippingInfo, PaymentInfo } from '@/lib/db/schema/orders'

// ============================================================================
// ORDER ITEM TYPE CLASSIFICATION
// ============================================================================

export type OrderItemType =
  | 'custom_blend'      // Mixing Atelier creation
  | 'collection_blend'  // Pre-defined collection blend
  | 'community_blend'   // Community-published blend
  | 'pure_oil'          // Single essential oil
  | 'carrier_oil'       // Single carrier oil / roller
  | 'crystal'           // Crystal add-on
  | 'cord_charm'        // Cord or charm attachment
  | 'refill'            // Any blend type as refill (50ml/100ml)
  | 'forever_bottle'    // Forever bottle hardware
  | 'gift_card'         // Gift card
  | 'shipping'          // Shipping line item

// ============================================================================
// ENRICHED ORDER ITEM (admin-facing)
// ============================================================================

export interface EnrichedOrderItem {
  // Core identifiers
  id: string
  name: string
  type: OrderItemType

  // Pricing (in dollars for admin display, cents in DB)
  unitPrice: number
  quantity: number
  totalPrice: number

  // Product classification
  productType?: 'pure_oil' | 'carrier_oil' | 'crystal' | 'attachment' | 'forever_bottle'
  oilId?: string
  crystalId?: string
  bottleSize?: number // 5, 10, 15, 20, 30, 50, 100

  // For custom blends (Mixing Atelier)
  customMix?: {
    name: string
    mode: 'pure' | 'carrier'
    totalVolume: number
    strength?: string
    oils: Array<{
      oilId: string
      oilName: string
      ml: number
      percentage: number
      drops?: number
    }>
    carrierOil?: string
    carrierPercentage?: number
    carrierMl?: number
    crystal?: string
    cord?: string
    intendedUse?: string
    safetyScore: number
    safetyRating: string
    safetyWarnings: string[]
    batchId: string
  }

  // For collection / community blends
  collectionBlendId?: string
  collectionBlendName?: string
  communityBlendId?: string
  communityBlendName?: string
  communityBlendCreatorId?: string
  communityBlendCreatorName?: string
  commissionRate?: number
  commissionAmount?: number

  // For refills
  isRefill?: boolean
  originalBatchId?: string
  sourceVolume?: number
  targetVolume?: number
  originalOrderId?: string
  scaledRecipe?: {
    oils: Array<{ oilName: string; ml: number; percentage: number }>
    carrierOil?: string
    carrierMl?: number
    totalVolume: number
  }

  // Visual / display
  imageUrl?: string
  description?: string

  // Attachments
  attachment?: OrderAttachment

  // Unlock tracking
  unlocksOilId?: string
  unlocksOilName?: string
}

// ============================================================================
// ENRICHED ORDER (admin-facing)
// ============================================================================

export interface EnrichedOrder {
  // Identification
  id: string

  // Customer
  customerId: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  isGuest: boolean

  // Status
  status: OrderStatus
  statusHistory: {
    status: OrderStatus
    timestamp: string
    note?: string
    changedBy?: string
  }[]

  // Line Items (enriched)
  items: EnrichedOrderItem[]

  // Totals
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  storeCreditUsed: number
  giftCardUsed: number
  total: number
  currency: string

  // Payment
  payment: PaymentInfo

  // Shipping
  shippingAddress: ShippingAddress
  shipping: ShippingInfo

  // Discounts
  discountCode?: string
  discountType?: 'percentage' | 'fixed'
  discountValue?: number

  // Special Flags
  isGift: boolean
  giftMessage?: string
  giftReceipt: boolean

  // Blending
  requiresBlending: boolean
  blendingPriority?: 'normal' | 'rush'

  // Refill Program
  eligibleForReturns: boolean
  returnCreditsEarned: number
  returnCreditsUsed: number

  // Notes
  customerNote?: string
  internalNote?: string
  metadata?: Record<string, unknown>

  // Timestamps
  createdAt: string
  updatedAt: string
  processingCompletedAt?: string
}

// ============================================================================
// ORDER FILTERS
// ============================================================================

export interface OrderFilters {
  status?: OrderStatus[]
  type?: OrderItemType[]
  search?: string // customer name, email, order ID, blend name
  dateFrom?: string
  dateTo?: string
  requiresBlending?: boolean
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// STATUS TRANSITION
// ============================================================================

export interface StatusTransition {
  from: OrderStatus
  to: OrderStatus
  allowed: boolean
  requiresNote?: boolean
  triggersEmail?: string
  autoActions?: string[]
}

export const VALID_STATUS_TRANSITIONS: StatusTransition[] = [
  { from: 'pending', to: 'confirmed', allowed: true, triggersEmail: 'order_confirmed' },
  { from: 'pending', to: 'cancelled', allowed: true, triggersEmail: 'order_cancelled' },
  { from: 'confirmed', to: 'blending', allowed: true, triggersEmail: 'blend_mixing' },
  { from: 'confirmed', to: 'cancelled', allowed: true, triggersEmail: 'order_cancelled' },
  { from: 'blending', to: 'quality-check', allowed: true },
  { from: 'blending', to: 'cancelled', allowed: true, requiresNote: true, triggersEmail: 'order_cancelled' },
  { from: 'quality-check', to: 'ready-to-ship', allowed: true, triggersEmail: 'order_ready' },
  { from: 'quality-check', to: 'blending', allowed: true, requiresNote: true },
  { from: 'ready-to-ship', to: 'shipped', allowed: true, triggersEmail: 'order_shipped' },
  { from: 'ready-to-ship', to: 'cancelled', allowed: true, requiresNote: true, triggersEmail: 'order_cancelled' },
  { from: 'shipped', to: 'delivered', allowed: true, triggersEmail: 'order_delivered' },
  { from: 'shipped', to: 'cancelled', allowed: false },
  { from: 'delivered', to: 'refunded', allowed: true, requiresNote: true },
  { from: 'cancelled', to: 'pending', allowed: false },
]

export function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
  const transition = VALID_STATUS_TRANSITIONS.find(t => t.from === from && t.to === to)
  return transition?.allowed ?? false
}

export function getTransitionEmailTemplate(from: OrderStatus, to: OrderStatus): string | undefined {
  const transition = VALID_STATUS_TRANSITIONS.find(t => t.from === from && t.to === to)
  return transition?.triggersEmail
}

// ============================================================================
// PRODUCTION QUEUE ITEM
// ============================================================================

export interface ProductionQueueItem {
  orderId: string
  itemId: string
  customerName: string
  customerEmail: string
  blendName: string
  type: OrderItemType
  mode?: 'pure' | 'carrier'
  bottleSize: number
  oils: Array<{ oilName: string; ml: number; percentage: number }>
  carrierOil?: string
  carrierMl?: number
  crystal?: string
  cord?: string
  safetyScore: number
  safetyWarnings: string[]
  priority: 'normal' | 'rush'
  queuedAt: string
  status: OrderStatus
  batchId?: string
}

// ============================================================================
// COMMISSION SUMMARY
// ============================================================================

export interface CommissionSummary {
  creatorId: string
  creatorName: string
  totalEarned: number
  pendingAmount: number
  paidAmount: number
  totalSales: number
  blendCount: number
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  mixingOrders: number
  readyOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  averageOrderValue: number
  totalCommissions: number
  pendingCommissions: number
  lowStockItems: string[]
  orderBreakdown: Record<string, number>
  source: 'local'
}
