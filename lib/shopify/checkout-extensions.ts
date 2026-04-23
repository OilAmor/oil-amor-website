/**
 * Oil Amor Shopify Checkout Extensions
 * 
 * Customizes checkout experience with Crystal Circle tier discounts, 
 * credit application with reservation pattern, and rewards status.
 * 
 * NOTE: Uses TierLevel from @/lib/rewards/tiers - the single source of truth
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { 
  TierLevel, 
  CRYSTAL_CIRCLE_TIERS, 
  TIER_ORDER,
  calculateTier,
  getProgressToNextTier,
  getSpendToNextTier
} from '@/lib/rewards/tiers'
import { 
  reserveCreditForCheckout,
  commitCreditReservation,
  releaseCreditReservation,
  getAvailableCredit
} from '@/lib/rewards/customer-rewards'
import { 
  getCustomerMetafields, 
  updateCustomerMetafields
} from './metafields'

// ========================================
// Types & Interfaces
// ========================================

export interface CheckoutCustomization {
  // Apply tier-based discounts
  tierDiscount?: {
    tier: TierLevel
    discountPercentage: number
    applicableTo: 'refills' | 'all'
  }
  
  // Apply account credit with reservation
  creditApplication?: {
    amount: number
    reservationId: string
    discountCode: string
    remainingBalance: number
  }
  
  // Show Crystal Circle status
  customerStatus?: {
    tier: TierLevel
    progressToNext: number
    nextTier?: TierLevel
    spendToNextTier: number
  }
  
  // Refill eligibility notice
  refillNotice?: {
    unlocked: boolean
    eligibleBottles: number
    message: string
  }
}

export interface DiscountCode {
  code: string
  percentage: number
  expiresAt: string
  usageLimit: number
}

export interface CheckoutLineItem {
  id: string
  title: string
  quantity: number
  originalPrice: number
  discountedPrice?: number
  attributes: Record<string, string>
}

export interface CreditReservationResult {
  discountCode: string
  reservationId: string
  amount: number
  expiresAt: Date
}

// ========================================
// Shopify Clients
// ========================================

const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
})

const adminClient = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
}

// ========================================
// Checkout Customization Functions
// ========================================

/**
 * Customize checkout based on customer data
 * Returns discount eligibility, credit availability, and tier status
 */
export async function customizeCheckout(
  checkoutId: string,
  customerId: string
): Promise<CheckoutCustomization> {
  const customerData = await getCustomerMetafields(customerId)
  const checkoutData = await getCheckoutData(checkoutId)

  const customization: CheckoutCustomization = {}

  // Get tier from customer data (source of truth is Shopify metafields)
  const tier = (customerData.crystal_circle_tier as TierLevel) || 'seed'
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier]

  // Apply tier discount for refills
  customization.tierDiscount = {
    tier,
    discountPercentage: tierConfig.refillDiscount,
    applicableTo: tierConfig.refillDiscount > 0 ? 'refills' : 'all',
  }

  // Calculate available credit (excluding any already reserved)
  const availableCredit = await getAvailableCredit(customerId)
  const checkoutTotal = checkoutData.totalPrice
  const creditToApply = Math.min(availableCredit, checkoutTotal)

  if (creditToApply > 0) {
    // Reserve credit and get discount code
    const reservation = await applyCreditToCheckout(customerId, creditToApply)
    
    customization.creditApplication = {
      amount: creditToApply,
      reservationId: reservation.reservationId,
      discountCode: reservation.discountCode,
      remainingBalance: availableCredit - creditToApply,
    }
  }

  // Calculate tier progress
  const totalSpend = customerData.total_spend || 0
  const nextTierIndex = TIER_ORDER.indexOf(tier) + 1
  const nextTier = TIER_ORDER[nextTierIndex]

  if (nextTier) {
    const spendToNextTier = getSpendToNextTier(totalSpend, tier)
    const progressToNext = getProgressToNextTier(totalSpend, tier)

    customization.customerStatus = {
      tier,
      progressToNext,
      nextTier,
      spendToNextTier,
    }
  } else {
    // Luminary tier - no next tier
    customization.customerStatus = {
      tier,
      progressToNext: 100,
      spendToNextTier: 0,
    }
  }

  // Check refill eligibility
  const refillUnlocked = customerData.refill_unlocked || false
  const foreverBottles = (customerData.forever_bottles as string[]) || []

  customization.refillNotice = {
    unlocked: refillUnlocked,
    eligibleBottles: foreverBottles.length,
    message: refillUnlocked
      ? `You have ${foreverBottles.length} Forever Bottle${foreverBottles.length > 1 ? 's' : ''} eligible for refill`
      : 'Purchase a 30ml bottle to unlock Forever Bottle refills',
  }

  return customization
}

