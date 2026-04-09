/**
 * Revelation Bridge - Connects Atelier UI to Advanced Revelation Engine
 * Converts existing atelier state into AdvancedBlendDNA format
 */

import { generateAdvancedRevelation, AdvancedBlendDNA, AdvancedBlendRevelation, OilArchetype, CrystalData, CordData } from './blend-revelation-engine-v2';

// Re-export types for consumers
export type { AdvancedBlendRevelation };
import { getOilArchetype } from './oil-archetypes';
import { getAtelierCordById } from './cord-data-atelier';
import { ATELIER_CRYSTALS } from './atelier-engine';
import { AtelierOil } from './atelier-engine';

// Extended oil type with ml measurement
export interface AtelierOilWithVolume extends AtelierOil {
  ml: number;
  restrictions?: string[];
}

export interface AtelierState {
  selectedOils: AtelierOilWithVolume[];
  selectedCrystal: string;
  selectedCord: string;
  selectedCarrier: string;
  dilutionPercentage: number;
  bottleSize: number;
  totalVolume: number;
}

export interface CarrierInfo {
  type: AdvancedBlendDNA['carrier']['type'];
  displayName: string;
  properties: string[];
}

// Map carrier selections to engine format
const CARRIER_MAP: Record<string, CarrierInfo> = {
  'pure': {
    type: 'pure',
    displayName: 'Pure Essential (No Carrier)',
    properties: ['Maximum potency', 'Rapid absorption', 'Professional use']
  },
  'jojoba': {
    type: 'jojoba',
    displayName: 'Jojoba Oil',
    properties: ['Wax ester structure', '98% sebum match', 'Balances skin', 'Facial superior']
  },
  'fractionated-coconut': {
    type: 'fractionated-coconut',
    displayName: 'Fractionated Coconut Oil',
    properties: ['Never solidifies', 'Completely odorless', 'Fast absorption', 'Massage superior']
  }
};

/**
 * Calculate actual dilution percentage from atelier state
 */
function calculateDilution(state: AtelierState): {
  percentage: number;
  strength: AdvancedBlendDNA['dilution']['strength'];
  safetyProfile: AdvancedBlendDNA['dilution']['safetyProfile'];
  recommendedFor: string[];
} {
  const { dilutionPercentage, selectedCarrier } = state;
  
  // Pure oil (no carrier)
  if (selectedCarrier === 'pure' || dilutionPercentage === 100) {
    return {
      percentage: 100,
      strength: 'neat',
      safetyProfile: 'clinical',
      recommendedFor: ['Advanced practitioners', 'Inhalation', 'Targeted therapy']
    };
  }
  
  // Determine strength category
  let strength: AdvancedBlendDNA['dilution']['strength'];
  let safetyProfile: AdvancedBlendDNA['dilution']['safetyProfile'];
  let recommendedFor: string[] = [];
  
  if (dilutionPercentage >= 25) {
    strength = 'maximum';
    safetyProfile = 'clinical';
    recommendedFor = ['Intensive short-term use', 'Professional guidance', 'Specific conditions'];
  } else if (dilutionPercentage >= 10) {
    strength = 'high';
    safetyProfile = 'potent';
    recommendedFor = ['Adults with experience', 'Therapeutic massage', 'Acute situations'];
  } else if (dilutionPercentage >= 5) {
    strength = 'medium';
    safetyProfile = 'balanced';
    recommendedFor = ['Regular therapeutic use', 'Most adults', 'Daily rituals'];
  } else if (dilutionPercentage >= 1) {
    strength = 'low';
    safetyProfile = 'gentle';
    recommendedFor = ['Beginners', 'Facial application', 'Children with guidance', 'Sensitive skin'];
  } else {
    strength = 'low';
    safetyProfile = 'gentle';
    recommendedFor = ['Ultra-sensitive skin', 'First-time users', 'Elderly'];
  }
  
  return {
    percentage: dilutionPercentage,
    strength,
    safetyProfile,
    recommendedFor
  };
}

/**
 * Convert atelier oils to archetype format
 */
