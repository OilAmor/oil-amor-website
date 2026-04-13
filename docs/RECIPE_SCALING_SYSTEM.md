# Recipe Scaling System

## Overview

The Recipe Scaling Engine preserves exact ratios when scaling custom blends to refill sizes (50ml and 100ml). This ensures customers get the **exact same formula** whether they buy a 30ml bottle or a 100ml refill.

## The Challenge

When customers create custom blends in the Mixing Atelier, they combine multiple essential oils in specific ratios. The challenge is maintaining those exact ratios when scaling up to refill sizes.

### Example Problem:

**Original 30ml Blend (Pure):**
- 10ml Lavender (33.3%)
- 10ml Tea Tree (33.3%)
- 10ml Eucalyptus (33.3%)

**Scaled to 100ml:**
- ❌ Wrong: 10ml each (10% each - different formula!)
- ✅ Correct: 33.3ml each (33.3% each - same formula!)

## The Solution: Normalized Recipes

Instead of storing absolute amounts, we store **percentages**. This allows perfect scaling to any size.

### How It Works

1. **Purchase**: User buys a custom blend (e.g., 30ml with specific drops of each oil)
2. **Normalization**: System converts drops to percentages
   ```typescript
   // Original: 200 drops Lavender + 100 drops Tea Tree = 300 drops total
   // Normalized: 66.7% Lavender + 33.3% Tea Tree
   ```
3. **Refill**: When user wants a refill, system scales the percentages
   ```typescript
   // 100ml refill = 2000 drops total
   // Lavender: 66.7% of 2000 = 1333 drops (66.7ml)
   // Tea Tree: 33.3% of 2000 = 667 drops (33.3ml)
   ```

## Handling Carrier Dilutions

The system also handles carrier oil blends correctly:

### Original 30ml Carrier Blend (30% essential oils):
- Essential oils: 9ml total (30%)
  - 3ml Lavender (33.3% of essential oils)
  - 3ml Tea Tree (33.3% of essential oils)
  - 3ml Eucalyptus (33.3% of essential oils)
- Carrier oil: 21ml (70%)

### Scaled to 100ml:
- Essential oils: 30ml total (30%)
  - 10ml Lavender
  - 10ml Tea Tree
  - 10ml Eucalyptus
- Carrier oil: 70ml (70%)

The **carrier:essential oil ratio** is preserved!

## Key Files

### Core Engine
- **`lib/refill/recipe-scaling.ts`** - Main scaling logic
  - `normalizeRecipe()` - Converts absolute amounts to percentages
  - `scaleToRefill()` - Scales normalized recipe to 50ml or 100ml
  - `validateScaledRecipe()` - Ensures scaled recipe is valid

### Database
- **`lib/db/schema/orders.ts`** - OrderCustomMix stores the original recipe
- **`lib/db/schema/user-blends.ts`** - UserBlend stores normalized recipe for refills

### UI Components
- **`app/components/refill/ScaledRefillCard.tsx`** - Displays scaled options

## Usage Example

```typescript
import { normalizeRecipe, scaleToRefill, createUnlockedRefill } from '@/lib/refill/recipe-scaling'

// After purchase, create an unlocked refill entry
const customMix = {
  recipeName: "Sleep Potion",
  mode: "carrier",
  oils: [
    { oilId: "lavender", oilName: "Lavender", drops: 100, percentage: 50 },
    { oilId: "chamomile", oilName: "Chamomile", drops: 60, percentage: 30 },
    { oilId: "cedarwood", oilName: "Cedarwood", drops: 40, percentage: 20 },
  ],
  carrierRatio: 30, // 30% essential oils, 70% carrier
  totalVolume: 30,
  // ... safety data
}

// Create unlocked refill (stores normalized version)
const unlocked = createUnlockedRefill(
  userId,
  orderId,
  "Sleep Potion",
  customMix
)

// Later, when user wants to refill:
const options = getRefillOptions(unlocked)
// options['50ml'] = scaled to 50ml with exact same ratios
// options['100ml'] = scaled to 100ml with exact same ratios
```

## API Integration

When a user views an unlocked blend in the refill store:

```typescript
// In the refill store page
const { normalizedRecipe, originalSize } = unlockedBlend

// Show both size options
const scaled50ml = scaleToRefill(normalizedRecipe, 50)
const scaled100ml = scaleToRefill(normalizedRecipe, 100)

// Display with exact formula breakdown
// User sees: "16.7ml Lavender + 10ml Chamomile + 6.7ml Cedarwood + 16.7ml carrier"
```

## User Experience

### In the Refill Store:

```
┌────────────────────────────────────────────────────────────┐
│ SLEEP POTION - Available for Refill                        │
├────────────────────────────────────────────────────────────┤
│ Original: 30ml carrier blend with 3 essential oils         │
│                                                            │
│ Choose Size:                                               │
│ ┌──────────────────┐  ┌──────────────────┐                │
│ │    50ml          │  │   100ml          │                │
│ │    $30.00        │  │   $55.00         │                │
│ │                  │  │                  │                │
│ │  8.3ml Lavender  │  │  16.7ml Lavender │                │
│ │  5ml Chamomile   │  │  10ml Chamomile  │                │
│ │  3.3ml Cedarwood │  │  6.7ml Cedarwood │                │
│ │  33.3ml Carrier  │  │  66.7ml Carrier  │                │
│ └──────────────────┘  └──────────────────┘                │
│                                                            │
│ Exact same formula, professionally blended                 │
└────────────────────────────────────────────────────────────┘
```

## Technical Details

### Normalization Process

```typescript
// Input: Absolute amounts
const oils = [
  { oilId: "lavender", drops: 200 },
  { oilId: "tea-tree", drops: 100 },
]

// Calculate percentages
const totalDrops = 300
const normalized = [
  { oilId: "lavender", percentage: 66.7, dropsPer30ml: 200 },
  { oilId: "tea-tree", percentage: 33.3, dropsPer30ml: 100 },
]
```

### Scaling Formula

```typescript
// For pure blends
totalDrops = targetVolume * 20 // 20 drops per ml
eachOilDrops = (percentage / 100) * totalDrops

// For carrier blends
essentialOilMl = (essentialOilPercentage / 100) * targetVolume
carrierOilMl = targetVolume - essentialOilMl
```

## Safety Considerations

The system includes validation to ensure scaled recipes are:
- **Measurable**: Warns if amounts are < 0.5ml (hard to measure precisely)
- **Accurate**: Verifies total volume equals target volume
- **Safe**: Preserves original safety scores and warnings

## Future Enhancements

- [ ] Custom refill sizes (75ml, 150ml)
- [ ] Bulk refill discounts
- [ ] Subscription refills
- [ ] Formula versioning (if user tweaks the recipe)
- [ ] Batch tracking for scaled refills

## Example: Complex Carrier Blend

**Original (30ml):**
```
Essential Oils (30% = 9ml):
- Lavender: 3ml (33.3% of essential)
- Bergamot: 2ml (22.2% of essential)
- Ylang Ylang: 2ml (22.2% of essential)
- Patchouli: 2ml (22.2% of essential)

Carrier Oil (70% = 21ml):
- Jojoba: 21ml
```

**Scaled to 100ml:**
```
Essential Oils (30% = 30ml):
- Lavender: 10ml (33.3%)
- Bergamot: 6.7ml (22.2%)
- Ylang Ylang: 6.7ml (22.2%)
- Patchouli: 6.7ml (22.2%)

Carrier Oil (70% = 70ml):
- Jojoba: 70ml
```

**Perfect ratio preservation!**