/**
 * Get checkout data from Shopify
 */
async function getCheckoutData(checkoutId: string): Promise<{
  lineItems: CheckoutLineItem[]
  subtotalPrice: number
  totalPrice: number
  customerId?: string
}> {
  const query = `
    query GetCheckout($checkoutId: ID!) {
      node(id: $checkoutId) {
        ... on Checkout {
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  price {
                    amount
                  }
                }
                customAttributes {
                  key
                  value
                }
              }
            }
          }
          subtotalPrice {
            amount
          }
          totalPrice {
            amount
          }
        }
      }
    }
  `

  const { data } = await storefrontClient.request(query, {
    variables: { checkoutId },
  })

  const checkout = data?.node

  return {
    lineItems: checkout?.lineItems?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      quantity: edge.node.quantity,
      originalPrice: parseFloat(edge.node.variant?.price?.amount || '0'),
      attributes: edge.node.customAttributes?.reduce((acc: Record<string, string>, attr: any) => {
        acc[attr.key] = attr.value
        return acc
      }, {}),
    })) || [],
    subtotalPrice: parseFloat(checkout?.subtotalPrice?.amount || '0'),
    totalPrice: parseFloat(checkout?.totalPrice?.amount || '0'),
  }
}

// ========================================
// Credit Application with Reservation Pattern
// ========================================

/**
 * Apply account credit to checkout with reservation
 * Creates a reservation that must be committed or released
 * 
 * @param customerId - Customer's unique identifier
 * @param amount - Amount of credit to apply
 * @returns Reservation details including discount code
 */
export async function applyCreditToCheckout(
  customerId: string,
  amount: number
): Promise<CreditReservationResult> {
  // Reserve credit in the rewards system
  const { reservationId, discountCode } = await reserveCreditForCheckout(customerId, amount)

  // Create the discount code in Shopify
  await createFixedAmountDiscountCode({
    code: discountCode,
    amount,
    customerIds: [customerId],
  })

  return {
    discountCode,
    reservationId,
    amount,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  }
}

/**
 * Confirm credit reservation after successful order
 * Call this from order webhook when order is paid
 * @param reservationId - The reservation ID from applyCreditToCheckout
 */
export async function confirmCreditReservation(reservationId: string): Promise<void> {
  await commitCreditReservation(reservationId)
}

/**
 * Cancel credit reservation (order abandoned/failed)
 * Returns credit to customer's available balance
 * @param reservationId - The reservation ID
 */
export async function cancelCreditReservation(reservationId: string): Promise<void> {
  await releaseCreditReservation(reservationId)
}

/**
 * Create fixed amount discount code in Shopify
 */
async function createFixedAmountDiscountCode(discount: {
  code: string
  amount: number
  customerIds: string[]
}): Promise<void> {
  const query = `
    mutation DiscountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${adminClient.storeDomain}/admin/api/${adminClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminClient.accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          basicCodeDiscount: {
            title: `Account Credit - ${discount.code}`,
            code: discount.code,
            startsAt: new Date().toISOString(),
            endsAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
            customerSelection: {
              customers: {
                add: discount.customerIds,
              },
            },
            customerGets: {
              value: {
                discountAmount: {
                  amount: discount.amount.toString(),
                  appliesOnEachItem: false,
                },
              },
              items: {
                all: true,
              },
            },
            usageLimit: 1,
            appliesOncePerCustomer: true,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Failed to create credit discount: ${JSON.stringify(data.errors)}`)
  }
}

// ========================================
// Tier Discount Code Generation
// ========================================

/**
 * Generate a unique discount code for tier refill benefits
 */
export async function generateTierDiscountCode(
  customerId: string,
  tier: TierLevel
): Promise<string> {
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier]
  
  if (tierConfig.refillDiscount === 0) {
    throw new Error('No discount available for this tier')
  }

  const code = generateDiscountCode(customerId, tier)
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  await createPercentageDiscountCode({
    code,
    percentage: tierConfig.refillDiscount,
    expiresAt: expiresAt.toISOString(),
    usageLimit: 100,
    customerIds: [customerId],
  })

  return code
}

/**
 * Generate a unique discount code string
 */
function generateDiscountCode(customerId: string | number, tier: TierLevel): string {
  const tierPrefix = tier.substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  const customerHash = String(customerId).slice(-6).toUpperCase()
  
  return `OILAMOR-${tierPrefix}-${customerHash}-${timestamp}`
}

