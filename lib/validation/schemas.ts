/**
 * Zod Validation Schemas
 * Type-safe validation for all API inputs
 */

import { z } from 'zod'

// ============================================================================
// BASE SCHEMAS
// ============================================================================

export const idSchema = z.string().min(1).max(255)
export const emailSchema = z.string().email().max(254)
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number')

// ============================================================================
// CART SCHEMAS
// ============================================================================

export const addToCartSchema = z.object({
  variantId: z.string().startsWith('gid://shopify/ProductVariant/'),
  quantity: z.number().int().min(1).max(99),
  configuration: z.object({
    oilName: z.string().min(1).max(100),
    crystalName: z.string().min(1).max(100),
    bottleSize: z.enum(['5ml', '10ml', '15ml', '30ml']),
    accessoryName: z.string().max(100).optional(),
  }).optional(),
  properties: z.record(z.string().max(255)).optional(),
  cartId: z.string().startsWith('cart_').optional(),
  customerId: z.string().optional(),
  email: z.string().email().optional(),
})

export const updateCartItemSchema = z.object({
  lineId: z.string().startsWith('line_'),
  quantity: z.number().int().min(0).max(99),
  cartId: z.string().startsWith('cart_'),
})

export const removeFromCartSchema = z.object({
  lineId: z.string().startsWith('line_'),
  cartId: z.string().startsWith('cart_'),
})

export const clearCartSchema = z.object({
  cartId: z.string().startsWith('cart_'),
})

export const mergeCartsSchema = z.object({
  guestCartId: z.string().startsWith('cart_'),
  userCartId: z.string().startsWith('cart_'),
})

// ============================================================================
// CONTACT SCHEMAS
// ============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  subject: z.enum(['general', 'order', 'product', 'wholesale', 'press', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(255),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(12).max(255),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  acceptsMarketing: z.boolean().default(false),
})

export const addressSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  address1: z.string().min(1).max(255),
  address2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  zip: z.string().min(1).max(20),
  phone: phoneSchema.optional(),
  isDefault: z.boolean().default(false),
})

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productFilterSchema = z.object({
  category: z.enum(['floral', 'citrus', 'herbal', 'woody', 'spicy', 'earthy']).optional(),
  chakra: z.enum(['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['name', 'price', 'newest']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// ============================================================================
// SEARCH SCHEMAS
// ============================================================================

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['products', 'oils', 'crystals', 'all']).default('all'),
  limit: z.number().int().min(1).max(50).default(10),
})

// ============================================================================
// NEWSLETTER SCHEMAS
// ============================================================================

export const newsletterSchema = z.object({
  email: emailSchema,
  source: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
})

// ============================================================================
// TYPE INFERENCES
// ============================================================================

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
