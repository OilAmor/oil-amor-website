/**
 * Blend Revelation Engine - AI-Powered Synergy Description System
 * 
 * Generates unique, poetic, sci-fi worthy descriptions for every blend combination
 * ENHANCED: Now integrates Oil Wisdom profiles for deeply personalized revelations
 */

import { createHash } from 'crypto';
import { OIL_WISDOM, OilWisdomProfile } from './oil-wisdom';

// ============================================================================
// TYPES - Blend DNA System
// ============================================================================

export interface OilWithRatio extends OilArchetype {
  ml: number;
  percentage: number;
  drops: number;
}

export interface BlendDNA {
  oils: OilWithRatio[];
  crystal: CrystalSignature;
  cord: CordResonance;
  carrier: CarrierEssence;
  bottleSize: number;
  totalMl: number;
  dominantOil?: string;
  supportingOils?: string[];
  ratioSignature?: string;
}

export interface OilArchetype {
  id: string;
  name: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'ether';
  chakra: 'root' | 'sacral' | 'solar-plexus' | 'heart' | 'throat' | 'third-eye' | 'crown';
  energetic: 'warming' | 'cooling' | 'balancing' | 'grounding' | 'uplifting' | 'calming';
  notes: 'top' | 'middle' | 'base';
  intensity: number;
  personality: string[];
  // ENHANCED: Wisdom integration
  wisdom?: OilWisdomProfile;
  frequency?: { hz: number; note: string };
  affirmation?: string;
  tarotCard?: string;
  latinName?: string;
  spiritualDescription?: string;
  culturalContext?: string[];
  // Alternative element representation (for weighted element scoring)
  elements?: {
    fire?: number;
    water?: number;
    earth?: number;
    air?: number;
    ether?: number;
  };
}

export interface CrystalSignature {
  id: string;
  name: string;
  vibration: number;
  element: 'fire' | 'water' | 'earth' | 'air' | 'ether';
  property: 'amplifying' | 'grounding' | 'cleansing' | 'protective' | 'healing';
  colorSpectrum: string[];
  meaning: string;
}

export interface CordResonance {
  id: string;
  name: string;
  material: 'silk' | 'cotton' | 'hemp' | 'leather' | 'waxed-cord';
  color: string;
  symbolism: string;
  energeticQuality: 'flowing' | 'grounding' | 'protective' | 'activating';
}

export interface CarrierEssence {
  type: 'pure' | 'jojoba' | 'fractionated-coconut' | 'argan';
  ratio?: number;
  properties: string[];
}

export interface BlendRevelation {
  id: string;
  blendName: string;
  archetype: BlendArchetypeType;
  vibration: number;
  elements: ElementBalance;
  narrative: {
    opening: string;
    journey: string;
    transformation: string;
    crystalHarmony: string;
    cordConnection: string;
  };
  poeticEssence: string;
  usageIntent: string[];
  chakras: string[];
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night' | 'any';
  moonPhase: 'new' | 'waxing' | 'full' | 'waning' | 'any';
  seasonalResonance: 'spring' | 'summer' | 'autumn' | 'winter' | 'any';
  generatedAt: string;
  cacheKey: string;
  // ENHANCED: Wisdom-derived additions
  frequencyHarmony?: {
    combinedHz: number;
    beatFrequency: number;
    chordType: string;
    description: string;
  };
  affirmation?: string;
  culturalSynthesis?: string;
  tarotSynergy?: string;
  carrierWisdom?: string;
}

export interface ElementBalance {
  fire: number;
  water: number;
  earth: number;
  air: number;
  ether: number;
  dominant: string;
}

// ============================================================================
// WISDOM INTEGRATION HELPERS
// ============================================================================

/**
 * Calculate frequency harmonics between oils
 * Returns beat frequency and chord type
 */
function calculateFrequencyHarmony(oils: OilWithRatio[]): { 
  combinedHz: number; 
  beatFrequency: number; 
  chordType: string;
  description: string;
} {
  const frequencies = oils.map(o => (o as any).frequency?.hz || 100).filter(Boolean);
  
  if (frequencies.length === 0) {
    return { combinedHz: 100, beatFrequency: 0, chordType: 'unknown', description: 'Universal resonance' };
  }
  
  if (frequencies.length === 1) {
    return { 
      combinedHz: frequencies[0], 
      beatFrequency: 0, 
      chordType: 'monotone', 
      description: `Pure ${frequencies[0]}Hz resonance` 
    };
  }
  
  // Calculate weighted average based on oil ratios
  const totalMl = oils.reduce((sum, o) => sum + o.ml, 0);
  const weightedHz = oils.reduce((sum, o) => {
    const hz = (o as any).frequency?.hz || 100;
    return sum + (hz * (o.ml / totalMl));
  }, 0);
  
  // Calculate beat frequency (difference between highest and lowest)
  const max = Math.max(...frequencies);
  const min = Math.min(...frequencies);
  const beatFreq = Math.abs(max - min);
  
  // Determine chord type based on frequency relationships
  let chordType = 'complex';
  let description = 'Multi-frequency harmony';
  
  if (frequencies.length === 2) {
    const ratio = max / min;
    if (ratio >= 1.99 && ratio <= 2.01) {
      chordType = 'octave';
      description = 'Octave resonance - doubling of frequency creates unity';
    } else if (ratio >= 1.49 && ratio <= 1.51) {
      chordType = 'perfect-fifth';
      description = 'Perfect fifth - the most consonant interval after octave';
    } else if (ratio >= 1.24 && ratio <= 1.27) {
      chordType = 'major-third';
      description = 'Major third - bright, uplifting harmonic relationship';
    } else if (beatFreq < 10) {
      chordType = 'binaural-theta';
      description = `Theta wave entrainment (${beatFreq.toFixed(1)}Hz) - deep meditation support`;
    } else if (beatFreq < 20) {
      chordType = 'binaural-beta';
      description = `Beta wave stimulation (${beatFreq.toFixed(1)}Hz) - mental alertness`;
    }
  }
  
  return {
    combinedHz: Math.round(weightedHz),
    beatFrequency: Math.round(beatFreq * 10) / 10,
    chordType,
    description
  };
}

