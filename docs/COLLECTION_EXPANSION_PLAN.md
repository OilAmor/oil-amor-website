# Oil Amor Collection Expansion Plan
## Strategic Growth to 60+ Oils

**Current State:** 17 oils (8 Common, 6 Premium, 3 Luxury)  
**Target State:** 60+ oils (Tiered expansion)  
**Reference:** SEOC (Sydney Essential Oil Company) - 177 products

---

## 📊 EXPANSION PHASES

### Phase 1: Foundation Expansion (+20 oils) → 37 total
**Timeline:** 4-6 weeks  
**Focus:** Most popular, highest-demand oils

### Phase 2: Category Expansion (+15 oils) → 52 total  
**Timeline:** 8-10 weeks  
**Focus:** Complete scent families

### Phase 3: Specialty/Luxury (+10 oils) → 62 total  
**Timeline:** 12-16 weeks  
**Focus:** Exotics, rare finds, therapeutic specialties

---

## 🎯 PHASE 1: FOUNDATION EXPANSION (+20 OILS)

### CITRUS FAMILY (Add 5 oils)
| Oil | Wholesale $/L | Rarity | Safety Profile | Notes |
|-----|---------------|--------|----------------|-------|
| **Bergamot (FCF)** | $180 | Premium | ✅ EXISTS | Furanocoumarin-free, non-phototoxic |
| **Sweet Orange** | $95 | Common | ✅ EXISTS | Add to Atelier |
| **Grapefruit** | $110 | Common | ⚠️ NEEDED | CYP3A4 inhibitor interactions |
| **Lime (Persian)** | $105 | Common | ⚠️ NEEDED | Phototoxic |
| **Mandarin** | $120 | Common | ⚠️ NEEDED | Gentle, child-safe citrus |

### FLORAL FAMILY (Add 5 oils)
| Oil | Wholesale $/L | Rarity | Safety Profile | Notes |
|-----|---------------|--------|----------------|-------|
| **Rose Otto** | $8000 | Luxury | ⚠️ NEEDED | Bulgarian rose, extremely expensive |
| **Jasmine Absolute** | $4500 | Luxury | ⚠️ NEEDED | Solvent extracted, precious |
| **Neroli** | $2800 | Luxury | ⚠️ NEEDED | Orange blossom, anxiety relief |
| **Ylang Ylang** | $350 | Premium | ✅ EXISTS | Add to Atelier |
| **Roman Chamomile** | $650 | Premium | ✅ EXISTS | Add to Atelier |

### WOOD/ROOT FAMILY (Add 4 oils)
| Oil | Wholesale $/L | Rarity | Safety Profile | Notes |
|-----|---------------|--------|----------------|-------|
| **Sandalwood (Australian)** | $1200 | Luxury | ⚠️ NEEDED | Sustainable alternative to Indian |
| **Cedarwood (Atlas)** | $140 | Common | ⚠️ NEEDED | Different from Chinese cedarwood |
| **Frankincense** | $380 | Premium | ✅ EXISTS | Add to Atelier |
| **Vetiver** | $420 | Premium | ⚠️ NEEDED | Grounding, thick viscosity |

### HERB/MINT FAMILY (Add 3 oils)
| Oil | Wholesale $/L | Rarity | Safety Profile | Notes |
|-----|---------------|--------|----------------|-------|
| **Peppermint** | $155 | Common | ✅ EXISTS | Add to Atelier |
| **Spearmint** | $130 | Common | ⚠️ NEEDED | Milder than peppermint, child-safe |
| **Rosemary (ct cineole)** | $145 | Common | ✅ EXISTS | Add to Atelier |

### RESIN/OTHER (Add 3 oils)
| Oil | Wholesale $/L | Rarity | Safety Profile | Notes |
|-----|---------------|--------|----------------|-------|
| **Benzoin** | $280 | Premium | ⚠️ NEEDED | Vanilla-like base note |
| **Copaiba** | $165 | Common | ⚠️ NEEDED | Anti-inflammatory, gentle |
| **Turmeric** | $220 | Premium | ⚠️ NEEDED | CO2 extract, anti-inflammatory |

---

## 🌸 PHASE 2: CATEGORY EXPANSION (+15 OILS)

### COMPLETE CITRUS (Add 3)
- **Tangerine** ($115) - Common, phototoxic
- **Clementine** ($125) - Common, gentle
- **Blood Orange** ($135) - Common, phototoxic