function convertOils(selectedOils: AtelierOilWithVolume[]): OilArchetype[] {
  if (selectedOils.length === 0) return [];
  const totalVolume = selectedOils.reduce((sum, o) => sum + o.ml, 0);
  
  return selectedOils
    .map(oil => {
      const archetype = getOilArchetype(oil.id);
      if (!archetype) return null;
      const percentage = totalVolume > 0 ? (oil.ml / totalVolume) * 100 : 0;
      
      return {
        id: oil.id,
        name: oil.name,
        element: archetype.element,
        chakra: archetype.chakra,
        energetic: archetype.energetic,
        notes: archetype.notes,
        intensity: archetype.intensity,
        personality: archetype.personality,
        volumeMl: oil.ml,
        percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

/**
 * Get crystal data
 */
function getCrystalData(crystalId: string): CrystalData {
  const crystal = ATELIER_CRYSTALS.find(c => c.id === crystalId);
  
  if (!crystal) {
    return {
      id: 'clear-quartz',
      name: 'Clear Quartz',
      vibration: 100,
      element: 'ether',
      property: 'amplifying',
      meaning: 'clarity and amplification'
    };
  }
  
  // Map crystal meanings and vibrations
  const crystalWisdom: Record<string, { vibration: number; element: string; meaning: string }> = {
    'clear-quartz': { vibration: 100, element: 'ether', meaning: 'clarity and amplification' },
    'amethyst': { vibration: 85, element: 'water', meaning: 'peace and spiritual protection' },
    'rose-quartz': { vibration: 90, element: 'water', meaning: 'love and emotional healing' },
    'citrine': { vibration: 95, element: 'fire', meaning: 'abundance and confidence' },
    'black-tourmaline': { vibration: 80, element: 'earth', meaning: 'protection and grounding' },
    'labradorite': { vibration: 88, element: 'air', meaning: 'transformation and magic' },
    'selenite': { vibration: 110, element: 'ether', meaning: 'purification and light' },
    'carnelian': { vibration: 92, element: 'fire', meaning: 'vitality and creativity' },
    'green-aventurine': { vibration: 87, element: 'earth', meaning: 'growth and opportunity' },
    'sodalite': { vibration: 82, element: 'water', meaning: 'truth and communication' },
    'tigers-eye': { vibration: 93, element: 'fire', meaning: 'courage and strength' },
    'red-jasper': { vibration: 86, element: 'earth', meaning: 'grounding and stability' },
    'lapis-lazuli': { vibration: 94, element: 'air', meaning: 'wisdom and truth' },
    'moonstone': { vibration: 89, element: 'water', meaning: 'intuition and cycles' },
    'hematite': { vibration: 84, element: 'earth', meaning: 'protection and balance' }
  };
  
  const wisdom = crystalWisdom[crystalId] || { vibration: 90, element: 'earth', meaning: 'healing' };
  
  // Use first property from crystal or default to 'amplifying'
  const property = crystal.properties[0] || 'amplifying';
  
  return {
    id: crystal.id,
    name: crystal.name,
    vibration: wisdom.vibration,
    element: wisdom.element,
    property,
    meaning: wisdom.meaning
  };
}

/**
 * Get cord data
 */
function getCordData(cordId: string): CordData {
  const cord = getAtelierCordById(cordId);
  
  return {
    id: cord.id,
    name: cord.name,
    material: cord.material,
    symbolism: cord.symbolism,
    energeticQuality: cord.energeticQuality
  };
}

/**
 * Build AdvancedBlendDNA from atelier state
 */
export function buildBlendDNA(state: AtelierState): AdvancedBlendDNA {
  const dilution = calculateDilution(state);
  const carrierInfo = CARRIER_MAP[state.selectedCarrier] || CARRIER_MAP['jojoba'];
  
  // Calculate carrier volume
  const totalOilVolume = state.totalVolume;
  const carrierVolume = state.selectedCarrier === 'pure' 
    ? 0 
    : (totalOilVolume * (100 - state.dilutionPercentage)) / state.dilutionPercentage;
  
  return {
    oils: convertOils(state.selectedOils),
    carrier: {
      type: carrierInfo.type,
      ratio: 100 - state.dilutionPercentage,
      volumeMl: Math.round(carrierVolume * 10) / 10,
      properties: carrierInfo.properties
    },
    dilution: {
      percentage: dilution.percentage,
      strength: dilution.strength,
      safetyProfile: dilution.safetyProfile,
      recommendedFor: dilution.recommendedFor
    },
    crystal: getCrystalData(state.selectedCrystal),
    cord: getCordData(state.selectedCord),
    bottleSize: state.bottleSize
  };
}

/**
 * Main function: Generate revelation from atelier state
 */
export async function generateAtelierRevelation(state: AtelierState): Promise<AdvancedBlendRevelation> {
  const dna = buildBlendDNA(state);
  return generateAdvancedRevelation(dna);
}

/**
 * Quick analysis without full revelation
 */
export function quickDilutionAnalysis(state: AtelierState): {
  percentage: number;
  strength: string;
  safetyProfile: string;
  carrierName: string;
  isSafe: boolean;
  warnings: string[];
} {
  const dilution = calculateDilution(state);
  const carrier = CARRIER_MAP[state.selectedCarrier];
  
  const warnings: string[] = [];
  
  // Safety checks
  if (dilution.percentage === 100) {
    warnings.push('Pure essential oils - for experienced users only');
    warnings.push('Never apply undiluted to sensitive skin areas');
  }
  if (dilution.percentage >= 25) {
    warnings.push('Very high concentration - short term use recommended');
  }
  if (state.selectedOils.some(o => o.restrictions && o.restrictions.length > 0) && dilution.percentage > 5) {
    warnings.push('Contains restricted oils - consider lower dilution');
  }
  
  const isSafe = dilution.percentage <= 10 || state.selectedCarrier !== 'pure';
  
  return {
    percentage: dilution.percentage,
    strength: dilution.strength,
    safetyProfile: dilution.safetyProfile,
    carrierName: carrier?.displayName || 'Unknown',
    isSafe,
    warnings
  };
}

export default generateAtelierRevelation;
