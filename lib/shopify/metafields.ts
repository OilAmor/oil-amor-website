/**
 * Oil Amor Shopify Metafields System
 * Manages product and customer metafields for configuration data
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { TierLevel } from '@/lib/rewards/tiers'

// ========================================
// Metafield Namespaces
// ========================================

export const METAFIELD_NAMESPACES = {
  oil: 'oil_amor.oil_properties',
  crystal: 'oil_amor.crystal_properties',
  configuration: 'oil_amor.product_config',
  rewards: 'oil_amor.customer_rewards',
  refill: 'oil_amor.refill_data',
  analytics: 'oil_amor.analytics',
} as const

// ========================================
// Metafield Type Definitions
// ========================================

export interface OilMetafields {
  'botanical_name': string
  'origin': string
  'extraction_method': string
  'therapeutic_properties': string[]
  'safety_notes': string
  'recommended_crystals': string[] // crystal slugs
  'synergy_content': Record<string, string> // crystal slug → content ID
  'elemental_affinity'?: string[]
  'chakra_alignment'?: string[]
  'intention_tags'?: string[]
}

export interface CrystalMetafields {
  'chakra': string
  'element': string
  'zodiac': string[]
  'meaning': string
  'origin': string
  'properties': string[]
  'rarity': 'common' | 'uncommon' | 'rare' | 'legendary'
  'cleansing_method': string
  'charging_method': string
}

export interface ProductConfigMetafields {
  'bottle_sizes': Array<{
    size: string
    volume_ml: number
    price_multiplier: number
    crystal_count: number
  }>
  'available_cords': string[]
  'available_charms': string[]
  'base_price': number
  'is_featured': boolean
  'is_new_arrival': boolean
}

export interface CustomerMetafields {
  'crystal_circle_tier': TierLevel
  'total_spend': number
  'purchase_count': number
  'account_credit': number
  'unlocked_chains': string[]
  'collected_charms': string[]
  'forever_bottles': string[] // serial numbers
  'refill_unlocked': boolean
  'refill_count': number
  'preferred_crystals': string[]
  'last_purchase_date'?: string
  'tier_upgrade_date'?: string
}

export interface RefillMetafields {
  'refill_eligible_bottles': Array<{
    serial_number: string
    oil_type: string
    purchase_date: string
    refill_count: number
    last_refill_date?: string
  }>
  'refill_history': Array<{
    date: string
    bottle_serial: string
    oil_type: string
    status: 'pending' | 'shipped' | 'delivered'
  }>
}

export interface AnalyticsMetafields {
  'view_count': number
  'add_to_cart_count': number
  'purchase_count': number
  'popular_combinations': Array<{
    oil_id: string
    crystal_id: string
    count: number
  }>
}

// ========================================
// Shopify Admin API Client
// ========================================

// Admin API for metafield mutations (requires private app token)
const adminClient = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
}

// Storefront API for metafield queries
const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
})

// ========================================
// Product Metafield Operations
// ========================================

/**
 * Set oil product metafields
 * Uses Shopify Admin API
 */
export async function setOilMetafields(
  productId: string,
  metafields: Partial<OilMetafields>
): Promise<void> {
  const mutations = Object.entries(metafields).map(([key, value]) => ({
    namespace: METAFIELD_NAMESPACES.oil,
    key,
    value: JSON.stringify(value),
    type: Array.isArray(value) ? 'json' : 'single_line_text_field',
  }))

  for (const mutation of mutations) {
    await setProductMetafield(productId, mutation)
  }
}

/**
 * Set crystal product metafields
 */
export async function setCrystalMetafields(
  productId: string,
  metafields: Partial<CrystalMetafields>
): Promise<void> {
  const mutations = Object.entries(metafields).map(([key, value]) => ({
    namespace: METAFIELD_NAMESPACES.crystal,
    key,
    value: JSON.stringify(value),
    type: Array.isArray(value) ? 'json' : 'single_line_text_field',
  }))

  for (const mutation of mutations) {
    await setProductMetafield(productId, mutation)
  }
}

/**
 * Set product configuration metafields
 */
export async function setProductConfigMetafields(
  productId: string,
  metafields: Partial<ProductConfigMetafields>
): Promise<void> {
  const mutations = Object.entries(metafields).map(([key, value]) => ({
    namespace: METAFIELD_NAMESPACES.configuration,
    key,
    value: JSON.stringify(value),
    type: 'json',
  }))

  for (const mutation of mutations) {
    await setProductMetafield(productId, mutation)
  }
}

