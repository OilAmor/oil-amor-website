import { z } from 'zod'

// ========================================
// API Input Validation Schemas
// ========================================

export const cartActionSchema = z.object({
  action: z.enum(['create', 'get', 'add', 'update', 'remove']),
  cartId: z.string().uuid().optional(),
  merchandiseId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/).optional(),
  quantity: z.number().int().min(0).max(100).optional(),
  lineId: z.string().uuid().optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(), // Spam prevention
})

export const productFilterSchema = z.object({
  category: z.enum(['all', 'floral', 'woody', 'citrus', 'herbal', 'resinous', 'blend']).optional(),
  sort: z.enum(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(24),
})

// ========================================
// Type Inference
// ========================================

export type CartActionInput = z.infer<typeof cartActionSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>

// ========================================
// Validation Helper with Error Formatting
// ========================================

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Array<{ field: string; message: string }> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors = result.error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  
  return { success: false, errors }
}

// ========================================
// Sanitization Helpers
// ========================================

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 10000) // Max length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}
