/**
 * Oil Amor Cart Transformation System
 * Transforms configured products into Shopify cart line items
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { TierLevel } from '../../app/types'

// ========================================
// Types & Interfaces
// ========================================

export type BottleSize = '5ml' | '10ml' | '15ml' | '20ml' | '30ml'

export interface ConfiguredProduct {
  oilVariantId: string
  bottleSize: BottleSize
  crystalType: string
  crystalCount: number
  accessory: {
    type: 'cord' | 'charm' | 'extra-crystals'
    cordType?: string
    charmType?: string
    extraCrystalCount?: number
  }
  customerTier: TierLevel
  creditToApply?: number
  synergyContentId?: string
}

export interface CartLineItem {
  merchandiseId: string
  quantity: number
  attributes: Array<{
    key: string
    value: string
  }>
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          product: {
            title: string
          }
        }
        attributes: Array<{
          key: string
          value: string
        }>
      }
    }>
  }
  cost: {
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

export interface CartTransformationResult {
  lineItems: CartLineItem[]
  metadata: {
    oilLineCount: number
    crystalLineCount: number
    accessoryLineCount: number
    creditLineCount: number
    totalLines: number
  }
}

// ========================================
// Shopify Client
// ========================================

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
})

// ========================================
// Product Variant IDs (from environment or config)
// ========================================

const PRODUCT_VARIANTS = {
  // Crystal products ( priced at $0 as they're included)
  CRYSTAL_BUNCH: process.env.SHOPIFY_CRYSTAL_BUNCH_VARIANT_ID || '',
  EXTRA_CRYSTALS: process.env.SHOPIFY_EXTRA_CRYSTALS_VARIANT_ID || '',
  
  // Accessory products (priced at $0 as they're included)
  CORD_WAXED_COTTON: process.env.SHOPIFY_CORD_WAXED_COTTON_VARIANT_ID || '',
  CORD_HEMP: process.env.SHOPIFY_CORD_HEMP_VARIANT_ID || '',
  CORD_SILK: process.env.SHOPIFY_CORD_SILK_VARIANT_ID || '',
  CORD_LEATHER: process.env.SHOPIFY_CORD_LEATHER_VARIANT_ID || '',
  
  CHARM_CRESCENT_MOON: process.env.SHOPIFY_CHARM_CRESCENT_VARIANT_ID || '',
  CHARM_SUN: process.env.SHOPIFY_CHARM_SUN_VARIANT_ID || '',
  CHARM_STARS: process.env.SHOPIFY_CHARM_STARS_VARIANT_ID || '',
  CHARM_TREE_OF_LIFE: process.env.SHOPIFY_CHARM_TREE_VARIANT_ID || '',
  CHARM_LOTUS: process.env.SHOPIFY_CHARM_LOTUS_VARIANT_ID || '',
  CHARM_OM: process.env.SHOPIFY_CHARM_OM_VARIANT_ID || '',
  
  // Credit application (negative price adjustment)
  CREDIT_APPLICATION: process.env.SHOPIFY_CREDIT_VARIANT_ID || '',
}

// Cord type to variant ID mapping
const CORD_VARIANT_MAP: Record<string, string> = {
  'waxed-cotton': PRODUCT_VARIANTS.CORD_WAXED_COTTON,
  'hemp': PRODUCT_VARIANTS.CORD_HEMP,
  'silk': PRODUCT_VARIANTS.CORD_SILK,
  'leather': PRODUCT_VARIANTS.CORD_LEATHER,
}

// Charm type to variant ID mapping
const CHARM_VARIANT_MAP: Record<string, string> = {
  'crescent-moon': PRODUCT_VARIANTS.CHARM_CRESCENT_MOON,
  'sun': PRODUCT_VARIANTS.CHARM_SUN,
  'stars': PRODUCT_VARIANTS.CHARM_STARS,
  'tree-of-life': PRODUCT_VARIANTS.CHARM_TREE_OF_LIFE,
  'lotus': PRODUCT_VARIANTS.CHARM_LOTUS,
  'om': PRODUCT_VARIANTS.CHARM_OM,
}

// ========================================
// Cart Fragments
// ========================================

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`

// ========================================
// Cart Transformation Functions
// ========================================

/**
 * Transform a configured Oil Amor product into Shopify cart line items
 * Creates multiple line items representing the complete configuration
 */
