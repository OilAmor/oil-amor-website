/**
 * Oil Amor Customer Authentication Bridge
 * Bridges Shopify Customer Accounts with Oil Amor profile data
 */

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { TierLevel } from '@/lib/rewards/tiers'
import { getCustomerMetafields, updateCustomerMetafields, CustomerMetafields } from './metafields'

// ========================================
// Types & Interfaces
// ========================================

export interface ShopifyCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  acceptsMarketing: boolean
  createdAt: string
  updatedAt: string
  defaultAddress?: {
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    zip: string
    phone?: string
  }
}

export interface CustomerRewardsProfile {
  tier: TierLevel
  totalSpend: number
  purchaseCount: number
  accountCredit: number
  unlockedChains: string[]
  collectedCharms: string[]
  foreverBottles: string[]
  refillUnlocked: boolean
  refillCount: number
  preferredCrystals: string[]
  lastPurchaseDate?: Date
  tierUpgradeDate?: Date
}

export interface AuthenticatedContext {
  customer: ShopifyCustomer
  oilAmorProfile: CustomerRewardsProfile
  isAuthenticated: true
}

export type AuthenticatedHandler = (
  req: NextRequest,
  context: AuthenticatedContext
) => Promise<NextResponse> | NextResponse

export type Handler = (req: NextRequest) => Promise<NextResponse> | NextResponse

// ========================================
// Shopify Client Configuration
// ========================================

const storefrontClient = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
}

const adminClient = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
}

// ========================================
// Authentication Functions
// ========================================

/**
 * Authenticate a customer using Shopify Customer Access Token
 * Returns combined Shopify + Oil Amor profile data
 */
export async function authenticateCustomer(
  shopifyCustomerId: string
): Promise<{
  oilAmorProfile: CustomerRewardsProfile
  shopifyCustomer: ShopifyCustomer
}> {
  // Fetch Shopify customer data
  const shopifyCustomer = await fetchShopifyCustomer(shopifyCustomerId)
  
  // Fetch Oil Amor metafields
  const metafields = await getCustomerMetafields(shopifyCustomerId)
  
  // Build Oil Amor profile
  const oilAmorProfile: CustomerRewardsProfile = {
    tier: (metafields.crystal_circle_tier as TierLevel) || 'seed',
    totalSpend: metafields.total_spend || 0,
    purchaseCount: metafields.purchase_count || 0,
    accountCredit: metafields.account_credit || 0,
    unlockedChains: metafields.unlocked_chains || [],
    collectedCharms: metafields.collected_charms || [],
    foreverBottles: metafields.forever_bottles || [],
    refillUnlocked: metafields.refill_unlocked || false,
    refillCount: metafields.refill_count || 0,
    preferredCrystals: metafields.preferred_crystals || [],
    lastPurchaseDate: metafields.last_purchase_date 
      ? new Date(metafields.last_purchase_date) 
      : undefined,
    tierUpgradeDate: metafields.tier_upgrade_date 
      ? new Date(metafields.tier_upgrade_date) 
      : undefined,
  }

  return {
    oilAmorProfile,
    shopifyCustomer,
  }
}

/**
 * Fetch customer data from Shopify
 */
async function fetchShopifyCustomer(customerId: string): Promise<ShopifyCustomer> {
  const query = `
    query GetCustomer($customerId: ID!) {
      customer(id: $customerId) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        updatedAt
        defaultAddress {
          address1
          address2
          city
          province
          country
          zip
          phone
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
        variables: { customerId },
      }),
    }
  )

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Failed to fetch customer: ${JSON.stringify(data.errors)}`)
  }

  if (!data.data?.customer) {
    throw new Error('Customer not found')
  }

  return data.data.customer
}

/**
 * Sync customer data between Shopify and Oil Amor
 * Ensures metafields are up to date
 */
export async function syncCustomerData(shopifyCustomerId: string): Promise<void> {
  const shopifyCustomer = await fetchShopifyCustomer(shopifyCustomerId)
  const metafields = await getCustomerMetafields(shopifyCustomerId)

  // Initialize metafields if new customer
  if (!metafields.crystal_circle_tier) {
    await initializeCustomerMetafields(shopifyCustomerId, shopifyCustomer)
  }

  // Sync any derived fields or updates
  // This could include updating preferred crystals based on purchase history,
  // recalculating tier status, etc.
}

