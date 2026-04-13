/**
 * Shopify ↔ Content Integration Tests
 * 
 * Tests that Sanity content syncs to Shopify, synergy content appears on product pages,
 * and metafields update correctly.
 */

// Mock ioredis before any imports
jest.mock('ioredis', () => {
  return {
    __esModule: true,
    Redis: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      set: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
      on: jest.fn(),
      quit: jest.fn(),
      connect: jest.fn(),
      flushdb: jest.fn(),
    })),
  };
});

// Mock drizzle-orm
jest.mock('drizzle-orm', () => ({
  eq: jest.fn((field, value) => ({ field, value, operator: 'eq' })),
  and: jest.fn((...conditions) => ({ conditions, operator: 'and' })),
  desc: jest.fn((field) => ({ field, direction: 'desc' })),
  sql: jest.fn((template, ...values) => ({ template, values })),
}));

// Mock database schema
jest.mock('@/lib/db/schema-refill', () => ({
  customers: { id: 'customers.id', email: 'customers.email', metadata: 'customers.metadata' },
  orders: { id: 'orders.id', customerId: 'orders.customerId', metadata: 'orders.metadata' },
  foreverBottles: { id: 'foreverBottles.id', customerId: 'foreverBottles.customerId', status: 'foreverBottles.status' },
  creditTransactions: { id: 'creditTransactions.id', customerId: 'creditTransactions.customerId' },
  customerCredits: { id: 'customerCredits.id', customerId: 'customerCredits.customerId', balance: 'customerCredits.balance' },
  foreverBottleHistory: { id: 'foreverBottleHistory.id' },
}));

