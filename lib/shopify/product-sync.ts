/**
 * Oil Amor Product Sync System
 * Syncs Oil Amor content with Shopify products
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { 
  setOilMetafields, 
  setCrystalMetafields, 
  setProductConfigMetafields,
  METAFIELD_NAMESPACES 
} from './metafields'

// ========================================
// Types & Interfaces
// ========================================

export interface OilContent {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  botanicalName: string
  origin: string
  extractionMethod: string
  therapeuticProperties: string[]
  safetyNotes: string
  elementalAffinity: string[]
  chakraAlignment?: string[]
  intentionTags?: string[]
  basePrice: number
  images: {
    featured: string
    gallery: string[]
  }
  recommendedCrystals: string[] // crystal slugs
  synergyContent: Record<string, string> // crystal slug → content ID
  isFeatured?: boolean
  isNewArrival?: boolean
}

export interface CrystalContent {
  id: string
  slug: string
  name: string
  description: string
  properties: {
    chakra: string
    element: string
    zodiac: string[]
    healing: string[]
    meaning: string
  }
  origin: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  cleansingMethod: string
  chargingMethod: string
  images: {
    featured: string
    gallery: string[]
  }
}

export interface ProductVariantInput {
  price: string
  compareAtPrice?: string
  sku: string
  inventoryQuantity: number
  options: Record<string, string>
  weight?: number
  weightUnit?: string
}

export interface SyncResult {
  productId: string
  variantsCreated: number
  metafieldsSet: number
  status: 'created' | 'updated'
  errors?: string[]
}

// ========================================
// Pricing Configuration
// ========================================

export const BOTTLE_SIZE_CONFIG: Record<string, {
  volume: number
  priceMultiplier: number
  crystalCount: number
  skuSuffix: string
}> = {
  '5ml': {
    volume: 5,
    priceMultiplier: 0.45,
    crystalCount: 4,
    skuSuffix: '-5ML',
  },
  '10ml': {
    volume: 10,
    priceMultiplier: 0.67,
    crystalCount: 6,
    skuSuffix: '-10ML',
  },
  '15ml': {
    volume: 15,
    priceMultiplier: 0.83,
    crystalCount: 8,
    skuSuffix: '-15ML',
  },
  '20ml': {
    volume: 20,
    priceMultiplier: 0.93,
    crystalCount: 10,
    skuSuffix: '-20ML',
  },
  '30ml': {
    volume: 30,
    priceMultiplier: 1.0,
    crystalCount: 12,
    skuSuffix: '-30ML',
  },
}

// ========================================
// Shopify Admin Client
// ========================================

const adminClient = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
}

// ========================================
// Oil Product Sync
// ========================================

/**
 * Sync Oil content to Shopify product
 * Creates or updates the product with variants for each bottle size
 */
