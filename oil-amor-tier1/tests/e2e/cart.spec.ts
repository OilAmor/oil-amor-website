/**
 * Cart E2E Tests
 * Critical user journey: Add to cart, update, checkout
 */

import { test, expect } from '@playwright/test'

test.describe('Cart Flow', () => {
  test('add item to cart', async ({ page }) => {
    await page.goto('/oils')
    
    // Click first product
    await page.getByRole('article').first().click()
    
    // Add to cart
    await page.getByText('Add to Collection').click()
    
    // Verify cart opens
    await expect(page.getByText('Your Selection')).toBeVisible()
    
    // Verify item is in cart
    await expect(page.getByRole('dialog')).toContainText('$')
  })
  
  test('update cart quantity', async ({ page }) => {
    // Add item first
    await page.goto('/oils/lavender')
    await page.getByText('Add to Collection').click()
    
    // Wait for cart to open
    await page.waitForSelector('[role="dialog"]')
    
    // Update quantity
    await page.getByLabel('Increase quantity').click()
    
    // Verify quantity updated
    await expect(page.getByText('2')).toBeVisible()
  })
  
  test('remove item from cart', async ({ page }) => {
    // Add item
    await page.goto('/oils/lavender')
    await page.getByText('Add to Collection').click()
    
    // Wait for cart
    await page.waitForSelector('[role="dialog"]')
    
    // Remove item
    await page.getByLabel('Remove item').click()
    
    // Verify empty state
    await expect(page.getByText('Your vessel awaits')).toBeVisible()
  })
  
  test('persists cart across page navigation', async ({ page }) => {
    // Add item
    await page.goto('/oils/lavender')
    await page.getByText('Add to Collection').click()
    
    // Navigate away
    await page.goto('/')
    
    // Open cart
    await page.getByLabel('Cart').click()
    
    // Verify item still there
    await expect(page.getByRole('dialog')).toContainText('Lavender')
  })
})
