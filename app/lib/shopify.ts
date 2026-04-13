import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { 
  ShopifyProduct, 
  Cart, 
  CartLine,
  ShopifyProductVariant 
} from '../types'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
})

// ========================================
// GraphQL Fragments
// ========================================

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`

const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            ...MoneyFragment
          }
          compareAtPrice {
            ...MoneyFragment
          }
          quantityAvailable
          selectedOptions {
            name
            value
          }
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "crystal_name"},
      {namespace: "custom", key: "crystal_property"},
      {namespace: "custom", key: "origin"},
      {namespace: "custom", key: "botanical_name"}
    ]) {
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
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

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
              price {
                ...MoneyFragment
              }
              product {
                title
                featuredImage {
                  ...ImageFragment
                }
              }
            }
          }
          cost {
            totalAmount {
              ...MoneyFragment
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    totalQuantity
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

// ========================================
// Product Queries
// ========================================

export async function getProducts(first: number = 50): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: { first },
  })

  return data?.products?.edges?.map((edge: any) => edge.node) || []
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: { handle },
  })

  return data?.product || null
}

export async function getProductsByCollection(handle: string, first: number = 50): Promise<ShopifyProduct[]> {
  const query = `
    query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: { handle, first },
  })

  return data?.collection?.products?.edges?.map((edge: any) => edge.node) || []
}

// ========================================
// Cart Mutations
// ========================================

export async function createCart(): Promise<Cart> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await client.request(query)
  return data?.cartCreate?.cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: { cartId },
  })

  return data?.cart || null
}

export async function addToCart(
  cartId: string, 
  merchandiseId: string, 
  quantity: number = 1
): Promise<Cart> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
  })

  return data?.cartLinesAdd?.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })

  return data?.cartLinesUpdate?.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await client.request(query, {
    variables: { cartId, lineIds },
  })

  return data?.cartLinesRemove?.cart
}

// ========================================
// Utility Functions
// ========================================

export function getMetafieldValue(product: ShopifyProduct, namespace: string, key: string): string | null {
  const metafield = product.metafields?.edges?.find(
    (edge: any) => edge.node.namespace === namespace && edge.node.key === key
  )
  return metafield?.node?.value || null
}

export function getFirstVariant(product: ShopifyProduct): ShopifyProductVariant | null {
  return product.variants?.edges?.[0]?.node || null
}


// Re-export types for convenience
export type { ShopifyProduct, ShopifyProductVariant, Cart, CartLine } from '../types'
