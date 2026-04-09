import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "AUD"): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function isClient(): boolean {
  return typeof window !== 'undefined'
}

export function isTouchDevice(): boolean {
  if (!isClient()) return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function prefersReducedMotion(): boolean {
  if (!isClient()) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