/**
 * Initialize metafields for a new customer
 */
async function initializeCustomerMetafields(
  customerId: string,
  shopifyCustomer: ShopifyCustomer
): Promise<void> {
  const initialData: Partial<CustomerMetafields> = {
    crystal_circle_tier: 'seed',
    total_spend: 0,
    purchase_count: 0,
    account_credit: 0,
    unlocked_chains: [], // Default: no chains unlocked at seed tier
    collected_charms: [],
    forever_bottles: [],
    refill_unlocked: false,
    refill_count: 0,
    preferred_crystals: [],
  }

  await updateCustomerMetafields(customerId, initialData)

  // Send welcome email (in production, trigger via email service)
  console.log(`Welcome email triggered for ${shopifyCustomer.email}`)
}

// ========================================
// Middleware
// ========================================

/**
 * Middleware wrapper for authenticated routes
 * Ensures customer is logged in and provides their data to the handler
 */
export function withCustomerAuth(
  handler: AuthenticatedHandler
): Handler {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get customer token from cookie
      const customerAccessToken = await getCustomerAccessToken()

      if (!customerAccessToken) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please log in to continue' },
          { status: 401 }
        )
      }

      // Validate token and get customer ID
      const customerId = await validateAccessToken(customerAccessToken)

      if (!customerId) {
        // Clear invalid token
        await clearCustomerAccessToken()
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Session expired. Please log in again.' },
          { status: 401 }
        )
      }

      // Fetch complete customer data
      const { shopifyCustomer, oilAmorProfile } = await authenticateCustomer(customerId)

      // Call the authenticated handler
      return handler(req, {
        customer: shopifyCustomer,
        oilAmorProfile,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to authenticate' },
        { status: 500 }
      )
    }
  }
}

/**
 * Optional auth middleware - allows both authenticated and guest users
 */
export function withOptionalAuth(
  handler: (
    req: NextRequest,
    context: AuthenticatedContext | { isAuthenticated: false }
  ) => Promise<NextResponse> | NextResponse
): Handler {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const customerAccessToken = await getCustomerAccessToken()

      if (!customerAccessToken) {
        // Guest user
        return handler(req, { isAuthenticated: false })
      }

      const customerId = await validateAccessToken(customerAccessToken)

      if (!customerId) {
        // Invalid token, treat as guest
        return handler(req, { isAuthenticated: false })
      }

      // Authenticated user
      const { shopifyCustomer, oilAmorProfile } = await authenticateCustomer(customerId)

      return handler(req, {
        customer: shopifyCustomer,
        oilAmorProfile,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Optional auth error:', error)
      return handler(req, { isAuthenticated: false })
    }
  }
}

// ========================================
// Token Management
// ========================================

const CUSTOMER_TOKEN_COOKIE = 'oil_amor_customer_token'
const CUSTOMER_ID_COOKIE = 'oil_amor_customer_id'

/**
 * Store customer access token
 */
export async function setCustomerAccessToken(
  token: string,
  customerId: string
): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  cookieStore.set(CUSTOMER_ID_COOKIE, customerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

/**
 * Get customer access token from cookies
 */
async function getCustomerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value || null
}

/**
 * Get customer ID from cookies
 */
export async function getCustomerIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_ID_COOKIE)?.value || null
}

/**
 * Clear customer access token
 */
export async function clearCustomerAccessToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE)
  cookieStore.delete(CUSTOMER_ID_COOKIE)
}

/**
 * Validate access token with Shopify
 */
