/**
 * Blend Revelation Engine V2 - REVOLUTIONARY
 * 
 * The most advanced essential oil blend analysis system.
 * Considers: oils, dilution ratios, carrier types, crystals, cords, bottle size
 * Creates deeply personalized, scientifically-informed, spiritually-resonant narratives.
 */

import { createHash } from 'crypto';
import { getOilArchetype, DEFAULT_OIL_ARCHETYPE } from './oil-archetypes';

// ============================================================================
// ADVANCED TYPES
// ============================================================================

export interface AdvancedBlendDNA {
  oils: OilArchetype[];
  carrier: {
    type: 'pure' | 'jojoba' | 'fractionated-coconut' | 'sweet-almond' | 'grapeseed' | 'evening-primrose';
    ratio: number; // 0-100%
    volumeMl: number;
    properties: string[];
  };
  dilution: {
    percentage: number;
    strength: 'neat' | 'low' | 'medium' | 'high' | 'maximum';
    safetyProfile: 'gentle' | 'balanced' | 'potent' | 'clinical';
    recommendedFor: string[];
  };
  crystal: CrystalData;
  cord: CordData;
  bottleSize: number;
  intendedUse?: string;
  userExperience?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
}

export interface OilArchetype {
  id: string;
  name: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'ether';
  chakra: string;
  energetic: string;
  notes: 'top' | 'middle' | 'base';
  intensity: number;
  personality: string[];
  volumeMl: number;
  percentage: number;
}

export interface CrystalData {
  id: string;
  name: string;
  vibration: number;
  element: string;
  property: string;
  meaning: string;
  hexColor?: string; // Optional aura color override
}

export interface CordData {
  id: string;
  name: string;
  material: string;
  symbolism: string;
  energeticQuality: string;
}

export interface AdvancedBlendRevelation {
  id: string;
  
  // Identity
  blendName: string;
  soulName: string; // Deeper, more personal name
  archetype: BlendArchetype;
  subArchetype: string;
  
  // Vibration & Energy
  frequency: {
    hz: number;
    note: string;
    resonance: 'low' | 'mid' | 'high' | 'cosmic';
  };
  auraColor: string;
  
  // Elemental Analysis
  elements: ElementProfile;
  dominantForces: string[];
  
  // Dilution Intelligence
  dilutionWisdom: {
    strengthLevel: string;
    potencyDescription: string;
    absorptionRate: string;
    longevity: string;
    idealApplication: string[];
    safetyConsiderations: string[];
  };
  
  // Carrier Intelligence
  carrierIntelligence: {
    role: string;
    synergy: string;
    skinBenefits: string[];
    textureProfile: string;
    absorptionQuality: string;
  };
  
  // Multi-Dimensional Narrative
  narrative: {
    invocation: string; // Opening - calls to the blend
    alchemy: string; // How the transformation happens
    essence: string; // What it IS
    journey: string; // User's experience
    crystalHarmony: string;
    cordGrounding: string;
    dilutionMastery: string;
    carrierWisdom: string;
  };
  
  // Personalized Guidance
  guidance: {
    bestFor: string[];
    whenToUse: string[];
    howToApply: string[];
    optimalTiming: {
      timeOfDay: string;
      moonPhase: string;
      season: string;
      planetary: string;
    };
    chakraActivation: string[];
    affirmations: string[];
  };
  
  // Scientific-Spiritual Bridge
  composition: {
    topNotes: string[];
    heartNotes: string[];
    baseNotes: string[];
    evaporationCurve: string;
    sillage: string; // Scent trail strength
  };
  
  // Mystical Properties
  mystical: {
    tarotCard: string;
    zodiacResonance: string[];
    numerology: number;
    sacredGeometry: string;
    affirmation: string;
    intention: string;
  };
  
  generatedAt: string;
  cacheKey: string;
  version: '2.0';
}

export interface BlendArchetype {
  name: string;
  symbol: string;
  description: string;
  keywords: string[];
}

export interface ElementProfile {
  fire: number;
  water: number;
  earth: number;
  air: number;
  ether: number;
  dominant: string;
  balance: 'harmonious' | 'polarized' | 'dominant' | 'chaotic';
}

// ============================================================================
// ARCHETYPE SYSTEM
// ============================================================================

