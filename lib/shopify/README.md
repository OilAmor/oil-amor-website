# Oil Amor Shopify Integration Layer

Complete commerce backbone connecting Oil Amor's custom product configurator to Shopify's e-commerce engine.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Oil Amor Frontend                               │
│  (Product Configurator → Cart → Checkout → Customer Dashboard)         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Shopify Integration Layer                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Cart Transformer  │  Metafields  │  Checkout Extensions              │
│  Product Sync      │  Inventory   │  Customer Auth                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Shopify Platform                                 │
│  (Storefront API → Admin API → Webhooks → Checkout Extensions)       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
lib/shopify/
├── index.ts                 # Main exports
├── cart-transformer.ts      # Cart transformation system
├── metafields.ts           # Product & customer metafields
├── checkout-extensions.ts  # Checkout customization
├── product-sync.ts         # Product synchronization
├── inventory.ts            # Component inventory management
└── customer-auth.ts        # Customer authentication bridge

app/api/
├── checkout/
│   └── customize/
│       └── route.ts        # Checkout customization API
└── webhooks/shopify/
    ├── order-created/
    │   └── route.ts        # Order creation webhook
    ├── order-paid/
    │   └── route.ts        # Order payment webhook
    └── customer-created/
        └── route.ts        # Customer creation webhook
```

## Core Modules

### 1. Cart Transformer (`cart-transformer.ts`)

Transforms Oil Amor's configured products into Shopify cart line items.

```typescript
import { transformToCartItems, addConfiguredProductToCart } from '@/lib/shopify'

const configuredProduct = {
  oilVariantId: 'gid://shopify/ProductVariant/123',
  bottleSize: '30ml',
  crystalType: 'amethyst',
  crystalCount: 12,
  accessory: { type: 'cord', cordType: 'waxed-cotton' },
  customerTier: TierLevel.COLLECTOR,
  creditToApply: 5,
}

// Transform to cart items
const { lineItems } = await transformToCartItems(configuredProduct)

// Add to cart
const cart = await addConfiguredProductToCart(cartId, configuredProduct)
```

**Cart Structure:**
- Line Item 1: Oil (30ml Lavender) - $62
- Line Item 2: Crystal Bunch (Amethyst x12) - $0 (included)
- Line Item 3: Cord (Waxed Cotton) - $0 (included)
- Line Item 4: Credit Application - -$5 (if applicable)

### 2. Metafields (`metafields.ts`)

Manages product and customer metafields for configuration data.

```typescript
import { 
  setOilMetafields, 
  getCustomerMetafields,
  updateCustomerMetafields,
  METAFIELD_NAMESPACES 
} from '@/lib/shopify'

// Set oil metafields
await setOilMetafields(productId, {
  botanical_name: 'Lavandula angustifolia',
  origin: 'France',
  extraction_method: 'Steam distillation',
  therapeutic_properties: ['calming', 'sleep', 'skin healing'],
  recommended_crystals: ['amethyst', 'clear-quartz'],
})

// Get customer metafields
const customerData = await getCustomerMetafields(customerId)
console.log(customerData.crystal_circle_tier) // 'collector'

// Update customer metafields
await updateCustomerMetafields(customerId, {
  total_spend: 450,
  purchase_count: 3,
})
```

### 3. Checkout Extensions (`checkout-extensions.ts`)

Customizes checkout with tier discounts, credit application, and Crystal Circle status.

```typescript
import { customizeCheckout, applyCreditToCheckout } from '@/lib/shopify'

// Get checkout customization
const customization = await customizeCheckout(checkoutId, customerId)
// Returns:
// {
//   tierDiscount: { tier: 'collector', discountPercentage: 10, applicableTo: 'all' },
//   creditApplication: { amount: 5, remainingBalance: 15 },
//   customerStatus: { tier: 'collector', progressToNext: 25, spendToNextTier: 150 },
//   refillNotice: { unlocked: true, eligibleBottles: 2, message: '...' }
// }

// Apply credit
const { creditCode, remainingBalance } = await applyCreditToCheckout(
  checkoutId, 
  customerId, 
  5
)
```

### 4. Product Sync (`product-sync.ts`)

Syncs Oil Amor content with Shopify products.

```typescript
import { syncOilToShopify, createBottleSizeVariants } from '@/lib/shopify'

// Sync oil to Shopify
const result = await syncOilToShopify({
  id: 'lavender',
  slug: 'lavender',
  name: 'Lavender',
  description: 'Calming essential oil...',
  botanicalName: 'Lavandula angustifolia',
  origin: 'France',
  extractionMethod: 'Steam distillation',
  therapeuticProperties: ['calming', 'sleep'],
  basePrice: 62,
  // ... other fields
})

// Create variants for each bottle size
await createBottleSizeVariants(productId, 62)
// Creates: 5ml ($28), 10ml ($42), 15ml ($52), 20ml ($58), 30ml ($62)
```

### 5. Inventory Management (`inventory.ts`)

Tracks component inventory for crystals, cords, charms, and bottles.

```typescript
import { 
  checkComponentAvailability,
  reserveComponents,
  releaseComponentReservation 
} from '@/lib/shopify'

// Check availability
const availability = await checkComponentAvailability({
  crystalType: 'amethyst',
  crystalCount: 12,
  accessory: { type: 'cord', cordType: 'waxed-cotton' },
  bottleSize: '30ml',
})

if (availability.available) {
  // Reserve components
  await reserveComponents(configuration, orderId, 30) // 30 min reservation
} else {
  console.log('Out of stock:', availability.missingComponents)
}