export async function syncOilToShopify(oil: OilContent): Promise<SyncResult> {
  const errors: string[] = []

  try {
    // Check if product already exists
    const existingProduct = await findProductByHandle(oil.slug)

    let productId: string
    let status: 'created' | 'updated'

    if (existingProduct) {
      // Update existing product
      productId = await updateProduct(existingProduct.id, {
        title: oil.name,
        descriptionHtml: formatDescription(oil.description),
        seo: {
          title: `${oil.name} | Oil Amor`,
          description: oil.shortDescription || oil.description.substring(0, 160),
        },
      })
      status = 'updated'
    } else {
      // Create new product
      productId = await createProduct({
        title: oil.name,
        descriptionHtml: formatDescription(oil.description),
        handle: oil.slug,
        productType: 'Essential Oil',
        vendor: 'Oil Amor',
        tags: ['essential-oil', ...oil.elementalAffinity, ...(oil.intentionTags || [])],
        seo: {
          title: `${oil.name} | Oil Amor`,
          description: oil.shortDescription || oil.description.substring(0, 160),
        },
      })
      status = 'created'
    }

    // Create/update variants for each bottle size
    const variantsCreated = await createBottleSizeVariants(productId, oil.basePrice, oil.slug)

    // Set oil-specific metafields
    await setOilMetafields(productId, {
      botanical_name: oil.botanicalName,
      origin: oil.origin,
      extraction_method: oil.extractionMethod,
      therapeutic_properties: oil.therapeuticProperties,
      safety_notes: oil.safetyNotes,
      recommended_crystals: oil.recommendedCrystals,
      synergy_content: oil.synergyContent,
      elemental_affinity: oil.elementalAffinity,
      chakra_alignment: oil.chakraAlignment,
      intention_tags: oil.intentionTags,
    })

    // Set product configuration metafields
    const bottleSizesConfig = Object.entries(BOTTLE_SIZE_CONFIG).map(([size, config]) => ({
      size,
      volume_ml: config.volume,
      price_multiplier: config.priceMultiplier,
      crystal_count: config.crystalCount,
    }))

    await setProductConfigMetafields(productId, {
      bottle_sizes: bottleSizesConfig,
      available_cords: ['waxed-cotton', 'hemp', 'silk', 'leather'],
      available_charms: ['crescent-moon', 'sun', 'stars', 'tree-of-life', 'lotus', 'om'],
      base_price: oil.basePrice,
      is_featured: oil.isFeatured || false,
      is_new_arrival: oil.isNewArrival || false,
    })

    // Upload images if product was created
    if (status === 'created' && oil.images.gallery.length > 0) {
      await uploadProductImages(productId, oil.images.gallery)
    }

    return {
      productId,
      variantsCreated,
      metafieldsSet: 9, // Approximate count
      status,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error(`Failed to sync oil ${oil.slug}:`, error)
    throw error
  }
}

/**
 * Sync Crystal content to Shopify product
 */
export async function syncCrystalToShopify(crystal: CrystalContent): Promise<SyncResult> {
  try {
    // Check if product already exists
    const existingProduct = await findProductByHandle(crystal.slug)

    let productId: string
    let status: 'created' | 'updated'

    if (existingProduct) {
      productId = await updateProduct(existingProduct.id, {
        title: crystal.name,
        descriptionHtml: formatDescription(crystal.description),
      })
      status = 'updated'
    } else {
      productId = await createProduct({
        title: crystal.name,
        descriptionHtml: formatDescription(crystal.description),
        handle: crystal.slug,
        productType: 'Crystal',
        vendor: 'Oil Amor',
        tags: ['crystal', crystal.properties.element, crystal.properties.chakra],
      })
      status = 'created'
    }

    // Set crystal-specific metafields
    await setCrystalMetafields(productId, {
      chakra: crystal.properties.chakra,
      element: crystal.properties.element,
      zodiac: crystal.properties.zodiac,
      meaning: crystal.properties.meaning,
      origin: crystal.origin,
      properties: crystal.properties.healing,
      rarity: crystal.rarity,
      cleansing_method: crystal.cleansingMethod,
      charging_method: crystal.chargingMethod,
    })

    return {
      productId,
      variantsCreated: 0,
      metafieldsSet: 8,
      status,
    }
  } catch (error) {
    console.error(`Failed to sync crystal ${crystal.slug}:`, error)
    throw error
  }
}

// ========================================
// Variant Management
// ========================================

/**
 * Create variants for each bottle size
 */
export async function createBottleSizeVariants(
  productId: string,
  basePrice: number,
  productSlug: string
): Promise<number> {
  let variantsCreated = 0

  // Get existing variants
  const existingVariants = await getProductVariants(productId)
  const existingOptions = existingVariants.map(v => v.title)

  for (const [size, config] of Object.entries(BOTTLE_SIZE_CONFIG)) {
    const variantTitle = size
    const price = Math.round(basePrice * config.priceMultiplier * 100) / 100
    const sku = `OIL-${productSlug.toUpperCase()}${config.skuSuffix}`

    // Check if variant already exists
    if (existingOptions.includes(variantTitle)) {
      // Update existing variant price
      const variant = existingVariants.find(v => v.title === variantTitle)
      if (variant) {
        await updateVariantPrice(variant.id, price.toFixed(2))
      }
    } else {
      // Create new variant
      await createProductVariant(productId, {
        price: price.toFixed(2),
        sku,
        inventoryQuantity: 100,
        options: { Size: size },
        weight: config.volume * 1.5, // Approximate weight in grams
        weightUnit: 'GRAMS',
      })
      variantsCreated++
    }
  }

  return variantsCreated
}

// ========================================
// Shopify API Functions
// ========================================

/**
 * Find product by handle
 */
async function findProductByHandle(handle: string): Promise<{ id: string; title: string } | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
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
        variables: { handle },
      }),
    }
  )

  const data = await response.json()
  return data.data?.productByHandle || null
}

/**
 * Create a new product
 */
