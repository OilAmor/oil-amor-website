/**
 * Test Data Factories
 * 
 * Mock data factories for creating test data across all test suites.
 * Provides consistent, type-safe mock data for unit, integration, and E2E tests.
 */

// Simple ID generator for tests (avoids ESM issues with nanoid)
const generateId = () => `mock-${Math.random().toString(36).substring(2, 15)}`;

import type { 
  TierLevel, 
  ChainType, 
  TierConfig 
} from '@/lib/rewards/tiers';
import type { 
  CustomerRewardsProfile, 
  CreditTransaction, 
  OrderInfo 
} from '@/lib/rewards/customer-rewards';
import type { ForeverBottle } from '@/lib/refill/forever-bottle';
import type { 
  Crystal,
  CrystalOption,
  BottleSize,
  Chain,
  ChainUnlock
} from '@/lib/rewards/chain-system';
import type {
  SanityDocument,
  SanityReference,
  SanityImage
} from '@/lib/content/sanity-types';

// ============================================================================
// ID Generators
// ============================================================================

export function generateCustomerId(): string {
  return `gid://shopify/Customer/${Math.floor(Math.random() * 1000000000)}`;
}

export function generateOrderId(): string {
  return `gid://shopify/Order/${Math.floor(Math.random() * 1000000000)}`;
}

export function generateProductId(): string {
  return `gid://shopify/Product/${Math.floor(Math.random() * 1000000000)}`;
}

export function generateVariantId(): string {
  return `gid://shopify/ProductVariant/${Math.floor(Math.random() * 1000000000)}`;
}

export function generateCustomerId(): string {
  return `gid://shopify/Customer/${Math.floor(Math.random() * 1000000000)}`;
}

// ============================================================================
// Customer Rewards Factories
// ============================================================================

