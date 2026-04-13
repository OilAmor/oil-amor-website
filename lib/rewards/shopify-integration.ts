/**
 * Shopify Integration for Crystal Circle
 * 
 * Handles synchronization between the rewards system and Shopify:
 * - Customer metafields for tier data
 * - Checkout scripts for automatic discounts
 * - Webhook handlers for order events
 * - Klaviyo email integration
 */

import { TierLevel, CRYSTAL_CIRCLE_TIERS, calculateTier } from './tiers';
import {
  CustomerRewardsProfile,
  getCustomerRewardsProfile,
  updateCustomerSpend,
  OrderInfo
} from './customer-rewards';
import { getAvailableChains } from './chain-system';
import { getAvailableCharms } from './charm-system';

// ============================================================================
// TYPES
// ============================================================================

interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  metafields?: ShopifyMetafield[];
}

interface ShopifyMetafield {
  id?: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface ShopifyOrder {
  id: string;
  name: string;
  customer: {
    id: string;
  } | null;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: Array<{
      node: {
        product: {
          id: string;
          productType: string;
        } | null;
        variant: {
          id: string;
          price: string;
        };
        quantity: number;
        title: string;
      };
    }>;
  };
  createdAt: string;
}

interface CheckoutScriptInput {
  cart: {
    lines: Array<{
      merchandise: {
        product: {
          productType: string;
          tags: string[];
        };
      };
      cost: {
        totalAmount: {
          amount: string;
        };
      };
    }>;
    cost: {
      totalAmount: {
        amount: string;
      };
      subtotalAmount: {
        amount: string;
      };
    };
  };
  buyerIdentity: {
    customer: {
      id: string;
      metafields: Array<{
        namespace: string;
        key: string;
        value: string;
      }>;
    } | null;
  };
}

interface DiscountApplication {
  target: 'order' | 'line';
  value: {
    percentage?: {
      value: number;
    };
    fixedAmount?: {
      amount: string;
    };
  };
  message: string;
  title: string;
}

// ============================================================================
// SHOPIFY METAFIELD CONFIGURATION
// ============================================================================

export const CRYSTAL_CIRCLE_METAFIELDS = {
  namespace: 'crystal_circle',
  keys: {
    tier: 'tier_level',
    totalSpend: 'total_spend',
    accountCredit: 'account_credit',
    memberSince: 'member_since',
    unlockedChains: 'unlocked_chains',
    unlockedCharms: 'unlocked_charms',
    purchaseCount: 'purchase_count'
  }
};

// ============================================================================
// CUSTOMER SYNC
// ============================================================================

/**
 * Sync customer rewards profile to Shopify metafields
 * @param customerId - Shopify customer ID
 * @param profile - Customer rewards profile
 */
export async function syncCustomerToShopify(
  customerId: string,
  profile: CustomerRewardsProfile
): Promise<void> {
  const metafields: ShopifyMetafield[] = [
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.tier,
      value: profile.currentTier,
      type: 'single_line_text_field'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.totalSpend,
      value: profile.totalSpend.toFixed(2),
      type: 'number_decimal'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.accountCredit,
      value: profile.accountCredit.toFixed(2),
      type: 'number_decimal'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.memberSince,
      value: profile.memberSince.toISOString(),
      type: 'date_time'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.purchaseCount,
      value: profile.purchaseCount.toString(),
      type: 'number_integer'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.unlockedChains,
      value: JSON.stringify(profile.unlockedChains),
      type: 'json'
    },
    {
      namespace: CRYSTAL_CIRCLE_METAFIELDS.namespace,
      key: CRYSTAL_CIRCLE_METAFIELDS.keys.unlockedCharms,
      value: JSON.stringify(profile.unlockedCharms),
      type: 'json'
    }
  ];

  // GraphQL mutation to update customer metafields
  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: `gid://shopify/Customer/${customerId}`,
      metafields: metafields.map(mf => ({
        namespace: mf.namespace,
        key: mf.key,
        value: mf.value,
        type: mf.type
      }))
    }
  };

  // Execute mutation via Shopify Admin API
  await executeShopifyGraphQL(mutation, variables);
}

/**
 * Get customer tier from Shopify metafields
 * @param customerId - Shopify customer ID
 * @returns Customer tier level
 */
export async function getCustomerTierFromShopify(
  customerId: string
): Promise<TierLevel | null> {
  const query = `
    query getCustomerMetafields($id: ID!) {
      customer(id: $id) {
        metafields(namespace: "crystal_circle", first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  `;

  const result = await executeShopifyGraphQL(query, {
    id: `gid://shopify/Customer/${customerId}`
  });

  const metafields = result.data?.customer?.metafields?.edges || [];
  const tierMetafield = metafields.find(
    (mf: { node: { key: string } }) => mf.node.key === 'tier_level'
  );

  return tierMetafield?.node?.value as TierLevel || null;
}