### MORE FLORALS (Add 4)
- **Helichrysum (Immortelle)** ($2200) - Luxury, skin healing
- **Linden Blossom** ($1800) - Luxury, calming
- **Rose Geranium** ($320) - Premium, balancing
- **Palmarosa** ($180) - Premium, "poor man's rose"

### EXOTIC WOODS/ROOTS (Add 4)
- **Amyris** ($150) - Common, sandalwood substitute
- **Cedarwood (Virginian)** ($95) - Common, different profile
- **Ho Wood** ($110) - Common, camphoraceous
- **Spikenard** ($850) - Luxury, biblical oil

### SPICES (Add 4)
- **Cardamom** ($380) - Premium, digestive
- **Black Pepper** ($195) - Premium, warming
- **Nutmeg** ($165) - Common, use cautiously
- **Coriander Seed** ($140) - Common, calming

---

## 💎 PHASE 3: SPECIALTY & LUXURY (+10 OILS)

### ULTRA-LUXURY FLORALS (Add 3)
- **Jasmine Grandiflorum** ($5200) - Luxury, different species
- **Rose Absolute** ($4500) - Luxury, solvent extracted
- **Blue Lotus** ($3500) - Luxury, exotic

### RARE THERAPEUTICS (Add 4)
- **German Chamomile (Blue)** ($580) - Premium, anti-inflammatory
- **Blue Tansy** ($1200) - Luxury, allergy relief
- **Inula Graveolens** ($2800) - Luxury, respiratory
- **Plai** ($380) - Premium, Thai ginger, pain relief

### EXOTIC WOODS (Add 3)
- **Agarwood (Oud)** - Contact for pricing - Ultra-luxury
- **Sandalwood (New Caledonia)** ($2800) - Luxury, sustainable
- **Rosewood** ($450) - Premium, endangered - CITES issues

---

## 📋 SAFETY PROFILE CREATION CHECKLIST

For each new oil added, create:

### 1. Oil Safety Profile (`lib/safety/oil-profiles-*.ts`)
- [ ] Oil ID and botanical name
- [ ] Max dilution percentages (IFRA compliant)
- [ ] Pregnancy safety rating (safe/caution/avoid)
- [ ] Age restrictions (0mo, 6mo, 2yr, 6yr, 12yr)
- [ ] Key chemical constituents with % ranges
- [ ] Contraindications (photosensitivity, sensitization, etc.)
- [ ] Drug interaction warnings
- [ ] First aid instructions
- [ ] Regulatory status (GRAS, EU restricted)

### 2. Atelier Integration (`lib/atelier/atelier-engine.ts`)
- [ ] Add to `ATELIER_OILS` array
- [ ] Assign wholesale price per liter
- [ ] Set rarity tier (common/premium/luxury)
- [ ] Define hex color code
- [ ] Write scent profile description
- [ ] Calculate collection prices (5ml/30ml)

### 3. Oil-Oil Interactions (`lib/safety/oil-interactions.ts`)
- [ ] Check for incompatibilities with existing oils
- [ ] Document synergistic combinations
- [ ] Note any scent clashes

### 4. Medication Database Updates
- [ ] Check against 88 medications
- [ ] Document any interactions
- [ ] Assign severity levels

### 5. UI Updates
- [ ] Add oil to collection page
- [ ] Update Mixing Atelier dropdown
- [ ] Add crystal pairing recommendations
- [ ] Create product imagery

---

## 🏷️ PRICING STRUCTURE

### Common Oils ($95-180/L wholesale)
- 5ml Collection: $19.95
- 30ml Collection: $29.95-34.95
- Atelier markup: Fair margin

### Premium Oils ($200-450/L wholesale)
- 5ml Collection: $21.95-26.95
- 30ml Collection: $36.95-54.95
- Atelier markup: Adjusted for rarity

### Luxury Oils ($800+/L wholesale)
- 5ml Collection: $28.95-45.95
- 30ml Collection: $59.95-150+
- Atelier markup: Significant markup for exclusivity

### Ultra-Luxury ($2000+/L wholesale)
- 5ml Collection: $50-150
- 30ml Collection: $150-500+
- Atelier: By quote only

---

## 🧪 PRIORITY SAFETY PROFILES (Phase 1)

These oils need immediate safety profiles:

### HIGH PRIORITY (Citrus - Phototoxicity)
1. Grapefruit - CYP3A4 interactions
2. Lime - Phototoxic
3. Bergamot (regular) - Severe phototoxicity
4. Mandarin - Generally safe but profile needed