/**
 * Detect chakra bridging when crystal and oils span adjacent chakras
 */
function detectChakraBridging(oilChakras: string[], crystalChakra: string): {
  bridge: string | null;
  description: string;
} {
  const chakraOrder = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
  const uniqueChakras = [...new Set([...oilChakras, crystalChakra])];
  
  if (uniqueChakras.length < 2) return { bridge: null, description: '' };
  
  // Check for adjacent chakras
  const indices = uniqueChakras.map(c => chakraOrder.indexOf(c)).sort((a, b) => a - b);
  
  for (let i = 0; i < indices.length - 1; i++) {
    if (indices[i + 1] - indices[i] === 1) {
      const lower = chakraOrder[indices[i]];
      const upper = chakraOrder[indices[i + 1]];
      return {
        bridge: `${lower}-to-${upper}`,
        description: `Energy flows from ${lower} to ${upper}, creating a bridge between these centers`
      };
    }
  }
  
  // Check for root-to-crown (full spectrum)
  if (indices.includes(0) && indices.includes(6)) {
    return {
      bridge: 'root-to-crown',
      description: 'Full chakra spectrum activated - from earthly foundation to cosmic connection'
    };
  }
  
  return { bridge: null, description: '' };
}

/**
 * Synthesize cultural contexts from multiple oils
 */
function synthesizeCultures(oils: OilWithRatio[]): string {
  const allCultures = oils.flatMap(o => (o as any).wisdom?.traditionalUses?.cultures || []);
  const uniqueCultures = [...new Set(allCultures)];
  
  if (uniqueCultures.length === 0) return '';
  if (uniqueCultures.length === 1) return `Tradition echoes from ${uniqueCultures[0]}.`;
  
  const culturePairs = [
    ['Ancient Egypt', 'Traditional Chinese Medicine'],
    ['Australian Aboriginal', 'Native American'],
    ['Medieval Europe', 'Ayurveda'],
    ['Roman Empire', 'Greek']
  ];
  
  for (const [c1, c2] of culturePairs) {
    if (uniqueCultures.includes(c1) && uniqueCultures.includes(c2)) {
      return `${c1} meets ${c2} in this cross-cultural wisdom blend.`;
    }
  }
  
  return `Wisdom converges from ${uniqueCultures.slice(0, 3).join(', ')}${uniqueCultures.length > 3 ? ' and more' : ''}.`;
}

/**
 * Weave multiple oil affirmations into a blend mantra
 */
function weaveAffirmations(oils: OilWithRatio[], ratioProfile: string): string {
  const affirmations = oils
    .map(o => (o as any).affirmation)
    .filter(Boolean)
    .slice(0, 3); // Max 3 affirmations
  
  if (affirmations.length === 0) return '';
  if (affirmations.length === 1) return affirmations[0];
  
  if (ratioProfile === 'dominant-lead') {
    // Dominant oil's affirmation leads
    return `${affirmations[0]} ${affirmations.slice(1).map(a => a.split('.')[0].toLowerCase()).join('. ')}.`;
  }
  
  if (ratioProfile === 'balanced-duo' && affirmations.length >= 2) {
    // Weave two affirmations together
    return `${affirmations[0]} Together: ${affirmations[1]}`;
  }
  
  // For complex blends, create a unified statement
  const themes = affirmations.map(a => a.split('.')[0]);
  return themes.join('. ') + '.';
}

/**
 * Map tarot card synergies
 */
function mapTarotSynergy(oilTarots: string[], crystalMeaning: string): string {
  if (oilTarots.length === 0) return '';
  
  const tarotMeanings: Record<string, string> = {
    'The Star': 'hope and healing',
    'The Sun': 'joy and vitality',
    'The Hierophant': 'spiritual wisdom',
    'High Priestess': 'intuition',
    'Empress': 'abundance',
    'Magician': 'mastery',
    'Fool': 'new beginnings',
    'King of Pentacles': 'stability',
    'Pentacles': 'earth and manifestation'
  };
  
  const meanings = oilTarots.map(t => {
    for (const [card, meaning] of Object.entries(tarotMeanings)) {
      if (t.includes(card)) return meaning;
    }
    return 'mystery';
  });
  
  if (meanings.length === 1) {
    return `${oilTarots[0]} brings ${meanings[0]} to this blend`;
  }
  
  return `${oilTarots.slice(0, 2).join(' meets ')}—${meanings.slice(0, 2).join(' dances with ')}`;
}

/**
 * Generate carrier wisdom narrative
 */
function generateCarrierWisdom(carrierType: string, carrierProperties: string[]): string {
  const carrierWisdom: Record<string, { story: string; benefit: string }> = {
    'jojoba': {
      story: 'Golden jojoba—molecularly similar to human sebum—has carried medicine for Indigenous desert peoples for millennia.',
      benefit: 'Its waxy texture creates time-released delivery, sinking slowly into skin like ancient wisdom.'
    },
    'fractionated-coconut': {
      story: 'Fractionated coconut—stripped of long-chain fatty acids—represents modern alchemy meeting tropical tradition.',
      benefit: 'Never solidifying, it carries essences with silky persistence, never staining, always gentle.'
    },
    'argan': {
      story: 'Moroccan argan—pressed from nuts cracked by Berber women—carries the luxury of Atlas Mountain tradition.',
      benefit: 'Rich with vitamin E and essential fatty acids, it nourishes as it delivers, anti-aging by nature.'
    }
  };
  
  const wisdom = carrierWisdom[carrierType];
  if (!wisdom) return '';
  
  return `${wisdom.story} ${wisdom.benefit}`;
}

/**
 * Enrich oil data with wisdom profiles
 */
