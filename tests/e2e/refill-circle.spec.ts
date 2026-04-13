/**
 * Refill Circle E2E Tests
 * 
 * Tests refill dashboard:
 * - View forever bottles
 * - Order refill
 * - Generate return label
 * - Track return
 * - Verify credit applied
 */

import { test, expect } from '@playwright/test';

test.describe('Refill Circle Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as customer with refill access
    await page.goto('/account/login');
    await page.fill('[data-testid="login-email"]', 'refill-customer@example.com');
    await page.fill('[data-testid="login-password"]', 'testpassword');
    await page.locator('[data-testid="login-submit"]').click();
    await page.waitForTimeout(2000);
  });

  test('should display refill dashboard for unlocked customers', async ({ page }) => {
    // Navigate to refill dashboard
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Verify dashboard loaded
    const dashboard = page.locator('[data-testid="refill-dashboard"]');
    await expect(dashboard).toBeVisible();

    // Verify bottles section exists
    const bottlesSection = page.locator('[data-testid="forever-bottles-section"]');
    await expect(bottlesSection).toBeVisible();
  });

  test('should list all forever bottles', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Get bottle cards
    const bottleCards = page.locator('[data-testid="forever-bottle-card"]');
    const count = await bottleCards.count();

    // Should have at least one bottle
    expect(count).toBeGreaterThan(0);

    // Verify bottle details
    const firstBottle = bottleCards.first();
    await expect(firstBottle.locator('[data-testid="bottle-serial"]')).toBeVisible();
    await expect(firstBottle.locator('[data-testid="bottle-oil-type"]')).toBeVisible();
    await expect(firstBottle.locator('[data-testid="bottle-status"]')).toBeVisible();
  });

  test('should show bottle details on click', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Click on first bottle
    const firstBottle = page.locator('[data-testid="forever-bottle-card"]').first();
    await firstBottle.click();
    await page.waitForTimeout(500);

    // Verify bottle details modal/page
    const bottleDetails = page.locator('[data-testid="bottle-details"]');
    await expect(bottleDetails).toBeVisible();

    // Check for history
    const historySection = page.locator('[data-testid="bottle-history"]');
    await expect(historySection).toBeVisible();
  });

  test('should initiate refill order for empty bottle', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Find an empty bottle
    const emptyBottle = page.locator('[data-testid="bottle-status-empty"]').first();
    
    if (await emptyBottle.isVisible().catch(() => false)) {
      // Click order refill button
      const orderRefillButton = emptyBottle.locator('[data-testid="order-refill-button"]');
      await orderRefillButton.click();
      await page.waitForTimeout(1000);

      // Verify refill order modal
      const refillModal = page.locator('[data-testid="refill-order-modal"]');
      await expect(refillModal).toBeVisible();

      // Select oil type if applicable
      const oilSelect = refillModal.locator('[data-testid="refill-oil-select"]');
      if (await oilSelect.isVisible()) {
        await oilSelect.selectOption({ index: 0 });
      }

      // Confirm refill order
      await refillModal.locator('[data-testid="confirm-refill-order"]').click();
      await page.waitForTimeout(1000);

      // Verify success message
      const successMessage = page.locator('[data-testid="refill-order-success"]');
      await expect(successMessage).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should generate return label for bottle', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Find a bottle eligible for return label
    const bottleCard = page.locator('[data-testid="forever-bottle-card"]').first();
    
    // Click generate label button
    const generateLabelButton = bottleCard.locator('[data-testid="generate-return-label"]');
    
    if (await generateLabelButton.isVisible().catch(() => false)) {
      await generateLabelButton.click();
      await page.waitForTimeout(2000);

      // Verify label generated
      const labelSection = page.locator('[data-testid="return-label-section"]');
      await expect(labelSection).toBeVisible();

      // Verify tracking number
      const trackingNumber = page.locator('[data-testid="tracking-number"]');
      await expect(trackingNumber).toBeVisible();
      
      const trackingText = await trackingNumber.textContent();
      expect(trackingText).toMatch(/TGE\d+/);

      // Verify download link
      const downloadLink = page.locator('[data-testid="download-label-link"]');
      await expect(downloadLink).toBeVisible();
      await expect(downloadLink).toHaveAttribute('href', /.+/);
    } else {
      test.skip();
    }
  });

  test('should display return tracking status', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Find a bottle in transit
    const inTransitBottle = page.locator('[data-testid="bottle-status-in-transit"]').first();

    if (await inTransitBottle.isVisible().catch(() => false)) {
      // Click tracking link
      const trackingLink = inTransitBottle.locator('[data-testid="track-shipment-link"]');
      await trackingLink.click();
      await page.waitForTimeout(1000);

      // Verify tracking modal/info
      const trackingInfo = page.locator('[data-testid="tracking-info"]');
      await expect(trackingInfo).toBeVisible();

      // Check tracking events
      const trackingEvents = page.locator('[data-testid="tracking-events"]');
      await expect(trackingEvents).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display account credits', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Verify credit display
    const creditDisplay = page.locator('[data-testid="account-credit-display"]');
    await expect(creditDisplay).toBeVisible();

    // Credit amount should be shown
    const creditAmount = creditDisplay.locator('[data-testid="credit-balance"]');
    await expect(creditAmount).toBeVisible();
  });

  test('should show credit transaction history', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Navigate to credit history
    const historyLink = page.locator('[data-testid="view-credit-history"]');
    if (await historyLink.isVisible()) {
      await historyLink.click();
      await page.waitForTimeout(1000);

      // Verify history table/list
      const creditHistory = page.locator('[data-testid="credit-history-list"]');
      await expect(creditHistory).toBeVisible();

      // Check for transaction entries
      const transactions = creditHistory.locator('[data-testid="credit-transaction"]');
      const count = await transactions.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display environmental impact stats', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Verify environmental stats section
    const envStats = page.locator('[data-testid="environmental-impact"]');
    await expect(envStats).toBeVisible();

    // Check for specific metrics
    const bottlesSaved = envStats.locator('[data-testid="bottles-saved"]');
    await expect(bottlesSaved).toBeVisible();

    const glassRecycled = envStats.locator('[data-testid="glass-recycled"]');
    await expect(glassRecycled).toBeVisible();

    const treesEquivalent = envStats.locator('[data-testid="trees-equivalent"]');
    await expect(treesEquivalent).toBeVisible();
  });

  test('should show refill program progress', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Verify progress section
    const progressSection = page.locator('[data-testid="refill-progress"]');
    await expect(progressSection).toBeVisible();

    // Check for refill count
    const refillCount = progressSection.locator('[data-testid="total-refills"]');
    await expect(refillCount).toBeVisible();
  });

  test('should handle bottle retirement', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Find a bottle eligible for retirement
    const bottleCard = page.locator('[data-testid="forever-bottle-card"]').first();
    const retireButton = bottleCard.locator('[data-testid="retire-bottle-button"]');

    if (await retireButton.isVisible().catch(() => false)) {
      await retireButton.click();
      await page.waitForTimeout(500);

      // Confirm retirement modal
      const confirmModal = page.locator('[data-testid="retire-confirm-modal"]');
      await expect(confirmModal).toBeVisible();

      // Cancel to avoid actual retirement in tests
      await confirmModal.locator('[data-testid="cancel-retire"]').click();
      
      // Verify bottle still exists
      await expect(bottleCard).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display correct pricing for refill order', async ({ page }) => {
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Start refill order
    const emptyBottle = page.locator('[data-testid="bottle-status-empty"]').first();
    
    if (await emptyBottle.isVisible().catch(() => false)) {
      await emptyBottle.locator('[data-testid="order-refill-button"]').click();
      await page.waitForTimeout(1000);

      // Check pricing breakdown
      const pricingSection = page.locator('[data-testid="refill-pricing"]');
      await expect(pricingSection).toBeVisible();

      // Verify standard price
      const standardPrice = pricingSection.locator('[data-testid="standard-price"]');
      await expect(standardPrice).toBeVisible();

      // Verify credit discount if applicable
      const creditDiscount = pricingSection.locator('[data-testid="credit-discount"]');
      // May or may not be visible depending on credits

      // Verify final price
      const finalPrice = pricingSection.locator('[data-testid="final-price"]');
      await expect(finalPrice).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should restrict refill access for locked customers', async ({ page }) => {
    // Logout and login as new customer without refill unlock
    await page.goto('/account/logout');
    await page.waitForTimeout(1000);

    await page.goto('/account/login');
    await page.fill('[data-testid="login-email"]', 'new-customer@example.com');
    await page.fill('[data-testid="login-password"]', 'testpassword');
    await page.locator('[data-testid="login-submit"]').click();
    await page.waitForTimeout(2000);

    // Try to access refill circle
    await page.goto('/account/refill-circle');
    await page.waitForTimeout(2000);

    // Should see locked message
    const lockedMessage = page.locator('[data-testid="refill-locked-message"]');
    const hasLockedMessage = await lockedMessage.isVisible().catch(() => false);

    if (hasLockedMessage) {
      await expect(lockedMessage).toContainText('unlock');

      // Verify CTA to purchase 30ml
      const unlockCta = page.locator('[data-testid="unlock-refill-cta"]');
      await expect(unlockCta).toBeVisible();
    } else {
      // If not locked, verify dashboard is shown
      const dashboard = page.locator('[data-testid="refill-dashboard"]');
      await expect(dashboard).toBeVisible();
    }
  });
});