### HIGH PRIORITY (Florals - Pregnancy/Hormonal)
5. Rose Otto - Premium, hormonal considerations
6. Jasmine - Pregnancy avoid
7. Neroli - Generally safe, profile needed
8. Ylang Ylang - Exists, add to Atelier

### MEDIUM PRIORITY (Therapeutics)
9. Sandalwood - Sustainable sourcing info
10. Vetiver - Generally safe
11. Copaiba - Drug interactions
12. Turmeric - Blood thinning

### MEDIUM PRIORITY (Herbs)
13. Spearmint - Child-safe alternative to peppermint
14. Rosemary - Exists, add to Atelier
15. Peppermint - Exists, add to Atelier

---

## 📦 SOURCING CONSIDERATIONS

### Australia-First Sourcing
- **Australian Sandalwood** (Santalum spicatum) - Sustainable
- **Australian Tea Tree** - Native, abundant
- **Australian Eucalyptus** - Multiple species available
- **Lemon Myrtle** - Native, already have

### Sustainability Concerns
- **Indian Sandalwood** - Endangered, avoid
- **Rosewood** - CITES listed, restricted trade
- **Agarwood/Oud** - Ensure sustainable aquilaria
- **Frankincense** - Overharvesting concerns, choose sustainable sources

### Organic Certification
- Target 70%+ certified organic
- Remaining: Wildcrafted or sustainably farmed
- All: GC/MS tested for purity

---

## 🎨 CRYSTAL PAIRINGS (New Oils)

Plan crystal synergies for new additions:

| Oil | Primary Crystal | Secondary |
|-----|-----------------|-----------|
| Rose Otto | Rose Quartz | Rhodonite |
| Jasmine | Moonstone | Pearl |
| Neroli | Citrine | Sunstone |
| Sandalwood | Clear Quartz | Smoky Quartz |
| Vetiver | Black Tourmaline | Hematite |
| Bergamot | Green Aventurine | Peridot |
| Grapefruit | Carnelian | Orange Calcite |

---

## 📈 BUSINESS IMPACT

### Revenue Projections
- **Phase 1:** +20 oils = ~$400K additional annual revenue potential
- **Phase 2:** +15 oils = ~$350K additional
- **Phase 3:** +10 oils = ~$500K+ additional (luxury markup)

### Mixing Atelier Benefits
- More blend combinations: 17 oils = 136 pairs, 60 oils = 1,770 pairs
- Higher average order value
- Increased customer retention
- "Perfume house" positioning

### SEO/Marketing Benefits
- "Complete aromatherapy destination"
- Rank for more essential oil keywords
- Educational content opportunities
- Wholesale B2B potential

---

## ✅ IMPLEMENTATION CHECKLIST

### Week 1-2: Preparation
- [ ] Finalize Phase 1 oil selections
- [ ] Source suppliers for new oils
- [ ] Order samples for quality testing
- [ ] Begin safety profile research

### Week 3-4: Safety Infrastructure
- [ ] Create safety profiles for 5 citrus oils
- [ ] Create safety profiles for 5 floral oils
- [ ] Update medication interaction database
- [ ] Internal safety audit

### Week 5-6: Atelier Integration
- [ ] Update `ATELIER_OILS` array
- [ ] Add crystal pairings
- [ ] Test mixing combinations
- [ ] Update pricing calculations

### Week 7-8: Collection Launch
- [ ] Product photography
- [ ] Collection page updates
- [ ] Marketing copy
- [ ] Launch campaign

---

## 🔒 LEGAL/DISCLAIMER UPDATES

With expanded collection, ensure:
- [ ] All oils have proper INCI names
- [ ] SDS (Safety Data Sheets) available
- [ ] Allergen declarations complete
- [ ] Country of origin labeling
- [ ] Expiration date guidelines
- [ ] Storage recommendations

---

## 📚 TRAINING MATERIALS

For customer service team:
- [ ] Oil comparison charts
- [ ] Substitution guides ("If out of X, use Y")
- [ ] Safety quick-reference
- [ ] Therapeutic use basics
- [ ] Contraindication awareness

---

**Next Step:** Approve Phase 1 oil list and begin safety profile creation.

**Estimated Total Investment:**
- Safety profile development: 40-60 hours
- Atelier integration: 20 hours
- Product setup: 30 hours
- **Total:** ~100-110 hours (~$8-10K at developer rates)

**ROI Timeline:** 4-6 months to break even, 12 months for 300%+ ROI