/**
 * Create percentage discount code in Shopify
 */
async function createPercentageDiscountCode(discount: {
  code: string
  percentage: number
  expiresAt: string
  usageLimit: number
  customerIds: string[]
}): Promise<void> {
  const query = `
    mutation DiscountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${adminClient.storeDomain}/admin/api/${adminClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminClient.accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          basicCodeDiscount: {
            title: `Tier Discount - ${discount.code}`,
            code: discount.code,
            startsAt: new Date().toISOString(),
            endsAt: discount.expiresAt,
            customerSelection: {
              customers: {
                add: discount.customerIds,
              },
            },
            customerGets: {
              value: {
                percentage: discount.percentage,
              },
              items: {
                all: true,
              },
            },
            usageLimit: discount.usageLimit,
            appliesOncePerCustomer: false,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Failed to create discount code: ${JSON.stringify(data.errors)}`)
  }
}

// ========================================
// Checkout Line Item Processing
// ========================================

/**
 * Process line items for tier discounts
 */
export function applyTierDiscountToLineItems(
  lineItems: CheckoutLineItem[],
  tier: TierLevel
): CheckoutLineItem[] {
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier]
  
  if (tierConfig.refillDiscount === 0) {
    return lineItems
  }

  return lineItems.map(item => {
    // Check if discount applies to this item (only refills)
    const isRefill = item.attributes?._product_type === 'refill'

    if (!isRefill) {
      return item
    }

    const discountMultiplier = 1 - (tierConfig.refillDiscount / 100)
    
    return {
      ...item,
      discountedPrice: Math.round(item.originalPrice * discountMultiplier * 100) / 100,
    }
  })
}

/**
 * Calculate checkout totals with discounts applied
 */
export function calculateCheckoutTotals(
  lineItems: CheckoutLineItem[],
  creditAmount: number = 0
): {
  subtotal: number
  discountAmount: number
  creditApplied: number
  total: number
} {
  const subtotal = lineItems.reduce((sum, item) => 
    sum + (item.originalPrice * item.quantity), 0
  )

  const discountedTotal = lineItems.reduce((sum, item) => {
    const price = item.discountedPrice || item.originalPrice
    return sum + (price * item.quantity)
  }, 0)

  const discountAmount = subtotal - discountedTotal
  const creditApplied = Math.min(creditAmount, discountedTotal)
  const total = discountedTotal - creditApplied

  return {
    subtotal,
    discountAmount,
    creditApplied,
    total,
  }
}

// ========================================
// Tier Upgrade Check
// ========================================

/**
 * Check and process tier upgrade
 * Returns true if tier was upgraded
 * 
 * NOTE: This function is maintained for backward compatibility.
 * Prefer using handleShopifyOrderWebhook from customer-rewards.ts
 */
export async function checkTierUpgrade(
  customerId: string,
  newPurchaseAmount: number
): Promise<{
  upgraded: boolean
  oldTier?: TierLevel
  newTier?: TierLevel
  rewards?: string[]
}> {
  const customerData = await getCustomerMetafields(customerId)
  const currentTier = (customerData.crystal_circle_tier as TierLevel) || 'seed'
  const totalSpend = (customerData.total_spend || 0) + newPurchaseAmount

  // Determine new tier based on total spend
  const newTier = calculateTier(totalSpend)

  if (newTier !== currentTier) {
    // Tier upgrade!
    const rewards = getTierUpgradeRewards(newTier)
    
    await updateCustomerMetafields(customerId, {
      crystal_circle_tier: newTier,
      total_spend: totalSpend,
      tier_upgrade_date: new Date().toISOString(),
      unlocked_chains: CRYSTAL_CIRCLE_TIERS[newTier].unlockedChains,
    })

    return {
      upgraded: true,
      oldTier: currentTier,
      newTier,
      rewards,
    }
  }

  return { upgraded: false }
}

/**
 * Get rewards for tier upgrade
 */
function getTierUpgradeRewards(tier: TierLevel): string[] {
  const config = CRYSTAL_CIRCLE_TIERS[tier]
  const rewards: string[] = []
  
  // Add benefits
  rewards.push(...config.benefits)
  
  // Add chain unlocks
  if (config.unlockedChains.length > 0) {
    const chains = config.unlockedChains.join(', ')
    rewards.push(`Unlock ${chains} chain${config.unlockedChains.length > 1 ? 's' : ''}`)
  }
  
  // Add charm unlocks
  if (config.unlockedCharms.length > 0 && !config.unlockedCharms.includes('all')) {
    rewards.push(`Unlock exclusive charms`)
  }
  
  return rewards
}
