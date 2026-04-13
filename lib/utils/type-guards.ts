/**
 * Type Guards
 * Runtime type checking utilities
 */

import { Cart, CartItem } from '@/lib/cart/types'
import { Oil, Crystal } from '@/lib/types/product'

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isCart(value: unknown): value is Cart {
  if (!isObject(value)) return false
  const cart = value as Partial<Cart>
  return (
    typeof cart.id === 'string' &&
    Array.isArray(cart.items) &&
    isObject(cart.summary)
  )
}

export function isCartItem(value: unknown): value is CartItem {
  if (!isObject(value)) return false
  const item = value as Partial<CartItem>
  return (
    typeof item.id === 'string' &&
    typeof item.variantId === 'string' &&
    typeof item.quantity === 'number'
  )
}

export function isOil(value: unknown): value is Oil {
  if (!isObject(value)) return false
  const oil = value as Partial<Oil>
  return (
    typeof oil.id === 'string' &&
    typeof oil.slug === 'string' &&
    typeof oil.name === 'string'
  )
}

export function isCrystal(value: unknown): value is Crystal {
  if (!isObject(value)) return false
  const crystal = value as Partial<Crystal>
  return (
    typeof crystal.id === 'string' &&
    typeof crystal.slug === 'string' &&
    typeof crystal.name === 'string'
  )
}

export function isValidEmail(value: unknown): value is string {
  if (!isString(value)) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}