export interface CreateMockCustomerInput {
  id?: string;
  customerId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  tier?: TierLevel;
  totalSpend?: number;
  accountCredit?: number;
  lifetimePurchases?: number;
  purchaseCount?: number;
  chainsUnlocked?: ChainUnlock[];
  unlockedChains?: string[];
  unlockedCharms?: string[];
  referralCode?: string;
  referredBy?: string | null;
  referralCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export function createMockCustomer(overrides: CreateMockCustomerInput = {}): CustomerRewardsProfile {
  const customerId = overrides.id || generateId();
  const tier = overrides.tier || 'seed' as TierLevel;
  const totalSpend = overrides.totalSpend ?? 0;
  
  // Calculate refill discount based on tier
  const tierDiscounts: Record<string, number> = {
    seed: 0,
    sprout: 0,
    bloom: 5,
    radiance: 10,
    luminary: 15,
  };
  
  // Tier thresholds and next tier names (capitalize for display)
  const tierThresholds: Record<string, { min: number; max: number; next: string | null }> = {
    seed: { min: 0, max: 149, next: 'Sprout' },
    sprout: { min: 150, max: 349, next: 'Bloom' },
    bloom: { min: 350, max: 699, next: 'Radiance' },
    radiance: { min: 700, max: 1499, next: 'Luminary' },
    luminary: { min: 1500, max: Infinity, next: null },
  };
  
  const threshold = tierThresholds[tier];
  const amountNeeded = threshold.next ? threshold.max + 1 - totalSpend : 0;
  const percentage = threshold.next 
    ? Math.min(100, parseFloat(((totalSpend / (threshold.max + 1)) * 100).toFixed(2)))
    : 100;
  
  // Determine unlocked chains based on tier
  const tierChains: Record<string, string[]> = {
    seed: [],
    sprout: ['silver-plated'],
    bloom: ['silver-plated', 'gold-plated'],
    radiance: ['silver-plated', 'gold-plated', 'sterling-silver'],
    luminary: ['silver-plated', 'gold-plated', 'sterling-silver', '14k-gold-filled'],
  };
  
  return {
    customerId,
    currentTier: tier,
    totalSpend,
    lifetimePurchases: overrides.lifetimePurchases ?? 0,
    purchaseCount: overrides.purchaseCount ?? 0,
    unlockedChains: overrides.unlockedChains || tierChains[tier] || [],
    unlockedCharms: overrides.unlockedCharms || [],
    accountCredit: overrides.accountCredit ?? 0,
    reservedCredit: 0,
    refillDiscount: tierDiscounts[tier] ?? 0,
    refillUnlocked: false,
    cordsOwned: 0,
    crystalsCollected: [],
    progressToNextTier: {
      current: totalSpend,
      target: threshold.max + 1,
      percentage,
      amountNeeded,
      nextTierName: threshold.next,
    },
    memberSince: overrides.createdAt || new Date(),
    creditHistory: [],
  } as CustomerRewardsProfile;
}

export function createMockOrder(overrides: Partial<OrderInfo> = {}): OrderInfo {
  return {
    orderId: overrides.orderId || generateOrderId(),
    orderTotal: overrides.orderTotal ?? 150,
    items: overrides.items || [
      { productId: generateProductId(), quantity: 1, price: 150 }
    ],
  };
}

export function createMockCreditTransaction(
  overrides: Partial<CreditTransaction> = {}
): CreditTransaction {
  return {
    id: overrides.id || generateId(),
    customerId: overrides.customerId || generateId(),
    amount: overrides.amount ?? 25,
    type: overrides.type || 'manual_adjustment',
    description: overrides.description || 'Test credit',
    orderId: overrides.orderId || null,
    createdAt: overrides.createdAt || new Date(),
    expiresAt: overrides.expiresAt || null,
    used: overrides.used ?? false,
    usedAt: overrides.usedAt || null,
  };
}

// ============================================================================
// Chain System Factories
// ============================================================================

export function createMockCrystal(overrides: Partial<Crystal> & { properties?: Partial<Crystal> } = {}): Crystal {
  return {
    id: overrides.id || generateId(),
    name: overrides.name || 'Clear Quartz',
    color: overrides.color || '#E8E8E8',
    chakra: overrides.chakra || 'crown',
    element: overrides.element || 'ether',
    energy: overrides.energy || 'amplification',
    description: overrides.description || 'Master healer crystal',
    images: overrides.images || {
      raw: '/crystals/quartz-raw.png',
      polished: '/crystals/quartz-polished.png',
    },
    benefits: overrides.benefits || ['Clarity', 'Focus', 'Energy amplification'],
    usage: overrides.usage || 'Place in direct contact with skin',
    // Add properties object for compatibility with tests expecting crystal.properties.chakra
    properties: {
      chakra: overrides.chakra || 'crown',
      element: overrides.element || 'ether',
      ...(overrides.properties || {}),
    },
  } as Crystal;
}

export function createMockCrystalOption(overrides: Partial<CrystalOption> = {}): CrystalOption {
  const crystal = createMockCrystal();
  return {
    crystalId: overrides.crystalId || crystal.id,
    crystal: overrides.crystal || crystal,
    quantity: overrides.quantity ?? 3,
    position: overrides.position || 'infusion_chamber',
  };
}

export function createMockChain(overrides: Partial<Chain> = {}): Chain {
  return {
    id: overrides.id || generateId(),
    name: overrides.name || 'Healing Chain',
    description: overrides.description || 'A chain for healing and wellness',
    requiredTier: overrides.requiredTier || 'seed' as TierLevel,
    crystals: overrides.crystals || [createMockCrystal()],
    chakraFocus: overrides.chakraFocus || ['heart', 'crown'],
    element: overrides.element || 'water',
    priceModifier: overrides.priceModifier ?? 0,
    svgTemplate: overrides.svgTemplate || '<svg><circle/></svg>',
    unlockMessage: overrides.unlockMessage || 'You unlocked a new chain!',
    available: overrides.available ?? true,
    popular: overrides.popular ?? false,
  };
}

export function createMockChainUnlock(overrides: Partial<ChainUnlock> = {}): ChainUnlock {
  return {
    chainId: overrides.chainId || generateId(),
    chain: overrides.chain || createMockChain(),
    unlockedAt: overrides.unlockedAt || new Date(),
    unlockedByTier: overrides.unlockedByTier || 'seed' as TierLevel,
    usedInOrders: overrides.usedInOrders ?? 0,
  };
}

// ============================================================================
// Bottle/Crystal Config Factories
// ============================================================================

export function createMockBottleSize(overrides: Partial<BottleSize> = {}): BottleSize {
  return {
    id: overrides.id || '30ml',
    name: overrides.name || '30ml',
    volume: overrides.volume ?? 30,
    price: overrides.price ?? 79,
    crystalCount: overrides.crystalCount ?? 3,
    description: overrides.description || 'Perfect for beginners',
    popular: overrides.popular ?? false,
  };
}

// ============================================================================
// Forever Bottle Factories
// ============================================================================

export function createMockForeverBottle(overrides: Partial<ForeverBottle> = {}): ForeverBottle {
  const id = overrides.id || generateId();
  const customerId = overrides.customerId || generateId();
  return {
    id,
    customerId,
    serialNumber: overrides.serialNumber || `FA-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    oilType: overrides.oilType || 'custom-blend',
    capacity: '100ml',
    purchaseDate: overrides.purchaseDate || new Date(),
    status: overrides.status || 'active',
    currentFillLevel: overrides.currentFillLevel ?? 100,
    refillCount: overrides.refillCount ?? 0,
    lastRefillDate: overrides.lastRefillDate,
    returnLabel: overrides.returnLabel,
    metadata: overrides.metadata || {
      orderId: generateOrderId(),
      productVariantId: generateId(),
      purchasePrice: 189,
    },
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
  };
}

// ============================================================================
// Sanity CMS Factories
// ============================================================================

export function createMockSanityDocument<T extends SanityDocument>(
  type: string,
  overrides: Partial<T> = {}
): T {
  const id = generateId();
  return {
    _id: id,
    _type: type,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'abc123',
    ...overrides,
  } as T;
}

export function createMockSanityReference(refId: string): SanityReference {
  return {
    _type: 'reference',
    _ref: refId,
  };
}

export function createMockSanityImage(
  assetId: string = generateId()
): SanityImage {
  return {
    _type: 'image',
    asset: createMockSanityReference(assetId),
  };
}

// ============================================================================
// Full Mock Data Sets
// ============================================================================

export function createMockFullCustomerWithRewards(
  tier: TierLevel = 'seed' as TierLevel
): {
  customer: CustomerRewardsProfile;
  orders: OrderInfo[];
  credits: CreditTransaction[];
} {
  const tierSpendMap: Record<string, number> = {
    seed: 0,
    sprout: 150,
    bloom: 350,
    radiance: 700,
    luminary: 1500,
  };

  const customer = createMockCustomer({
    tier,
    totalSpend: tierSpendMap[tier],
    chainsUnlocked: [],
  });

  const orders = [
    createMockOrder({ orderTotal: tierSpendMap[tier] }),
  ];

  const credits = [
    createMockCreditTransaction({ customerId: customer.customerId, amount: 25 }),
  ];

  return {
    customer,
    orders,
    credits,
  };
}

// ============================================================================
// Product Content Factories
// ============================================================================

export interface MockOil {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  ingredients: string[];
  benefits: string[];
  chakra: string[];
  element: string;
}

export interface MockSynergyContent {
  id: string;
  oilId: string;
  crystalId: string;
  title: string;
  headline?: string;
  story?: string;
  description: string;
  intention?: string;
  chakraAlignment?: string;
  element?: string;
  ritualInstructions: Array<{
    stepNumber: number;
    title: string;
    instruction: string;
  }>;
  benefits: string[];
}

export function createMockOil(overrides: Partial<MockOil> = {}): MockOil {
  return {
    id: overrides.id || generateId(),
    name: overrides.name || 'Lavender Dreams',
    description: overrides.description || 'Calming lavender oil for relaxation',
    basePrice: overrides.basePrice ?? 79,
    ingredients: overrides.ingredients || ['Lavender', 'Jojoba Oil', 'Vitamin E'],
    benefits: overrides.benefits || ['Relaxation', 'Sleep support', 'Stress relief'],
    chakra: overrides.chakra || ['crown', 'heart'],
    element: overrides.element || 'air',
  };
}

export function createMockSynergyContent(overrides: Partial<MockSynergyContent> = {}): MockSynergyContent {
  return {
    id: overrides.id || generateId(),
    oilId: overrides.oilId || generateId(),
    crystalId: overrides.crystalId || generateId(),
    title: overrides.title || 'Lavender & Amethyst Synergy',
    headline: overrides.headline || 'Lavender + Amethyst: Dream Blend',
    story: overrides.story || 'A harmonious blend for relaxation and spiritual connection',
    description: overrides.description || 'A powerful combination for deep relaxation and spiritual connection',
    intention: overrides.intention || 'relaxation',
    chakraAlignment: overrides.chakraAlignment || 'crown',
    element: overrides.element || 'air',
    ritualInstructions: overrides.ritualInstructions || [
      { stepNumber: 1, title: 'Prepare', instruction: 'Set your intention' },
      { stepNumber: 2, title: 'Apply', instruction: 'Use 2-3 drops' },
    ],
    benefits: overrides.benefits || ['Deep relaxation', 'Spiritual connection', 'Better sleep'],
  };
}

// ============================================================================
// Configured Product Factory
// ============================================================================

import type { ConfiguredProduct } from '@/lib/shopify/cart-transformer';

export interface CreateMockConfiguredProductInput {
  oilVariantId?: string;
  bottleSize?: '5ml' | '10ml' | '15ml' | '20ml' | '30ml';
  crystalType?: string;
  crystalCount?: number;
  customerTier?: TierLevel;
  creditToApply?: number;
  cordType?: string;
  charmType?: string;
}

export function createMockConfiguredProduct(
  overrides: CreateMockConfiguredProductInput = {}
): ConfiguredProduct {
  return {
    oilVariantId: overrides.oilVariantId || generateVariantId(),
    bottleSize: overrides.bottleSize || '30ml',
    crystalType: overrides.crystalType || 'amethyst',
    crystalCount: overrides.crystalCount ?? 3,
    accessory: {
      type: 'cord',
      cordType: overrides.cordType || 'silver-chain',
      charmType: overrides.charmType,
    },
    customerTier: overrides.customerTier || 'seed',
    creditToApply: overrides.creditToApply,
  };
}

// ============================================================================
// Edge Cases & Error Scenarios
// ============================================================================

export function createMockExpiredCredit(): CreditTransaction {
  const expiredDate = new Date();
  expiredDate.setFullYear(expiredDate.getFullYear() - 1);

  return createMockCreditTransaction({
    expiresAt: expiredDate,
    used: false,
  });
}

export function createMockNegativeBalanceCustomer(): CustomerRewardsProfile {
  return createMockCustomer({
    accountCredit: -50,
    totalSpend: 1000,
  });
}

export function createMockMaxTierCustomer(): CustomerRewardsProfile {
  return createMockCustomer({
    tier: 'luminary' as TierLevel,
    totalSpend: 5000,
    accountCredit: 500,
    referralCount: 10,
  });
}
