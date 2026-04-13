/**
 * Validation Utilities
 * Helper functions for validation
 */

import { ZodSchema, ZodError } from 'zod'
import { logger } from '@/lib/logging/logger'

// ============================================================================
// VALIDATION RESULT TYPE
// ============================================================================

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

export interface ValidationError {
  path: string
  message: string
}

// ============================================================================
// VALIDATE FUNCTION
// ============================================================================

export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      
      return { success: false, errors }
    }
    
    logger.error('Validation error', error as Error)
    return { 
      success: false, 
      errors: [{ path: 'unknown', message: 'Unknown validation error' }] 
    }
  }
}

// ============================================================================
// SAFE PARSE FUNCTION
// ============================================================================

export function safeParse<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return result.data
  }
  
  return null
}

// ============================================================================
// VALIDATION ERROR FORMATTER
// ============================================================================

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.path}: ${e.message}`).join(', ')
}

// ============================================================================
// QUERY PARAM PARSER
// ============================================================================

export function parseQueryParams<T>(
  schema: ZodSchema<T>,
  searchParams: URLSearchParams
): ValidationResult<T> {
  const data: Record<string, unknown> = {}
  
  searchParams.forEach((value, key) => {
    // Try to parse numbers and booleans
    if (value === 'true') {
      data[key] = true
    } else if (value === 'false') {
      data[key] = false
    } else if (!isNaN(Number(value)) && value !== '') {
      data[key] = Number(value)
    } else {
      data[key] = value
    }
  })
  
  return validate(schema, data)
}
