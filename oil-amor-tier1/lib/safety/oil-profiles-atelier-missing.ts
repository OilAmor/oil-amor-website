/**
 * Oil Amor Safety Database - Missing Atelier Oil Profiles
 * Complete safety data for all oils sold in the Mixing Atelier
 * 
 * Sources: Tisserand & Young (2014) Essential Oil Safety, 2nd Edition
 *          IFRA Standards 51st Amendment
 *          Aromatherapy Science by Maria Lis-Balchin
 */

import { OilSafetyProfile } from './types'

// ============================================================================
// 1. LEMONGRASS (Cymbopogon flexuosus / C. citratus)
// ============================================================================

export const LEMONGRASS_PROFILE: OilSafetyProfile = {
  oilId: 'lemongrass',
  commonName: 'Lemongrass',
  botanicalName: 'Cymbopogon flexuosus',
  
  maxDilutionPercent: 0.7, // IFRA restriction due to citral
  recommendedDilutionPercent: 0.5,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'dilute',
    under6Years: 'dilute',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'avoid',
  pregnancyNotes: 'High citral content (75-85%) is embryotoxic in animal studies. Best avoided during pregnancy as precaution.',
  
  breastfeedingSafety: 'caution',
  breastfeedingNotes: 'No specific data, but citral content suggests caution.',
  
  contraindications: [
    {
      type: 'skin-sensitization',
      severity: 'warning',
      description: 'High citral content can cause skin sensitization',
      affectedSystems: ['skin'],
    },
  ],
  
  keyConstituents: [
    { name: 'Citral (geranial + neral)', percentageRange: [75, 85], concerns: ['skin-sensitization'] },
    { name: 'Geraniol', percentageRange: [2, 10], concerns: [] },
    { name: 'Limonene', percentageRange: [1, 5], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'lemon',
      reason: 'Stacking citral content increases skin sensitization risk',
      severity: 'caution',
      chemicalExplanation: 'Both high in citral/citronellal - combined use may exceed safe dermal limits',
    },
    {
      oilId: 'lemon-myrtle',
      reason: 'Extreme citral stacking - both 90%+ citral',
      severity: 'avoid',
      chemicalExplanation: 'Combined citral content would exceed IFRA safety limits significantly',
    },
    {
      oilId: 'may-chang',
      reason: 'Both very high in citral (geranial/neral)',
      severity: 'avoid',
      chemicalExplanation: 'May chang is 70-85% citral, lemongrass is 75-85% citral - combined is unsafe',
    },
  ],
  
  toxicity: {
    level: 'low',
    oral: false,
    dermal: true, // Sensitization risk
    inhalation: false,
    notes: 'Embryotoxic in high doses in animal studies. Skin sensitizer at concentrations above 0.7%.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: true,
    riskLevel: 'high',
    maxDilutionForSensitive: 0.3,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Anticoagulants',
      effect: 'unknown',
      description: 'Theoretical anticoagulant effect at very high doses - monitor if on blood thinners',
      severity: 'caution',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash immediately with soap and water. If sensitization (rash, itching) occurs, discontinue use.',
    eyeContact: 'Flush with water for 15 minutes. Seek medical attention if irritation persists.',
    ingestion: 'Do not induce vomiting. Drink milk or water. Contact poison control if large amount ingested.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: true, // Citral restrictions
    ifraRestrictions: true, // Limited to 0.7% dermally
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'IFRA Standards 51st Amendment - Citral restrictions',
    'Duke (2002) Handbook of Medicinal Herbs',
  ],
}

// ============================================================================
// 2. CINNAMON LEAF (Cinnamomum verum / C. zeylanicum)
// ============================================================================

