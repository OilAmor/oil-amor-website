# Oil Onboarding System - Complete Guide

## Overview

This system ensures that **every new oil added to the platform undergoes rigorous safety validation** before being available to users. No oil passes without 100% critical validation.

**Philosophy:** "No oil is added until its safety profile is complete"

---

## The Safety-First Onboarding Workflow

```
┌─────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│  DRAFT  │───▶│ CHEMICAL ANALYSIS│───▶│ SAFETY RESEARCH │───▶│  VALIDATION │
└─────────┘    └──────────────────┘    └─────────────────┘    └──────┬──────┘
                                                                      │
    ┌─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    REVIEW   │───▶│   APPROVED  │    │   REJECTED  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Stage Requirements

| Stage | Requirements | Gatekeeper |
|-------|--------------|------------|
| **Draft** | Oil identified, initial proposal | Product Team |
| **Chemical Analysis** | GC/MS report with complete chemical profile | Lab Technician |
| **Safety Research** | Literature review, references compiled | Safety Researcher |
| **Validation** | All automated checks pass | System |
| **Review** | Manual safety officer review | Safety Officer |
| **Approved** | Production-ready | Safety Director |

---

## Automated Safety Validations

### 1. Chemical Profile Validation

**Required:**
- ✅ Primary components (>5%) with CAS numbers
- ✅ Secondary components (1-5%)
- ✅ Known allergens flagged

**Auto-Detection:**
```typescript
// System automatically flags:
const KNOWN_ALLERGENS = [
  'linalool', 'limonene', 'eugenol', 'geraniol', 
  'citronellol', 'citral', 'cinnamaldehyde'
];
```

### 2. Neurotoxic Compound Detection

**Critical Check:**
```typescript
const NEUROTOXIC_COMPOUNDS = [
  'thujone', 'pulegone', 'camphor', 
  'pinocamphone', 'methyl salicylate'
];
```

**If detected:**
- ⚠️ CRITICAL error if not flagged as `isNeurotoxic: true`
- 🔴 Must add epilepsy/seizure contraindications
- 🔴 Requires acknowledgment for use

### 3. Anticoagulant Detection

**Critical Check:**
```typescript
const ANTICOAGULANT_COMPOUNDS = [
  'eugenol', 'methyl salicylate', 'coumarin'
];
```

**If detected:**
- ⚠️ CRITICAL error if not flagged as `isAnticoagulant: true`
- 🔴 Must add blood thinner interactions
- 🔴 Route-specific (topical only) warnings

### 4. Phototoxicity Validation

**Auto-Detection:**
- Citrus family (`rutaceae`) = MUST be phototoxic
- Furocoumarin content = MUST be phototoxic
- Bergapten, psoralen detected = MUST be phototoxic

### 5. Pregnancy Safety Completeness

**Required for ALL oils:**
```typescript
reproductiveSafety: {
  pregnancyTrimester1: { safety: 'safe' | 'caution' | 'avoid', ... },
  pregnancyTrimester2: { ... },
  pregnancyTrimester3: { ... },
  breastfeeding: { ... },
  tryingToConceive: { ... }
}
```

### 6. Age Restriction Validation

**Critical age groups that MUST be specified:**
- `infant_0_3mo` - Most vulnerable
- `infant_3_6mo` - Developing metabolism
- `child_2_6y` - Pediatric safety

### 7. Cross-Reference Validation

**Automatic checks against:**
- ✅ Medication database (100+ drugs)
- ✅ Allergen database (90+ allergens)
- ✅ Similar oils in database

---

## Adding a New Oil - Step-by-Step

### Step 1: Create Draft Record

```typescript
import { createOnboardingRecord } from '@/lib/safety/oil-onboarding-system';

const record = createOnboardingRecord(
  'new-oil-id',
  'officer-name'
);
```

### Step 2: Complete Chemical Analysis

**Obtain GC/MS Report:**
- Send oil sample to certified lab
- Request complete chemical composition
- Ensure CAS numbers provided

**Input Data:**
```typescript
record.safetyProfile = {
  id: 'new-oil-id',
  name: 'New Essential Oil',
  botanicalName: 'Botanical name',
  family: 'botanical_family',
  extractionMethod: 'steam-distilled',
  