function enrichOilWithWisdom(oil: OilWithRatio): OilWithRatio {
  const wisdom = OIL_WISDOM[oil.id as keyof typeof OIL_WISDOM];
  if (!wisdom) return oil;
  
  return {
    ...oil,
    wisdom,
    frequency: wisdom.frequency,
    affirmation: wisdom.metaphysical?.affirmation,
    tarotCard: wisdom.metaphysical?.tarotCorrespondence,
    latinName: wisdom.latinName,
    spiritualDescription: wisdom.description?.spiritual,
    culturalContext: wisdom.traditionalUses?.cultures,
    personality: wisdom.categories?.slice(0, 3) || oil.personality
  };
}

export type BlendArchetypeType = 
  | 'the-warrior'
  | 'the-healer'
  | 'the-mystic'
  | 'the-groundskeeper'
  | 'the-messenger'
  | 'the-alchemist'
  | 'the-sanctuary'
  | 'the-ignite'
  | 'the-deep-dive'
  | 'the-ascension'
  | 'the-forest-whisper'
  | 'the-celestial-dance'
  | 'the-shadow-work'
  | 'the-dawn-bringer'
  | 'the-night-keeper';

// ============================================================================
// ARCHETYPE ANALYSIS
// ============================================================================

export function analyzeBlendArchetype(dna: BlendDNA): {
  archetype: BlendArchetypeType;
  confidence: number;
  elementBalance: ElementBalance;
  dominantChakra: string;
  dominantOil: string;
  ratioProfile: 'dominant-lead' | 'balanced-duo' | 'harmonious-trio' | 'complex-symphony';
} {
  const elementCounts = { fire: 0, water: 0, earth: 0, air: 0, ether: 0 };
  const chakraCounts: Record<string, number> = {};
  const oilContributions: Record<string, number> = {};
  
  // Calculate total volume for ratio weighting
  const totalVolume = dna.oils.reduce((sum, oil) => sum + oil.ml, 0);
  
  // Weight elements and chakras by oil ratio
  dna.oils.forEach(oil => {
    const ratioWeight = oil.ml / totalVolume;
    const weightedIntensity = oil.intensity * ratioWeight * 10; // Scale for impact
    
    elementCounts[oil.element] += weightedIntensity;
    chakraCounts[oil.chakra] = (chakraCounts[oil.chakra] || 0) + weightedIntensity;
    oilContributions[oil.name] = ratioWeight;
  });
  
  // Sort oils by contribution to determine dominant/supporting
  const sortedOils = Object.entries(oilContributions).sort((a, b) => b[1] - a[1]);
  const dominantOil = sortedOils[0]?.[0] || 'Unknown';
  
  // Determine ratio profile based on distribution
  let ratioProfile: 'dominant-lead' | 'balanced-duo' | 'harmonious-trio' | 'complex-symphony';
  if (sortedOils.length === 1) {
    ratioProfile = 'dominant-lead';
  } else if (sortedOils.length === 2) {
    const ratio = sortedOils[0][1] / sortedOils[1][1];
    ratioProfile = ratio > 1.5 ? 'dominant-lead' : 'balanced-duo';
  } else if (sortedOils.length === 3) {
    ratioProfile = 'harmonious-trio';
  } else {
    ratioProfile = 'complex-symphony';
  }
  
  elementCounts[dna.crystal.element] += 3;
  
  const cordElements: Record<string, keyof typeof elementCounts> = {
    'flowing': 'water',
    'grounding': 'earth',
    'activating': 'fire',
    'protective': 'earth'
  };
  if (cordElements[dna.cord.energeticQuality]) {
    elementCounts[cordElements[dna.cord.energeticQuality]] += 2;
  }
  
  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const balance: ElementBalance = {
    fire: Math.round((elementCounts.fire / total) * 100),
    water: Math.round((elementCounts.water / total) * 100),
    earth: Math.round((elementCounts.earth / total) * 100),
    air: Math.round((elementCounts.air / total) * 100),
    ether: Math.round((elementCounts.ether / total) * 100),
    dominant: Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0]
  };
  
  const dominantChakra = Object.entries(chakraCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'heart';
  
  const archetype = determineArchetype(balance, dominantChakra, dna, ratioProfile);
  
  return {
    archetype,
    confidence: calculateConfidence(dna, balance),
    elementBalance: balance,
    dominantChakra,
    dominantOil,
    ratioProfile
  };
}

function determineArchetype(
  balance: ElementBalance, 
  chakra: string, 
  dna: BlendDNA,
  ratioProfile: 'dominant-lead' | 'balanced-duo' | 'harmonious-trio' | 'complex-symphony'
): BlendArchetypeType {
  // Get dominant oil's personality traits
  const dominantOil = dna.oils.reduce((prev, current) => 
    (prev.ml > current.ml) ? prev : current
  );
  
  // Check for archetype hints in dominant oil personality
  const personalities = dominantOil.personality || [];
  
  if (personalities.includes('mystic') && chakra === 'third-eye') {
    return ratioProfile === 'dominant-lead' ? 'the-mystic' : 'the-shadow-work';
  }
  
  if (personalities.includes('warrior') && balance.dominant === 'fire') {
    return ratioProfile === 'balanced-duo' ? 'the-ignite' : 'the-warrior';
  }
  
  if (dna.crystal.property === 'healing' && balance.dominant === 'water') {
    return ratioProfile === 'complex-symphony' ? 'the-sanctuary' : 'the-healer';
  }
  
  // Calculate element balance variance
  const values = Object.values(balance).slice(0, 5) as number[];
  const avg = values.reduce((a, b) => a + b, 0) / 5;
  const isBalanced = values.every(v => Math.abs(v - avg) < 15);
  
  if (isBalanced) {
    return ratioProfile === 'complex-symphony' ? 'the-alchemist' : 'the-sanctuary';
  }
  
  // Ratio-aware archetype mapping
  const map: Record<string, Partial<Record<string, BlendArchetypeType>>> = {
    fire: { 
      'solar-plexus': ratioProfile === 'dominant-lead' ? 'the-ignite' : 'the-warrior', 
      'root': 'the-warrior', 
      'heart': 'the-dawn-bringer' 
    },
    water: { 
      'sacral': ratioProfile === 'balanced-duo' ? 'the-deep-dive' : 'the-healer', 
      'heart': ratioProfile === 'complex-symphony' ? 'the-sanctuary' : 'the-healer', 
      'third-eye': 'the-shadow-work' 
    },
    earth: { 
      'root': ratioProfile === 'harmonious-trio' ? 'the-forest-whisper' : 'the-groundskeeper', 
      'heart': 'the-forest-whisper' 
    },
    air: { 
      'throat': ratioProfile === 'balanced-duo' ? 'the-celestial-dance' : 'the-messenger', 
      'crown': 'the-celestial-dance', 
      'third-eye': ratioProfile === 'dominant-lead' ? 'the-ascension' : 'the-mystic' 
    },
    ether: { 
      'crown': ratioProfile === 'complex-symphony' ? 'the-celestial-dance' : 'the-ascension', 
      'third-eye': 'the-mystic' 
    }
  };
  
  return map[balance.dominant]?.[chakra] || map[balance.dominant]?.['any'] || 'the-alchemist';
}

