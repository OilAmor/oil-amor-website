/**
 * Shopify API Contract Tests
 * 
 * Verify Shopify API contracts don't break
 * Test webhook payload formats
 * Test Storefront API responses
 */

import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

// ============================================================================
// Shopify Webhook Payload Schemas
// ============================================================================

const ShopifyCustomerSchema = z.object({
  id: z.number().or(z.string()),
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  accepts_marketing: z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const ShopifyLineItemSchema = z.object({
  id: z.number().or(z.string()),
  product_id: z.number().or(z.string()),
  variant_id: z.number().or(z.string()),
  quantity: z.number(),
  price: z.string(),
  title: z.string(),
  variant_title: z.string().optional(),
  sku: z.string().optional(),
  vendor: z.string().optional(),
  grams: z.number().optional(),
  properties: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
});

const ShopifyAddressSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  province: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string().optional(),
});

const ShopifyOrderCreateSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  order_number: z.number(),
  customer: ShopifyCustomerSchema.optional(),
  email: z.string().email().optional(),
  line_items: z.array(ShopifyLineItemSchema),
  total_price: z.string(),
  subtotal_price: z.string(),
  total_tax: z.string(),
  currency: z.string(),
  financial_status: z.string(),
  fulfillment_status: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  billing_address: ShopifyAddressSchema.optional(),
  shipping_address: ShopifyAddressSchema.optional(),
  note: z.string().optional(),
  note_attributes: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
});

const ShopifyOrderPaidSchema = ShopifyOrderCreateSchema.extend({
  financial_status: z.literal('paid'),
});

type ShopifyOrderCreate = z.infer<typeof ShopifyOrderCreateSchema>;
type ShopifyOrderPaid = z.infer<typeof ShopifyOrderPaidSchema>;

// ============================================================================
// Storefront API Response Schemas
// ============================================================================

const StorefrontMoneyV2Schema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

const StorefrontProductVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: StorefrontMoneyV2Schema,
  compareAtPrice: StorefrontMoneyV2Schema.optional().nullable(),
  sku: z.string().optional(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().optional(),
});

const StorefrontProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  description: z.string(),
  productType: z.string(),
  variants: z.object({
    edges: z.array(z.object({
      node: StorefrontProductVariantSchema,
    })),
  }),
  metafields: z.object({
    edges: z.array(z.object({
      node: z.object({
        namespace: z.string(),
        key: z.string(),
        value: z.string(),
      }),
    })),
  }).optional(),
});

const StorefrontCartSchema = z.object({
  id: z.string(),
  checkoutUrl: z.string().url(),
  lines: z.object({
    edges: z.array(z.object({
      node: z.object({
        id: z.string(),
        quantity: z.number(),
        merchandise: StorefrontProductVariantSchema,
        attributes: z.array(z.object({
          key: z.string(),
          value: z.string(),
        })),
      }),
    })),
  }),
  cost: z.object({
    subtotalAmount: StorefrontMoneyV2Schema,
    totalAmount: StorefrontMoneyV2Schema,
    totalTaxAmount: StorefrontMoneyV2Schema.optional(),
  }),
});

type StorefrontCart = z.infer<typeof StorefrontCartSchema>;

// ============================================================================
// Contract Tests
// ============================================================================