export async function transformToCartItems(
  configuredProduct: ConfiguredProduct
): Promise<CartTransformationResult> {
  const lineItems: CartLineItem[] = []
  let oilLineCount = 0
  let crystalLineCount = 0
  let accessoryLineCount = 0
  let creditLineCount = 0

  // Line Item 1: The Oil (main product with bottle size variant)
  const oilLineItem: CartLineItem = {
    merchandiseId: configuredProduct.oilVariantId,
    quantity: 1,
    attributes: buildCoreAttributes(configuredProduct),
  }
  lineItems.push(oilLineItem)
  oilLineCount = 1

  // Line Item 2: Crystal Bunch (included with oil)
  if (PRODUCT_VARIANTS.CRYSTAL_BUNCH) {
    const crystalLineItem: CartLineItem = {
      merchandiseId: PRODUCT_VARIANTS.CRYSTAL_BUNCH,
      quantity: configuredProduct.crystalCount,
      attributes: [
        { key: '_component_type', value: 'crystal' },
        { key: '_crystal_type', value: configuredProduct.crystalType },
        { key: '_crystal_count', value: configuredProduct.crystalCount.toString() },
        { key: '_pricing_note', value: 'Included with oil purchase' },
        { key: '_parent_line', value: 'oil' },
      ],
    }
    lineItems.push(crystalLineItem)
    crystalLineCount = 1
  }

  // Line Item 3: Extra Crystals (if selected)
  if (configuredProduct.accessory.type === 'extra-crystals' && 
      configuredProduct.accessory.extraCrystalCount &&
      PRODUCT_VARIANTS.EXTRA_CRYSTALS) {
    const extraCrystalsLineItem: CartLineItem = {
      merchandiseId: PRODUCT_VARIANTS.EXTRA_CRYSTALS,
      quantity: configuredProduct.accessory.extraCrystalCount,
      attributes: [
        { key: '_component_type', value: 'extra-crystals' },
        { key: '_crystal_type', value: configuredProduct.crystalType },
        { key: '_extra_count', value: configuredProduct.accessory.extraCrystalCount.toString() },
        { key: '_pricing_note', value: 'Additional crystals' },
        { key: '_parent_line', value: 'oil' },
      ],
    }
    lineItems.push(extraCrystalsLineItem)
    crystalLineCount += 1
  }

  // Line Item 4: Cord or Charm Accessory
  if (configuredProduct.accessory.type === 'cord' && configuredProduct.accessory.cordType) {
    const cordVariantId = CORD_VARIANT_MAP[configuredProduct.accessory.cordType]
    if (cordVariantId) {
      const cordLineItem: CartLineItem = {
        merchandiseId: cordVariantId,
        quantity: 1,
        attributes: [
          { key: '_component_type', value: 'cord' },
          { key: '_cord_type', value: configuredProduct.accessory.cordType },
          { key: '_pricing_note', value: 'Included with oil purchase' },
          { key: '_parent_line', value: 'oil' },
        ],
      }
      lineItems.push(cordLineItem)
      accessoryLineCount = 1
    }
  } else if (configuredProduct.accessory.type === 'charm' && configuredProduct.accessory.charmType) {
    const charmVariantId = CHARM_VARIANT_MAP[configuredProduct.accessory.charmType]
    if (charmVariantId) {
      const charmLineItem: CartLineItem = {
        merchandiseId: charmVariantId,
        quantity: 1,
        attributes: [
          { key: '_component_type', value: 'charm' },
          { key: '_charm_type', value: configuredProduct.accessory.charmType },
          { key: '_pricing_note', value: 'Included with oil purchase (cord substitution)' },
          { key: '_parent_line', value: 'oil' },
        ],
      }
      lineItems.push(charmLineItem)
      accessoryLineCount = 1
    }
  }

  // Line Item 5: Credit Application (if applicable)
  if (configuredProduct.creditToApply && configuredProduct.creditToApply > 0) {
    const creditLineItem: CartLineItem = {
      merchandiseId: PRODUCT_VARIANTS.CREDIT_APPLICATION,
      quantity: 1,
      attributes: [
        { key: '_component_type', value: 'credit' },
        { key: '_credit_amount', value: configuredProduct.creditToApply.toString() },
        { key: '_customer_tier', value: configuredProduct.customerTier },
        { key: '_pricing_note', value: `Account credit applied` },
      ],
    }
    lineItems.push(creditLineItem)
    creditLineCount = 1
  }

  return {
    lineItems,
    metadata: {
      oilLineCount,
      crystalLineCount,
      accessoryLineCount,
      creditLineCount,
      totalLines: lineItems.length,
    },
  }
}

/**
 * Build core attributes for the oil line item
 */