function calculateConfidence(dna: BlendDNA, balance: ElementBalance): number {
  const oilCount = dna.oils.length;
  const elementValues = Object.values(balance).slice(0, 5) as number[];
  const maxElement = Math.max(...elementValues);
  const countScore = Math.min(oilCount * 15, 50);
  const dominanceScore = maxElement * 0.5;
  return Math.min(Math.round(countScore + dominanceScore), 100);
}

// ============================================================================
// CACHE SYSTEM
// ============================================================================

interface CacheEntry {
  revelation: BlendRevelation;
  generatedAt: number;
  accessCount: number;
}

class RevelationCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 1000;
  private ttl = 30 * 24 * 60 * 60 * 1000;

  generateKey(dna: BlendDNA): string {
    // Include oil ratios for unique identification of ratio-specific blends
    const oilComponents = dna.oils.map(o => `${o.id}:${o.ml.toFixed(1)}ml`).sort();
    const components = [
      ...oilComponents,
      dna.crystal.id,
      dna.cord.id,
      dna.carrier.type,
      dna.carrier.ratio?.toString() || 'pure',
      dna.bottleSize.toString()
    ].join('|');
    
    return createHash('sha256').update(components).digest('hex').substring(0, 16);
  }

  get(key: string): BlendRevelation | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.generatedAt > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    entry.accessCount++;
    return entry.revelation;
  }

  set(key: string, revelation: BlendRevelation): void {
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries())
        .sort((a, b) => a[1].accessCount - b[1].accessCount)[0];
      if (oldest) this.cache.delete(oldest[0]);
    }
    this.cache.set(key, { revelation, generatedAt: Date.now(), accessCount: 1 });
  }
}

export const revelationCache = new RevelationCache();

// ============================================================================
// MAIN REVELATION ENGINE
// ============================================================================

export async function revealBlend(dna: BlendDNA): Promise<BlendRevelation> {
  const cacheKey = revelationCache.generateKey(dna);
  const cached = revelationCache.get(cacheKey);
  if (cached) return cached;
  
  const analysis = analyzeBlendArchetype(dna);
  const revelation = generateRevelation(dna, analysis, cacheKey);
  revelationCache.set(cacheKey, revelation);
  
  return revelation;
}

