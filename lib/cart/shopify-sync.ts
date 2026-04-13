/**
 * Shopify Cart Synchronization
 * Bidirectional sync between local cart and Shopify checkout
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { Cart, CartItem, AddToCartInput, ShopifyCart } from './types'
import { logger } from '@/lib/logging/logger'

// ============================================================================
// SHOPIFY CLIENT (Lazy initialization)
// ============================================================================

let shopifyClient: ReturnType<typeof createStorefrontApiClient> | null = null

function getShopifyClient() {
  if (!shopifyClient) {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    const publicAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    
    if (!storeDomain || !publicAccessToken) {
      throw new Error('Shopify not configured - missing environment variables')
    }
    
    shopifyClient = createStorefrontApiClient({
      storeDomain,
      apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
      publicAccessToken,
    })
  }
  return shopifyClient
}

// ============================================================================
// GRAPHQL FRAGMENTS
// ============================================================================

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
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
                id
                title
                featuredImage {
                  url
                  altText
                }
              }
              price {
                amount
                currencyCode
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
      totalTaxAmount {
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

// ============================================================================
// SHOPIFY CART OPERATIONS
// ============================================================================

export async function createShopifyCart(): Promise<string> {
  const mutation = `
    mutation CartCreate {
      cartCreate {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  
  try {
    const { data } = await getShopifyClient().request(mutation)
    
    if (data?.cartCreate?.userErrors?.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message)
    }
    
    return data?.cartCreate?.cart?.id
  } catch (error) {
    logger.error('Failed to create Shopify cart', error as Error)
    throw error
  }
}

export async function getShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `
  
  try {
    const { data } = await getShopifyClient().request(query, {
      variables: { cartId },
    })
    
    return data?.cart || null
  } catch (error) {
    logger.error('Failed to get Shopify cart', error as Error, { cartId })
    return null
  }
}

export async function addLinesToShopifyCart(
  cartId: string,
  lines: Array<{
    merchandiseId: string
    quantity: number
    attributes?: Array<{ key: string; value: string }>
  }>
): Promise<ShopifyCart> {
  const mutation = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
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
  
  try {
    const { data } = await getShopifyClient().request(mutation, {
      variables: { cartId, lines },
    })
    
    if (data?.cartLinesAdd?.userErrors?.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message)
    }
    
    return data?.cartLinesAdd?.cart
  } catch (error) {
    logger.error('Failed to add lines to Shopify cart', error as Error, { cartId })
    throw error
  }
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{
    id: string
    quantity: number
  }>
): Promise<ShopifyCart> {
  const mutation = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
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
  
  try {
    const { data } = await getShopifyClient().request(mutation, {
      variables: {
        cartId,
        lines: lines.map(line => ({
          id: line.id,
          quantity: line.quantity,
        })),
      },
    })
    
    if (data?.cartLinesUpdate?.userErrors?.length > 0) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message)
    }
    
    return data?.cartLinesUpdate?.cart
  } catch (error) {
    logger.error('Failed to update Shopify cart lines', error as Error, { cartId })
    throw error
  }
}

export async function removeLinesFromShopifyCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const mutation = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
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
  
  try {
    const { data } = await getShopifyClient().request(mutation, {
      variables: { cartId, lineIds },
    })
    
    if (data?.cartLinesRemove?.userErrors?.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors[0].message)
    }
    
    return data?.cartLinesRemove?.cart
  } catch (error) {
    logger.error('Failed to remove lines from Shopify cart', error as Error, { cartId })
    throw error
  }
}

// ============================================================================
// CART TRANSFORMERS
// ============================================================================

export function transformToShopifyLines(
  items: CartItem[]
): Array<{
  merchandiseId: string
  quantity: number
  attributes: Array<{ key: string; value: string }>
}> {
  return items
    .filter((item): item is CartItem & { variantId: string } => !!item.variantId)
    .map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
      attributes: [
        ...(item.configuration ? [
          ...(item.configuration.oilName ? [{ key: 'Oil', value: String(item.configuration.oilName) }] : []),
          ...(item.configuration.crystalName ? [{ key: 'Crystal', value: String(item.configuration.crystalName) }] : []),
          ...(item.configuration.bottleSize ? [{ key: 'Size', value: String(item.configuration.bottleSize) }] : []),
          ...(item.configuration.accessoryName ? [
            { key: 'Accessory', value: String(item.configuration.accessoryName) },
          ] : []),
        ] : []),
        ...(item.properties ? Object.entries(item.properties).map(([key, value]) => ({
          key,
          value: String(value),
        })) : []),
      ],
    }))
}

export function transformShopifyCartToLocal(shopifyCart: ShopifyCart): Partial<Cart> {
  return {
    shopifyCartId: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    items: shopifyCart.lines.edges.map(({ node }) => ({
      id: node.id,
      variantId: node.merchandise.id,
      productId: node.merchandise.product.id,
      name: `${node.merchandise.product.title} - ${node.merchandise.title}`,
      quantity: node.quantity,
      unitPrice: parseFloat(node.merchandise.price.amount),
      price: parseFloat(node.merchandise.price.amount),
      currency: node.merchandise.price.currencyCode,
      image: node.merchandise.product.featuredImage?.url,
      properties: node.attributes.reduce((acc, attr) => {
        acc[attr.key] = attr.value
        return acc
      }, {} as Record<string, string>),
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    summary: {
      subtotal: parseFloat(shopifyCart.cost.subtotalAmount.amount),
      totalTax: parseFloat(shopifyCart.cost.totalTaxAmount?.amount || '0'),
      totalShipping: 0,
      totalDiscounts: 0,
      total: parseFloat(shopifyCart.cost.totalAmount?.amount || shopifyCart.cost.subtotalAmount.amount),
      currency: shopifyCart.cost.totalAmount?.currencyCode || shopifyCart.cost.subtotalAmount.currencyCode,
      itemCount: shopifyCart.totalQuantity,
    },
  }
}

// ============================================================================
// BIDIRECTIONAL SYNC
// ============================================================================

export async function syncCartToShopify(localCart: Cart): Promise<Cart> {
  if (!localCart.shopifyCartId) {
    // Create new Shopify cart
    const shopifyCartId = await createShopifyCart()
    localCart.shopifyCartId = shopifyCartId
  }
  
  // Get current Shopify cart
  const shopifyCart = await getShopifyCart(localCart.shopifyCartId)
  
  if (!shopifyCart) {
    // Cart was deleted on Shopify, create new one
    const shopifyCartId = await createShopifyCart()
    localCart.shopifyCartId = shopifyCartId
    
    // Add all items
    if (localCart.items.length > 0) {
      const lines = transformToShopifyLines(localCart.items)
      await addLinesToShopifyCart(shopifyCartId, lines)
    }
  } else {
    // Sync differences
    const shopifyLineIds = new Set(shopifyCart.lines.edges.map(edge => edge.node.id))
    const localLineIds = new Set(localCart.items.map(item => item.id))
    
    // Find items to add
    const itemsToAdd = localCart.items.filter(item => !shopifyLineIds.has(item.id))
    
    // Find items to remove
    const linesToRemove = shopifyCart.lines.edges
      .filter(edge => !localLineIds.has(edge.node.id))
      .map(edge => edge.node.id)
    
    // Find items to update
    const itemsToUpdate = localCart.items.filter(item => {
      const shopifyLine = shopifyCart.lines.edges.find(edge => edge.node.id === item.id)
      return shopifyLine && shopifyLine.node.quantity !== item.quantity
    })
    
    // Execute changes
    if (linesToRemove.length > 0) {
      await removeLinesFromShopifyCart(localCart.shopifyCartId, linesToRemove)
    }
    
    if (itemsToAdd.length > 0) {
      const lines = transformToShopifyLines(itemsToAdd)
      await addLinesToShopifyCart(localCart.shopifyCartId, lines)
    }
    
    if (itemsToUpdate.length > 0) {
      const lines = itemsToUpdate.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }))
      await updateShopifyCartLines(localCart.shopifyCartId, lines)
    }
  }
  
  // Get updated Shopify cart
  const updatedShopifyCart = await getShopifyCart(localCart.shopifyCartId)
  
  if (updatedShopifyCart) {
    // Update local cart with Shopify data
    const transformed = transformShopifyCartToLocal(updatedShopifyCart)
    localCart = {
      ...localCart,
      ...transformed,
      updatedAt: new Date().toISOString(),
    }
  }
  
  return localCart
}