async function validateAccessToken(token: string): Promise<string | null> {
  const query = `
    query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
      }
    }
  `

  try {
    const response = await fetch(
      `https://${storefrontClient.storeDomain}/api/${storefrontClient.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontClient.publicAccessToken,
        },
        body: JSON.stringify({
          query,
          variables: { customerAccessToken: token },
        }),
      }
    )

    const data = await response.json()
    return data.data?.customer?.id || null
  } catch {
    return null
  }
}

// ========================================
// Customer Actions
// ========================================

/**
 * Create a new customer account
 */
export async function createCustomerAccount(input: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  acceptsMarketing?: boolean
}): Promise<{ customerId: string; accessToken: string }> {
  const query = `
    mutation CreateCustomer($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${storefrontClient.storeDomain}/api/${storefrontClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontClient.publicAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            email: input.email,
            password: input.password,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            acceptsMarketing: input.acceptsMarketing ?? false,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.customerCreate?.customerUserErrors?.length > 0) {
    const error = data.data.customerCreate.customerUserErrors[0]
    throw new Error(`${error.field}: ${error.message}`)
  }

  const customerId = data.data?.customerCreate?.customer?.id
  const accessToken = data.data?.customerCreate?.customerAccessToken?.accessToken

  if (!customerId || !accessToken) {
    throw new Error('Failed to create customer account')
  }

  // Initialize Oil Amor metafields
  await initializeCustomerMetafields(customerId, {
    id: customerId,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    acceptsMarketing: input.acceptsMarketing ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return { customerId, accessToken }
}

/**
 * Login customer
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<{ customerId: string; accessToken: string }> {
  const query = `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${storefrontClient.storeDomain}/api/${storefrontClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontClient.publicAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            email,
            password,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
    const error = data.data.customerAccessTokenCreate.customerUserErrors[0]
    throw new Error(error.message)
  }

  const accessToken = data.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken

  if (!accessToken) {
    throw new Error('Invalid credentials')
  }

  // Get customer ID from token
  const customerId = await validateAccessToken(accessToken)

  if (!customerId) {
    throw new Error('Failed to retrieve customer information')
  }

  // Sync customer data
  await syncCustomerData(customerId)

  return { customerId, accessToken }
}

/**
 * Logout customer
 */
export async function logoutCustomer(accessToken: string): Promise<void> {
  const query = `
    mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `

  await fetch(
    `https://${storefrontClient.storeDomain}/api/${storefrontClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontClient.publicAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken: accessToken },
      }),
    }
  )

  await clearCustomerAccessToken()
}

/**
 * Recover customer password
 */
export async function recoverPassword(email: string): Promise<void> {
  const query = `
    mutation CustomerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${storefrontClient.storeDomain}/api/${storefrontClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontClient.publicAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { email },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.customerRecover?.customerUserErrors?.length > 0) {
    const error = data.data.customerRecover.customerUserErrors[0]
    throw new Error(error.message)
  }
}

// ========================================
// Helper Functions
// ========================================

/**
 * Check if customer has unlocked a specific chain type
 */
export function hasUnlockedChain(
  profile: CustomerRewardsProfile,
  chainType: string
): boolean {
  return profile.unlockedChains.includes(chainType)
}

/**
 * Check if customer has collected a specific charm
 */
export function hasCollectedCharm(
  profile: CustomerRewardsProfile,
  charmId: string
): boolean {
  return profile.collectedCharms.includes(charmId)
}

/**
 * Get customer's tier progress percentage
 */
export function getTierProgress(profile: CustomerRewardsProfile): number {
  const tierThresholds: Record<TierLevel, { min: number; max: number }> = {
    seed: { min: 0, max: 149 },
    sprout: { min: 150, max: 349 },
    bloom: { min: 350, max: 699 },
    radiance: { min: 700, max: 1499 },
    luminary: { min: 1500, max: Infinity },
  }

  const current = tierThresholds[profile.tier]
  
  if (profile.tier === 'luminary') {
    return 100
  }

  const progress = ((profile.totalSpend - current.min) / (current.max - current.min)) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * Get next tier information
 */
export function getNextTier(profile: CustomerRewardsProfile): {
  tier: TierLevel | null
  spendNeeded: number
} {
  const tierOrder: TierLevel[] = ['seed', 'sprout', 'bloom', 'radiance', 'luminary']

  const currentIndex = tierOrder.indexOf(profile.tier)
  
  if (currentIndex === tierOrder.length - 1) {
    return { tier: null, spendNeeded: 0 }
  }

  const nextTier = tierOrder[currentIndex + 1]
  const tierThresholds: Record<TierLevel, number> = {
    seed: 0,
    sprout: 150,
    bloom: 350,
    radiance: 700,
    luminary: 1500,
  }

  return {
    tier: nextTier,
    spendNeeded: Math.max(0, tierThresholds[nextTier] - profile.totalSpend),
  }
}
