/**
 * Home Page E2E Tests
 */

import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })
  
  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Oil Amor/)
  })
  
  test('displays hero section', async ({ page }) => {
    await expect(page.getByText('Essence')).toBeVisible()
    await expect(page.getByText('Transcended')).toBeVisible()
  })
  
  test('navigation is visible', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByText('Oil Amor')).toBeVisible()
  })
  
  test('can navigate to collection', async ({ page }) => {
    await page.getByText('Explore Collection').click()
    await expect(page).toHaveURL(/\/oils/)
  })
  
  test('mobile menu works', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Open mobile menu
    await page.getByLabel('Open menu').click()
    
    // Check menu items are visible
    await expect(page.getByText('Collection')).toBeVisible()
  })
})
