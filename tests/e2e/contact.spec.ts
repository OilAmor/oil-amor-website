/**
 * Contact Form E2E Tests
 */

import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })
  
  test('validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Send Message' }).click()
    
    // Check for validation messages
    await expect(page.getByText(/required/i)).toBeVisible()
  })
  
  test('validates email format', async ({ page }) => {
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Message').fill('Test message')
    
    await page.getByRole('button', { name: 'Send Message' }).click()
    
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })
  
  test('submits form successfully', async ({ page }) => {
    // Fill form
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Subject').selectOption('general')
    await page.getByLabel('Message').fill('This is a test message for the contact form.')
    
    // Submit
    await page.getByRole('button', { name: 'Send Message' }).click()
    
    // Verify success
    await expect(page.getByText('Message sent')).toBeVisible()
  })
})
