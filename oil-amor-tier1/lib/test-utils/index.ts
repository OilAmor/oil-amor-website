/**
 * Test Utilities
 * Helper functions and mocks for testing
 */

import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

export function createMockCart(overrides = {}) {
  return {
    id: 'cart_test123',
    items: [],
    summary: {
      subtotal: 0,
      totalTax: 0,
      totalShipping: 0,
      totalDiscounts: 0,
      total: 0,
      currency: 'AUD',
      itemCount: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockCartItem(overrides = {}) {
  return {
    id: 'line_test456',
    variantId: 'gid://shopify/ProductVariant/123456',
    productId: 'gid://shopify/Product/789',
    name: 'Lavender with Amethyst',
    quantity: 1,
    price: 48,
    currency: 'AUD',
    image: 'https://cdn.shopify.com/image.jpg',
    configuration: {
      oilName: 'Lavender',
      crystalName: 'Amethyst',
      bottleSize: '10ml',
    },
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockOil(overrides = {}) {
  return {
    id: 'oil_123',
    slug: 'lavender',
    name: 'Lavandula angustifolia',
    commonName: 'True Lavender',
    botanicalName: 'Lavandula angustifolia',
    description: 'Calming and soothing essential oil',
    category: 'floral',
    origin: 'Bulgaria',
    extractionMethod: 'steam-distillation',
    therapeuticProperties: ['Calming', 'Sleep support', 'Skin healing'],
    images: [{ url: 'https://cdn.shopify.com/lavender.jpg' }],
    price: { amount: 48, currencyCode: 'AUD' },
    recommendedCrystals: ['amethyst', 'clear-quartz'],
    seo: {
      title: 'Lavender Essential Oil',
      description: 'Calming lavender oil',
    },
    ...overrides,
  }
}

export function createMockCrystal(overrides = {}) {
  return {
    id: 'crystal_123',
    slug: 'amethyst',
    name: 'Amethyst',
    description: 'Stone of tranquility',
    meaning: 'Promotes calm and clarity',
    properties: {
      chakra: 'crown',
      element: 'air',
      zodiac: ['Pisces', 'Virgo'],
      healing: ['Stress relief', 'Sleep improvement'],
    },
    images: [{ url: 'https://cdn.shopify.com/amethyst.jpg' }],
    color: '#9966CC',
    rarity: 'common',
    availability: 'in-stock',
    isUnlocked: true,
    ...overrides,
  }
}

// ============================================================================
// CUSTOM RENDER
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any custom providers here
}

export function render(ui: ReactElement, options: CustomRenderOptions = {}) {
  return rtlRender(ui, options)
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { render }

// ============================================================================
// ASYNC UTILITIES
// ============================================================================

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// ============================================================================
// MOCK FETCH
// ============================================================================

export function mockFetch(response: unknown, status = 200) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  })
}

export function mockFetchError(message: string, status = 500) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(message),
  })
}

// ============================================================================
// MATCHERS
// ============================================================================

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidCart(): R
      toHaveCartItem(variantId: string): R
    }
  }
}

expect.extend({
  toBeValidCart(received) {
    const hasId = typeof received.id === 'string'
    const hasItems = Array.isArray(received.items)
    const hasSummary = typeof received.summary === 'object'
    
    const pass = hasId && hasItems && hasSummary
    
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid cart`
          : `expected ${received} to be a valid cart`,
    }
  },
  
  toHaveCartItem(received, variantId: string) {
    const hasItem = received.items.some(
      (item: { variantId: string }) => item.variantId === variantId
    )
    
    return {
      pass: hasItem,
      message: () =>
        hasItem
          ? `expected cart not to have item with variantId ${variantId}`
          : `expected cart to have item with variantId ${variantId}`,
    }
  },
})
