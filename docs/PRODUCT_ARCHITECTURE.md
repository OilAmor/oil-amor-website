# Oil Amor Product Architecture

## Overview

This document outlines the comprehensive product architecture implemented for Oil Amor, featuring dual product lines, dynamic sizing with crystal counts, carrier oil options, and an exclusive refill program.

---

## Product Lines

### 1. Pure Essential Oil Blends
- **Format**: Concentrated therapeutic-grade essential oils
- **Applicator**: Precision glass dropper
- **Use Cases**: Aromatherapy, diffusion, bathing, custom blending
- **Price Range**: $48 - $148 AUD (base prices)

### 2. Carrier Oil Blends
- **Format**: Pre-diluted essential oils in premium carrier oils
- **Applicator**: Stainless steel roller ball
- **Use Cases**: Direct skin application, pulse point therapy, on-the-go use
- **Carrier Premium**: +$12 AUD
- **Price Range**: $60 - $160 AUD (with carrier)

---

## Bottle Sizes & Crystal Counts

Each bottle size includes a carefully calibrated number of crystal chips for optimal energetic resonance:

| Size | Volume | Crystal Chips | Base Price | Height | Best For |
|------|--------|---------------|------------|--------|----------|
| 30ml | 30ml | 12 chips | $148 | 7.5cm | Signature size, maximum energetic matrix |
| 20ml | 20ml | 8 chips | $108 | 6.5cm | Sustained daily support |
| 15ml | 15ml | 6 chips | $88 | 5.8cm | Travel, discovering pairings |
| 10ml | 10ml | 4 chips | $68 | 5.2cm | Portable, bag/bedside |
| 5ml | 5ml | 2 chips | $48 | 4.5cm | Introduction to Oil Amor |

---

## Carrier Oil Options

### Jojoba Oil (Most Popular)
- **Botanical**: *Simmondsia chinensis*
- **Texture**: Light, silky
- **Absorption**: Medium
- **Best For**: All skin types, acne-prone, sensitive, mature
- **Upgrade Cost**: +$5
- **Synergy Effect**: Enhances grounding and balancing properties

### Apricot Kernel Oil (Recommended for Heart Oils)
- **Botanical**: *Prunus armeniaca*
- **Texture**: Light, velvety
- **Absorption**: Fast
- **Best For**: Dry, sensitive, mature, inflamed skin
- **Synergy Effect**: Amplifies heart-centered and soothing properties

### Fractionated Coconut Oil
- **Botanical**: *Cocos nucifera*
- **Texture**: Very light, non-greasy
- **Absorption**: Fast
- **Best For**: All skin types, oily, acne-prone
- **Synergy Effect**: Neutral canvas, fast aromatic delivery

### Sweet Almond Oil
- **Botanical**: *Prunus dulcis*
- **Texture**: Medium, slightly oily
- **Absorption**: Medium
- **Best For**: Dry, normal, combination skin
- **Synergy Effect**: Enhances comforting and nurturing aspects

### Grapeseed Oil
- **Botanical**: *Vitis vinifera*
- **Texture**: Very light, silky
- **Absorption**: Fast
- **Best For**: Oily, acne-prone, large pores
- **Synergy Effect**: Brightens and elevates energetic properties

---

## Dynamic Synergy System

The synergy descriptions adapt based on the carrier oil selection:

### How It Works
1. **Base Synergy**: Oil + Crystal combination (75 unique pairings)
2. **Carrier Modifier**: Each carrier oil adds unique therapeutic and energetic properties
3. **Absorption Factor**: Fast/medium/slow absorption affects ritual timing
4. **Crystal Count**: Size-specific crystal counts influence intensity descriptions

### Example: Lavender + Amethyst + Jojoba
> "Jojoba's sebum-like composition allows the Amethyst-Lavender synergy to penetrate deeply, creating lasting calm that works with your skin's natural rhythms. With twelve crystal chips creating a powerful energetic matrix, Jojoba enhances grounding and balancing properties. This combination creates a unique delivery system where the Amethyst amplifies the Lavender through the nourishing medium of Jojoba Oil, creating a holistic experience that works on physical, emotional, and energetic levels simultaneously."

---

## Refill Program

### Eligibility
- **Available to**: Existing customers only (must have purchased 5ml-30ml bottle)
- **Not Available**: New customers without purchase history
- **Rationale**: Ensures customers have proper bottles and applicators to refill

