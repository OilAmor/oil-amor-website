# TypeScript Error Fixes Summary

## Overview
This document summarizes the TypeScript fixes applied to resolve type errors in the Oil Amor Tier 1 project.

## Fixes Applied

### 1. Global Type Declarations (types/global.d.ts)
Created comprehensive type declarations for missing modules:
- **@upstash/redis**: Full Redis client interface with all operations
- **@sentry/nextjs**: Sentry SDK types including init, captureException, integrations
- **pg**: PostgreSQL pool and client types

### 2. Type Definition Fixes (app/types/index.ts)
Fixed types to work as both values and types (const + type pattern):

```typescript
// Before: Just types (can't be used as values)
export type TierLevel = 'seed' | 'sprout' | ...
export type Chakra = 'root' | 'sacral' | ...
export type Element = 'earth' | 'water' | ...

// After: Both const and type
export const TierLevel = { SEED: 'seed', ... } as const
export type TierLevel = typeof TierLevel[keyof typeof TierLevel]

export const Chakra = { ROOT: 'root', ... } as const
export type Chakra = typeof Chakra[keyof typeof Chakra]

export const Elemental = { EARTH: 'earth', ... } as const
export type Element = typeof Elemental[keyof typeof Elemental]
```

### 3. Added Missing Interface Properties
- **CordOption**: Added `isUnlocked: boolean`
- **CharmOption**: Added `symbol`, `price`, `isUnlocked`
- **PurchaseHistory**: Added `totalOrders`, `uniqueOils`, `uniqueCrystals`, `cordCount`, `totalBottles`
- **ShopifyCart**: Added `totalItems` (optional)

### 4. Added Missing Component Props
- **BottlePreviewProps**: size, crystalCount
- **BottleSizeSelectorProps**: sizes, selectedSize, onSelect
- **SynergyDisplayProps**: oilName, crystalName, synergy

### 5. Fixed useCart Hook (app/hooks/use-cart.tsx)
- Renamed from .ts to .tsx (JSX support)
- Added `totalItems` as alias for `itemCount`
- Added `cartId` to return object

### 6. Fixed Import Paths
Changed `@/types` imports to relative paths (`../types`) in:
- cart-sidebar.tsx
- shopify.ts
- quick-view-modal.tsx
- recently-viewed.tsx

### 7. Fixed Component Type Issues
- **AccessorySelector.tsx**: Fixed TabType, import TierLevel, charmId → charmType
- **CrystalSelector.tsx**: Added type-only import for Element, use Elemental for values
- **demo.tsx**: Fixed Chakra and Element imports to use const objects

### 8. Updated lib/rewards/tiers.ts
Changed TierLevel from type-only to const + type pattern

### 9. Added Test Utilities (lib/test-utils.ts)
Created mock data generators for cart testing

### 10. Fixed Security Utils (lib/security/security-utils.ts)
Fixed `sanitizeHtml` to work in both browser and Node.js environments

### 11. Updated package.json
Added missing dev dependencies:
- `ts-jest`: ^29.1.0
- `identity-obj-proxy`: ^3.0.0

## Remaining Issues to Address

### High Priority

#### 1. Cart Type Mismatches
The `Cart` type in `lib/cart/types.ts` uses different property names than expected by components:
- Components expect: `lines`, `cost`
- Cart type has: `items`, `summary`

**Fix**: Align component expectations with actual Cart type or create adapter.

#### 2. Configurator Store Missing Properties
`ConfiguratorStore` is missing:
- `isAddingToCart`
- `setIsAddingToCart`
- `showCollectionProgress`

**Fix**: Add to store interface and implementation.

#### 3. Database Schema Mismatches
Multiple issues in `lib/db/schema-refill.ts`:
- Missing `orders` export
- Missing `customers` export
- Type mismatches in ForeverBottle returnLabel dates (string vs Date)

#### 4. API Route Type Errors
- `app/api/checkout/customize/route.ts`: CreditReservationResult missing properties
- `app/api/log/route.ts` & `app/api/security/log/route.ts`: Sentry captureMessage signature mismatch

#### 5. Component Props Mismatches
Multiple components have props that don't match their type definitions:
- BottlePreview: Expects bottleSize, crystalType, cordType, charmType, isAnimating
- BottleSizeSelector: Expects sizes as objects, getting strings

### Medium Priority

#### 1. Demo Data Type Issues (app/components/product-configurator/demo.tsx)
- Mock data doesn't match expected types
- Missing properties: properties on Crystal, basePrice on Oil

#### 2. Missing Exports
- ProductConfiguratorProps not exported from ProductConfigurator.tsx
- HeaderProps, FooterProps not exported from layout components

#### 3. CordType Usage
CordType enum values (e.g., 'black-cotton') don't match the type definition ('cord' | 'chain')

#### 4. Atelier Section
ShopifyProduct not exported from shopify.ts

### Low Priority

#### 1. Style Type Issues
- framer-motion type conflicts in Card.tsx

#### 2. Implicit Any Types
- Several callbacks need explicit type annotations

## Recommended Next Steps

1. **Unify Cart Types**: Create a single source of truth for cart types that both components and API use
2. **Fix Database Schema**: Update schema-refill.ts to include all needed exports
3. **Component Audit**: Review all product configurator components for type consistency
4. **API Type Alignment**: Fix credit system and logging API types
5. **Add CI Type Check**: Add type-check to CI pipeline to prevent future regressions

## Commands

```bash
# Check current type errors
npm run type-check

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Files Modified

### Critical Fixes
- `types/global.d.ts` (NEW)
- `app/types/index.ts`
- `app/hooks/use-cart.tsx` (renamed from .ts)
- `lib/rewards/tiers.ts`
- `app/lib/constants.ts`
- `lib/security/security-utils.ts`
- `lib/test-utils.ts` (NEW)
- `package.json`

### Component Fixes
- `app/components/product-configurator/AccessorySelector.tsx`
- `app/components/product-configurator/CrystalSelector.tsx`
- `app/components/product-configurator/demo.tsx`
- `app/components/cart-sidebar.tsx`
- `app/components/quick-view-modal.tsx`
- `app/components/recently-viewed.tsx`
- `app/lib/shopify.ts`

## Summary

**Before**: ~500+ TypeScript errors  
**After**: ~490 TypeScript errors (mostly component-specific mismatches)

**Major improvements**:
- Core infrastructure types fixed (Redis, Sentry, PostgreSQL)
- Enum/Const pattern established for type+value usage
- Cart hook and types improved
- Missing type declarations added

**Remaining work**:
- Component prop type alignment
- Database schema fixes
- Cart type unification across app