export const CINNAMON_LEAF_PROFILE: OilSafetyProfile = {
  oilId: 'cinnamon-leaf',
  commonName: 'Cinnamon Leaf',
  botanicalName: 'Cinnamomum verum',
  
  maxDilutionPercent: 0.6, // IFRA restriction due to eugenol
  recommendedDilutionPercent: 0.5,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'avoid', // Eugenol toxicity risk
    under6Years: 'dilute',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'caution',
  pregnancyNotes: 'Eugenol content may stimulate uterus at high doses. Use sparingly if at all.',
  
  breastfeedingSafety: 'caution',
  breastfeedingNotes: 'No specific data. Use at low dilutions.',
  
  contraindications: [
    {
      type: 'blood-thinning',
      severity: 'warning',
      description: 'Eugenol has anticoagulant properties',
      affectedSystems: ['blood'],
    },
    {
      type: 'skin-sensitization',
      severity: 'warning',
      description: 'Can cause skin irritation at higher concentrations',
      affectedSystems: ['skin'],
    },
  ],
  
  keyConstituents: [
    { name: 'Eugenol', percentageRange: [80, 90], concerns: ['anticoagulant', 'skin-irritant', 'mucous-membrane-irritant'] },
    { name: 'Beta-caryophyllene', percentageRange: [3, 8], concerns: [] },
    { name: 'Linalool', percentageRange: [1, 4], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'cinnamon-bark',
      reason: 'Cinnamon bark + leaf = excessive eugenol + cinnamaldehyde - severe skin/mucous membrane irritation',
      severity: 'avoid',
      chemicalExplanation: 'Leaf is 80%+ eugenol, bark is 60%+ cinnamaldehyde. Combined = dual irritation pathway.',
    },
    {
      oilId: 'clove-bud',
      reason: 'Both very high in eugenol - additive anticoagulant + irritation risk',
      severity: 'avoid',
      chemicalExplanation: 'Clove bud is 80-90% eugenol, cinnamon leaf is 80-90% eugenol = 160%+ eugenol equivalent',
    },
    {
      oilId: 'clove-bud',
      reason: 'Stacking anticoagulant compounds with blood thinners',
      severity: 'avoid',
      chemicalExplanation: 'Combined eugenol from both oils significantly increases bleeding risk',
    },
  ],
  
  toxicity: {
    level: 'moderate',
    oral: true, // Toxic in large doses due to eugenol
    dermal: true, // Irritant
    inhalation: true, // Mucous membrane irritant
    notes: 'Eugenol can cause liver toxicity in very high doses. Oral ingestion not recommended.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: true,
    riskLevel: 'moderate',
    maxDilutionForSensitive: 0.3,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: true, // Strong aroma
    isMucousMembraneIrritant: true,
    cautionForRespiratoryConditions: true,
  },
  
  drugInteractions: [
    {
      drugClass: 'Anticoagulants',
      effect: 'potentiates',
      description: 'Eugenol inhibits platelet aggregation. Significant bleeding risk with blood thinners.',
      severity: 'warning',
    },
    {
      drugClass: 'Antiplatelet agents',
      effect: 'potentiates',
      description: 'Additive antiplatelet effects',
      severity: 'caution',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water. Cool compress if burning sensation.',
    eyeContact: 'Flush immediately with water for 15 minutes. Seek medical attention.',
    ingestion: 'DO NOT INDUCE VOMITING. Give milk/water. Contact poison control immediately.',
    inhalation: 'Move to fresh air. If breathing difficulty, seek medical attention.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: true, // Eugenol restrictions
    ifraRestrictions: true, // Limited to 0.6% dermally
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'IFRA Standards 51st Amendment - Eugenol restrictions',
    'Osol & Pratt (1973) The United States Dispensatory',
  ],
}

// ============================================================================
// 3. MAY CHANG / LITSEA CUBEBA (Litsea cubeba)
// ============================================================================

export const MAY_CHANG_PROFILE: OilSafetyProfile = {
  oilId: 'may-chang',
  commonName: 'May Chang',
  botanicalName: 'Litsea cubeba',
  
  maxDilutionPercent: 0.8, // IFRA restriction due to citral
  recommendedDilutionPercent: 0.5,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'dilute',
    under6Years: 'dilute',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'avoid',
  pregnancyNotes: 'HIGH citral content (70-85%) is embryotoxic in animal studies. AVOID during pregnancy.',
  
  breastfeedingSafety: 'caution',
  breastfeedingNotes: 'No data. High citral suggests caution.',
  
  contraindications: [
    {
      type: 'skin-sensitization',
      severity: 'warning',
      description: 'Very high citral content - strong skin sensitizer',
      affectedSystems: ['skin'],
    },
  ],
  
  keyConstituents: [
    { name: 'Citral (geranial + neral)', percentageRange: [70, 85], concerns: ['skin-sensitization', 'embryotoxic'] },
    { name: 'Limonene', percentageRange: [8, 15], concerns: [] },
    { name: 'Methyl heptenone', percentageRange: [1, 5], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'lemongrass',
      reason: 'Both 75-85% citral - stacking creates unsafe dermal exposure',
      severity: 'avoid',
      chemicalExplanation: 'Combined citral would exceed IFRA limits by significant margin',
    },
    {
      oilId: 'lemon-myrtle',
      reason: 'May chang (70-85% citral) + Lemon myrtle (90%+ citral) = extreme sensitization risk',
      severity: 'avoid',
      chemicalExplanation: 'Would create one of highest citral concentrations possible in aromatherapy',
    },
    {
      oilId: 'lemon',
      reason: 'Citral + citral/limonene stacking',
      severity: 'caution',
      chemicalExplanation: 'Adds to phototoxic citral load',
    },
  ],
  
  toxicity: {
    level: 'low',
    oral: false,
    dermal: true, // Sensitization
    inhalation: false,
    notes: 'Embryotoxic in animal studies due to citral. Strict pregnancy avoidance recommended.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: true,
    riskLevel: 'high',
    maxDilutionForSensitive: 0.3,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [],
  
  firstAid: {
    skinContact: 'Wash with soap and water. Discontinue if irritation.',
    eyeContact: 'Flush with water for 15 minutes.',
    ingestion: 'Contact poison control.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: true, // Citral restrictions
    ifraRestrictions: true, // 0.8% limit
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'IFRA Standards 51st Amendment',
    'Weiss (1997) Essential Oil Crops',
  ],
}

// ============================================================================
// 4. GINGER (Zingiber officinale)
// ============================================================================

export const GINGER_PROFILE: OilSafetyProfile = {
  oilId: 'ginger',
  commonName: 'Ginger',
  botanicalName: 'Zingiber officinale',
  
  maxDilutionPercent: 4, // Generally well-tolerated
  recommendedDilutionPercent: 2,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'dilute',
    under6Years: 'safe',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'caution',
  pregnancyNotes: 'Traditionally used for morning sickness but use sparingly. Some concern about high doses affecting pregnancy.',
  
  breastfeedingSafety: 'safe',
  breastfeedingNotes: 'Generally considered safe in culinary/normal amounts.',
  
  contraindications: [
    {
      type: 'blood-thinning',
      severity: 'caution',
      description: 'May inhibit platelet aggregation at high doses',
      affectedSystems: ['blood'],
    },
    {
      type: 'gallstones',
      severity: 'caution',
      description: 'May stimulate bile production - caution with gallstones',
      affectedSystems: ['gallbladder'],
    },
  ],
  
  keyConstituents: [
    { name: 'Zingiberene', percentageRange: [20, 35], concerns: [] },
    { name: 'Beta-sesquiphellandrene', percentageRange: [10, 18], concerns: [] },
    { name: 'Beta-bisabolene', percentageRange: [5, 12], concerns: [] },
    { name: 'Citral', percentageRange: [2, 8], concerns: ['skin-sensitization'] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'clove-bud',
      reason: 'Both have anticoagulant properties - additive effect with blood thinners',
      severity: 'caution',
      chemicalExplanation: 'Ginger inhibits thromboxane synthesis, clove inhibits platelets',
    },
    {
      oilId: 'cinnamon-leaf',
      reason: 'Both affect blood clotting - monitor if on anticoagulants',
      severity: 'caution',
      chemicalExplanation: 'Eugenol (cinnamon) + gingerol/ginger compounds both affect clotting',
    },
  ],
  
  toxicity: {
    level: 'none',
    oral: false,
    dermal: false,
    inhalation: false,
    notes: 'Generally recognized as very safe oil. GRAS status.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 4,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Anticoagulants',
      effect: 'potential',
      description: 'May have mild antiplatelet effects. Monitor with warfarin, apixaban.',
      severity: 'minor',
    },
    {
      drugClass: 'Antiplatelet agents',
      effect: 'potential',
      description: 'Theoretical additive effect',
      severity: 'minor',
    },
    {
      drugClass: 'Diabetes medications',
      effect: 'potentiates',
      description: 'May lower blood sugar - monitor glucose',
      severity: 'minor',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water.',
    eyeContact: 'Flush with water.',
    ingestion: 'Generally safe in small amounts. Large amounts: contact poison control.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'FDA GRAS List',
    'British Herbal Pharmacopoeia',
  ],
}

// ============================================================================
// 5. CARROT SEED (Daucus carota)
// ============================================================================

export const CARROT_SEED_PROFILE: OilSafetyProfile = {
  oilId: 'carrot-seed',
  commonName: 'Carrot Seed',
  botanicalName: 'Daucus carota',
  
  maxDilutionPercent: 25, // Very safe oil
  recommendedDilutionPercent: 5,
  
  ageRestrictions: {
    under2Months: 'safe',
    under6Months: 'safe',
    under2Years: 'safe',
    under6Years: 'safe',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'safe',
  pregnancyNotes: 'One of the safest oils for pregnancy. Traditional uterine tonic but safe at normal dilutions.',
  
  breastfeedingSafety: 'safe',
  breastfeedingNotes: 'No known concerns.',
  
  contraindications: [], // Very safe oil
  
  keyConstituents: [
    { name: 'Carotol', percentageRange: [15, 25], concerns: [] },
    { name: 'Daucol', percentageRange: [5, 12], concerns: [] },
    { name: 'Beta-bisabolene', percentageRange: [4, 10], concerns: [] },
    { name: 'Alpha-pinene', percentageRange: [3, 8], concerns: [] },
  ],
  
  incompatibleOils: [],
  
  toxicity: {
    level: 'none',
    oral: false,
    dermal: false,
    inhalation: false,
    notes: 'Extremely safe oil with wide therapeutic window.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 25,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [],
  
  firstAid: {
    skinContact: 'Wash with soap and water if desired.',
    eyeContact: 'Flush with water.',
    ingestion: 'Contact poison control if large amount.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'Battaglia (2003) The Complete Guide to Aromatherapy',
  ],
}

// ============================================================================
// 6. LEMON MYRTLE (Backhousia citriodora)
// ============================================================================

export const LEMON_MYRTLE_PROFILE: OilSafetyProfile = {
  oilId: 'lemon-myrtle',
  commonName: 'Lemon Myrtle',
  botanicalName: 'Backhousia citriodora',
  
  maxDilutionPercent: 0.5, // EXTREMELY restricted - highest citral of all oils
  recommendedDilutionPercent: 0.3,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'avoid', // Too strong for children
    under6Years: 'dilute',
    under12Years: 'dilute',
  },
  
  pregnancySafety: 'avoid',
  pregnancyNotes: 'HIGHEST citral content of any essential oil (90-98%) - strictly avoid during pregnancy due to embryotoxicity risk.',
  
  breastfeedingSafety: 'avoid',
  breastfeedingNotes: 'Extremely high citral content suggests avoidance.',
  
  contraindications: [
    {
      type: 'skin-sensitization',
      severity: 'avoid',
      description: 'Highest citral content of all essential oils - extreme sensitization risk',
      affectedSystems: ['skin'],
    },
  ],
  
  keyConstituents: [
    { name: 'Citral (geranial + neral)', percentageRange: [90, 98], concerns: ['skin-sensitization', 'embryotoxic', 'mucous-membrane-irritant'] },
    { name: '6-methyl-5-hepten-2-one', percentageRange: [0.5, 2], concerns: [] },
    { name: 'Linalool', percentageRange: [0.1, 1], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'lemongrass',
      reason: 'Lemon myrtle (90-98% citral) + Lemongrass (75-85% citral) = EXTREME sensitization',
      severity: 'avoid',
      chemicalExplanation: 'Combined would be unsafe by any standard - exceeds all IFRA limits',
    },
    {
      oilId: 'may-chang',
      reason: 'Both extremely high citral - dangerous combination',
      severity: 'avoid',
      chemicalExplanation: '90-98% + 70-85% citral = severe dermal toxicity risk',
    },
    {
      oilId: 'lemon',
      reason: 'Phototoxicity + sensitization stack',
      severity: 'avoid',
      chemicalExplanation: 'Lemon is phototoxic, lemon myrtle is sensitizing - worst of both',
    },
  ],
  
  toxicity: {
    level: 'low-to-moderate',
    oral: false,
    dermal: true, // Extreme sensitization
    inhalation: true, // Respiratory irritant at high concentrations
    notes: 'Highest citral content of any commercial essential oil. Must be used at very low concentrations.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: true,
    riskLevel: 'high',
    maxDilutionForSensitive: 0.2,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: true,
    isMucousMembraneIrritant: true,
    cautionForRespiratoryConditions: true,
  },
  
  drugInteractions: [],
  
  firstAid: {
    skinContact: 'Wash immediately with soap and water. If burning/irritation persists, seek medical attention.',
    eyeContact: 'Flush immediately with water for 15 minutes. Seek medical attention.',
    ingestion: 'DO NOT INDUCE VOMITING. Contact poison control immediately.',
    inhalation: 'Move to fresh air. If breathing difficulty, seek medical attention.',
  },
  
  regulatoryStatus: {
    gras: false, // Not GRAS
    euCosmeticRestricted: true, // Severe citral restrictions
    ifraRestrictions: true, // 0.5% limit - very strict
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'IFRA Standards 51st Amendment - Citral',
    'Hayes & Markovic (2002) Toxicology of Australian Essential Oils',
  ],
}

// ============================================================================
// 7. GERANIUM BOURBON (Pelargonium graveolens) - Same as geranium
// ============================================================================

export const GERANIUM_BOURBON_PROFILE: OilSafetyProfile = {
  oilId: 'geranium-bourbon',
  commonName: 'Geranium Bourbon',
  botanicalName: 'Pelargonium graveolens',
  
  maxDilutionPercent: 25, // Very safe
  recommendedDilutionPercent: 5,
  
  ageRestrictions: {
    under2Months: 'safe',
    under6Months: 'safe',
    under2Years: 'safe',
    under6Years: 'safe',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'safe',
  pregnancyNotes: 'Considered one of the safer oils during pregnancy.',
  
  breastfeedingSafety: 'safe',
  breastfeedingNotes: 'No known concerns.',
  
  contraindications: [
    {
      type: 'hormone-modulating',
      severity: 'minor',
      description: 'Very weak phytoestrogenic activity',
      affectedSystems: ['endocrine'],
    },
  ],
  
  keyConstituents: [
    { name: 'Citronellol', percentageRange: [30, 45], concerns: [] },
    { name: 'Geraniol', percentageRange: [15, 25], concerns: [] },
    { name: 'Linalool', percentageRange: [5, 15], concerns: [] },
    { name: 'Citral', percentageRange: [1, 5], concerns: ['skin-sensitization'] },
  ],
  
  incompatibleOils: [],
  
  toxicity: {
    level: 'none',
    oral: false,
    dermal: false,
    inhalation: false,
    notes: 'Very safe oil. "Bourbon" denotes origin (Reunion Island) but same species as regular geranium.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 25,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Diabetes medications',
      effect: 'potential',
      description: 'May have mild blood sugar lowering effect - monitor',
      severity: 'minor',
    },
    {
      drugClass: 'Hormone therapies',
      effect: 'potential',
      description: 'Very weak phytoestrogenic effect - theoretical interaction',
      severity: 'minor',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water.',
    eyeContact: 'Flush with water.',
    ingestion: 'Contact poison control if large amount.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'Same as Pelargonium graveolens (geranium)',
  ],
}

// ============================================================================
// 8. JUNIPER BERRY (Juniperus communis)
// ============================================================================

export const JUNIPER_BERRY_PROFILE: OilSafetyProfile = {
  oilId: 'juniper-berry',
  commonName: 'Juniper Berry',
  botanicalName: 'Juniperus communis',
  
  maxDilutionPercent: 25, // Generally safe at normal dilutions
  recommendedDilutionPercent: 5,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'avoid', // Neurotoxicity concern
    under6Years: 'dilute',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'avoid',
  pregnancyNotes: 'EMMENAGOGUE and ABORTIFACIENT. Can stimulate uterine contractions. STRICTLY AVOID during pregnancy.',
  
  breastfeedingSafety: 'caution',
  breastfeedingNotes: 'No specific data. Use at low dilutions as precaution.',
  
  contraindications: [
    {
      type: 'nephrotoxic',
      severity: 'caution',
      description: 'High doses can irritate kidneys - avoid with kidney disease',
      affectedSystems: ['kidneys'],
    },
    {
      type: 'uterine-stimulant',
      severity: 'avoid',
      description: 'Emmenagogue - stimulates uterine contractions',
      affectedSystems: ['reproductive'],
    },
  ],
  
  keyConstituents: [
    { name: 'Alpha-pinene', percentageRange: [25, 50], concerns: [] },
    { name: 'Myrcene', percentageRange: [5, 15], concerns: [] },
    { name: 'Limonene', percentageRange: [3, 10], concerns: [] },
    { name: 'Sabinene', percentageRange: [1, 5], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'clary-sage',
      reason: 'Both affect hormones/uterus - additive emmenagogue effect',
      severity: 'caution',
      chemicalExplanation: 'Both have historical use for menstrual regulation',
    },
    {
      oilId: 'fennel',
      reason: 'Both have hormonal/uterine effects - avoid with hormone-sensitive conditions',
      severity: 'caution',
      chemicalExplanation: 'Phytoestrogenic + uterine stimulant combination',
    },
  ],
  
  toxicity: {
    level: 'low-to-moderate',
    oral: true, // Toxic in large doses
    dermal: false,
    inhalation: false,
    notes: 'Traditional abortifacient. Kidney irritant at very high doses.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 25,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Diuretics',
      effect: 'potentiates',
      description: 'Juniper has diuretic properties - additive effect',
      severity: 'minor',
    },
    {
      drugClass: 'Nephrotoxic drugs',
      effect: 'potentiates',
      description: 'Avoid combining with drugs that affect kidneys',
      severity: 'moderate',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water.',
    eyeContact: 'Flush with water.',
    ingestion: 'DO NOT INDUCE VOMITING. Contact poison control.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: false, // Not GRAS for ingestion
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'European Medicines Agency Assessment Report on Juniperus communis',
  ],
}

// ============================================================================
// 9. PATCHOULI DARK (Pogostemon cablin) - Same as regular patchouli
// ============================================================================

export const PATCHOULI_DARK_PROFILE: OilSafetyProfile = {
  oilId: 'patchouli-dark',
  commonName: 'Patchouli Dark',
  botanicalName: 'Pogostemon cablin',
  
  maxDilutionPercent: 25, // Very safe
  recommendedDilutionPercent: 5,
  
  ageRestrictions: {
    under2Months: 'safe',
    under6Months: 'safe',
    under2Years: 'safe',
    under6Years: 'safe',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'safe',
  pregnancyNotes: 'Considered safe during pregnancy. Traditional grounding oil.',
  
  breastfeedingSafety: 'safe',
  breastfeedingNotes: 'No known concerns.',
  
  contraindications: [],
  
  keyConstituents: [
    { name: 'Patchoulol', percentageRange: [30, 45], concerns: [] },
    { name: 'Bulnesene', percentageRange: [15, 25], concerns: [] },
    { name: 'Alpha-guaiene', percentageRange: [10, 18], concerns: [] },
    { name: 'Alpha-patchoulene', percentageRange: [3, 8], concerns: [] },
  ],
  
  incompatibleOils: [],
  
  toxicity: {
    level: 'none',
    oral: false,
    dermal: false,
    inhalation: false,
    notes: 'Extremely safe oil. "Dark" refers to aging process that deepens color and scent.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 25,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Blood thinners',
      effect: 'potential',
      description: 'Very weak anticoagulant effect - theoretical only',
      severity: 'minor',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water.',
    eyeContact: 'Flush with water.',
    ingestion: 'Contact poison control if large amount.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'Same as Pogostemon cablin (patchouli)',
  ],
}

// ============================================================================
// 10. MYRRH (Commiphora myrrha)
// ============================================================================

export const MYRRH_PROFILE: OilSafetyProfile = {
  oilId: 'myrrh',
  commonName: 'Myrrh',
  botanicalName: 'Commiphora myrrha',
  
  maxDilutionPercent: 25,
  recommendedDilutionPercent: 5,
  
  ageRestrictions: {
    under2Months: 'avoid',
    under6Months: 'avoid',
    under2Years: 'dilute',
    under6Years: 'safe',
    under12Years: 'safe',
  },
  
  pregnancySafety: 'avoid',
  pregnancyNotes: 'EMMENAGOGUE - stimulates uterine contractions. Feto-toxic in high doses. AVOID during pregnancy.',
  
  breastfeedingSafety: 'caution',
  breastfeedingNotes: 'No specific data. Use at low dilutions.',
  
  contraindications: [
    {
      type: 'uterine-stimulant',
      severity: 'avoid',
      description: 'Emmenagogue - stimulates uterine contractions',
      affectedSystems: ['reproductive'],
    },
    {
      type: 'feto-toxic',
      severity: 'warning',
      description: 'Animal studies show feto-toxicity at high doses',
      affectedSystems: ['reproductive'],
    },
    {
      type: 'blood-glucose-affecting',
      severity: 'caution',
      description: 'May lower blood sugar',
      affectedSystems: ['endocrine'],
    },
  ],
  
  keyConstituents: [
    { name: 'Furanoeudesma-1,3-diene', percentageRange: [15, 30], concerns: [] },
    { name: 'Curzerene', percentageRange: [10, 20], concerns: [] },
    { name: 'Lindestrene', percentageRange: [5, 12], concerns: [] },
    { name: 'Beta-elemene', percentageRange: [3, 8], concerns: [] },
  ],
  
  incompatibleOils: [
    {
      oilId: 'juniper-berry',
      reason: 'Both emmenagogues - additive uterine stimulation',
      severity: 'caution',
      chemicalExplanation: 'Combined uterine stimulation risk',
    },
    {
      oilId: 'clary-sage',
      reason: 'Both affect hormones and uterus',
      severity: 'caution',
      chemicalExplanation: 'Hormonal + uterine effects combined',
    },
    {
      oilId: 'fennel',
      reason: 'Both have feto-toxic potential - avoid in pregnancy',
      severity: 'caution',
      chemicalExplanation: 'Different pathways but both harmful to fetus',
    },
  ],
  
  toxicity: {
    level: 'low',
    oral: true, // Large doses toxic
    dermal: false,
    inhalation: false,
    notes: 'Traditional emmenagogue and abortifacient. Feto-toxic in high doses.',
  },
  
  photosensitivity: {
    isPhotosensitive: false,
  },
  
  skinSensitization: {
    isSensitizer: false,
    riskLevel: 'low',
    maxDilutionForSensitive: 25,
  },
  
  respiratoryEffects: {
    canTriggerAsthma: false,
    isMucousMembraneIrritant: false,
    cautionForRespiratoryConditions: false,
  },
  
  drugInteractions: [
    {
      drugClass: 'Anticoagulants',
      effect: 'potential',
      description: 'May have mild anticoagulant effect',
      severity: 'minor',
    },
    {
      drugClass: 'Diabetes medications',
      effect: 'potentiates',
      description: 'May lower blood sugar - monitor glucose',
      severity: 'minor',
    },
    {
      drugClass: 'Warfarin',
      effect: 'potential',
      description: 'May affect INR',
      severity: 'minor',
    },
  ],
  
  firstAid: {
    skinContact: 'Wash with soap and water.',
    eyeContact: 'Flush with water.',
    ingestion: 'Do not induce vomiting. Contact poison control.',
    inhalation: 'Move to fresh air.',
  },
  
  regulatoryStatus: {
    gras: true,
    euCosmeticRestricted: false,
    ifraRestrictions: false,
  },
  
  sources: [
    'Tisserand & Young (2014) Essential Oil Safety, 2nd Ed.',
    'European Medicines Agency Assessment Report on Myrrh',
    'Michie & Cooper (1991) Myrrh: Toxicity study',
  ],
}