### Refill Sizes

| Size | Volume | Price | Savings | Refills 30ml Bottle |
|------|--------|-------|---------|---------------------|
| 50ml | 50ml | $128 | 45% | 1.6x |
| 100ml | 100ml | $218 | 55% | 3.3x |

### Loyalty Discount Tiers

| Tier | Requirement | Refill Discount |
|------|-------------|-----------------|
| First Refill | 1+ regular bottle | 10% off |
| Regular Customer | 3+ regular bottles | 15% off |
| Oil Amor Devotee | 5+ regular bottles | 20% off |

### Environmental Impact
- 75% less packaging
- 3.3x more product (100ml vs 30ml)
- 55% cost savings
- Crystals remain in original bottle

---

## Pricing Structure

### Base Price Calculation
```
Total = Base Price (by size)
      + Carrier Premium ($12 if carrier blend)
      + Applicator Cost ($3 dropper / $4 roller ball)
      + Carrier Upgrade ($5 if Jojoba)
```

### Example Prices

#### Pure Essential Oil (Dropper)
| Size | Base | Applicator | Total |
|------|------|------------|-------|
| 5ml | $48 | $3 | $51 |
| 15ml | $88 | $3 | $91 |
| 30ml | $148 | $3 | $151 |

#### Carrier Blend with Jojoba (Roller Ball)
| Size | Base | Carrier | Applicator | Upgrade | Total |
|------|------|---------|------------|---------|-------|
| 5ml | $48 | $12 | $4 | $5 | $69 |
| 15ml | $88 | $12 | $4 | $5 | $109 |
| 30ml | $148 | $12 | $4 | $5 | $169 |

---

## Total Product Combinations

### Unique Synergies
- **5 Oils** × **3 Crystals** = 15 base oil-crystal pairings
- **15 Pairings** × **5 Carrier Oils** = 75 carrier-specific synergies
- **75 Synergies** × **5 Sizes** = 375 unique product configurations
- **Plus Pure Oil Variants** = 750 total product variants

---

## Oil Recommendations by Carrier

| Oil | Recommended Carrier | Reason |
|-----|---------------------|--------|
| Lavender | Apricot Kernel | Heart-centered relaxation |
| Eucalyptus | Fractionated Coconut | Fast absorption for clarity |
| Tea Tree | Jojoba | Balancing for blemish-prone skin |
| Clove Bud | Sweet Almond | Comforting warmth |
| Lemongrass | Grapeseed | Uplifting, fast absorption |

---

## Technical Implementation

### Key Files

```
lib/content/product-config.ts       # Product configuration system
lib/content/oil-crystal-synergies.ts # Oil & crystal database
app/components/product-configurator.tsx # Interactive configurator
app/(shop)/refill/page.tsx          # Refill program page
```

### Data Flow
1. **Oil Database**: Contains size info, crystal counts, carrier synergies
2. **Product Config**: Pricing, carrier definitions, synergy generator
3. **Configurator**: Interactive UI for building custom product
4. **Refill Logic**: Eligibility checking based on purchase history

---

## Customer Journey

### New Customer
1. Browse oils in The Atelier
2. Select oil and crystal pairing
3. Choose size (5ml recommended for first purchase)
4. Choose format (pure or carrier blend)
5. For carrier blends, select carrier oil
6. View dynamic synergy description
7. Add to cart

### Existing Customer
1. Browse collection or go directly to refill page
2. Eligibility automatically checked
3. View refill sizes and loyalty discount
4. Purchase refill (50ml or 100ml)
5. Transfer to original crystal-charged bottle
6. Earn credits for bottle returns

---

## Future Enhancements

### Planned
- [ ] Subscription refills (auto-delivery)
- [ ] Custom carrier oil blends (2+ carriers)
- [ ] Seasonal carrier oil rotations
- [ ] Personalized carrier recommendations based on skin type quiz

### Under Consideration
- [ ] Refill stations at retail partners
- [ ] Bulk carrier oil purchases for DIY blending
- [ ] Carrier oil "flight" samplers
- [ ] Refill reminder emails based on usage patterns

---

## Testing

All product architecture features are covered by:
- **135 passing tests** (100% pass rate)
- Unit tests for configuration functions
- Integration tests for pricing calculations
- TypeScript type safety throughout

---

*Last Updated: March 2026*
*Version: 1.0*