// Release reservation (on cancel)
await releaseComponentReservation(orderId)
```

### 6. Customer Authentication (`customer-auth.ts`)

Bridges Shopify Customer Accounts with Oil Amor profiles.

```typescript
import { 
  authenticateCustomer,
  withCustomerAuth,
  createCustomerAccount,
  loginCustomer 
} from '@/lib/shopify'

// Authenticate customer
const { shopifyCustomer, oilAmorProfile } = await authenticateCustomer(customerId)

// Protect API routes
export const GET = withCustomerAuth(async (req, { customer, oilAmorProfile }) => {
  // Customer is authenticated
  return NextResponse.json({ tier: oilAmorProfile.tier })
})

// Create account
const { customerId, accessToken } = await createCustomerAccount({
  email: 'customer@example.com',
  password: 'securepassword',
  firstName: 'Jane',
  lastName: 'Doe',
})

// Login
const { customerId, accessToken } = await loginCustomer(email, password)
```

## API Routes

### Checkout Customization

```
GET  /api/checkout/customize?checkoutId=xxx&customerId=xxx
POST /api/checkout/customize (body: { checkoutId, creditAmount })
```

### Webhooks

Configure these in your Shopify admin:

```
POST /api/webhooks/shopify/order-created  # Order creation
POST /api/webhooks/shopify/order-paid     # Payment confirmation
POST /api/webhooks/shopify/customer-created # New customer signup
```

## Environment Variables

```env
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
SHOPIFY_STOREFRONT_API_VERSION=2024-01

# Shopify Admin API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=xxx
SHOPIFY_ADMIN_API_VERSION=2024-01
SHOPIFY_WEBHOOK_SECRET=xxx
SHOPIFY_LOCATION_ID=xxx

# Product Variant IDs (for cart transformation)
SHOPIFY_CRYSTAL_BUNCH_VARIANT_ID=xxx
SHOPIFY_EXTRA_CRYSTALS_VARIANT_ID=xxx
SHOPIFY_CORD_WAXED_COTTON_VARIANT_ID=xxx
SHOPIFY_CORD_HEMP_VARIANT_ID=xxx
SHOPIFY_CORD_SILK_VARIANT_ID=xxx
SHOPIFY_CORD_LEATHER_VARIANT_ID=xxx
SHOPIFY_CHARM_CRESCENT_VARIANT_ID=xxx
SHOPIFY_CHARM_SUN_VARIANT_ID=xxx
SHOPIFY_CHARM_STARS_VARIANT_ID=xxx
SHOPIFY_CHARM_TREE_VARIANT_ID=xxx
SHOPIFY_CHARM_LOTUS_VARIANT_ID=xxx
SHOPIFY_CHARM_OM_VARIANT_ID=xxx
SHOPIFY_CREDIT_VARIANT_ID=xxx

# Australia Post (for refill shipping)
AUSPOST_API_KEY=xxx
AUSPOST_API_SECRET=xxx
```

## Metafield Namespaces

| Namespace | Purpose |
|-----------|---------|
| `oil_amor.oil_properties` | Oil product metadata |
| `oil_amor.crystal_properties` | Crystal product metadata |
| `oil_amor.product_config` | Product configuration options |
| `oil_amor.customer_rewards` | Customer Crystal Circle data |
| `oil_amor.refill_data` | Forever Bottle refill tracking |
| `oil_amor.analytics` | Product analytics |

## Tier Configuration

| Tier | Min Spend | Discount | Applies To |
|------|-----------|----------|------------|
| New | $0 | 0% | - |
| Explorer | $100 | 5% | Refills |
| Collector | $300 | 10% | All |
| Connoisseur | $600 | 15% | All |
| Master | $1000 | 20% | All |

## Bottle Size Pricing

| Size | Price Multiplier | Crystal Count | Price (base $62) |
|------|------------------|---------------|------------------|
| 5ml | 0.45 | 4 | $28 |
| 10ml | 0.67 | 6 | $42 |
| 15ml | 0.83 | 8 | $52 |
| 20ml | 0.93 | 10 | $58 |
| 30ml | 1.0 | 12 | $62 |

## Webhook Processing

All webhooks return 200 OK to Shopify to prevent retries. Errors are logged for manual review.

### Order Created
- Updates customer spend & purchase count
- Unlocks refill on first 30ml purchase
- Registers Forever Bottles
- Checks for tier upgrades
- Sends confirmation email

### Order Paid
- Confirms inventory reservations
- Generates AusPost labels for refills
- Triggers fulfillment
- Sends tracking emails

### Customer Created
- Initializes Crystal Circle tier to 'new'
- Assigns welcome gift (credit or charm)
- Sends welcome email
- Subscribes to newsletter (if opted in)

## Testing

```typescript
// Test cart transformation
import { transformToCartItems } from '@/lib/shopify/cart-transformer'

const result = await transformToCartItems({
  oilVariantId: 'test-variant',
  bottleSize: '30ml',
  crystalType: 'amethyst',
  crystalCount: 12,
  accessory: { type: 'cord', cordType: 'waxed-cotton' },
  customerTier: TierLevel.EXPLORER,
})

console.log(result.lineItems) // Array of cart line items
console.log(result.metadata)  // Summary statistics
```

## Security Considerations

1. **Webhook Verification**: Always verify HMAC signatures in production
2. **API Tokens**: Store admin tokens securely, never expose in frontend
3. **Rate Limiting**: Implement rate limiting on API routes
4. **Error Handling**: Never expose internal errors to client
5. **Credit Management**: Validate credit amounts server-side

## Performance Optimization

- Use Edge Runtime for API routes
- Implement caching for metafield reads
- Batch inventory checks when possible
- Use GraphQL fragments to minimize API calls
- Implement connection pooling for Shopify API