  chemicalProfile: {
    primaryComponents: [
      { name: 'linalool', casNumber: '78-70-6', percentage: 35, isAllergen: true },
      // ... all components >5%
    ],
    secondaryComponents: [
      // ... components 1-5%
    ],
    traceComponents: [
      // ... components <1%
    ]
  }
};
```

**Advance Stage:**
```typescript
const result = advanceStage(record, 'chemical_analysis', 'lab-tech');
if (!result.success) {
  console.error(result.errors);
}
```

### Step 3: Research Safety Data

**Required References:**
1. Tisserand & Young - Essential Oil Safety (primary)
2. IFRA Standards
3. Peer-reviewed studies (minimum 2)

**Complete Safety Profile:**
```typescript
record.safetyProfile = {
  // ... chemical profile from step 2
  
  safetyFlags: {
    isPhototoxic: false,
    isNeurotoxic: false,
    isAnticoagulant: false,
    // ... all 16 safety flags
  },
  
  interactions: {
    contraindicatedConditions: ['condition-id'],
    contraindicatedMedications: [
      {
        medicationCategory: 'category',
        severity: 'contraindicated' | 'caution' | 'monitor',
        mechanism: 'explanation',
        recommendation: 'what to do'
      }
    ],
    potentialAllergens: ['linalool'],
    crossReactsWith: ['similar-oil-id']
  },
  
  ageRestrictions: {
    infant_0_3mo: { allowed: false, maxConcentration: null },
    // ... all age groups
  },
  
  reproductiveSafety: {
    pregnancyTrimester1: { safety: 'safe', maxConcentration: 1.0 },
    // ... all reproductive categories
  },
  
  references: [
    'Tisserand, R. & Young, R. (2014)...',
    'Study citation...'
  ]
};
```

### Step 4: Run Automated Validation

```typescript
import { validateOilSafetyProfile } from '@/lib/safety/oil-onboarding-system';

record.validationResult = validateOilSafetyProfile(record.safetyProfile);

if (!record.validationResult.isValid) {
  // CRITICAL: Must fix all critical errors
  console.error('Critical Errors:', record.validationResult.errors);
  
  // Review warnings
  console.warn('Warnings:', record.validationResult.warnings);
  
  // Missing data needed
  console.info('Missing:', record.validationResult.missingCriticalData);
}
```

**Validation MUST pass before proceeding.**

### Step 5: Compare to Similar Oils

```typescript
import { compareToSimilarOils } from '@/lib/safety/oil-onboarding-system';

const comparison = compareToSimilarOils(
  record.safetyProfile,
  existingOilsDatabase
);

// Review any discrepancies
if (comparison.concerns.length > 0) {
  console.warn('Safety discrepancies with similar oils:');
  comparison.concerns.forEach(c => console.warn(c));
}
```

### Step 6: Manual Review

**Safety Officer Checklist:**
- [ ] Chemical profile verified against GC/MS
- [ ] All safety flags appropriate
- [ ] Pregnancy data reviewed
- [ ] Age restrictions appropriate
- [ ] Medication interactions complete
- [ ] Allergen cross-reactivity checked
- [ ] References verified
- [ ] Similar oil comparison reviewed

### Step 7: Approve or Reject

```typescript
// If approved
const result = advanceStage(record, 'approved', 'safety-director');

// If rejected
const result = advanceStage(record, 'rejected', 'safety-director');
record.reviewerNotes?.push('Reason for rejection...');
```

---

## Safety Profile Schema Reference

### Complete TypeScript Interface

```typescript
interface NewOilSafetyProfile {
  // Identification
  id: string;
  name: string;
  botanicalName: string;
  family: BotanicalFamily;
  origin: string;
  extractionMethod: 'steam-distilled' | 'cold-pressed' | 
                    'solvent-extracted' | 'co2-extracted';
  
  // Chemical Composition
  chemicalProfile: {
    primaryComponents: ChemicalComponent[];    // >5%
    secondaryComponents: ChemicalComponent[];  // 1-5%
    traceComponents: ChemicalComponent[];      // <1%
  };
  
  // Safety Classifications (16 flags)
  safetyFlags: {
    isPhototoxic: boolean;
    isNeurotoxic: boolean;
    isHepatotoxic: boolean;
    isNephrotoxic: boolean;
    isCarcinogenic: boolean;
    isSkinSensitizer: boolean;
    isRespiratorySensitizer: boolean;
    isEmmenagogue: boolean;
    isAbortifacient: boolean;
    isGalactagogue: boolean;
    isAnticoagulant: boolean;
    isHypertensive: boolean;
    isHypotensive: boolean;
    affectsBloodSugar: boolean;
    containsPhenols: boolean;
    containsKetones: boolean;
  };
  
  // Interactions
  interactions: {
    contraindicatedConditions: HealthCondition[];
    contraindicatedMedications: MedicationInteraction[];
    potentialAllergens: string[];
    crossReactsWith: string[];
  };
  
