/**
 * Core Type Definitions
 * Enterprise-grade TypeScript types for Oil Amor
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

export type ID = string
export type Timestamp = string // ISO 8601
export type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP'
export type Locale = 'en-AU' | 'en-US' | 'en-GB'

// ============================================================================
// MONEY & PRICING
// ============================================================================

export interface Money {
  amount: number
  currencyCode: CurrencyCode
}

export interface Price {
  amount: number
  currencyCode: CurrencyCode
  compareAtPrice?: number
}

export interface PriceRange {
  min: Money
  max: Money
}

// ============================================================================
// IMAGES
// ============================================================================

export interface Image {
  url: string
  altText?: string
  width?: number
  height?: number
}

export interface ImageWithBlur extends Image {
  blurDataUrl?: string
}

// ============================================================================
// SEO
// ============================================================================

export interface SEO {
  title: string
  description: string
  keywords?: string[]
  image?: Image
  noIndex?: boolean
  noFollow?: boolean
  canonicalUrl?: string
  structuredData?: Record<string, unknown>
}

export interface OpenGraph {
  title: string
  description: string
  type: 'website' | 'article' | 'product'
  url: string
  image: Image
  siteName: string
  locale: Locale
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
  totalCount?: number
  currentPage: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationInfo
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: {
    requestId: string
    timestamp: Timestamp
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    requestId: string
    timestamp: Timestamp
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================================================
// USER & CUSTOMER
// ============================================================================

export interface User {
  id: ID
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  acceptsMarketing: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
}

export interface Address {
  id: ID
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
  isDefault: boolean
}

// ============================================================================
// NAVIGATION
// ============================================================================

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ============================================================================
// THEME
// ============================================================================

export type Theme = 'light' | 'dark' | 'system'