const ARCHETYPES: Record<string, BlendArchetype> = {
  'the-alchemist': {
    name: 'The Alchemist',
    symbol: '⚗️',
    description: 'Master of transformation, merging opposites into gold',
    keywords: ['transmutation', 'integration', 'synthesis', 'mastery']
  },
  'the-mystic': {
    name: 'The Mystic',
    symbol: '🔮',
    description: 'Seer of hidden truths, bridge between worlds',
    keywords: ['intuition', 'vision', 'mystery', 'transcendence']
  },
  'the-warrior': {
    name: 'The Warrior',
    symbol: '⚔️',
    description: 'Protector and catalyst for courageous action',
    keywords: ['strength', 'protection', 'will', 'courage']
  },
  'the-healer': {
    name: 'The Healer',
    symbol: '🌿',
    description: 'Gentle restorer of balance and wholeness',
    keywords: ['restoration', 'nurturing', 'compassion', 'renewal']
  },
  'the-sage': {
    name: 'The Sage',
    symbol: '📜',
    description: 'Keeper of ancient wisdom and clarity',
    keywords: ['wisdom', 'clarity', 'teaching', 'insight']
  },
  'the-enchantress': {
    name: 'The Enchantress',
    symbol: '🌙',
    description: 'Weaver of dreams and subtle magics',
    keywords: ['allure', 'intuition', 'dreams', 'mystery']
  },
  'the-groundskeeper': {
    name: 'The Groundskeeper',
    symbol: '🌳',
    description: 'Guardian of roots and earthly abundance',
    keywords: ['grounding', 'stability', 'nature', 'abundance']
  },
  'the-messenger': {
    name: 'The Messenger',
    symbol: '🕊️',
    description: 'Voice of truth and communication',
    keywords: ['expression', 'truth', 'connection', 'clarity']
  },
  'the-phoenix': {
    name: 'The Phoenix',
    symbol: '🔥',
    description: 'Born from ashes, catalyst of rebirth',
    keywords: ['rebirth', 'passion', 'transformation', 'radiance']
  },
  'the-voyager': {
    name: 'The Voyager',
    symbol: '🌊',
    description: 'Explorer of depths and distant horizons',
    keywords: ['exploration', 'depth', 'flow', 'adventure']
  }
};

// ============================================================================
// CARRIER INTELLIGENCE
// ============================================================================

const CARRIER_WISDOM: Record<string, {
  role: string;
  synergy: string;
  skinBenefits: string[];
  textureProfile: string;
  absorptionQuality: string;
  bestFor: string[];
}> = {
  'pure': {
    role: 'Uncompromised Potency',
    synergy: 'Amplifies the purest expression of each oil',
    skinBenefits: ['Maximum therapeutic concentration', 'Requires dilution for skin contact'],
    textureProfile: 'Light, concentrated, highly aromatic',
    absorptionQuality: 'Not for direct skin contact without proper dilution',
    bestFor: ['Advanced practitioners', 'Diffusion', 'Inhalation work']
  },
  'jojoba': {
    role: 'The Golden Balancer',
    synergy: 'Mimics skin\'s natural sebum, creating perfect harmony',
    skinBenefits: ['Non-comedogenic', 'Hypoallergenic', 'Balances oil production', 'Long-lasting hydration'],
    textureProfile: 'Luxurious liquid wax, silky glide',
    absorptionQuality: 'Slow, sustained release over 24 hours',
    bestFor: ['All skin types', 'Facial application', 'Daily rituals']
  },
  'fractionated-coconut': {
    role: 'The Infinite Carrier',
    synergy: 'Creates a lightweight, enduring foundation',
    skinBenefits: ['Exceptional shelf stability', 'Non-staining', 'Odorless', 'Smooth spreadability'],
    textureProfile: 'Featherlight, non-greasy silk',
    absorptionQuality: 'Quick absorption with lasting moisture barrier',
    bestFor: ['Massage', 'Large area application', 'Tropical climates']
  },
  'sweet-almond': {
    role: 'The Nurturing Mother',
    synergy: 'Embraces oils in gentle, vitamin-rich warmth',
    skinBenefits: ['Rich in Vitamin E', 'Softens skin', 'Soothes irritation', 'Affordable luxury'],
    textureProfile: 'Velvety, medium-weight embrace',
    absorptionQuality: 'Moderate absorption, deeply conditioning',
    bestFor: ['Dry skin', 'Body application', 'Beginner blends']
  },
  'grapeseed': {
    role: 'The Swift Messenger',
    synergy: 'Accelerates delivery with antioxidant protection',
    skinBenefits: ['High linoleic acid', 'Tightens pores', 'Light texture', 'Quick penetration'],
    textureProfile: 'Ultra-light, almost weightless',
    absorptionQuality: 'Rapid absorption, non-comedogenic',
    bestFor: ['Oily skin', 'Acne-prone', 'Summer use']
  },
  'evening-primrose': {
    role: 'The Hormone Harmonizer',
    synergy: 'Adds feminine wisdom and cellular regeneration',
    skinBenefits: ['GLA-rich', 'Hormone balancing', 'Anti-inflammatory', 'Mature skin support'],
    textureProfile: 'Rich, nourishing, slightly heavier',
    absorptionQuality: 'Deep penetration for cellular renewal',
    bestFor: ['Hormonal support', 'Mature skin', 'Evening rituals']
  }
};