function buildCoreAttributes(configuredProduct: ConfiguredProduct): Array<{ key: string; value: string }> {
  const attributes: Array<{ key: string; value: string }> = [
    // Core configuration
    { key: '_crystal_type', value: configuredProduct.crystalType },
    { key: '_crystal_count', value: configuredProduct.crystalCount.toString() },
    { key: '_bottle_size', value: configuredProduct.bottleSize },
    
    // Accessory selection
    { key: '_accessory_type', value: configuredProduct.accessory.type },
  ]

  // Add accessory-specific attributes
  if (configuredProduct.accessory.type === 'cord' && configuredProduct.accessory.cordType) {
    attributes.push({ key: '_cord_type', value: configuredProduct.accessory.cordType })
  } else if (configuredProduct.accessory.type === 'charm' && configuredProduct.accessory.charmType) {
    attributes.push({ key: '_charm_type', value: configuredProduct.accessory.charmType })
  } else if (configuredProduct.accessory.type === 'extra-crystals') {
    attributes.push({ 
      key: '_extra_crystal_count', 
      value: (configuredProduct.accessory.extraCrystalCount || 0).toString() 
    })
  }

  // Customer context
  attributes.push({ key: '_customer_tier', value: configuredProduct.customerTier })
  
  if (configuredProduct.creditToApply && configuredProduct.creditToApply > 0) {
    attributes.push({ key: '_credit_applied', value: configuredProduct.creditToApply.toString() })
  }

  // Synergy content reference
  if (configuredProduct.synergyContentId) {
    attributes.push({ key: '_synergy_content_id', value: configuredProduct.synergyContentId })
  }

  // Fulfillment notes
  const fulfillmentNotes = buildFulfillmentNotes(configuredProduct)
  if (fulfillmentNotes) {
    attributes.push({ key: '_fulfillment_notes', value: fulfillmentNotes })
  }

  return attributes
}

/**
 * Build fulfillment notes for the operations team
 */
function buildFulfillmentNotes(configuredProduct: ConfiguredProduct): string {
  const notes: string[] = []
  
  notes.push(`Crystal: ${configuredProduct.crystalType} x${configuredProduct.crystalCount}`)
  
  if (configuredProduct.accessory.type === 'cord') {
    notes.push(`Cord: ${configuredProduct.accessory.cordType || 'default'}`)
  } else if (configuredProduct.accessory.type === 'charm') {
    notes.push(`Charm: ${configuredProduct.accessory.charmType} (replaces cord)`)
  } else if (configuredProduct.accessory.type === 'extra-crystals') {
    notes.push(`Extra crystals: +${configuredProduct.accessory.extraCrystalCount}`)
  }

  if (configuredProduct.synergyContentId) {
    notes.push(`Include synergy card: ${configuredProduct.synergyContentId}`)
  }

  return notes.join(' | ')
}

// ========================================
// Cart Operations
// ========================================

/**
 * Add a configured product to the Shopify cart
 */
export async function addConfiguredProductToCart(
  cartId: string | null,
  configuredProduct: ConfiguredProduct
): Promise<ShopifyCart> {
  const { lineItems } = await transformToCartItems(configuredProduct)

  // Create cart if doesn't exist
  if (!cartId) {
    return createCartWithLines(lineItems)
  }

  // Add to existing cart
  return addLinesToCart(cartId, lineItems)
}

/**
 * Create a new cart with the given line items
 */
async function createCartWithLines(lines: CartLineItem[]): Promise<ShopifyCart> {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data, errors } = await client.request(query, {
    variables: {
      lines: lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
        attributes: line.attributes,
      })),
    },
  })

  if (errors) {
    throw new Error(`Failed to create cart: ${JSON.stringify(errors)}`)
  }

  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(`Cart creation errors: ${JSON.stringify(data.cartCreate.userErrors)}`)
  }

  return data?.cartCreate?.cart
}

/**
 * Add lines to an existing cart
 */
async function addLinesToCart(cartId: string, lines: CartLineItem[]): Promise<ShopifyCart> {
  const query = `
    mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data, errors } = await client.request(query, {
    variables: {
      cartId,
      lines: lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
        attributes: line.attributes,
      })),
    },
  })

  if (errors) {
    throw new Error(`Failed to add to cart: ${JSON.stringify(errors)}`)
  }

  if (data?.cartLinesAdd?.userErrors?.length > 0) {
    throw new Error(`Cart line errors: ${JSON.stringify(data.cartLinesAdd.userErrors)}`)
  }

  return data?.cartLinesAdd?.cart
}

/**
 * Update cart line quantities
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data, errors } = await client.request(query, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })

  if (errors) {
    throw new Error(`Failed to update cart line: ${JSON.stringify(errors)}`)
  }

  return data?.cartLinesUpdate?.cart
}

/**
 * Remove lines from cart
 */
export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data, errors } = await client.request(query, {
    variables: { cartId, lineIds },
  })

  if (errors) {
    throw new Error(`Failed to remove cart lines: ${JSON.stringify(errors)}`)
  }

  return data?.cartLinesRemove?.cart
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `

  const { data, errors } = await client.request(query, {
    variables: { cartId },
  })

  if (errors) {
    console.error('Error fetching cart:', errors)
    return null
  }

  return data?.cart || null
}