function generateRevelation(dna: BlendDNA, analysis: ReturnType<typeof analyzeBlendArchetype>, cacheKey: string): BlendRevelation {
  const archetype = analysis.archetype;
  const { dominantChakra, dominantOil, ratioProfile } = analysis;
  
  // ENHANCED: Enrich oils with wisdom data
  const enrichedOils = dna.oils.map(enrichOilWithWisdom);
  
  // Get ratio distribution for narrative with wisdom
  const totalMl = enrichedOils.reduce((sum, o) => sum + o.ml, 0);
  const oilDistribution = enrichedOils.map(o => ({
    name: o.name,
    percentage: ((o.ml / totalMl) * 100).toFixed(1),
    ml: o.ml,
    element: o.element,
    personality: o.personality?.[0] || 'essence',
    // WISDOM-ENHANCED: Add spiritual descriptions and frequencies
    spiritualDescription: (o as any).spiritualDescription?.substring(0, 100) + '...' || '',
    frequency: (o as any).frequency,
    latinName: (o as any).latinName,
    affirmation: (o as any).affirmation,
    culturalContext: (o as any).culturalContext?.[0]
  })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
  
  // ENHANCED: Calculate frequency harmony
  const frequencyHarmony = calculateFrequencyHarmony(enrichedOils);
  
  // ENHANCED: Detect chakra bridging
  const oilChakras = enrichedOils.map(o => o.chakra);
  const chakraBridge = detectChakraBridging(oilChakras, dna.crystal.element === 'ether' ? 'crown' : 'heart');
  
  // ENHANCED: Synthesize cultural contexts
  const culturalSynthesis = synthesizeCultures(enrichedOils);
  
  // ENHANCED: Weave affirmations
  const affirmation = weaveAffirmations(enrichedOils, ratioProfile);
  
  // ENHANCED: Map tarot synergy
  const oilTarots = enrichedOils.map(o => (o as any).tarotCard).filter(Boolean);
  const tarotSynergy = mapTarotSynergy(oilTarots, dna.crystal.meaning);
  
  // ENHANCED: Generate carrier wisdom
  const carrierWisdom = dna.carrier.type !== 'pure' 
    ? generateCarrierWisdom(dna.carrier.type, dna.carrier.properties)
    : '';
  
  // ENHANCED: Wisdom-infused ratio-specific opening phrases
  const dominantWisdom = oilDistribution[0];
  const dominantFreq = dominantWisdom.frequency;
  
  const ratioOpenings: Record<typeof ratioProfile, string[]> = {
    'dominant-lead': [
      `${dominantWisdom.name} commands this blend with ${dominantWisdom.percentage}% presence${dominantFreq ? `, its ${dominantFreq.hz}Hz ${dominantFreq.note} frequency singing "${dominantWisdom.affirmation?.split('.')[0] || 'I am'}"` : ''}. A singular vision from ${dominantWisdom.culturalContext || 'ancient wisdom'}.`,
      `Led by ${dominantWisdom.latinName || dominantWisdom.name}'s ${dominantWisdom.percentage}% dominion${dominantFreq ? ` at ${dominantFreq.hz}Hz` : ''}, this blend channels ${dominantWisdom.spiritualDescription?.substring(0, 60) || 'pure essence'}...`
    ],
    'balanced-duo': [
      `${oilDistribution[0].name} (${oilDistribution[0].percentage}%) and ${oilDistribution[1]?.name || 'companion'} (${oilDistribution[1]?.percentage}%)${frequencyHarmony.chordType !== 'unknown' ? ` create a ${frequencyHarmony.chordType}` : ' dance'}—${oilDistribution[0].frequency?.note || ''}${oilDistribution[1]?.frequency ? ` meeting ${oilDistribution[1].frequency.note}` : ''}. ${culturalSynthesis || 'Two traditions converge.'}`,
      `A duet of ${oilDistribution[0].name} and ${oilDistribution[1]?.name || 'ally'} in near-equal measure—${oilDistribution[0].affirmation?.split('.')[0] || 'strength'} meets ${oilDistribution[1]?.affirmation?.split('.')[0] || 'grace'}.`
    ],
    'harmonious-trio': [
      `Three frequencies converge: ${oilDistribution.slice(0, 3).map(o => `${o.percentage}% ${o.name}${o.frequency ? ` (${o.frequency.hz}Hz)` : ''}`).join(', ')}—${frequencyHarmony.description || 'a triad of purpose'}.`,
      `${oilDistribution[0].name}, ${oilDistribution[1]?.name}, and ${oilDistribution[2]?.name}—${culturalSynthesis || 'three voices from different traditions'} unite in purpose.`
    ],
    'complex-symphony': [
      `A ${enrichedOils.length}-part symphony at ${frequencyHarmony.combinedHz}Hz combined frequency—${frequencyHarmony.description || 'complex harmonic tapestry'}. ${culturalSynthesis || 'Multiple traditions converge.'}`,
      `${enrichedOils.length} essences create a ${frequencyHarmony.chordType} chord—each drop contains: ${oilDistribution.slice(0, 3).map(o => o.name).join(', ')}, and more.`
    ]
  };
  
  // ENHANCED: Wisdom-aware archetype openings
  const dominantOilWisdom = enrichedOils.find(o => o.name === dominantOil);
  const dominantSpiritual = (dominantOilWisdom as any)?.spiritualDescription?.substring(0, 80) || '';
  
  const openings: Record<BlendArchetypeType, string[]> = {
    'the-warrior': [
      `${ratioOpenings[ratioProfile][0]} ${dominantSpiritual ? dominantSpiritual + '...' : ''} From the forge of ${analysis.elementBalance.dominant}, this blend emerges as a shield of aromatic armor.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} A rallying cry in liquid form—${affirmation ? `"${affirmation.split('.')[0]}"` : 'strength distilled'}.`
    ],
    'the-healer': [
      `${ratioOpenings[ratioProfile][0]} ${chakraBridge.description || `A gentle cascade of ${analysis.elementBalance.dominant} flows through this healing waterscape.`}`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} Like ${dominantOilWisdom?.name || 'moonlight'} used in healing since ${dominantOilWisdom?.culturalContext?.[0] || 'ancient times'}—restoration flows.`
    ],
    'the-mystic': [
      `${ratioOpenings[ratioProfile][0]} ${tarotSynergy ? `${tarotSynergy}. ` : ''}Beyond the veil, this ${frequencyHarmony.chordType} frequency blend opens hidden doorways.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} ${dominantSpiritual ? dominantSpiritual + '...' : 'A key turned in the lock of consciousness.'}`
    ],
    'the-groundskeeper': [
      `${ratioOpenings[ratioProfile][0]} Rooted deep in ${analysis.elementBalance.dominant}${culturalSynthesis ? '—' + culturalSynthesis : ''}.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} ${carrierWisdom ? carrierWisdom.split('.')[0] + '.' : 'An anchor cast into the depths of earth.'}`
    ],
    'the-messenger': [
      `${ratioOpenings[ratioProfile][0]} On wings of ${analysis.elementBalance.dominant} at ${frequencyHarmony.combinedHz}Hz—truth carried across the threshold of silence.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} ${affirmation ? 'The message: "' + affirmation.split('.')[0] + '"' : 'A breath of clarity that clears the fog.'}`
    ],
    'the-alchemist': [
      `${ratioOpenings[ratioProfile][0]} All elements in ${frequencyHarmony.chordType} harmony—${frequencyHarmony.description || 'transmutation achieved'}.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} The prima materia: ${oilDistribution.slice(0, 3).map(o => o.latinName?.split(' ')[1] || o.name).join(', ')}... refined.`
    ],
    'the-sanctuary': [
      `${ratioOpenings[ratioProfile][0]} A protected space where ${frequencyHarmony.beatFrequency > 0 ? frequencyHarmony.beatFrequency + 'Hz theta waves' : analysis.elementBalance.dominant + ' energy'} creates peace.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} ${carrierWisdom ? carrierWisdom.split('.')[0] + '.' : 'Within this sanctuary, the world fades.'}`
    ],
    'the-ignite': [
      `${ratioOpenings[ratioProfile][0]} ${frequencyHarmony.chordType === 'octave' ? 'Octave resonance doubles the fire—' : ''}This ${analysis.elementBalance.dominant} blend burns with ${dominantOilWisdom?.personality?.[0] || 'passion'}.`,
      `${ratioOpenings[ratioProfile][1] || ratioOpenings[ratioProfile][0]} From the first breath: ${affirmation ? affirmation.split('.')[0] : 'ignition'}.`
    ],
    'the-deep-dive': [
      `Into ${frequencyHarmony.beatFrequency < 10 ? 'theta-wave ' : ''}depths where ${analysis.elementBalance.dominant} holds secrets—${oilDistribution[0].name} leads at ${oilDistribution[0].percentage}%.`,
      `A current of ${frequencyHarmony.combinedHz}Hz pulls you into the profound waters of ${dominantChakra} chakra work.`
    ],
    'the-ascension': [
      `Elevating on ${frequencyHarmony.combinedHz}Hz currents toward ${dominantChakra}—${frequencyHarmony.chordType} harmony opens the way.`,
      `${chakraBridge.description || 'Each breath lifts you higher.'} ${tarotSynergy ? tarotSynergy + '.' : ''}`
    ],
    'the-forest-whisper': [
      `${culturalSynthesis || 'Ancient trees'} speak through this ${analysis.elementBalance.dominant} blend—${oilDistribution.map(o => o.name).join(', ')} echo through time.`,
      `The wisdom of ${dominantOilWisdom?.culturalContext?.[0] || 'old growth'} carried on ${frequencyHarmony.combinedHz}Hz frequency.`
    ],
    'the-celestial-dance': [
      `Stars wheel at ${frequencyHarmony.combinedHz}Hz—${frequencyHarmony.chordType} cosmic rhythm captured in liquid form.`,
      `${tarotSynergy || 'Cosmic patterns'} dance with ${analysis.elementBalance.dominant} essence.`
    ],
    'the-shadow-work': [
      `In the mirror of ${analysis.elementBalance.dominant}, ${frequencyHarmony.beatFrequency < 8 ? 'theta-wave ' : ''}frequencies illuminate what we hide.`,
      `${dominantOilWisdom?.name || 'This blend'}—used since ${dominantOilWisdom?.culturalContext?.[0] || 'ancient times'} for inner work—guides the journey.`
    ],
    'the-dawn-bringer': [
      `First light breaks at ${frequencyHarmony.combinedHz}Hz—${affirmation ? affirmation.split('.')[0] : 'new beginnings'} heralded.`,
      `${oilDistribution[0].name} leads this ${analysis.elementBalance.dominant} dawn—${culturalSynthesis || 'fresh starts encoded in aromatic form'}.`
    ],
    'the-night-keeper': [
      `Guardian of dreams at ${frequencyHarmony.combinedHz}Hz—${frequencyHarmony.beatFrequency < 6 ? 'delta-wave ' : ''}safe passage through night's realm.`,
      `${dominantOilWisdom?.name} watches over sleep as it did in ${dominantOilWisdom?.culturalContext?.[0] || 'ancient temples'}.`
    ]
  };
  
  const opening = openings[archetype][Math.floor(Math.random() * openings[archetype].length)];
  
  // ENHANCED: Generate wisdom-infused journey narrative
  const sortedOils = [...oilDistribution];
  const dominant = sortedOils[0];
  const supporting = sortedOils.slice(1);
  
  let journey: string;
  if (sortedOils.length === 1) {
    const freq = dominant.frequency;
    journey = `${dominant.name} (${dominant.latinName?.split(' ').slice(1).join(' ') || ''}) stands in ${dominant.percentage}% concentration${freq ? ` at ${freq.hz}Hz ${freq.note}` : ''}—${dominant.spiritualDescription?.substring(0, 60) || 'a pure monolith of ' + dominant.element + ' essence'}...`;
  } else if (sortedOils.length === 2) {
    const ratio = parseFloat(dominant.percentage) / parseFloat(supporting[0]?.percentage || '1');
    const domFreq = dominant.frequency;
    const supFreq = supporting[0]?.frequency;
    
    if (ratio > 2) {
      journey = `${dominant.name}${domFreq ? ` (${domFreq.hz}Hz)` : ''} dominates at ${dominant.percentage}%, its "${dominant.affirmation?.split('.')[0] || dominant.personality}" nature commanding. ${supporting[0]?.percentage}% ${supporting[0]?.name}${supFreq ? ` (${supFreq.hz}Hz)` : ''} provides ${frequencyHarmony.description || 'subtle undertone'}.`;
    } else {
      journey = `${dominant.percentage}% ${dominant.name}${domFreq ? ` ${domFreq.note}` : ''} and ${supporting[0]?.percentage}% ${supporting[0]?.name}${supFreq ? ` ${supFreq.note}` : ''}—${frequencyHarmony.chordType !== 'unknown' ? frequencyHarmony.chordType + ' harmony' : 'their ' + dominant.element + ' and ' + supporting[0]?.element + ' natures in dialogue'}. ${culturalSynthesis || ''}`;
    }
  } else {
    const distributionDesc = supporting.slice(0, 2).map(o => `${o.percentage}% ${o.name}${o.frequency ? ` (${o.frequency.hz}Hz)` : ''}`).join(' and ');
    const freqDesc = frequencyHarmony.chordType !== 'unknown' ? frequencyHarmony.description : 'intentional ratios';
    journey = `${dominant.name} anchors at ${dominant.percentage}%${dominant.frequency ? ` (${dominant.frequency.hz}Hz)` : ''}—"${dominant.affirmation?.split('.')[0] || dominant.personality}"—while ${distributionDesc} contribute to a ${freqDesc}.`;
  }
  
  // ENHANCED: Add ratio-specific modifier with wisdom
  const ratioModifiers: Record<typeof ratioProfile, string> = {
    'dominant-lead': ` ${dominant.culturalContext ? 'From ' + dominant.culturalContext + ', ' : ''}the ${dominant.percentage}% ${dominant.name} signature shapes every aspect. ${carrierWisdom ? carrierWisdom.split('.')[1] || '' : ''}`,
    'balanced-duo': ` ${frequencyHarmony.beatFrequency > 0 ? frequencyHarmony.beatFrequency + 'Hz differential creates entrainment. ' : ''}Neither overshadows—${supporting[0]?.affirmation ? '"' + supporting[0].affirmation.split('.')[0] + '" supports "' + dominant.affirmation?.split('.')[0] + '"' : 'they achieve together what neither could alone'}.`,
    'harmonious-trio': ` Three frequencies${frequencyHarmony.combinedHz ? ` combining to ${frequencyHarmony.combinedHz}Hz` : ''} create stability through diversity. ${chakraBridge.description || ''}`,
    'complex-symphony': ` ${sortedOils.length} distinct frequencies${frequencyHarmony.beatFrequency < 10 ? ' in theta-range entrainment' : ''} defy simple categorization. ${culturalSynthesis || ''}`
  };
  journey += ratioModifiers[ratioProfile];
  
  const transformations: Record<BlendArchetypeType, string> = {
    'the-warrior': 'Awakens inner strength, fortifies boundaries, and ignites the will to act with courage.',
    'the-healer': 'Opens the heart to receive care, soothes emotional wounds, and restores wellbeing.',
    'the-mystic': 'Expands perception beyond the veil, enhances intuition, and opens channels of higher knowing.',
    'the-groundskeeper': 'Roots scattered energy into present moment, establishes stability, and connects to earth support.',
    'the-messenger': 'Clears the throat of inhibition, empowers authentic expression, and bridges truth with voice.',
    'the-alchemist': 'Transmutes leaden states into golden awareness, balances all polarities, and catalyzes profound change.',
    'the-sanctuary': 'Creates sacred space within and without, establishes peace as the default state.',
    'the-ignite': 'Sparks creative fire, fuels passion projects, and lights the way through stagnation.',
    'the-deep-dive': 'Supports journey into subconscious depths, facilitates shadow integration.',
    'the-ascension': 'Elevates frequency, expands consciousness, and opens crown connection.',
    'the-forest-whisper': 'Rekindles primal connection to nature, brings ancient wisdom into modern context.',
    'the-celestial-dance': 'Aligns personal rhythm with cosmic cycles, opens to stellar downloads.',
    'the-shadow-work': 'Illuminates hidden aspects, supports courage to face the dark.',
    'the-dawn-bringer': 'Heralds fresh starts, clears residue of past chapters.',
    'the-night-keeper': 'Guards the threshold of dreams, deepens restorative rest.'
  };
  
  const transformation = transformations[archetype];
  
  // ENHANCED: Crystal harmony with chakra bridging and frequency
  const crystalRole = dna.crystal.property === 'amplifying' ? 'an amplifier' : 
                      dna.crystal.property === 'grounding' ? 'an anchor' : 
                      dna.crystal.property === 'cleansing' ? 'a purifier' : 'a guardian';
  
  const crystalHarmony = chakraBridge.bridge ? 
    `${dna.crystal.name}—${crystalRole}—bridges ${chakraBridge.bridge} with its ${dna.crystal.meaning.toLowerCase()}. The crystal's ${dna.crystal.element} element resonates at ${frequencyHarmony.combinedHz}Hz combined frequency.` :
    `${dna.crystal.name} enters as ${crystalRole}, its ${dna.crystal.meaning.toLowerCase()} resonating with the ${archetype.replace(/-/g, ' ')} nature${frequencyHarmony.beatFrequency > 0 ? ` and ${frequencyHarmony.beatFrequency}Hz beat frequency` : ''}.`;
  
  const cordNarratives: Record<string, string> = {
    'silk': `The ${dna.cord.name} adds a thread of ${dna.cord.energeticQuality} grace, its smooth passage a reminder that transformation can be elegant.`,
    'cotton': `Woven from ${dna.cord.name}, this natural fiber grounds the blend in earthy authenticity.`,
    'hemp': `The ${dna.cord.name} brings sturdy ${dna.cord.energeticQuality} energy, anchoring the ethereal to the practical.`,
    'leather': `${dna.cord.name} encircles the vessel with ${dna.cord.energeticQuality} strength, protecting the precious contents.`,
    'waxed-cord': `The ${dna.cord.name} seals the blend with ${dna.cord.energeticQuality} intention.`
  };
  const cordConnection = cordNarratives[dna.cord.material] || `${dna.cord.name} completes the vessel.`;
  
  const essences: Record<BlendArchetypeType, string[]> = {
    'the-warrior': ['Strength forged in aromatic fire', 'Courage distilled into form'],
    'the-healer': ['Gentle medicine for tender hearts', 'The soft power of restoration'],
    'the-mystic': ['Wisdom from beyond the veil', 'Secrets whispered by stars'],
    'the-groundskeeper': ['Roots that hold through all storms', 'The steady heartbeat of earth'],
    'the-messenger': ['Truth carried on aromatic wind', 'Voice freed from silence'],
    'the-alchemist': ['All elements in golden balance', 'The transformation of self'],
    'the-sanctuary': ['A portable peace, always near', 'Sacred space you carry with you'],
    'the-ignite': ['Spark that starts revolutions', 'Passion made tangible'],
    'the-deep-dive': ['Depths that reveal treasures', 'Courage to explore within'],
    'the-ascension': ['Elevation in every breath', 'Rising toward your highest self'],
    'the-forest-whisper': ['Ancient wisdom, modern vessel', 'The wild remembers you'],
    'the-celestial-dance': ['Stardust suspended in oil', 'Cosmic rhythm in liquid form'],
    'the-shadow-work': ['Light that illuminates darkness', 'Integration of all selves'],
    'the-dawn-bringer': ['New beginnings in every drop', 'The promise of fresh starts'],
    'the-night-keeper': ['Guardian of dream realms', 'Safe passage through dark']
  };
  
  const poeticEssence = essences[archetype][Math.floor(Math.random() * essences[archetype].length)];
  
  const usageIntents: Record<BlendArchetypeType, string[]> = {
    'the-warrior': ['Before challenging conversations', 'When setting boundaries', 'During workouts'],
    'the-healer': ['During self-care rituals', 'When processing emotions', 'For heart-centered meditation'],
    'the-mystic': ['Before divination', 'For third-eye meditation', 'When seeking guidance'],
    'the-groundskeeper': ['When feeling scattered', 'Before important decisions', 'For root chakra work'],
    'the-messenger': ['Before speaking your truth', 'For throat chakra work', 'When writing'],
    'the-alchemist': ['During major transitions', 'For full chakra balancing', 'When transforming habits'],
    'the-sanctuary': ['Before sleep', 'When anxious', 'For creating sacred space'],
    'the-ignite': ['When starting projects', 'For creative sessions', 'When feeling stuck'],
    'the-deep-dive': ['During shadow work', 'For introspection', 'When processing trauma'],
    'the-ascension': ['For crown chakra work', 'During meditation', 'When seeking clarity'],
    'the-forest-whisper': ['When missing nature', 'For grounding', 'When feeling disconnected'],
    'the-celestial-dance': ['For moon rituals', 'When aligning with cycles', 'For cosmic connection'],
    'the-shadow-work': ['When facing fears', 'For integration work', 'When accepting all parts of self'],
    'the-dawn-bringer': ['For morning rituals', 'When starting anew', 'After endings'],
    'the-night-keeper': ['Before sleep', 'For dream work', 'When processing the day']
  };
  
  const timingMap: Record<BlendArchetypeType, { time: BlendRevelation['timeOfDay']; moon: BlendRevelation['moonPhase']; season: BlendRevelation['seasonalResonance'] }> = {
    'the-warrior': { time: 'morning', moon: 'waxing', season: 'summer' },
    'the-healer': { time: 'any', moon: 'any', season: 'any' },
    'the-mystic': { time: 'night', moon: 'full', season: 'winter' },
    'the-groundskeeper': { time: 'any', moon: 'any', season: 'autumn' },
    'the-messenger': { time: 'morning', moon: 'any', season: 'spring' },
    'the-alchemist': { time: 'any', moon: 'any', season: 'any' },
    'the-sanctuary': { time: 'night', moon: 'any', season: 'any' },
    'the-ignite': { time: 'morning', moon: 'waxing', season: 'summer' },
    'the-deep-dive': { time: 'night', moon: 'waning', season: 'winter' },
    'the-ascension': { time: 'dawn', moon: 'full', season: 'any' },
    'the-forest-whisper': { time: 'any', moon: 'any', season: 'spring' },
    'the-celestial-dance': { time: 'night', moon: 'full', season: 'any' },
    'the-shadow-work': { time: 'night', moon: 'new', season: 'winter' },
    'the-dawn-bringer': { time: 'dawn', moon: 'new', season: 'spring' },
    'the-night-keeper': { time: 'night', moon: 'any', season: 'any' }
  };
  
  const timing = timingMap[archetype] || { time: 'any', moon: 'any', season: 'any' };
  
  const oilVibes = dna.oils.reduce((sum, oil) => sum + (oil.intensity * 10), 0);
  const crystalVibe = dna.crystal.vibration || 100;
  const vibration = Math.round((oilVibes + crystalVibe) / (dna.oils.length + 1));
  
  const archetypeNames: Record<BlendArchetypeType, string[]> = {
    'the-warrior': ['Iron', 'Flame', 'Guardian', 'Shield'],
    'the-healer': ['Soothe', 'Restore', 'Heart', 'Bloom'],
    'the-mystic': ['Oracle', 'Veil', 'Third', 'Mist'],
    'the-groundskeeper': ['Root', 'Earth', 'Forest', 'Stone'],
    'the-messenger': ['Wing', 'Voice', 'Sky', 'Truth'],
    'the-alchemist': ['Gold', 'Transmute', 'Merge', 'Unity'],
    'the-sanctuary': ['Haven', 'Peace', 'Sanctuary', 'Nest'],
    'the-ignite': ['Spark', 'Blaze', 'Rise', 'Ember'],
    'the-deep-dive': ['Abyss', 'Pearl', 'Depth', 'Flow'],
    'the-ascension': ['Crown', 'Lift', 'Clarity', 'Above'],
    'the-forest-whisper': ['Moss', 'Canopy', 'Pine', 'Glade'],
    'the-celestial-dance': ['Star', 'Orbit', 'Nebula', 'Cosmos'],
    'the-shadow-work': ['Mirror', 'Depth', 'Void', 'Transform'],
    'the-dawn-bringer': ['Aurora', 'Awaken', 'Morning', 'Rise'],
    'the-night-keeper': ['Luna', 'Dream', 'Midnight', 'Rest']
  };
  
  const suffixes = ['Essence', 'Blend', 'Synergy', 'Alchemy', 'Resonance', 'Harmony'];
  const prefix = archetypeNames[archetype][Math.floor(Math.random() * archetypeNames[archetype].length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const blendName = `${prefix} ${suffix}`;
  
  return {
    id: cacheKey,
    blendName,
    archetype,
    vibration,
    elements: analysis.elementBalance,
    narrative: { opening, journey, transformation, crystalHarmony, cordConnection },
    poeticEssence,
    usageIntent: usageIntents[archetype],
    chakras: [dominantChakra, ...dna.oils.map(o => o.chakra).filter((c, i, a) => a.indexOf(c) === i)],
    timeOfDay: timing.time,
    moonPhase: timing.moon,
    seasonalResonance: timing.season,
    generatedAt: new Date().toISOString(),
    cacheKey,
    // ENHANCED: Wisdom-derived additions
    frequencyHarmony,
    affirmation,
    culturalSynthesis,
    tarotSynergy,
    carrierWisdom: carrierWisdom || undefined
  };
}

export const BlendRevelationEngine = {
  revealBlend,
  analyzeBlendArchetype,
  revelationCache
};

export default BlendRevelationEngine;