// ============================================================================
// CHECKOUT INTEGRATION
// ============================================================================

/**
 * Generate checkout script for automatic tier discounts
 * This function returns discount applications based on customer tier
 */
export async function generateCheckoutDiscounts(
  input: CheckoutScriptInput
): Promise<DiscountApplication[]> {
  const discounts: DiscountApplication[] = [];
  
  const customer = input.buyerIdentity.customer;
  if (!customer) {
    return discounts;
  }

  // Get tier from customer metafields
  const tierMetafield = customer.metafields.find(
    mf => mf.namespace === 'crystal_circle' && mf.key === 'tier_level'
  );
  
  if (!tierMetafield) {
    return discounts;
  }

  const tier = tierMetafield.value as TierLevel;
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier];

  // Apply refill discount if applicable
  if (tierConfig.refillDiscount > 0) {
    const hasRefillItems = input.cart.lines.some(
      line => 
        line.merchandise.product.productType === 'Oil' &&
        line.merchandise.product.tags.includes('refill')
    );

    if (hasRefillItems) {
      discounts.push({
        target: 'line',
        value: {
          percentage: {
            value: tierConfig.refillDiscount
          }
        },
        message: `${tierConfig.name} Member: ${tierConfig.refillDiscount}% off refills`,
        title: 'Crystal Circle Refill Discount'
      });
    }
  }

  // Apply account credit if available
  const creditMetafield = customer.metafields.find(
    mf => mf.namespace === 'crystal_circle' && mf.key === 'account_credit'
  );

  if (creditMetafield) {
    const credit = parseFloat(creditMetafield.value);
    if (credit > 0) {
      const subtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
      const creditToUse = Math.min(credit, subtotal);

      discounts.push({
        target: 'order',
        value: {
          fixedAmount: {
            amount: creditToUse.toFixed(2)
          }
        },
        message: `Account Credit: $${creditToUse.toFixed(2)} applied`,
        title: 'Crystal Circle Account Credit'
      });
    }
  }

  return discounts;
}

// ============================================================================
// WEBHOOK HANDLERS
// ============================================================================

/**
 * Handle Shopify order creation webhook
 * Updates customer spend and processes tier changes
 */
export async function handleOrderCreatedWebhook(
  order: ShopifyOrder
): Promise<void> {
  if (!order.customer) {
    console.log('Order has no customer, skipping rewards update');
    return;
  }

  const customerId = order.customer.id;
  const orderTotal = parseFloat(order.totalPriceSet.shopMoney.amount);

  // Build order info for processing
  const orderInfo: OrderInfo = {
    orderId: order.id,
    orderTotal,
    items: order.lineItems.edges.map(({ node }) => ({
      productId: node.product?.id || '',
      productType: mapProductType(node.product?.productType || ''),
      quantity: node.quantity,
      price: parseFloat(node.variant.price)
    })),
    isRefill: order.lineItems.edges.some(({ node }) =>
      node.title.toLowerCase().includes('refill')
    )
  };

  // Update customer rewards
  const result = await updateCustomerSpend(customerId, orderInfo);

  // Sync updated profile to Shopify
  await syncCustomerToShopify(customerId, result.profile);

  // Send notifications for tier upgrades
  if (result.tierUpgraded) {
    const { createTierUpgradeNotification } = await import('./notifications');
    await createTierUpgradeNotification(
      customerId,
      result.newTier!,
      result.previousTier
    );
  }

  // Send notifications for new chain unlocks
  for (const chain of result.newChainsUnlocked) {
    const { createChainUnlockNotification } = await import('./notifications');
    await createChainUnlockNotification(customerId, chain);
  }

  // Send notifications for new charm unlocks
  for (const charm of result.newCharmsUnlocked) {
    const { createCharmUnlockNotification } = await import('./notifications');
    await createCharmUnlockNotification(customerId, charm);
  }
}

/**
 * Handle Shopify customer creation webhook
 * Initializes rewards profile for new customers
 */
export async function handleCustomerCreatedWebhook(
  customer: ShopifyCustomer
): Promise<void> {
  // New customers start at Seed tier with default profile
  const defaultProfile = await getCustomerRewardsProfile(customer.id);
  
  await syncCustomerToShopify(customer.id, defaultProfile);

  // Send welcome email via Klaviyo
  await sendKlaviyoEmail(customer.email, 'welcome-crystal-circle', {
    firstName: customer.firstName,
    tierName: 'Seed',
    benefits: CRYSTAL_CIRCLE_TIERS.seed.benefits
  });
}