async function createProduct(input: {
  title: string
  descriptionHtml: string
  handle: string
  productType: string
  vendor: string
  tags: string[]
  seo?: { title: string; description: string }
}): Promise<string> {
  const query = `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
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
          input: {
            title: input.title,
            descriptionHtml: input.descriptionHtml,
            handle: input.handle,
            productType: input.productType,
            vendor: input.vendor,
            tags: input.tags,
            seo: input.seo,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.productCreate?.userErrors?.length > 0) {
    throw new Error(`Product creation errors: ${JSON.stringify(data.data.productCreate.userErrors)}`)
  }

  return data.data?.productCreate?.product?.id
}

/**
 * Update an existing product
 */
async function updateProduct(
  productId: string,
  input: {
    title: string
    descriptionHtml: string
    seo?: { title: string; description: string }
  }
): Promise<string> {
  const query = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
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
          input: {
            id: productId,
            title: input.title,
            descriptionHtml: input.descriptionHtml,
            seo: input.seo,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.productUpdate?.userErrors?.length > 0) {
    throw new Error(`Product update errors: ${JSON.stringify(data.data.productUpdate.userErrors)}`)
  }

  return productId
}

/**
 * Get product variants
 */
async function getProductVariants(productId: string): Promise<Array<{ id: string; title: string }>> {
  const query = `
    query GetProductVariants($productId: ID!) {
      product(id: $productId) {
        variants(first: 10) {
          edges {
            node {
              id
              title
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
        variables: { productId },
      }),
    }
  )

  const data = await response.json()
  return data.data?.product?.variants?.edges?.map((edge: any) => edge.node) || []
}

/**
 * Create a product variant
 */
async function createProductVariant(
  productId: string,
  variant: ProductVariantInput
): Promise<string> {
  const query = `
    mutation CreateProductVariant($input: ProductVariantInput!) {
      productVariantCreate(input: $input) {
        productVariant {
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
          input: {
            productId,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            sku: variant.sku,
            inventoryQuantities: {
              availableQuantity: variant.inventoryQuantity,
              locationId: process.env.SHOPIFY_LOCATION_ID,
            },
            options: Object.values(variant.options),
            weight: variant.weight,
            weightUnit: variant.weightUnit,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.productVariantCreate?.userErrors?.length > 0) {
    throw new Error(
      `Variant creation errors: ${JSON.stringify(data.data.productVariantCreate.userErrors)}`
    )
  }

  return data.data?.productVariantCreate?.productVariant?.id
}

/**
 * Update variant price
 */
async function updateVariantPrice(variantId: string, price: string): Promise<void> {
  const query = `
    mutation UpdateVariant($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
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
          input: {
            id: variantId,
            price,
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.productVariantUpdate?.userErrors?.length > 0) {
    console.error(`Variant update errors: ${JSON.stringify(data.data.productVariantUpdate.userErrors)}`)
  }
}

/**
 * Upload product images
 */
async function uploadProductImages(productId: string, imageUrls: string[]): Promise<void> {
  // In production, you'd download images and upload to Shopify
  // For now, we'll just log it
  console.log(`Would upload ${imageUrls.length} images to product ${productId}`)
}

// ========================================
// Utility Functions
// ========================================

/**
 * Format description HTML
 */
function formatDescription(description: string): string {
  // Convert plain text to HTML if needed
  if (!description.includes('<')) {
    return `<p>${description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
  }
  return description
}

/**
 * Bulk sync oils
 */
export async function bulkSyncOils(oils: OilContent[]): Promise<{
  success: SyncResult[]
  failed: Array<{ oil: OilContent; error: string }>
}> {
  const success: SyncResult[] = []
  const failed: Array<{ oil: OilContent; error: string }> = []

  for (const oil of oils) {
    try {
      const result = await syncOilToShopify(oil)
      success.push(result)
    } catch (error) {
      failed.push({
        oil,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return { success, failed }
}

/**
 * Bulk sync crystals
 */
export async function bulkSyncCrystals(crystals: CrystalContent[]): Promise<{
  success: SyncResult[]
  failed: Array<{ crystal: CrystalContent; error: string }>
}> {
  const success: SyncResult[] = []
  const failed: Array<{ crystal: CrystalContent; error: string }> = []

  for (const crystal of crystals) {
    try {
      const result = await syncCrystalToShopify(crystal)
      success.push(result)
    } catch (error) {
      failed.push({
        crystal,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return { success, failed }
}

/**
 * Sync from Sanity CMS
 * This would connect to your Sanity instance and sync all content
 */
export async function syncFromSanity(): Promise<{
  oils: { success: number; failed: number }
  crystals: { success: number; failed: number }
}> {
  // This is a placeholder implementation
  // In production, you'd fetch from Sanity and sync to Shopify
  console.log('Syncing from Sanity...')
  
  return {
    oils: { success: 0, failed: 0 },
    crystals: { success: 0, failed: 0 },
  }
}