  // Age Restrictions
  ageRestrictions: {
    infant_0_3mo: AgeRestriction;
    infant_3_6mo: AgeRestriction;
    infant_6_12mo: AgeRestriction;
    toddler_1_2y: AgeRestriction;
    child_2_6y: AgeRestriction;
    child_6_12y: AgeRestriction;
    teen_12_18y: AgeRestriction;
    adult: AgeRestriction;
  };
  
  // Reproductive Safety
  reproductiveSafety: {
    pregnancyTrimester1: ReproductiveSafety;
    pregnancyTrimester2: ReproductiveSafety;
    pregnancyTrimester3: ReproductiveSafety;
    breastfeeding: ReproductiveSafety;
    tryingToConceive: ReproductiveSafety;
  };
  
  // Route Safety
  routeSafety: {
    topical: RouteSpecificSafety;
    inhalation: RouteSpecificSafety;
    diffusion: RouteSpecificSafety;
    oral: RouteSpecificSafety;
  };
  
  // Maximum Concentrations
  maxConcentrations: {
    generalUse: number;
    facialUse: number;
    pregnancy: number | null;
    children: number | null;
    elderly: number | null;
  };
  
  // Documentation
  references: string[];
  completedBy: string;
  reviewedBy?: string;
  completionDate: string;
  reviewDate?: string;
  version: number;
}
```

---

## Common Pitfalls & How to Avoid Them

### ❌ Pitfall 1: Missing Chemical Components

**Problem:** Only listing major components, missing allergens in trace amounts.

**Solution:**
- Always get full GC/MS analysis
- Flag ALLERGENS even in trace amounts
- System will warn about known allergens

### ❌ Pitfall 2: Incorrect Safety Flagging

**Problem:** Not flagging phototoxicity in citrus oils.

**Solution:**
- System auto-detects citrus family
- Always double-check furocoumarin content
- Compare to similar oils

### ❌ Pitfall 3: Incomplete Pregnancy Data

**Problem:** Generic "consult doctor" instead of specific trimester guidance.

**Solution:**
- Research specific trimester effects
- Check emmenagogue properties
- Reference Tisserand's pregnancy categories

### ❌ Pitfall 4: Missing Age Restrictions

**Problem:** Assuming adult restrictions apply to children.

**Solution:**
- Specify ALL age groups
- Use conservative concentrations for infants
- Reference pediatric aromatherapy guidelines

### ❌ Pitfall 5: Undocumented Cross-Reactivity

**Problem:** Not checking if oil cross-reacts with known allergens.

**Solution:**
- System auto-checks allergen database
- Manually review botanical family
- Test with similar oils

---

## Quality Assurance Checklist

Before approving ANY new oil:

### Chemical Analysis
- [ ] GC/MS report obtained
- [ ] All components >1% documented
- [ ] CAS numbers provided
- [ ] Batch variability noted

### Safety Flags
- [ ] All 16 flags reviewed
- [ ] Neurotoxic compounds flagged
- [ ] Anticoagulant compounds flagged
- [ ] Phototoxicity verified

### Interactions
- [ ] All contraindicated conditions listed
- [ ] Medication interactions complete
- [ ] Allergen cross-reactivity checked
- [ ] Similar oils compared

### Special Populations
- [ ] Pregnancy trimester data complete
- [ ] Breastfeeding safety specified
- [ ] All age groups restricted appropriately
- [ ] Elderly considerations noted

### Documentation
- [ ] Minimum 2 peer-reviewed references
- [ ] Tisserand reference included
- [ ] Safety data sheet available
- [ ] Botanical verification

---

## Integration with Existing System

Once approved, the oil is added to:

1. **Product Database** - Available for purchase
2. **Safety Database** - Integrated into validation system
3. **Autocomplete** - Available in mixing atelier
4. **Community System** - Can be shared in blends

```typescript
// After approval, oil is automatically:
- Added to ATELIER_OILS
- Indexed in medication interaction checks
- Cross-referenced for allergy detection
- Made available in community blends
```

---

## Emergency Procedures

### If a Safety Issue is Discovered Post-Release:

1. **Immediate:** Set oil status to `SUSPENDED`
2. **Within 1 hour:** Email all customers who purchased
3. **Within 4 hours:** Update safety database
4. **Within 24 hours:** Issue safety bulletin
5. **Within 1 week:** Complete incident report

---

## Contact & Support

**Safety Officer:** safety@oilamor.com  
**Technical Support:** dev@oilamor.com  
**Emergency Hotline:** +1-XXX-XXX-XXXX

---

**Remember: No oil is worth a customer's safety. When in doubt, flag it out.**