// ========================================
// Utility Functions
// ========================================

/**
 * Extract configured products from cart lines
 * Used for displaying cart summary
 */
export function extractConfiguredProducts(cart: ShopifyCart): Array<{
  oilLineId: string
  configuration: Partial<ConfiguredProduct>
}> {
  const configurations: Array<{
    oilLineId: string
    configuration: Partial<ConfiguredProduct>
  }> = []

  for (const edge of cart.lines.edges) {
    const line = edge.node
    const componentType = line.attributes.find(attr => attr.key === '_component_type')?.value

    if (!componentType) {
      // This is the main oil line
      const config: Partial<ConfiguredProduct> = {
        bottleSize: line.attributes.find(attr => attr.key === '_bottle_size')?.value as BottleSize,
        crystalType: line.attributes.find(attr => attr.key === '_crystal_type')?.value,
        crystalCount: parseInt(line.attributes.find(attr => attr.key === '_crystal_count')?.value || '0'),
        customerTier: line.attributes.find(attr => attr.key === '_customer_tier')?.value as TierLevel,
        creditToApply: parseFloat(line.attributes.find(attr => attr.key === '_credit_applied')?.value || '0'),
        synergyContentId: line.attributes.find(attr => attr.key === '_synergy_content_id')?.value,
      }

      const accessoryType = line.attributes.find(attr => attr.key === '_accessory_type')?.value
      if (accessoryType) {
        config.accessory = { type: accessoryType as 'cord' | 'charm' | 'extra-crystals' }
        
        const cordType = line.attributes.find(attr => attr.key === '_cord_type')?.value
        const charmType = line.attributes.find(attr => attr.key === '_charm_type')?.value
        const extraCount = line.attributes.find(attr => attr.key === '_extra_crystal_count')?.value
        
        if (cordType) config.accessory.cordType = cordType
        if (charmType) config.accessory.charmType = charmType
        if (extraCount) config.accessory.extraCrystalCount = parseInt(extraCount)
      }

      configurations.push({
        oilLineId: line.id,
        configuration: config,
      })
    }
  }

  return configurations
}

/**
 * Calculate total credit applied in cart
 */
export function calculateTotalCredit(cart: ShopifyCart): number {
  let totalCredit = 0

  for (const edge of cart.lines.edges) {
    const line = edge.node
    const componentType = line.attributes.find(attr => attr.key === '_component_type')?.value
    
    if (componentType === 'credit') {
      const creditAmount = parseFloat(
        line.attributes.find(attr => attr.key === '_credit_amount')?.value || '0'
      )
      totalCredit += creditAmount
    }
  }

  return totalCredit
}

/**
 * Group cart lines by parent oil configuration
 * Useful for displaying bundled items together
 */
export function groupCartLinesByConfiguration(cart: ShopifyCart): Array<{
  parentLine: typeof cart.lines.edges[0]['node']
  componentLines: Array<typeof cart.lines.edges[0]['node']>
}> {
  const groups: Array<{
    parentLine: typeof cart.lines.edges[0]['node']
    componentLines: Array<typeof cart.lines.edges[0]['node']>
  }> = []

  const parentLines = cart.lines.edges.filter(
    edge => !edge.node.attributes.find(attr => attr.key === '_component_type')
  )

  for (const parentEdge of parentLines) {
    // Find related component lines (those with matching crystal/bottle info)
    const parentCrystal = parentEdge.node.attributes.find(
      attr => attr.key === '_crystal_type'
    )?.value
    
    const parentSize = parentEdge.node.attributes.find(
      attr => attr.key === '_bottle_size'
    )?.value

    const componentLines = cart.lines.edges
      .filter(edge => {
        const isComponent = edge.node.attributes.find(
          attr => attr.key === '_component_type'
        )?.value
        const componentCrystal = edge.node.attributes.find(
          attr => attr.key === '_crystal_type'
        )?.value
        const parentLine = edge.node.attributes.find(
          attr => attr.key === '_parent_line'
        )?.value

        return isComponent && 
               componentCrystal === parentCrystal &&
               parentLine === 'oil'
      })
      .map(edge => edge.node)

    groups.push({
      parentLine: parentEdge.node,
      componentLines,
    })
  }

  return groups
}