// ============================================================================
// KLAVIYO INTEGRATION
// ============================================================================

interface KlaviyoEvent {
  token: string;
  event: string;
  customer_properties: {
    $email: string;
    $first_name?: string;
    $last_name?: string;
  };
  properties: Record<string, unknown>;
  time: string;
}

/**
 * Send event to Klaviyo for email automation
 */
export async function trackKlaviyoEvent(
  email: string,
  event: string,
  properties: Record<string, unknown>
): Promise<void> {
  const klaviyoEvent: KlaviyoEvent = {
    token: process.env.KLAVIYO_PUBLIC_API_KEY || '',
    event,
    customer_properties: {
      $email: email
    },
    properties,
    time: new Date().toISOString()
  };

  await fetch('https://a.klaviyo.com/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(klaviyoEvent)
  });
}

/**
 * Send email via Klaviyo
 */
export async function sendKlaviyoEmail(
  email: string,
  templateId: string,
  variables: Record<string, unknown>
): Promise<void> {
  // Use Klaviyo API to trigger email
  const response = await fetch('https://a.klaviyo.com/api/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.KLAVIYO_PRIVATE_API_KEY}`
    },
    body: JSON.stringify({
      to: email,
      template: templateId,
      variables
    })
  });

  if (!response.ok) {
    console.error('Failed to send Klaviyo email:', await response.text());
  }
}

/**
 * Sync customer properties to Klaviyo profile
 */
export async function syncToKlaviyoProfile(
  email: string,
  profile: CustomerRewardsProfile
): Promise<void> {
  await trackKlaviyoEvent(email, 'Crystal Circle Profile Updated', {
    tier: profile.currentTier,
    totalSpend: profile.totalSpend,
    purchaseCount: profile.purchaseCount,
    accountCredit: profile.accountCredit,
    unlockedChainsCount: profile.unlockedChains.length,
    unlockedCharmsCount: profile.unlockedCharms.includes('all') 
      ? 'all' 
      : profile.unlockedCharms.length
  });
}

// ============================================================================
// PRODUCT CONFIGURATOR INTEGRATION
// ============================================================================

/**
 * Get available options for product configurator based on customer tier
 */
export async function getConfiguratorOptions(
  customerId: string
): Promise<{
  chains: Array<{ type: string; name: string; available: boolean }>;
  charms: Array<{ id: string; name: string; available: boolean }>;
}> {
  const profile = await getCustomerRewardsProfile(customerId);
  
  const availableChains = getAvailableChains(profile.currentTier);
  const availableCharms = getAvailableCharms(
    profile.purchaseCount,
    profile.currentTier
  );

  return {
    chains: availableChains.map(chain => ({
      type: chain.type,
      name: chain.config.name,
      available: !chain.isLocked
    })),
    charms: availableCharms.map(charm => ({
      id: charm.id,
      name: charm.config.name,
      available: !charm.isLocked && charm.isCollected
    }))
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Execute Shopify GraphQL query/mutation
 */
async function executeShopifyGraphQL(
  query: string,
  variables: Record<string, unknown>
): Promise<any> {
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken || ''
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Map Shopify product type to internal product type
 */
function mapProductType(shopifyType: string): 'oil' | 'chain' | 'charm' | 'cord' | 'crystal' {
  const typeMap: Record<string, 'oil' | 'chain' | 'charm' | 'cord' | 'crystal'> = {
    'Oil': 'oil',
    'Essential Oil': 'oil',
    'Chain': 'chain',
    'Necklace Chain': 'chain',
    'Charm': 'charm',
    'Diffuser Charm': 'charm',
    'Cord': 'cord',
    'Leather Cord': 'cord',
    'Crystal': 'crystal',
    'Gemstone': 'crystal'
  };

  return typeMap[shopifyType] || 'oil';
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Sync all customers to Shopify (for initial setup)
 */
export async function syncAllCustomersToShopify(): Promise<{
  synced: number;
  failed: number;
  errors: string[];
}> {
  const results = { synced: 0, failed: 0, errors: [] as string[] };

  // This would iterate through all customers in the database
  // and sync their rewards profiles to Shopify
  
  return results;
}

/**
 * Migrate existing customer data to Crystal Circle
 */
export async function migrateExistingCustomers(): Promise<{
  migrated: number;
  skipped: number;
}> {
  // This would migrate customers from old loyalty system
  // to the new Crystal Circle system
  
  return { migrated: 0, skipped: 0 };
}