/**
 * Internal: Set a single product metafield via Admin API
 */
async function setProductMetafield(
  productId: string,
  metafield: {
    namespace: string
    key: string
    value: string
    type: string
  }
): Promise<void> {
  const query = `
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
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
          metafields: [
            {
              ownerId: productId,
              namespace: metafield.namespace,
              key: metafield.key,
              value: metafield.value,
              type: metafield.type,
            },
          ],
        },
      }),
    }
  )

  const data = await response.json()

  if (data.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`)
  }

  if (data.data?.metafieldsSet?.userErrors?.length > 0) {
    throw new Error(
      `Metafield errors: ${JSON.stringify(data.data.metafieldsSet.userErrors)}`
    )
  }
}

// ========================================
// Customer Metafield Operations
// ========================================

/**
 * Get customer metafields
 */
export async function getCustomerMetafields(
  customerId: string
): Promise<Partial<CustomerMetafields>> {
  const query = `
    query GetCustomerMetafields($customerId: ID!) {
      customer(id: $customerId) {
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
              type
            }
          }
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
    throw new Error(`Failed to get customer metafields: ${JSON.stringify(data.errors)}`)
  }

  const metafields: Partial<CustomerMetafields> = {}

  for (const edge of data.data?.customer?.metafields?.edges || []) {
    const node = edge.node
    if (node.namespace === METAFIELD_NAMESPACES.rewards) {
      try {
        ;(metafields as Record<string, unknown>)[node.key] = JSON.parse(node.value)
      } catch {
        ;(metafields as Record<string, unknown>)[node.key] = node.value
      }
    }
  }

  return metafields
}

/**
 * Update customer metafields
 */
export async function updateCustomerMetafields(
  customerId: string,
  updates: Partial<CustomerMetafields>
): Promise<void> {
  const metafields = Object.entries(updates).map(([key, value]) => ({
    ownerId: customerId,
    namespace: METAFIELD_NAMESPACES.rewards,
    key,
    value: JSON.stringify(value),
    type: typeof value === 'number' ? 'number_integer' : 'json',
  }))

  const query = `
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
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
        variables: { metafields },
      }),
    }
  )

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Failed to update customer metafields: ${JSON.stringify(data.errors)}`)
  }

  if (data.data?.metafieldsSet?.userErrors?.length > 0) {
    throw new Error(
      `Metafield update errors: ${JSON.stringify(data.data.metafieldsSet.userErrors)}`
    )
  }
}

/**
 * Increment customer numeric metafield
 * Useful for purchase counts, total spend, etc.
 */
export async function incrementCustomerMetafield(
  customerId: string,
  key: keyof CustomerMetafields,
  incrementBy: number = 1
): Promise<number> {
  const current = await getCustomerMetafields(customerId)
  const currentValue = (current[key] as number) || 0
  const newValue = currentValue + incrementBy

  await updateCustomerMetafields(customerId, { [key]: newValue } as Partial<CustomerMetafields>)

  return newValue
}

/**
 * Add item to customer array metafield
 * Useful for collected charms, unlocked chains, etc.
 */
export async function addToCustomerArrayMetafield(
  customerId: string,
  key: keyof CustomerMetafields,
  item: string
): Promise<void> {
  const current = await getCustomerMetafields(customerId)
  const currentArray = (current[key] as string[]) || []
  
  if (!currentArray.includes(item)) {
    const newArray = [...currentArray, item]
    await updateCustomerMetafields(customerId, { [key]: newArray } as Partial<CustomerMetafields>)
  }
}

// ========================================
// Refill Metafield Operations
// ========================================

/**
 * Get refill data for a customer
 */
export async function getRefillMetafields(
  customerId: string
): Promise<Partial<RefillMetafields>> {
  const query = `
    query GetRefillMetafields($customerId: ID!) {
      customer(id: $customerId) {
        metafields(first: 10, namespace: "${METAFIELD_NAMESPACES.refill}") {
          edges {
            node {
              key
              value
            }
          }
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
  const metafields: Partial<RefillMetafields> = {}

  for (const edge of data.data?.customer?.metafields?.edges || []) {
    try {
      ;(metafields as Record<string, unknown>)[edge.node.key] = JSON.parse(edge.node.value)
    } catch {
      ;(metafields as Record<string, unknown>)[edge.node.key] = edge.node.value
    }
  }

  return metafields
}

/**
 * Register a new Forever Bottle for refill
 */
export async function registerForeverBottle(
  customerId: string,
  serialNumber: string,
  oilType: string
): Promise<void> {
  const refillData = await getRefillMetafields(customerId)
  const eligibleBottles = refillData.refill_eligible_bottles || []

  const newBottle = {
    serial_number: serialNumber,
    oil_type: oilType,
    purchase_date: new Date().toISOString(),
    refill_count: 0,
  }

  await updateCustomerMetafields(customerId, {
    forever_bottles: [...((await getCustomerMetafields(customerId)).forever_bottles || []), serialNumber],
  })

  // Also update refill-specific metafield
  const query = `
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  await fetch(
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
          metafields: [
            {
              ownerId: customerId,
              namespace: METAFIELD_NAMESPACES.refill,
              key: 'refill_eligible_bottles',
              value: JSON.stringify([...eligibleBottles, newBottle]),
              type: 'json',
            },
          ],
        },
      }),
    }
  )
}

// ========================================
// Product Query Operations (Storefront API)
// ========================================

/**
 * Get oil metafields via Storefront API
 */
export async function getOilMetafieldsStorefront(
  productHandle: string
): Promise<Partial<OilMetafields>> {
  const query = `
    query GetOilMetafields($handle: String!) {
      product(handle: $handle) {
        metafields(identifiers: [
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "botanical_name"},
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "origin"},
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "extraction_method"},
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "therapeutic_properties"},
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "recommended_crystals"},
          {namespace: "${METAFIELD_NAMESPACES.oil}", key: "synergy_content"}
        ]) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  `

  const { data } = await storefrontClient.request(query, {
    variables: { handle: productHandle },
  })

  const metafields: Partial<OilMetafields> = {}

  for (const edge of data?.product?.metafields?.edges || []) {
    const node = edge.node
    try {
      ;(metafields as Record<string, unknown>)[node.key] = JSON.parse(node.value)
    } catch {
      ;(metafields as Record<string, unknown>)[node.key] = node.value
    }
  }

  return metafields
}

/**
 * Get crystal metafields via Storefront API
 */
export async function getCrystalMetafieldsStorefront(
  productHandle: string
): Promise<Partial<CrystalMetafields>> {
  const query = `
    query GetCrystalMetafields($handle: String!) {
      product(handle: $handle) {
        metafields(identifiers: [
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "chakra"},
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "element"},
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "zodiac"},
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "meaning"},
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "properties"},
          {namespace: "${METAFIELD_NAMESPACES.crystal}", key: "rarity"}
        ]) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  `

  const { data } = await storefrontClient.request(query, {
    variables: { handle: productHandle },
  })

  const metafields: Partial<CrystalMetafields> = {}

  for (const edge of data?.product?.metafields?.edges || []) {
    const node = edge.node
    try {
      ;(metafields as Record<string, unknown>)[node.key] = JSON.parse(node.value)
    } catch {
      ;(metafields as Record<string, unknown>)[node.key] = node.value
    }
  }

  return metafields
}

// ========================================
// Analytics Metafield Operations
// ========================================

/**
 * Increment product analytics counter
 */
export async function incrementProductAnalytics(
  productId: string,
  metric: 'view_count' | 'add_to_cart_count' | 'purchase_count'
): Promise<void> {
  const query = `
    query GetProductMetafield($productId: ID!) {
      product(id: $productId) {
        metafield(namespace: "${METAFIELD_NAMESPACES.analytics}", key: "${metric}") {
          value
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
        variables: { productId },
      }),
    }
  )

  const data = await response.json()
  const currentValue = parseInt(data.data?.product?.metafield?.value || '0')
  const newValue = currentValue + 1

  await setProductMetafield(productId, {
    namespace: METAFIELD_NAMESPACES.analytics,
    key: metric,
    value: newValue.toString(),
    type: 'number_integer',
  })
}

/**
 * Record popular combination
 */
export async function recordPopularCombination(
  productId: string,
  oilId: string,
  crystalId: string
): Promise<void> {
  // This would typically update a JSON metafield with combination counts
  // Implementation depends on how you want to structure the data
  console.log(`Recording combination: ${oilId} + ${crystalId} for product ${productId}`)
}