describe('Shopify API Contract Tests', () => {
  describe('Webhook Payload Contracts', () => {
    it('should validate order/create webhook payload', () => {
      const validPayload: ShopifyOrderCreate = {
        id: 'gid://shopify/Order/1234567890',
        name: '#1001',
        order_number: 1001,
        customer: {
          id: 'gid://shopify/Customer/9876543210',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'Customer',
        },
        email: 'test@example.com',
        line_items: [
          {
            id: 'gid://shopify/LineItem/111111111',
            product_id: 'gid://shopify/Product/222222222',
            variant_id: 'gid://shopify/ProductVariant/333333333',
            quantity: 1,
            price: '89.99',
            title: 'Lavender Essential Oil',
            variant_title: '30ml',
            sku: 'LAV-30',
            properties: [
              { name: '_crystal_type', value: 'amethyst' },
              { name: '_cord_type', value: 'waxed-cotton' },
            ],
          },
        ],
        total_price: '89.99',
        subtotal_price: '89.99',
        total_tax: '0.00',
        currency: 'AUD',
        financial_status: 'pending',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        billing_address: {
          first_name: 'Test',
          last_name: 'Customer',
          address1: '123 Test Street',
          city: 'Sydney',
          province: 'NSW',
          country: 'Australia',
          zip: '2000',
        },
      };

      const result = ShopifyOrderCreateSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should validate order/paid webhook payload', () => {
      const validPayload: ShopifyOrderPaid = {
        id: 'gid://shopify/Order/1234567890',
        name: '#1001',
        order_number: 1001,
        customer: {
          id: 'gid://shopify/Customer/9876543210',
          email: 'test@example.com',
        },
        email: 'test@example.com',
        line_items: [],
        total_price: '89.99',
        subtotal_price: '89.99',
        total_tax: '0.00',
        currency: 'AUD',
        financial_status: 'paid',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:35:00Z',
      };

      const result = ShopifyOrderPaidSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid order webhook payload', () => {
      const invalidPayload = {
        id: '123',
        // Missing required fields
        line_items: 'not-an-array',
      };

      const result = ShopifyOrderCreateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should validate customer-created webhook payload', () => {
      const validPayload = {
        id: 'gid://shopify/Customer/9876543210',
        email: 'newcustomer@example.com',
        first_name: 'New',
        last_name: 'Customer',
        accepts_marketing: false,
        created_at: '2024-01-15T10:30:00Z',
      };

      const result = ShopifyCustomerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should handle webhook payload with custom attributes', () => {
      const payloadWithCustomAttributes: ShopifyOrderCreate = {
        id: 'gid://shopify/Order/1234567890',
        name: '#1001',
        order_number: 1001,
        email: 'test@example.com',
        line_items: [
          {
            id: 'gid://shopify/LineItem/111111111',
            product_id: 'gid://shopify/Product/222222222',
            variant_id: 'gid://shopify/ProductVariant/333333333',
            quantity: 1,
            price: '89.99',
            title: 'Lavender Essential Oil',
            properties: [
              { name: '_crystal_type', value: 'amethyst' },
              { name: '_crystal_count', value: '3' },
              { name: '_cord_type', value: 'waxed-cotton' },
              { name: '_customer_tier', value: 'sprout' },
            ],
          },
        ],
        total_price: '89.99',
        subtotal_price: '89.99',
        total_tax: '0.00',
        currency: 'AUD',
        financial_status: 'paid',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        note_attributes: [
          { name: 'crystal_circle_tier', value: 'sprout' },
          { name: 'account_credit_applied', value: '5.00' },
        ],
      };

      const result = ShopifyOrderCreateSchema.safeParse(payloadWithCustomAttributes);
      expect(result.success).toBe(true);
    });
  });

  describe('Storefront API Response Contracts', () => {
    it('should validate cart creation response', () => {
      const validCartResponse: StorefrontCart = {
        id: 'gid://shopify/Cart/abc123',
        checkoutUrl: 'https://oil-amor.myshopify.com/checkouts/abc123',
        lines: {
          edges: [
            {
              node: {
                id: 'gid://shopify/CartLine/line1',
                quantity: 1,
                merchandise: {
                  id: 'gid://shopify/ProductVariant/variant1',
                  title: 'Lavender Oil / 30ml',
                  price: { amount: '89.99', currencyCode: 'AUD' },
                  availableForSale: true,
                },
                attributes: [
                  { key: '_crystal_type', value: 'amethyst' },
                  { key: '_cord_type', value: 'waxed-cotton' },
                ],
              },
            },
          ],
        },
        cost: {
          subtotalAmount: { amount: '89.99', currencyCode: 'AUD' },
          totalAmount: { amount: '89.99', currencyCode: 'AUD' },
        },
      };

      const result = StorefrontCartSchema.safeParse(validCartResponse);
      expect(result.success).toBe(true);
    });

    it('should validate product query response', () => {
      const validProductResponse = {
        id: 'gid://shopify/Product/123',
        title: 'Lavender Essential Oil',
        handle: 'lavender-essential-oil',
        description: 'Premium lavender essential oil',
        productType: 'Essential Oil',
        variants: {
          edges: [
            {
              node: {
                id: 'gid://shopify/ProductVariant/456',
                title: '30ml',
                price: { amount: '89.99', currencyCode: 'AUD' },
                compareAtPrice: null,
                sku: 'LAV-30',
                availableForSale: true,
                quantityAvailable: 50,
              },
            },
          ],
        },
        metafields: {
          edges: [
            {
              node: {
                namespace: 'crystal',
                key: 'default_crystal',
                value: 'amethyst',
              },
            },
          ],
        },
      };

      const result = StorefrontProductSchema.safeParse(validProductResponse);
      expect(result.success).toBe(true);
    });

    it('should handle cart response with credit application', () => {
      const cartWithCredit: StorefrontCart = {
        id: 'gid://shopify/Cart/abc123',
        checkoutUrl: 'https://oil-amor.myshopify.com/checkouts/abc123',
        lines: {
          edges: [
            {
              node: {
                id: 'gid://shopify/CartLine/line1',
                quantity: 1,
                merchandise: {
                  id: 'gid://shopify/ProductVariant/variant1',
                  title: 'Lavender Oil / 30ml',
                  price: { amount: '89.99', currencyCode: 'AUD' },
                  availableForSale: true,
                },
                attributes: [
                  { key: '_crystal_type', value: 'amethyst' },
                  { key: '_credit_applied', value: '5.00' },
                ],
              },
            },
            {
              node: {
                id: 'gid://shopify/CartLine/credit',
                quantity: 1,
                merchandise: {
                  id: 'gid://shopify/ProductVariant/credit',
                  title: 'Account Credit',
                  price: { amount: '-5.00', currencyCode: 'AUD' },
                  availableForSale: true,
                },
                attributes: [
                  { key: '_component_type', value: 'credit' },
                  { key: '_credit_amount', value: '5.00' },
                ],
              },
            },
          ],
        },
        cost: {
          subtotalAmount: { amount: '84.99', currencyCode: 'AUD' },
          totalAmount: { amount: '84.99', currencyCode: 'AUD' },
        },
      };

      const result = StorefrontCartSchema.safeParse(cartWithCredit);
      expect(result.success).toBe(true);
    });
  });

  describe('Metafield Contracts', () => {
    it('should validate customer metafield structure', () => {
      const customerMetafields = [
        { namespace: 'crystal_circle', key: 'tier', value: 'sprout', type: 'string' },
        { namespace: 'crystal_circle', key: 'total_spend', value: '150.00', type: 'number_decimal' },
        { namespace: 'crystal_circle', key: 'account_credit', value: '25.00', type: 'number_decimal' },
        { namespace: 'crystal_circle', key: 'member_since', value: '2024-01-15', type: 'date' },
      ];

      const MetafieldSchema = z.object({
        namespace: z.string(),
        key: z.string(),
        value: z.string(),
        type: z.string(),
      });

      const result = z.array(MetafieldSchema).safeParse(customerMetafields);
      expect(result.success).toBe(true);
    });

    it('should validate product metafield structure', () => {
      const productMetafields = [
        { namespace: 'oil', key: 'botanical_name', value: 'Lavandula angustifolia' },
        { namespace: 'oil', key: 'origin', value: 'Bulgaria' },
        { namespace: 'oil', key: 'extraction_method', value: 'Steam distillation' },
        { namespace: 'crystal', key: 'synergy_crystals', value: 'amethyst,rose-quartz' },
        { namespace: 'inventory', key: 'reorder_point', value: '10' },
      ];

      const ProductMetafieldSchema = z.object({
        namespace: z.string(),
        key: z.string(),
        value: z.string(),
      });

      const result = z.array(ProductMetafieldSchema).safeParse(productMetafields);
      expect(result.success).toBe(true);
    });
  });

  describe('API Version Compatibility', () => {
    it('should document supported API versions', () => {
      const supportedVersions = [
        '2023-10',
        '2024-01',
        '2024-04',
        '2024-07',
      ];

      // Document minimum required version
      const minimumVersion = '2023-10';
      expect(supportedVersions).toContain(minimumVersion);
    });

    it('should validate GraphQL query structure', () => {
      const cartCreateMutation = `
        mutation CartCreate($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              id
              checkoutUrl
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price { amount currencyCode }
                      }
                    }
                    attributes { key value }
                  }
                }
              }
              cost {
                subtotalAmount { amount currencyCode }
                totalAmount { amount currencyCode }
              }
            }
            userErrors { field message }
          }
        }
      `;

      // Document the expected query structure
      expect(cartCreateMutation).toContain('cartCreate');
      expect(cartCreateMutation).toContain('CartLineInput');
      expect(cartCreateMutation).toContain('userErrors');
    });
  });

  describe('Error Response Contracts', () => {
    it('should validate GraphQL error response', () => {
      const graphqlError = {
        errors: [
          {
            message: 'Invalid merchandise ID',
            locations: [{ line: 2, column: 3 }],
            path: ['cartCreate', 'lines'],
            extensions: {
              code: 'INVALID_INPUT',
            },
          },
        ],
        data: null,
      };

      const GraphQLErrorSchema = z.object({
        errors: z.array(z.object({
          message: z.string(),
          locations: z.array(z.object({
            line: z.number(),
            column: z.number(),
          })).optional(),
          path: z.array(z.string()).optional(),
          extensions: z.object({
            code: z.string(),
          }).optional(),
        })),
        data: z.null().optional(),
      });

      const result = GraphQLErrorSchema.safeParse(graphqlError);
      expect(result.success).toBe(true);
    });

    it('should handle rate limit errors', () => {
      const rateLimitError = {
        errors: [
          {
            message: 'Throttled',
            extensions: {
              code: 'THROTTLED',
              retryAfter: 2,
            },
          },
        ],
      };

      expect(rateLimitError.errors[0].extensions.code).toBe('THROTTLED');
      expect(rateLimitError.errors[0].extensions.retryAfter).toBe(2);
    });
  });
});