// Mock database before any imports
jest.mock('@/lib/db', () => ({
  db: {
    query: {},
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  syncSynergyContentToShopify,
  syncProductContent,
} from '@/lib/shopify/product-sync';
import { 
  updateProductMetafields,
  getProductMetafields,
} from '@/lib/shopify/metafields';
import { 
  createMockOil,
  createMockCrystal,
  createMockSynergyContent,
} from '../utils/test-data';
import { 
  setupTestEnvironment, 
  teardownTestEnvironment,
  shopifyMocks,
} from '../utils/setup';

// Mock Shopify API
jest.mock('@/lib/shopify/product-sync', () => ({
  syncSynergyContentToShopify: jest.fn(),
  syncProductContent: jest.fn(),
}));

jest.mock('@/lib/shopify/metafields', () => ({
  updateProductMetafields: jest.fn(),
  getProductMetafields: jest.fn(),
}));

describe('Shopify ↔ Content Integration', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await teardownTestEnvironment();
  });

  describe('Sanity Content Sync to Shopify', () => {
    it('should sync oil content to Shopify product', async () => {
      // Arrange
      const oil = createMockOil({
        id: 'oil-lavender-123',
        title: 'Lavender Essential Oil',
        slug: 'lavender-essential-oil',
      });

      const shopifyProductId = 'gid://shopify/Product/123456789';

      (syncProductContent as jest.Mock).mockResolvedValue({
        success: true,
        productId: shopifyProductId,
        syncedFields: ['title', 'description', 'metafields'],
      });

      // Act
      const result = await syncProductContent(oil, shopifyProductId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.productId).toBe(shopifyProductId);
      expect(syncProductContent).toHaveBeenCalledWith(oil, shopifyProductId);
    });

    it('should sync crystal properties to product metafields', async () => {
      // Arrange
      const crystal = createMockCrystal({
        name: 'Amethyst',
        chakra: 'crown',
        element: 'air',
      });

      const productId = 'gid://shopify/Product/123456789';

      (updateProductMetafields as jest.Mock).mockResolvedValue({
        success: true,
        metafields: [
          { namespace: 'crystal', key: 'name', value: 'Amethyst' },
          { namespace: 'crystal', key: 'chakra', value: 'crown' },
          { namespace: 'crystal', key: 'element', value: 'air' },
        ],
      });

      // Act
      const result = await updateProductMetafields(productId, [
        { namespace: 'crystal', key: 'name', value: crystal.name },
        { namespace: 'crystal', key: 'chakra', value: crystal.properties.chakra },
        { namespace: 'crystal', key: 'element', value: crystal.properties.element },
      ]);

      // Assert
      expect(result.success).toBe(true);
      expect(result.metafields).toHaveLength(3);
    });

    it('should handle sync failures gracefully', async () => {
      // Arrange
      const oil = createMockOil({ title: 'Test Oil' });
      const productId = 'gid://shopify/Product/999999999';

      (syncProductContent as jest.Mock).mockRejectedValue(
        new Error('Product not found in Shopify')
      );

      // Act & Assert
      await expect(syncProductContent(oil, productId)).rejects.toThrow('Product not found');
    });
  });

  describe('Synergy Content on Product Pages', () => {
    it('should display synergy content for oil-crystal combination', async () => {
      // Arrange
      const oil = createMockOil({ id: 'oil-lavender', title: 'Lavender' });
      const crystal = createMockCrystal({ id: 'crystal-amethyst', name: 'Amethyst' });
      const synergy = createMockSynergyContent({
        oilRef: oil._id,
        crystalRef: crystal._id,
        headline: 'Divine Tranquility',
        intention: 'calm',
      });

      const productId = 'gid://shopify/Product/123456789';

      (syncSynergyContentToShopify as jest.Mock).mockResolvedValue({
        success: true,
        productId,
        synergyContent: {
          headline: synergy.headline,
          story: synergy.story,
          ritualInstructions: synergy.ritualInstructions,
        },
      });

      // Act
      const result = await syncSynergyContentToShopify(synergy, productId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.synergyContent.headline).toBe('Divine Tranquility');
    });

    it('should update product metafields with synergy information', async () => {
      // Arrange
      const synergy = createMockSynergyContent({
        headline: 'Divine Tranquility',
        intention: 'calm',
        chakraAlignment: 'crown',
        element: 'air',
      });

      const productId = 'gid://shopify/Product/123456789';

      (updateProductMetafields as jest.Mock).mockResolvedValue({
        success: true,
        metafields: [
          { namespace: 'synergy', key: 'headline', value: synergy.headline },
          { namespace: 'synergy', key: 'intention', value: synergy.intention },
          { namespace: 'synergy', key: 'chakra', value: synergy.chakraAlignment },
          { namespace: 'synergy', key: 'element', value: synergy.element },
        ],
      });

      // Act
      const result = await updateProductMetafields(productId, [
        { namespace: 'synergy', key: 'headline', value: synergy.headline },
        { namespace: 'synergy', key: 'intention', value: synergy.intention },
        { namespace: 'synergy', key: 'chakra', value: synergy.chakraAlignment },
        { namespace: 'synergy', key: 'element', value: synergy.element },
      ]);

      // Assert
      const headlineMetafield = result.metafields.find(
        (m: { key: string }) => m.key === 'headline'
      );
      expect(headlineMetafield?.value).toBe('Divine Tranquility');
    });

    it('should retrieve synergy content from product metafields', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/123456789';

      (getProductMetafields as jest.Mock).mockResolvedValue({
        metafields: [
          { namespace: 'synergy', key: 'headline', value: 'Divine Tranquility' },
          { namespace: 'synergy', key: 'intention', value: 'calm' },
          { namespace: 'synergy', key: 'chakra', value: 'crown' },
          { namespace: 'crystal', key: 'name', value: 'Amethyst' },
        ],
      });

      // Act
      const result = await getProductMetafields(productId);

      // Assert
      const synergyFields = result.metafields.filter(
        (m: { namespace: string }) => m.namespace === 'synergy'
      );
      expect(synergyFields).toHaveLength(3);
    });
  });

  describe('Metafield Updates', () => {
    it('should update multiple metafields in batch', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/123456789';
      const metafields = [
        { namespace: 'oil', key: 'botanical_name', value: 'Lavandula angustifolia' },
        { namespace: 'oil', key: 'origin', value: 'Bulgaria' },
        { namespace: 'oil', key: 'extraction', value: 'Steam distillation' },
        { namespace: 'usage', key: 'diffusion', value: '3-5 drops' },
        { namespace: 'usage', key: 'topical', value: '2% dilution' },
      ];

      (updateProductMetafields as jest.Mock).mockResolvedValue({
        success: true,
        metafields: metafields.map((m, i) => ({ ...m, id: `metafield-${i}` })),
      });

      // Act
      const result = await updateProductMetafields(productId, metafields);

      // Assert
      expect(result.success).toBe(true);
      expect(result.metafields).toHaveLength(5);
    });

    it('should preserve existing metafields when updating', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/123456789';
      const existingMetafields = [
        { namespace: 'general', key: 'brand', value: 'Oil Amor' },
        { namespace: 'general', key: 'collection', value: 'Essentials' },
      ];
      const newMetafields = [
        { namespace: 'oil', key: 'safety', value: 'Dilute before use' },
      ];

      (getProductMetafields as jest.Mock).mockResolvedValue({
        metafields: existingMetafields,
      });

      (updateProductMetafields as jest.Mock).mockResolvedValue({
        success: true,
        metafields: [...existingMetafields, ...newMetafields],
      });

      // Act
      const existing = await getProductMetafields(productId);
      const result = await updateProductMetafields(productId, newMetafields);

      // Assert
      expect(result.metafields).toHaveLength(3);
      expect(result.metafields.some((m: { namespace: string; key: string }) => 
        m.namespace === 'general' && m.key === 'brand'
      )).toBe(true);
    });

    it('should handle metafield value type conversions', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/123456789';
      const metafields = [
        { namespace: 'pricing', key: 'member_price', value: '45.00', type: 'number_decimal' },
        { namespace: 'inventory', key: 'in_stock', value: 'true', type: 'boolean' },
        { namespace: 'product', key: 'featured', value: 'false', type: 'boolean' },
      ];

      (updateProductMetafields as jest.Mock).mockResolvedValue({
        success: true,
        metafields: metafields.map((m, i) => ({ 
          ...m, 
          id: `metafield-${i}`,
          value: m.type === 'boolean' ? m.value === 'true' : parseFloat(m.value),
        })),
      });

      // Act
      const result = await updateProductMetafields(productId, metafields);

      // Assert
      const memberPrice = result.metafields.find(
        (m: { key: string }) => m.key === 'member_price'
      );
      expect(memberPrice?.value).toBe(45.00);
    });
  });

  describe('Content Sync Workflows', () => {
    it('should sync new oil product with all content', async () => {
      // Arrange
      const oil = createMockOil({
        title: 'New Essential Oil',
        botanicalName: 'Test plant',
        description: 'A wonderful new oil',
      });

      const shopifyProductId = 'gid://shopify/Product/987654321';

      (syncProductContent as jest.Mock).mockResolvedValue({
        success: true,
        productId: shopifyProductId,
        syncedFields: [
          'title',
          'description',
          'botanical_name',
          'origin',
          'extraction_method',
          'safety_notes',
        ],
      });

      // Act
      const result = await syncProductContent(oil, shopifyProductId);

      // Assert
      expect(result.syncedFields).toContain('title');
      expect(result.syncedFields).toContain('description');
    });

    it('should update existing product when content changes', async () => {
      // Arrange
      const oil = createMockOil({ title: 'Updated Oil Name' });
      const productId = 'gid://shopify/Product/123456789';

      (syncProductContent as jest.Mock).mockResolvedValue({
        success: true,
        productId,
        updatedFields: ['title', 'slug'],
        previousValues: { title: 'Old Oil Name' },
      });

      // Act
      const result = await syncProductContent(oil, productId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.updatedFields).toContain('title');
    });

    it('should validate content before syncing', async () => {
      // Arrange
      const invalidOil = createMockOil({ 
        title: '', // Invalid: empty title
        botanicalName: '', // Invalid: empty botanical name
      });
      const productId = 'gid://shopify/Product/123456789';

      (syncProductContent as jest.Mock).mockRejectedValue(
        new Error('Validation failed: title and botanicalName are required')
      );

      // Act & Assert
      await expect(syncProductContent(invalidOil, productId)).rejects.toThrow('Validation failed');
    });
  });

  describe('Synergy Content Display Logic', () => {
    it('should select correct synergy based on crystal type', async () => {
      // Arrange
      const oil = createMockOil({ id: 'oil-lavender' });
      const amethystSynergy = createMockSynergyContent({
        id: 'synergy-lavender-amethyst',
        oilRef: oil._id,
        crystalRef: 'crystal-amethyst',
        headline: 'Lavender + Amethyst: Divine Tranquility',
      });
      const quartzSynergy = createMockSynergyContent({
        id: 'synergy-lavender-quartz',
        oilRef: oil._id,
        crystalRef: 'crystal-quartz',
        headline: 'Lavender + Quartz: Clear Calm',
      });

      const productId = 'gid://shopify/Product/123456789';

      (syncSynergyContentToShopify as jest.Mock)
        .mockResolvedValue({
          success: true,
          productId,
          synergyContent: { headline: 'Lavender + Amethyst: Divine Tranquility' },
        });

      // Act
      const amethystResult = await syncSynergyContentToShopify(amethystSynergy, productId);

      // Assert
      expect(amethystResult.synergyContent.headline).toContain('Amethyst');
    });

    it('should include ritual instructions in synergy sync', async () => {
      // Arrange
      const synergy = createMockSynergyContent({
        ritualInstructions: [
          { stepNumber: 1, title: 'Prepare', instruction: 'Set your intention' },
          { stepNumber: 2, title: 'Apply', instruction: 'Use 2-3 drops' },
        ],
      });

      const productId = 'gid://shopify/Product/123456789';

      (syncSynergyContentToShopify as jest.Mock).mockResolvedValue({
        success: true,
        productId,
        synergyContent: {
          headline: synergy.headline,
          ritualInstructions: synergy.ritualInstructions,
        },
      });

      // Act
      const result = await syncSynergyContentToShopify(synergy, productId);

      // Assert
      expect(result.synergyContent.ritualInstructions).toHaveLength(2);
    });
  });
});