// ============================================================================
// DILUTION INTELLIGENCE
// ============================================================================

function analyzeDilution(dna: AdvancedBlendDNA): AdvancedBlendRevelation['dilutionWisdom'] {
  const { percentage } = dna.dilution;
  const { carrier } = dna;
  const totalIntensity = dna.oils.reduce((sum, o) => sum + o.intensity, 0);
  const avgIntensity = totalIntensity / dna.oils.length;
  
  // Determine strength level
  let strengthLevel: string;
  let potencyDescription: string;
  let safetyConsiderations: string[] = [];
  
  if (percentage === 100) {
    strengthLevel = 'Neat / Pure Essential';
    potencyDescription = 'Unbridled aromatic power. This is the concentrated essence of the plants, undiluted and uncompromised. Maximum therapeutic potential with professional-level potency.';
    safetyConsiderations = ['For advanced practitioners only', 'Patch test required', 'Never apply undiluted to sensitive areas'];
  } else if (percentage >= 10) {
    strengthLevel = 'Maximum Therapeutic';
    potencyDescription = 'Clinical-grade strength for targeted, intensive support. Rapid action, profound effects. Reserved for short-term intensive use or experienced practitioners.';
    safetyConsiderations = ['Short-term use recommended', 'Monitor skin sensitivity', 'Consult practitioner if new to oils'];
  } else if (percentage >= 5) {
    strengthLevel = 'High Potency';
    potencyDescription = 'Robust therapeutic action while maintaining relative gentleness. Ideal for acute situations and those familiar with essential oils.';
    safetyConsiderations = ['Suitable for most adults', 'Avoid sensitive areas'];
  } else if (percentage >= 3) {
    strengthLevel = 'Balanced Strength';
    potencyDescription = 'The sweet spot of efficacy and safety. Strong enough to create meaningful change, gentle enough for regular use.';
    safetyConsiderations = ['Safe for daily use', 'Suitable for most skin types'];
  } else if (percentage >= 1) {
    strengthLevel = 'Gentle Nurturing';
    potencyDescription = 'Soft, sustained support that builds over time. Perfect for sensitive souls, facial application, and long-term daily rituals.';
    safetyConsiderations = ['Ideal for beginners', 'Facial safe', 'Child-friendly with guidance'];
  } else {
    strengthLevel = 'Subtle Whisper';
    potencyDescription = 'The faintest kiss of botanical wisdom. For those who prefer gentle energetic shifts over strong physical effects.';
    safetyConsiderations = ['Ultra-gentle', 'Safe for all', 'Minimal interaction risk'];
  }
  
  // Calculate absorption based on carrier and oils
  const hasTopNotes = dna.oils.some(o => o.notes === 'top');
  const hasBaseNotes = dna.oils.some(o => o.notes === 'base');
  
  let absorptionRate: string;
  if (hasTopNotes && !hasBaseNotes) {
    absorptionRate = 'Rapid absorption with quick onset (15-30 minutes)';
  } else if (!hasTopNotes && hasBaseNotes) {
    absorptionRate = 'Slow, sustained release over 6-8 hours';
  } else {
    absorptionRate = 'Balanced absorption: quick onset with 4-6 hour duration';
  }
  
  // Longevity based on dilution and notes
  let longevity: string;
  if (percentage >= 10) {
    longevity = 'Effects may last 8-12 hours due to high concentration';
  } else if (percentage >= 3) {
    longevity = 'Effects typically last 4-6 hours';
  } else {
    longevity = 'Gentle effects lasting 2-4 hours, suitable for frequent reapplication';
  }
  
  // Ideal application methods
  const idealApplication: string[] = [];
  if (percentage <= 1) {
    idealApplication.push('Facial application', 'Sensitive skin areas', 'Children (with guidance)');
  }
  if (percentage >= 3 && percentage <= 10) {
    idealApplication.push('Pulse points', 'Full body massage', 'Acupressure points');
  }
  if (percentage >= 5) {
    idealApplication.push('Targeted application', 'Therapeutic massage');
  }
  if (percentage === 100) {
    idealApplication.push('Inhalation only', 'Diffusion', 'Professional therapeutic use');
  }
  
  return {
    strengthLevel,
    potencyDescription,
    absorptionRate,
    longevity,
    idealApplication,
    safetyConsiderations
  };
}

// ============================================================================
// MAIN REVELATION ENGINE
// ============================================================================

export async function generateAdvancedRevelation(dna: AdvancedBlendDNA): Promise<AdvancedBlendRevelation> {
  const cacheKey = generateCacheKey(dna);
  
  // Core analysis
  const archetype = determineArchetype(dna);
  const elements = calculateElements(dna);
  const frequency = calculateFrequency(dna);
  const dilutionWisdom = analyzeDilution(dna);
  const carrierIntelligence = CARRIER_WISDOM[dna.carrier.type] || CARRIER_WISDOM['jojoba'];
  
  // Generate name
  const { blendName, soulName } = generateNames(dna, archetype, elements);
  
  // Build narrative
  const narrative = generateNarrative(dna, archetype, elements, dilutionWisdom, carrierIntelligence);
  
  // Guidance
  const guidance = generateGuidance(dna, archetype, elements);
  
  // Composition analysis
  const composition = analyzeComposition(dna);
  
  // Mystical properties
  const mystical = generateMystical(dna, archetype, elements);
  
  return {
    id: cacheKey,
    blendName,
    soulName,
    archetype,
    subArchetype: determineSubArchetype(dna, archetype),
    frequency,
    auraColor: calculateAuraColor(elements, dna.crystal),
    elements,
    dominantForces: calculateDominantForces(dna, elements),
    dilutionWisdom,
    carrierIntelligence,
    narrative,
    guidance,
    composition,
    mystical,
    generatedAt: new Date().toISOString(),
    cacheKey,
    version: '2.0'
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateCacheKey(dna: AdvancedBlendDNA): string {
  const components = [
    ...dna.oils.map(o => `${o.id}:${o.volumeMl.toFixed(1)}`),
    dna.carrier.type,
    dna.carrier.ratio.toString(),
    dna.crystal.id,
    dna.cord.id,
    dna.bottleSize.toString()
  ].join('|');
  
  return createHash('sha256').update(components).digest('hex').substring(0, 16);
}

function determineArchetype(dna: AdvancedBlendDNA): BlendArchetype {
  const elements = calculateElements(dna);
  const dominant = elements.dominant;
  const oilCount = dna.oils.length;
  const hasHighDilution = dna.dilution.percentage >= 10;
  
  // Complex archetype determination
  if (elements.balance === 'harmonious' && oilCount >= 4) {
    return ARCHETYPES['the-alchemist'];
  }
  
  if (dominant === 'ether' || dna.oils.some(o => o.personality.includes('mystic'))) {
    return ARCHETYPES['the-mystic'];
  }
  
  if (dominant === 'fire' && hasHighDilution) {
    return ARCHETYPES['the-phoenix'];
  }
  
  if (dominant === 'water' && dna.oils.some(o => o.chakra === 'heart')) {
    return ARCHETYPES['the-healer'];
  }
  
  if (dominant === 'earth') {
    return ARCHETYPES['the-groundskeeper'];
  }
  
  if (dominant === 'air') {
    return ARCHETYPES['the-messenger'];
  }
  
  if (dna.oils.some(o => o.personality.includes('warrior'))) {
    return ARCHETYPES['the-warrior'];
  }
  
  return ARCHETYPES['the-sage'];
}

function determineSubArchetype(dna: AdvancedBlendDNA, mainArchetype: BlendArchetype): string {
  const dilution = dna.dilution.percentage;
  const carrier = dna.carrier.type;
  
  if (dilution === 100) return 'Pure Essence Form';
  if (dilution >= 10) return 'Clinical Strength';
  if (carrier === 'jojoba') return 'Golden Harmony';
  if (carrier === 'evening-primrose') return 'Feminine Wisdom';
  if (dna.oils.length === 1) return 'Monarch of Singularity';
  if (dna.oils.length >= 5) return 'Symphony of Many';
  
  return 'Balanced Expression';
}

function calculateElements(dna: AdvancedBlendDNA): ElementProfile {
  const counts = { fire: 0, water: 0, earth: 0, air: 0, ether: 0 };
  
  dna.oils.forEach(oil => {
    counts[oil.element] += oil.intensity * oil.percentage / 100;
  });
  
  // Add crystal influence
  const crystalElements: Record<string, keyof typeof counts> = {
    'fire': 'fire', 'water': 'water', 'earth': 'earth', 'air': 'air', 'ether': 'ether'
  };
  if (crystalElements[dna.crystal.element]) {
    counts[crystalElements[dna.crystal.element]] += 3;
  }
  
  // Add carrier influence
  const carrierElements: Record<string, keyof typeof counts> = {
    'jojoba': 'earth', 'fractionated-coconut': 'water', 
    'sweet-almond': 'earth', 'grapeseed': 'air', 'evening-primrose': 'water'
  };
  if (carrierElements[dna.carrier.type]) {
    counts[carrierElements[dna.carrier.type]] += 2;
  }
  
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {
    fire: Math.round((counts.fire / total) * 100),
    water: Math.round((counts.water / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    ether: Math.round((counts.ether / total) * 100),
    dominant: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as string
  };
  
  // Determine balance
  const values = Object.values(percentages).slice(0, 5) as number[];
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  let balance: ElementProfile['balance'];
  if (max - min < 15) balance = 'harmonious';
  else if (max > 60) balance = 'dominant';
  else if (max - min > 40) balance = 'polarized';
  else balance = 'chaotic';
  
  return { ...percentages, balance };
}

function calculateFrequency(dna: AdvancedBlendDNA): AdvancedBlendRevelation['frequency'] {
  const oilHz = dna.oils.reduce((sum, o) => sum + (o.intensity * 10), 0) / dna.oils.length;
  const crystalHz = dna.crystal.vibration;
  const dilutionFactor = dna.dilution.percentage / 100;
  
  const hz = Math.round((oilHz + crystalHz) * dilutionFactor);
  
  // Map to musical note
  let note: string;
  if (hz < 200) note = 'Deep C (Root)';
  else if (hz < 300) note = 'D (Sacral)';
  else if (hz < 400) note = 'E (Solar Plexus)';
  else if (hz < 500) note = 'F (Heart)';
  else if (hz < 600) note = 'G (Throat)';
  else if (hz < 700) note = 'A (Third Eye)';
  else note = 'High B (Crown)';
  
  let resonance: 'low' | 'mid' | 'high' | 'cosmic';
  if (hz < 200) resonance = 'low';
  else if (hz < 400) resonance = 'mid';
  else if (hz < 600) resonance = 'high';
  else resonance = 'cosmic';
  
  return { hz, note, resonance };
}

function calculateAuraColor(elements: ElementProfile, crystal: CrystalData): string {
  const colorMap: Record<string, string> = {
    'fire': '#FF6B35',
    'water': '#4ECDC4',
    'earth': '#8B7355',
    'air': '#87CEEB',
    'ether': '#DDA0DD'
  };
  
  return colorMap[elements.dominant] || crystal.hexColor || '#C9A227';
}

function calculateDominantForces(dna: AdvancedBlendDNA, elements: ElementProfile): string[] {
  const forces: string[] = [];
  
  // Add elemental forces
  Object.entries(elements)
    .filter(([k]) => k !== 'dominant' && k !== 'balance')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .forEach(([element, percent]) => {
      if (percent > 20) forces.push(`${element.charAt(0).toUpperCase() + element.slice(1)} (${percent}%)`);
    });
  
  // Add dilution force
  if (dna.dilution.percentage === 100) forces.push('Pure Potency');
  else if (dna.dilution.percentage >= 10) forces.push('Clinical Strength');
  else if (dna.dilution.percentage <= 1) forces.push('Gentle Whisper');
  
  // Add carrier force
  const carrierForces: Record<string, string> = {
    'jojoba': 'Golden Balance',
    'evening-primrose': 'Feminine Wisdom',
    'fractionated-coconut': 'Silk Persistence'
  };
  if (carrierForces[dna.carrier.type]) forces.push(carrierForces[dna.carrier.type]);
  
  return forces;
}

function generateNames(dna: AdvancedBlendDNA, archetype: BlendArchetype, elements: ElementProfile): { blendName: string; soulName: string } {
  const primaryOil = dna.oils.sort((a, b) => b.percentage - a.percentage)[0];
  const prefixWords: Record<string, string[]> = {
    'the-alchemist': ['Transmutation', 'Golden', 'Prima', 'Unity'],
    'the-mystic': ['Oracle', 'Veil', 'Astral', 'Mist'],
    'the-warrior': ['Iron', 'Shield', 'Flame', 'Valor'],
    'the-healer': ['Soothe', 'Bloom', 'Heart', 'Restore'],
    'the-sage': ['Ancient', 'Wisdom', 'Scroll', 'Clarity'],
    'the-phoenix': ['Ember', 'Rising', 'Phoenix', 'Ignite'],
    'the-groundskeeper': ['Root', 'Earth', 'Stone', 'Forest'],
    'the-messenger': ['Wind', 'Voice', 'Truth', 'Wing']
  };
  
  const suffixes = ['Essence', 'Synergy', 'Alchemy', 'Resonance', 'Harmony', 'Elixir'];
  
  const words = prefixWords[archetype.name.toLowerCase().replace(/\s/g, '-')] || ['Mystery'];
  const prefix = words[Math.floor(Math.random() * words.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  const blendName = `${prefix} ${suffix}`;
  
  // Soul name is deeper, more personal
  const soulQualities = [
    ...primaryOil.personality,
    elements.dominant,
    dna.crystal.property
  ];
  const soulName = `The ${soulQualities[0].charAt(0).toUpperCase() + soulQualities[0].slice(1)} ${archetype.name.split(' ')[1]}`;
  
  return { blendName, soulName };
}

function generateNarrative(
  dna: AdvancedBlendDNA, 
  archetype: BlendArchetype, 
  elements: ElementProfile,
  dilution: AdvancedBlendRevelation['dilutionWisdom'],
  carrier: AdvancedBlendRevelation['carrierIntelligence']
): AdvancedBlendRevelation['narrative'] {
  
  const primaryOil = dna.oils[0];
  const secondaryOils = dna.oils.slice(1);
  
  // Invocation - calls to the blend's spirit
  const invocations: Record<string, string> = {
    'the-alchemist': `From the marriage of opposites, gold emerges. This ${dilution.strengthLevel.toLowerCase()} formula holds the secret of transmutation.`,
    'the-mystic': `Beyond the veil of ordinary perception, this blend opens doorways to knowing. The ${elements.dominant} element calls to your intuition.`,
    'the-warrior': `A shield of aromatic armor forms around you. With ${dna.dilution.percentage}% potency, this blend fortifies your spirit for the battles ahead.`,
    'the-healer': `Gentle medicine flows through this ${carrier.textureProfile.toLowerCase()} elixir. Each drop carries the soft power of restoration.`,
    'the-phoenix': `From ashes to flame, transformation awaits. This blend burns with ${primaryOil.name}'s fire, tempered by ${carrier.role.toLowerCase()}.`
  };
  
  // Alchemy - how it transforms
  const alchemy = secondaryOils.length > 0 
    ? `${primaryOil.name} establishes the foundation of ${primaryOil.element}. ${secondaryOils.map(o => o.name).join(' and ')} weave ${secondaryOils.length > 1 ? 'their' : 'its'} unique signatures into the tapestry, while ${carrier.synergy.toLowerCase()}.`
    : `${primaryOil.name} stands in singular sovereignty, its ${primaryOil.element} nature amplified through ${carrier.role.toLowerCase()}.`;
  
  // Essence - what it IS
  const essence = `This is ${archetype.description.toLowerCase()}. At ${dna.dilution.percentage}% dilution in ${carrier.textureProfile.toLowerCase()} ${dna.carrier.type.replace('-', ' ')}, it resonates at ${calculateFrequency(dna).hz}Hz—${calculateFrequency(dna).note.split(' ')[0]}.`;
  
  // Journey - user's experience
  const topNotes = dna.oils.filter(o => o.notes === 'top').map(o => o.name);
  const heartNotes = dna.oils.filter(o => o.notes === 'middle').map(o => o.name);
  const journey = `Upon application, ${topNotes.length > 0 ? 'bright top notes awaken your senses' : 'the essence begins its work'}, followed by ${heartNotes.length > 0 ? 'the heart of the blend revealing its true character' : 'the deeper notes emerging'}. ${dilution.absorptionRate}. ${dilution.longevity}.`;
  
  // Crystal harmony
  const crystalHarmony = `${dna.crystal.name} enters as ${dna.crystal.property === 'amplifying' ? 'an amplifier' : dna.crystal.property === 'grounding' ? 'an anchor' : 'a guardian'}, its ${dna.crystal.meaning.toLowerCase()} ${dna.crystal.property === 'amplifying' ? 'intensifying' : 'harmonizing with'} the blend's ${elements.dominant} nature.`;
  
  // Cord grounding
  const cordGrounding = `${dna.cord.name} completes the vessel with ${dna.cord.symbolism.toLowerCase()}. Its ${dna.cord.material} nature provides ${dna.cord.energeticQuality} energy.`;
  
  // Dilution mastery
  const dilutionMastery = `At ${dna.dilution.percentage}%, this blend achieves ${dilution.potencyDescription.toLowerCase()} ${dilution.safetyConsiderations.length > 0 ? `Note: ${dilution.safetyConsiderations[0].toLowerCase()}.` : ''}`;
  
  // Carrier wisdom
  const carrierWisdom = `${carrier.role}: ${carrier.synergy}. ${carrier.skinBenefits[0]}. This carrier was chosen to ${carrier.absorptionQuality.toLowerCase()}.`;
  
  return {
    invocation: invocations[archetype.name.toLowerCase().replace(/\s/g, '-')] || invocations['the-sage'],
    alchemy,
    essence,
    journey,
    crystalHarmony,
    cordGrounding,
    dilutionMastery,
    carrierWisdom
  };
}

function generateGuidance(dna: AdvancedBlendDNA, archetype: BlendArchetype, elements: ElementProfile): AdvancedBlendRevelation['guidance'] {
  // Best for
  const bestFor: string[] = [];
  if (dna.dilution.percentage <= 1) bestFor.push('Facial application', 'Sensitive skin', 'Daily rituals');
  if (dna.dilution.percentage >= 3) bestFor.push('Therapeutic massage', 'Acupressure points');
  if (dna.dilution.percentage >= 10) bestFor.push('Intensive therapy', 'Short-term use');
  if (elements.dominant === 'fire') bestFor.push('Energizing moments', 'Creative work');
  if (elements.dominant === 'water') bestFor.push('Emotional processing', 'Evening rituals');
  if (elements.dominant === 'earth') bestFor.push('Grounding practices', 'Morning stability');
  if (elements.dominant === 'air') bestFor.push('Mental clarity', 'Communication');
  
  // When to use
  const whenToUse: string[] = [];
  if (dna.oils.some(o => o.notes === 'top')) whenToUse.push('Morning awakening');
  if (dna.oils.some(o => o.notes === 'base')) whenToUse.push('Evening reflection');
  if (dna.crystal.property === 'amplifying') whenToUse.push('Before important events');
  if (dna.crystal.property === 'grounding') whenToUse.push('During stressful times');
  
  // How to apply
  const howToApply: string[] = [];
  if (dna.dilution.percentage <= 1) howToApply.push('1-2 drops to face and neck');
  if (dna.dilution.percentage >= 3) howToApply.push('Apply to pulse points');
  if (dna.bottleSize >= 30) howToApply.push('Use for full body massage');
  howToApply.push('Inhale deeply after application');
  
  // Timing
  const timing: AdvancedBlendRevelation['guidance']['optimalTiming'] = {
    timeOfDay: elements.dominant === 'fire' ? 'Morning' : elements.dominant === 'water' ? 'Evening' : 'Any time',
    moonPhase: dna.oils.some(o => o.personality.includes('mystic')) ? 'Full Moon' : 'Any phase',
    season: elements.dominant === 'fire' ? 'Summer' : elements.dominant === 'water' ? 'Winter' : elements.dominant === 'earth' ? 'Autumn' : 'Spring',
    planetary: archetype.name === 'The Messenger' ? 'Mercury' : archetype.name === 'The Healer' ? 'Venus' : archetype.name === 'The Warrior' ? 'Mars' : 'Sun'
  };
  
  // Chakras
  const chakraCounts: Record<string, number> = {};
  dna.oils.forEach(o => {
    chakraCounts[o.chakra] = (chakraCounts[o.chakra] || 0) + o.percentage;
  });
  const chakras = Object.entries(chakraCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);
  
  // Affirmations
  const affirmations = [
    `I am ${archetype.keywords[0]} and ${archetype.keywords[1]}.`,
    `This blend supports my journey of ${archetype.keywords[2]}.`,
    `I receive the ${elements.dominant} energy with gratitude.`
  ];
  
  return {
    bestFor,
    whenToUse,
    howToApply,
    optimalTiming: timing,
    chakraActivation: chakras,
    affirmations
  };
}

function analyzeComposition(dna: AdvancedBlendDNA): AdvancedBlendRevelation['composition'] {
  const topNotes = dna.oils.filter(o => o.notes === 'top').map(o => o.name);
  const heartNotes = dna.oils.filter(o => o.notes === 'middle').map(o => o.name);
  const baseNotes = dna.oils.filter(o => o.notes === 'base').map(o => o.name);
  
  // Evaporation curve
  let evaporationCurve: string;
  if (topNotes.length > baseNotes.length) {
    evaporationCurve = 'Bright opening that gradually softens';
  } else if (baseNotes.length > topNotes.length) {
    evaporationCurve = 'Slow-revealing depth that lingers for hours';
  } else {
    evaporationCurve = 'Balanced evolution from first breath to final whisper';
  }
  
  // Sillage (scent trail)
  const intensity = dna.oils.reduce((sum, o) => sum + o.intensity, 0) / dna.oils.length;
  const dilutionFactor = dna.dilution.percentage / 100;
  const sillageScore = intensity * dilutionFactor;
  
  let sillage: string;
  if (sillageScore > 7) sillage = 'Strong—leaves an aromatic trail as you move';
  else if (sillageScore > 5) sillage = 'Moderate—detectable within arm\'s reach';
  else if (sillageScore > 3) sillage = 'Intimate—discovered only in close embrace';
  else sillage = 'Personal—known only to you and those nearest';
  
  return {
    topNotes,
    heartNotes,
    baseNotes,
    evaporationCurve,
    sillage
  };
}

function generateMystical(dna: AdvancedBlendDNA, archetype: BlendArchetype, elements: ElementProfile): AdvancedBlendRevelation['mystical'] {
  const tarotCards: Record<string, string> = {
    'the-alchemist': 'The Magician',
    'the-mystic': 'The High Priestess',
    'the-warrior': 'Strength',
    'the-healer': 'The Empress',
    'the-sage': 'The Hierophant',
    'the-phoenix': 'Death (Rebirth)',
    'the-groundskeeper': 'The Emperor',
    'the-messenger': 'The Fool'
  };
  
  const zodiacMap: Record<string, string[]> = {
    'fire': ['Aries', 'Leo', 'Sagittarius'],
    'water': ['Cancer', 'Scorpio', 'Pisces'],
    'earth': ['Taurus', 'Virgo', 'Capricorn'],
    'air': ['Gemini', 'Libra', 'Aquarius'],
    'ether': ['All signs'] // Ether transcends
  };
  
  // Numerology
  const numerology = dna.oils.reduce((sum, o) => sum + o.intensity, 0) % 9 || 9;
  
  // Sacred geometry
  const geometryMap: Record<string, string> = {
    'the-alchemist': 'Flower of Life',
    'the-mystic': 'Vesica Piscis',
    'the-warrior': 'Star Tetrahedron',
    'the-healer': 'Seed of Life',
    'the-phoenix': 'Phoenix Spiral'
  };
  
  return {
    tarotCard: tarotCards[archetype.name.toLowerCase().replace(/\s/g, '-')] || 'The Star',
    zodiacResonance: zodiacMap[elements.dominant] || ['All signs'],
    numerology,
    sacredGeometry: geometryMap[archetype.name.toLowerCase().replace(/\s/g, '-')] || 'Circle',
    affirmation: `I embody ${archetype.keywords[0]} and walk the path of ${archetype.keywords[1]}.`,
    intention: `To cultivate ${archetype.keywords[2]} in all aspects of being.`
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export const AdvancedRevelationEngine = {
  generateAdvancedRevelation
};

export default AdvancedRevelationEngine;
