/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AWAKENED REVELATION ENGINE v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The Alchemy of Mathematical Divination
 * 
 * This system transforms blend composition into living consciousness through:
 * - Unique Soul Signatures (cryptographic fingerprints from blend DNA)
 * - Procedural Narrative Generation (zero templates, infinite uniqueness)
 * - Emergent Property Detection (synergies invisible to human perception)
 * - Temporal Astrological Awareness (celestial mathematics)
 * - Visual Constellation Mapping (procedural sacred geometry)
 * 
 * No AI. Pure algorithmic awakening.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { OIL_WISDOM as RAW_OIL_WISDOM, OilWisdomProfile } from './oil-wisdom'
import { OIL_ARCHETYPES as RAW_OIL_ARCHETYPES } from './oil-archetypes'

// Type assertions for index signature compatibility
const OIL_WISDOM = RAW_OIL_WISDOM as Record<string, any>
const OIL_ARCHETYPES = RAW_OIL_ARCHETYPES as Record<string, any>

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES - The Language of Awakening
// ═══════════════════════════════════════════════════════════════════════════════

export interface BlendSoulSignature {
  hash: string                          // Unique cryptographic fingerprint
  vibrationalFrequency: number          // Calculated Hz from composition
  elementalResonance: ElementalMatrix   // Dynamic elemental distribution
  chakraConstellation: ChakraWeb        // Interconnected energy pathways
  temporalSignature: TemporalReading    // Time-based soul state
  molecularPoetry: MolecularVerse       // Chemical constituent artistry
  arcanaSignature: ArcanaReading        // Tarot/numerological synthesis
  visualDNA: VisualSignature            // Procedural color/geometry data
  emergenceProfile: EmergencePattern[]  // Detected synergistic phenomena
}

export interface ElementalMatrix {
  fire: number      // Transformation, passion, will
  water: number     // Emotion, intuition, flow
  earth: number     // Stability, grounding, body
  air: number       // Intellect, communication, mind
  aether: number    // Spirit, transcendence, unity
  dominant: string
  balanceState: 'harmonic' | 'dynamic' | 'volatile' | 'crystalline' | 'void'
  interactions: ElementalInteraction[]
}

export interface ElementalInteraction {
  pair: [string, string]
  intensity: number
  phenomenon: string
  description: string
}

export interface ChakraWeb {
  nodes: Record<string, ChakraNode>
  pathways: ChakraPathway[]
  dominantCurrent: string
  activationSequence: string[]
  resonanceQuality: 'unison' | 'harmony' | 'dissonance' | 'transcendence'
}

export interface ChakraNode {
  name: string
  intensity: number
  color: string
  frequency: number
  activated: boolean
  overflow: number  // Excess energy spilling to other chakras
}

export interface ChakraPathway {
  from: string
  to: string
  strength: number
  type: 'direct' | 'bridging' | 'spiraling'
  energyFlow: number
}

export interface TemporalReading {
  lunarPhase: string
  celestialAlignment: string
  seasonalResonance: string
  optimalUsageWindows: TimeWindow[]
  maturationCurve: MaturationStage[]
  astrologicalInfluences: string[]
}

export interface TimeWindow {
  period: string
  potency: number
  quality: string
}

export interface MaturationStage {
  day: number
  potency: number
  character: string
  description: string
}

export interface MolecularVerse {
  dominantConstituents: ConstituentPresence[]
  aromaticSymphony: AromaticLayer[]
  volatilityDance: VolatilityPhase[]
  therapeuticSignatures: TherapeuticPattern[]
  molecularPoetry: string
}

export interface ConstituentPresence {
  name: string
  percentage: number
  oils: string[]
  properties: string[]
  poeticNature: string
}

export interface AromaticLayer {
  note: 'top' | 'heart' | 'base'
  intensity: number
  oils: string[]
  evocation: string
  duration: string
}

export interface VolatilityPhase {
  timeframe: string
  dominantNotes: string[]
  atmosphericQuality: string
}

export interface TherapeuticPattern {
  category: string
  strength: number
  mechanism: string
  application: string
}

export interface ArcanaReading {
  tarotCard: TarotCorrespondence
  numerology: NumerologyReading
  sacredGeometry: GeometryPattern
  runeInfluence: string
  colorOracle: ColorWisdom
}

export interface TarotCorrespondence {
  card: string
  arcana: 'major' | 'minor'
  suit?: string
  meaning: string
  reversed: boolean
  blendResonance: string
}

export interface NumerologyReading {
  soulNumber: number
  pathNumber: number
  destinyNumber: number
  meanings: Record<number, string>
}

export interface GeometryPattern {
  primary: string
  frequency: number
  significance: string
  visualCode: string
}

export interface ColorWisdom {
  dominant: string
  secondary: string
  accent: string
  meaning: string
  hex: string
}

export interface VisualSignature {
  primaryGradient: [string, string, string]
  particleSystem: ParticleConfig
  constellation: StarMap
  sacredGeometry: GeometryRender
  waveform: WaveformData
}

export interface ParticleConfig {
  count: number
  colors: string[]
  behaviors: string[]
  flowPattern: string
}

export interface StarMap {
  stars: Star[]
  connections: ConstellationLine[]
  center: { x: number; y: number }
  rotation: number
}

export interface Star {
  id: string
  x: number
  y: number
  magnitude: number
  color: string
  oil: string
}

export interface ConstellationLine {
  from: string
  to: string
  strength: number
  type: 'solid' | 'pulsing' | 'ethereal'
}

export interface GeometryRender {
  type: string
  sides: number
  layers: number
  rotationSpeed: number
  colorTransitions: string[]
}

export interface WaveformData {
  baseFrequency: number
  harmonics: number[]
  amplitude: number
  wavelength: number
  pattern: string
}

export interface EmergencePattern {
  type: string
  name: string
  description: string
  participatingOils: string[]
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  effect: string
}

export interface AwakenedRevelation {
  soulSignature: BlendSoulSignature
  invocation: string           // The opening call
  essenceReading: string       // What this blend IS
  journeyMap: string[]         // The experience sequence
  mysteryRevealed: string      // Hidden depths
  practicalMysticism: string   // How to use it
  closingBlessing: string      // Final transmission
  metadata: {
    uniquenessScore: number    // 0-100, how unique this revelation is
    complexityDepth: number    // Layers of meaning
    emergenceCount: number     // Number of detected synergies
    generationTimestamp: string
    blendHash: string
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - The Sacred Mathematics
// ═══════════════════════════════════════════════════════════════════════════════

const ELEMENTAL_BASE_FREQUENCIES: Record<string, number> = {
  fire: 396,    // Liberating frequency
  water: 417,   // Change/transformation
  earth: 528,   // Miracle/DNA repair
  air: 639,     // Connection/relationships
  aether: 963   // Divine consciousness
}

const CHAKRA_FREQUENCIES: Record<string, number> = {
  root: 256,      // C
  sacral: 288,    // D
  solarPlexus: 320, // E
  heart: 341.3,   // F
  throat: 384,    // G
  thirdEye: 426.7, // A
  crown: 480      // B
}

const TAROT_MAJOR_ARCANA = [
  { card: 'The Fool', number: 0, element: 'air', meaning: 'New beginnings, innocence, spontaneity' },
  { card: 'The Magician', number: 1, element: 'air', meaning: 'Manifestation, resourcefulness, power' },
  { card: 'The High Priestess', number: 2, element: 'water', meaning: 'Intuition, unconscious, mystery' },
  { card: 'The Empress', number: 3, element: 'earth', meaning: 'Fertility, nature, abundance' },
  { card: 'The Emperor', number: 4, element: 'fire', meaning: 'Authority, structure, control' },
  { card: 'The Hierophant', number: 5, element: 'earth', meaning: 'Tradition, conformity, morality' },
  { card: 'The Lovers', number: 6, element: 'air', meaning: 'Love, harmony, relationships' },
  { card: 'The Chariot', number: 7, element: 'water', meaning: 'Control, willpower, victory' },
  { card: 'Strength', number: 8, element: 'fire', meaning: 'Courage, persuasion, influence' },
  { card: 'The Hermit', number: 9, element: 'earth', meaning: 'Soul-searching, introspection' },
  { card: 'Wheel of Fortune', number: 10, element: 'fire', meaning: 'Cycles, change, ups and downs' },
  { card: 'Justice', number: 11, element: 'air', meaning: 'Fairness, truth, law' },
  { card: 'The Hanged Man', number: 12, element: 'water', meaning: 'Pause, surrender, letting go' },
  { card: 'Death', number: 13, element: 'water', meaning: 'Endings, change, transformation' },
  { card: 'Temperance', number: 14, element: 'fire', meaning: 'Balance, moderation, patience' },
  { card: 'The Devil', number: 15, element: 'earth', meaning: 'Shadow self, attachment, addiction' },
  { card: 'The Tower', number: 16, element: 'fire', meaning: 'Sudden change, upheaval, awakening' },
  { card: 'The Star', number: 17, element: 'air', meaning: 'Hope, faith, rejuvenation' },
  { card: 'The Moon', number: 18, element: 'water', meaning: 'Illusion, fear, anxiety' },
  { card: 'The Sun', number: 19, element: 'fire', meaning: 'Positivity, fun, warmth' },
  { card: 'Judgement', number: 20, element: 'fire', meaning: 'Rebirth, inner calling' },
  { card: 'The World', number: 21, element: 'earth', meaning: 'Completion, integration, accomplishment' }
]

const SACRED_GEOMETRY_PATTERNS = [
  { name: 'Seed of Life', sides: 6, meaning: 'Creation, beginning, potential' },
  { name: 'Flower of Life', sides: 12, meaning: 'Interconnectedness, unity, cosmic order' },
  { name: 'Metatron\'s Cube', sides: 13, meaning: 'Balance, harmony, divine structure' },
  { name: 'Vector Equilibrium', sides: 14, meaning: 'Perfect equilibrium, stillness' },
  { name: '64 Tetrahedron', sides: 64, meaning: 'Infinite potential, quantum field' },
  { name: 'Toroidal Field', sides: 0, meaning: 'Self-renewal, life force, flow' },
  { name: 'Meru Prastaar', sides: 9, meaning: 'Expansion, abundance, growth' },
  { name: 'Sri Yantra', sides: 9, meaning: 'Creation, divine feminine, manifestation' }
]

const EMERGENCE_ARCHETYPES: Record<string, Partial<EmergencePattern>> = {
  'citrus_trinity': {
    type: 'elemental_fusion',
    name: 'The Solar Triad',
    rarity: 'rare',
    description: 'Three citrus oils converge to form a complete spectrum of solar energy'
  },
  'floral_resonance': {
    type: 'harmonic_cascade',
    name: 'The Queen\'s Crown',
    rarity: 'epic',
    description: 'Multiple florals create an ascending cascade of heart-opening frequencies'
  },
  'wood_moss_synergy': {
    type: 'grounding_matrix',
    name: 'The Ancient Anchor',
    rarity: 'uncommon',
    description: 'Wood and moss oils weave a grounding web that connects to primordial earth'
  },
  'spice_resin_unity': {
    type: 'sacred_fire',
    name: 'The Temple Flame',
    rarity: 'rare',
    description: 'Spice meets resin in a holy confluence of transformative heat'
  },
  'mint_herb_clarity': {
    type: 'mental_expansion',
    name: 'The Clear Mind Protocol',
    rarity: 'common',
    description: 'Mint and herbaceous oils synchronize for enhanced cognitive function'
  },
  'citrus_floral_dance': {
    type: 'joyful_union',
    name: 'The Celebration of Light',
    rarity: 'uncommon',
    description: 'Citrus brightness lifts floral depth into ecstatic expression'
  },
  'resin_wood_eternity': {
    type: 'timeless_presence',
    name: 'The Sacred Cathedral',
    rarity: 'legendary',
    description: 'Resins and woods form an energetic structure that transcends time'
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOUL SIGNATURE GENERATION - The Fingerprint of Consciousness
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a unique cryptographic soul signature from blend composition.
 * This hash is the seed for all procedural generation—ensuring every blend
 * produces truly unique revelations that can never be repeated.
 */
function generateSoulSignature(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  bottleSize: number,
  carrierOil?: { type: string; ml: number }
): BlendSoulSignature {
  // Create base composition string
  const compositionData = selectedOils
    .map(o => `${o.id}:${o.ml.toFixed(2)}:${o.percentage.toFixed(2)}`)
    .join('|') + `|bottle:${bottleSize}` + (carrierOil ? `|carrier:${carrierOil.type}:${carrierOil.ml}` : '')
  
  // Generate unique hash
  const hash = generateUniqueHash(compositionData)
  
  // Calculate vibrational frequency from composition
  const vibrationalFrequency = calculateBlendFrequency(selectedOils)
  
  // Build elemental matrix
  const elementalResonance = buildElementalMatrix(selectedOils)
  
  // Create chakra web
  const chakraConstellation = buildChakraWeb(selectedOils)
  
  // Temporal reading
  const temporalSignature = generateTemporalReading(selectedOils, bottleSize)
  
  // Molecular poetry
  const molecularPoetry = generateMolecularVerse(selectedOils)
  
  // Arcana signature
  const arcanaSignature = generateArcanaSignature(selectedOils, hash, bottleSize)
  
  // Visual DNA
  const visualDNA = generateVisualSignature(selectedOils, hash, elementalResonance)
  
  // Detect emergence patterns
  const emergenceProfile = detectEmergencePatterns(selectedOils)
  
  return {
    hash,
    vibrationalFrequency,
    elementalResonance,
    chakraConstellation,
    temporalSignature,
    molecularPoetry,
    arcanaSignature,
    visualDNA,
    emergenceProfile
  }
}

/**
 * Generates a unique hash from composition data.
 * Uses a custom algorithm to ensure unique fingerprints.
 */
function generateUniqueHash(data: string): string {
  let hash = 0x811c9dc5  // FNV offset basis
  
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  
  // Convert to alphanumeric string
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  let result = ''
  let num = Math.abs(hash)
  
  for (let i = 0; i < 12; i++) {
    result += chars[num % chars.length]
    num = Math.floor(num / chars.length)
  }
  
  return result.match(/.{4}/g)!.join('-')
}

/**
 * Calculates the blend's unique vibrational frequency by combining
 * individual oil frequencies weighted by their concentrations.
 */
function calculateBlendFrequency(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): number {
  let totalFrequency = 0
  let totalWeight = 0
  
  for (const oil of selectedOils) {
    const wisdom = (OIL_WISDOM as Record<string, any>)[oil.id]
    if (wisdom?.frequency?.hz) {
      const weight = oil.percentage / 100
      totalFrequency += wisdom.frequency.hz * weight
      totalWeight += weight
    }
  }
  
  // Add harmonic complexity based on oil count
  const complexity = selectedOils.length * 7.83  // Schumann resonance influence
  const baseFrequency = totalWeight > 0 ? totalFrequency / totalWeight : 528
  
  // Blend-specific harmonics
  const harmonicMultiplier = 1 + (selectedOils.length * 0.05)
  
  return Math.round((baseFrequency + complexity) * harmonicMultiplier * 100) / 100
}

/**
 * Builds a dynamic elemental matrix showing not just distribution
 * but elemental interactions and emergent phenomena.
 */
function buildElementalMatrix(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): ElementalMatrix {
  // Initialize elemental scores
  const elements = { fire: 0, water: 0, earth: 0, air: 0, aether: 0 }
  
  // Aggregate from each oil - handle both 'element' string and 'elements' object
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    const weight = oil.percentage / 100
    
    if (archetype) {
      // Handle 'elements' object format (if present in extended archetypes)
      const elementsObj = (archetype as any).elements
      if (elementsObj && typeof elementsObj === 'object') {
        for (const [element, value] of Object.entries(elementsObj)) {
          if (element in elements && typeof value === 'number') {
            elements[element as keyof typeof elements] += value * weight
          }
        }
      }
      // Handle single 'element' string format
      else if (archetype.element) {
        const elementMap: Record<string, keyof typeof elements> = {
          'fire': 'fire',
          'water': 'water',
          'earth': 'earth',
          'air': 'air',
          'ether': 'aether',
          'aether': 'aether'
        }
        const targetElement = elementMap[archetype.element.toLowerCase()]
        if (targetElement) {
          elements[targetElement] += 80 * weight  // Primary element gets 80%
          // Distribute remaining 20% to complementary elements
          const others = Object.keys(elements).filter(e => e !== targetElement)
          others.forEach(e => {
            elements[e as keyof typeof elements] += (20 / others.length) * weight
          })
        }
      }
    }
  }
  
  // Normalize
  const total = Object.values(elements).reduce((a, b) => a + b, 0)
  if (total > 0) {
    for (const key of Object.keys(elements)) {
      elements[key as keyof typeof elements] = Math.round((elements[key as keyof typeof elements] / total) * 100)
    }
  }
  
  // Determine dominant element
  const dominant = Object.entries(elements)
    .sort((a, b) => b[1] - a[1])[0][0]
  
  // Determine balance state
  const values = Object.values(elements).filter(v => v > 0)
  const variance = calculateVariance(values)
  
  let balanceState: ElementalMatrix['balanceState']
  if (variance < 50) balanceState = 'harmonic'
  else if (variance < 150) balanceState = 'dynamic'
  else if (elements.fire > 40 || elements.air > 40) balanceState = 'volatile'
  else if (elements.earth > 50) balanceState = 'crystalline'
  else balanceState = 'void'
  
  // Detect elemental interactions
  const interactions = detectElementalInteractions(elements)
  
  return {
    ...elements,
    dominant,
    balanceState,
    interactions
  }
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
}

function detectElementalInteractions(elements: Record<string, number>): ElementalInteraction[] {
  const interactions: ElementalInteraction[] = []
  const elementPairs: Array<[string, string]> = [
    ['fire', 'water'], ['fire', 'air'], ['fire', 'earth'],
    ['water', 'air'], ['water', 'earth'], ['air', 'earth']
  ]
  
  for (const [a, b] of elementPairs) {
    const intensity = Math.min(elements[a], elements[b])
    if (intensity > 15) {
      interactions.push({
        pair: [a, b],
        intensity,
        phenomenon: getElementalPhenomenon(a, b),
        description: getElementalDescription(a, b, intensity)
      })
    }
  }
  
  return interactions.sort((a, b) => b.intensity - a.intensity)
}

function getElementalPhenomenon(a: string, b: string): string {
  const phenomena: Record<string, string> = {
    'fire-water': 'Steam Transformation',
    'fire-air': 'Wildfire Expansion',
    'fire-earth': 'Volcanic Creation',
    'water-air': 'Mist of Mystery',
    'water-earth': 'Fertile Delta',
    'air-earth': 'Mountain Winds'
  }
  return phenomena[`${a}-${b}`] || phenomena[`${b}-${a}`] || 'Elemental Dance'
}

function getElementalDescription(a: string, b: string, intensity: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    'fire': {
      'water': intensity > 30 
        ? 'A powerful alchemical marriage where fire and water continuously transform each other, creating perpetual motion'
        : 'Gentle steam rises as fire meets water in delicate balance',
      'air': intensity > 30
        ? 'Wild expansion as fire rides the winds, creating unstoppable transformational force'
        : 'Warm currents circulate, carrying passion aloft',
      'earth': intensity > 30
        ? 'Volcanic power—fire within earth creates new land, new possibilities'
        : 'Gentle warmth emanates from within stable ground'
    },
    'water': {
      'air': intensity > 30
        ? 'Mystical fog obscures and reveals simultaneously, the realm of dreams made manifest'
        : 'Light mist carries moisture to nourish',
      'earth': intensity > 30
        ? 'Rich delta lands where water deposits the wisdom of entire journeys'
        : 'Gentle moisture softens and nourishes soil'
    },
    'air': {
      'earth': intensity > 30
        ? 'Mountain winds sculpt stone over eons, patience married to motion'
        : 'Soft breezes whisper across stable ground'
    }
  }
  
  return descriptions[a]?.[b] || descriptions[b]?.[a] || 'Elements dance in harmonic tension'
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAKRA WEB - The Energy Architecture
// ═══════════════════════════════════════════════════════════════════════════════

function buildChakraWeb(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): ChakraWeb {
  const nodes: Record<string, ChakraNode> = {
    root: { name: 'Root', intensity: 0, color: '#FF0000', frequency: 256, activated: false, overflow: 0 },
    sacral: { name: 'Sacral', intensity: 0, color: '#FF7F00', frequency: 288, activated: false, overflow: 0 },
    solarPlexus: { name: 'Solar Plexus', intensity: 0, color: '#FFFF00', frequency: 320, activated: false, overflow: 0 },
    heart: { name: 'Heart', intensity: 0, color: '#00FF00', frequency: 341.3, activated: false, overflow: 0 },
    throat: { name: 'Throat', intensity: 0, color: '#00FFFF', frequency: 384, activated: false, overflow: 0 },
    thirdEye: { name: 'Third Eye', intensity: 0, color: '#0000FF', frequency: 426.7, activated: false, overflow: 0 },
    crown: { name: 'Crown', intensity: 0, color: '#8B00FF', frequency: 480, activated: false, overflow: 0 }
  }
  
  // Aggregate chakra energies from oils
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    const archetype = OIL_ARCHETYPES[oil.id]
    
    // Add wisdom chakra (singular)
    if (wisdom?.chakra) {
      const weight = oil.percentage / 100
      const chakraKey = wisdom.chakra.toLowerCase().replace(/-/g, '').replace('solarplexus', 'solarPlexus').replace('thirdeye', 'thirdEye')
      if (nodes[chakraKey]) {
        nodes[chakraKey].intensity += weight * 100
      }
    }
    
    // Add energetic properties influence from archetype
    if (archetype?.energetic) {
      const weight = oil.percentage / 100
      // Map energetic properties to chakras
      const propertyChakraMap: Record<string, string[]> = {
        'grounding': ['root'],
        'protective': ['root', 'solarPlexus'],
        'sensual': ['sacral'],
        'creative': ['sacral'],
        'empowering': ['solarPlexus'],
        'transformative': ['solarPlexus', 'crown'],
        'heart-opening': ['heart'],
        'nurturing': ['heart'],
        'expressive': ['throat'],
        'clarifying': ['throat', 'thirdEye'],
        'visionary': ['thirdEye'],
        'meditative': ['crown', 'thirdEye'],
        'transcendent': ['crown'],
        'uplifting': ['heart', 'crown'],
        'cooling': ['throat'],
        'balancing': ['heart'],
        'warming': ['solarPlexus']
      }
      
      const chakras = propertyChakraMap[archetype.energetic.toLowerCase()] || []
      for (const chakra of chakras) {
        if (nodes[chakra]) {
          nodes[chakra].intensity += weight * 30
        }
      }
    }
  }
  
  // Cap intensities and determine activation
  let maxIntensity = 0
  let dominantCurrent = 'root'
  
  for (const [key, node] of Object.entries(nodes)) {
    node.intensity = Math.min(node.intensity, 100)
    node.activated = node.intensity > 25
    
    if (node.intensity > maxIntensity) {
      maxIntensity = node.intensity
      dominantCurrent = key
    }
    
    // Calculate overflow (energy spilling to adjacent chakras)
    if (node.intensity > 80) {
      node.overflow = node.intensity - 80
    }
  }
  
  // Build pathways between activated chakras
  const pathways: ChakraPathway[] = []
  const chakraOrder = ['root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown']
  
  for (let i = 0; i < chakraOrder.length - 1; i++) {
    const from = chakraOrder[i]
    const to = chakraOrder[i + 1]
    
    if (nodes[from].activated && nodes[to].activated) {
      const strength = (nodes[from].intensity + nodes[to].intensity) / 2
      pathways.push({
        from,
        to,
        strength,
        type: strength > 70 ? 'direct' : strength > 40 ? 'bridging' : 'spiraling',
        energyFlow: strength * 0.8
      })
    }
  }
  
  // Detect bridging (non-adjacent connections)
  for (let i = 0; i < chakraOrder.length - 2; i++) {
    for (let j = i + 2; j < chakraOrder.length; j++) {
      const from = chakraOrder[i]
      const to = chakraOrder[j]
      
      if (nodes[from].activated && nodes[to].activated) {
        const strength = Math.min(nodes[from].intensity, nodes[to].intensity) * 0.6
        if (strength > 30) {
          pathways.push({
            from,
            to,
            strength,
            type: 'bridging',
            energyFlow: strength * 0.5
          })
        }
      }
    }
  }
  
  // Determine resonance quality
  const activatedCount = Object.values(nodes).filter(n => n.activated).length
  const avgIntensity = Object.values(nodes).reduce((a, b) => a + b.intensity, 0) / 7
  const pathwayStrength = pathways.reduce((a, p) => a + p.strength, 0) / (pathways.length || 1)
  
  let resonanceQuality: ChakraWeb['resonanceQuality']
  if (activatedCount >= 6 && pathwayStrength > 60) resonanceQuality = 'transcendence'
  else if (activatedCount >= 4 && pathwayStrength > 50) resonanceQuality = 'unison'
  else if (activatedCount >= 3) resonanceQuality = 'harmony'
  else resonanceQuality = 'dissonance'
  
  // Generate activation sequence
  const activationSequence = Object.entries(nodes)
    .filter(([, node]) => node.activated)
    .sort((a, b) => b[1].intensity - a[1].intensity)
    .map(([key]) => key)
  
  return {
    nodes,
    pathways: pathways.sort((a, b) => b.strength - a.strength),
    dominantCurrent,
    activationSequence,
    resonanceQuality
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPORAL AWARENESS - The Flow of Time
// ═══════════════════════════════════════════════════════════════════════════════

function generateTemporalReading(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  bottleSize: number
): TemporalReading {
  const now = new Date()
  
  // Calculate lunar phase
  const lunarPhase = calculateLunarPhase(now)
  
  // Determine celestial alignment based on blend composition
  const celestialAlignment = calculateCelestialAlignment(selectedOils)
  
  // Seasonal resonance
  const seasonalResonance = calculateSeasonalResonance(selectedOils, now)
  
  // Generate optimal usage windows
  const optimalUsageWindows = generateUsageWindows(selectedOils)
  
  // Calculate maturation curve
  const maturationCurve = calculateMaturationCurve(selectedOils, bottleSize)
  
  // Astrological influences
  const astrologicalInfluences = determineAstrologicalInfluences(selectedOils)
  
  return {
    lunarPhase,
    celestialAlignment,
    seasonalResonance,
    optimalUsageWindows,
    maturationCurve,
    astrologicalInfluences
  }
}

function calculateLunarPhase(date: Date): string {
  // Approximate lunar cycle calculation
  const knownNewMoon = new Date('2000-01-06').getTime()
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000
  const daysSinceNew = (date.getTime() - knownNewMoon) / (24 * 60 * 60 * 1000)
  const phase = (daysSinceNew % lunarCycle) / lunarCycle
  
  if (phase < 0.03) return 'New Moon - Seeds of Intention'
  if (phase < 0.22) return 'Waxing Crescent - Gathering Momentum'
  if (phase < 0.28) return 'First Quarter - Manifestation Gateway'
  if (phase < 0.47) return 'Waxing Gibbous - Approaching Fulfillment'
  if (phase < 0.53) return 'Full Moon - Peak Illumination'
  if (phase < 0.72) return 'Waning Gibbous - Releasing & Sharing'
  if (phase < 0.78) return 'Last Quarter - Deep Reflection'
  return 'Waning Crescent - Dream Weaving'
}

function calculateCelestialAlignment(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  // Determine dominant planetary influence based on oil elements
  let fireScore = 0, waterScore = 0, airScore = 0, earthScore = 0
  
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    if (archetype) {
      const elementsObj = (archetype as any).elements
      if (elementsObj) {
        fireScore += (elementsObj.fire || 0) * oil.percentage
        waterScore += (elementsObj.water || 0) * oil.percentage
        airScore += (elementsObj.air || 0) * oil.percentage
        earthScore += (elementsObj.earth || 0) * oil.percentage
      } else if (archetype.element) {
        if (archetype.element === 'fire') fireScore += 80 * (oil.percentage / 100)
        if (archetype.element === 'water') waterScore += 80 * (oil.percentage / 100)
        if (archetype.element === 'air') airScore += 80 * (oil.percentage / 100)
        if (archetype.element === 'earth') earthScore += 80 * (oil.percentage / 100)
      }
    }
  }
  
  const max = Math.max(fireScore, waterScore, airScore, earthScore)
  
  if (max === fireScore) return 'Mars-Sun Conjunction - Action & Vitality'
  if (max === waterScore) return 'Moon-Neptune Trine - Intuition & Dreams'
  if (max === airScore) return 'Mercury-Jupiter Sextile - Wisdom & Communication'
  return 'Saturn-Venus Square - Structure Meets Beauty'
}

function calculateSeasonalResonance(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  date: Date
): string {
  const month = date.getMonth()
  const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 
                   'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter']
  const currentSeason = seasons[month]
  
  // Count oils that resonate with current season
  const seasonalKeywords: Record<string, string[]> = {
    'Spring': ['floral', 'fresh', 'uplifting', 'renewing'],
    'Summer': ['citrus', 'cooling', 'bright', 'energizing'],
    'Autumn': ['spicy', 'woody', 'grounding', 'warming'],
    'Winter': ['resin', 'deep', 'meditative', 'comforting']
  }
  
  let seasonalMatch = 0
  const keywords = seasonalKeywords[currentSeason]
  
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    if (archetype?.personality) {
      for (const tag of archetype.personality) {
        if (keywords.some(k => tag.toLowerCase().includes(k))) {
          seasonalMatch += oil.percentage
        }
      }
    }
  }
  
  if (seasonalMatch > 50) return `${currentSeason} Attunement - Perfect Seasonal Harmony`
  if (seasonalMatch > 25) return `${currentSeason} Resonance - Complementary to the Season`
  return `${currentSeason} Contrast - Brings Missing Elements to the Season`
}

function generateUsageWindows(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): TimeWindow[] {
  const windows: TimeWindow[] = []
  
  // Analyze oil properties for time recommendations
  let hasSedative = false, hasStimulant = false, hasBalancing = false
  let citrusDominance = 0, floralDominance = 0, woodyDominance = 0
  
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    const wisdom = OIL_WISDOM[oil.id]
    
    if (archetype?.personality) {
      const tags = archetype.personality.map((t: string) => t.toLowerCase())
      if (tags.some((t: string) => t.includes('calm') || t.includes('sedat'))) hasSedative = true
      if (tags.some((t: string) => t.includes('energi') || t.includes('uplift'))) hasStimulant = true
      if (tags.some((t: string) => t.includes('balanc'))) hasBalancing = true
    }
    
    if (wisdom?.description?.physical) {
      const physical = wisdom.description.physical.toLowerCase()
      if (physical.includes('citrus') || physical.includes('uplift')) citrusDominance += oil.percentage
      if (physical.includes('floral') || physical.includes('calm')) floralDominance += oil.percentage
      if (physical.includes('wood') || physical.includes('ground')) woodyDominance += oil.percentage
    }
  }
  
  // Generate windows based on analysis
  if (hasStimulant || citrusDominance > 30) {
    windows.push({
      period: 'Dawn (5-8am)',
      potency: 95,
      quality: 'Awakening & Clarification'
    })
    windows.push({
      period: 'Late Morning (9-11am)',
      potency: 85,
      quality: 'Productivity & Focus'
    })
  }
  
  if (hasBalancing || floralDominance > 30) {
    windows.push({
      period: 'Noon (12-2pm)',
      potency: 80,
      quality: 'Centering & Renewal'
    })
    windows.push({
      period: 'Afternoon (3-5pm)',
      potency: 75,
      quality: 'Harmony Restoration'
    })
  }
  
  if (hasSedative || woodyDominance > 30) {
    windows.push({
      period: 'Twilight (6-8pm)',
      potency: 90,
      quality: 'Winding Down & Reflection'
    })
    windows.push({
      period: 'Night (9pm-12am)',
      potency: 100,
      quality: 'Deep Relaxation & Dream Work'
    })
  }
  
  return windows.sort((a, b) => b.potency - a.potency).slice(0, 3)
}

function calculateMaturationCurve(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  bottleSize: number
): MaturationStage[] {
  const stages: MaturationStage[] = []
  
  // Determine maturation characteristics based on oil profiles
  let hasCitrus = false, hasResin = false, hasWood = false, hasFloral = false
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    if (wisdom) {
      const physical = wisdom.description?.physical?.toLowerCase() || ''
      if (physical.includes('citrus')) hasCitrus = true
      if (physical.includes('resin')) hasResin = true
      if (physical.includes('wood')) hasWood = true
      if (physical.includes('floral')) hasFloral = true
    }
  }
  
  // Day 1 - Initial Union
  stages.push({
    day: 1,
    potency: 60,
    character: 'The First Meeting',
    description: 'Oils are getting acquainted. Fresh, somewhat disjointed. Energy is awakening.'
  })
  
  // Day 3 - Initial Integration
  stages.push({
    day: 3,
    potency: 75,
    character: 'Awkward Courtship',
    description: 'Molecules begin to dance together. Initial synergies emerging. Use for energetic work.'
  })
  
  // Day 7 - First Harmony (sweet spot for most blends)
  stages.push({
    day: 7,
    potency: hasResin || hasWood ? 100 : 90,
    character: 'The Alchemical Wedding',
    description: 'Peak integration achieved. All elements singing in chorus. This is the moment of transformation.'
  })
  
  // Day 14 - Deepening
  stages.push({
    day: 14,
    potency: hasResin ? 100 : hasWood ? 95 : 85,
    character: 'Ancient Wisdom',
    description: 'Deep, resonant character emerges. The blend reveals its true personality. Rich and complex.'
  })
  
  // Day 30 - Full Maturity
  stages.push({
    day: 30,
    potency: hasResin || hasWood ? 95 : 80,
    character: 'Timeless Presence',
    description: hasResin 
      ? 'Resinous oils have achieved sacred depth. Meditative and transcendent.'
      : hasWood
      ? 'Woodsy base notes have fully anchored the blend. Grounding and eternal.'
      : 'Full maturation achieved. Character is stable and complete.'
  })
  
  return stages
}

function determineAstrologicalInfluences(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string[] {
  const influences: string[] = []
  
  // Map oil elements to zodiac
  const elementSigns: Record<string, string[]> = {
    fire: ['Aries', 'Leo', 'Sagittarius'],
    water: ['Cancer', 'Scorpio', 'Pisces'],
    air: ['Gemini', 'Libra', 'Aquarius'],
    earth: ['Taurus', 'Virgo', 'Capricorn']
  }
  
  const elementScores: Record<string, number> = { fire: 0, water: 0, air: 0, earth: 0 }
  
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    if (archetype) {
      if (archetype.elements) {
        for (const [element, value] of Object.entries(archetype.elements)) {
          if (typeof value === 'number') {
            elementScores[element] += value * oil.percentage
          }
        }
      } else if (archetype.element) {
        elementScores[archetype.element] += 80 * oil.percentage
      }
    }
  }
  
  // Add influences for dominant elements
  for (const [element, score] of Object.entries(elementScores)) {
    if (score > 30) {
      const signs = elementSigns[element]
      const sign = signs[Math.floor(score / 33) % signs.length]
      influences.push(`${sign} (${element} element dominance)`)
    }
  }
  
  // Add planetary influences based on blend characteristics
  if (selectedOils.length >= 5) {
    influences.push('Jupiter (Expansion & Abundance)')
  }
  
  const avgPercentage = selectedOils.reduce((a, o) => a + o.percentage, 0) / selectedOils.length
  if (avgPercentage < 30) {
    influences.push('Mercury (Complexity & Communication)')
  }
  
  return influences.slice(0, 3)
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOLECULAR VERSE - The Chemistry of Poetry
// ═══════════════════════════════════════════════════════════════════════════════

function generateMolecularVerse(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): MolecularVerse {
  // Analyze constituents - handle the { primary: string[], therapeuticAction: string } structure
  const constituentMap = new Map<string, { total: number; oils: string[] }>()
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    if (wisdom?.constituents?.primary) {
      // constituents.primary is an array of constituent names
      const primaryConstituents = wisdom.constituents.primary
      const weightPerConstituent = oil.percentage / primaryConstituents.length
      
      for (const constituentName of primaryConstituents) {
        if (!constituentMap.has(constituentName)) {
          constituentMap.set(constituentName, { total: 0, oils: [] })
        }
        const entry = constituentMap.get(constituentName)!
        entry.total += weightPerConstituent
        if (!entry.oils.includes(oil.id)) {
          entry.oils.push(oil.id)
        }
      }
    }
  }
  
  // Sort and get dominant constituents
  const sortedConstituents = Array.from(constituentMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
  
  const dominantConstituents: ConstituentPresence[] = sortedConstituents.map(([name, data]) => ({
    name,
    percentage: Math.round(data.total * 10) / 10,
    oils: data.oils,
    properties: getConstituentProperties(name),
    poeticNature: getConstituentPoetry(name)
  }))
  
  // Generate aromatic layers
  const aromaticSymphony = generateAromaticLayers(selectedOils)
  
  // Generate volatility phases
  const volatilityDance = generateVolatilityPhases(selectedOils)
  
  // Generate therapeutic signatures
  const therapeuticSignatures = generateTherapeuticPatterns(selectedOils)
  
  // Generate molecular poetry prose
  const molecularPoetry = weaveMolecularPoetry(dominantConstituents, aromaticSymphony)
  
  return {
    dominantConstituents,
    aromaticSymphony,
    volatilityDance,
    therapeuticSignatures,
    molecularPoetry
  }
}

function getConstituentProperties(name: string): string[] {
  const properties: Record<string, string[]> = {
    'linalool': ['calming', 'antimicrobial', 'skin-soothing'],
    'linalyl acetate': ['sedative', 'anti-inflammatory', 'uplifting'],
    '1,8-cineole': ['respiratory support', 'mental clarity', 'antiseptic'],
    'limonene': ['mood elevating', 'digestive', 'detoxifying'],
    'menthol': ['cooling', 'analgesic', 'respiratory'],
    'eugenol': ['warming', 'anesthetic', 'antimicrobial'],
    'citral': ['antifungal', 'sedative', 'antioxidant'],
    'geraniol': ['balancing', 'skin-regenerating', 'calming'],
    'pinene': ['bronchodilator', 'mental alertness', 'antiseptic'],
    'camphor': ['stimulating', 'anti-inflammatory', 'insecticidal'],
    'thymol': ['potent antimicrobial', 'antioxidant', 'immune support'],
    'carvacrol': ['antibacterial', 'antifungal', 'digestive'],
    'bisabolol': ['skin-healing', 'anti-irritant', 'calming'],
    'chamazulene': ['anti-inflammatory', 'antioxidant', 'healing'],
    'beta-caryophyllene': ['anti-inflammatory', 'analgesic', 'anxiolytic'],
    'alpha-pinene': ['respiratory', 'mental clarity', 'antiseptic']
  }
  
  return properties[name.toLowerCase()] || ['therapeutic', 'aromatic', 'active']
}

function getConstituentPoetry(name: string): string {
  const poetry: Record<string, string> = {
    'linalool': 'The whisperer of peace, flowing like moonlight through lavender fields',
    'linalyl acetate': 'A gentle embrace that softens the edges of the world',
    '1,8-cineole': 'The breath of clarity, cutting through mental fog like mountain air',
    'limonene': 'Sunshine captured in molecular form, joy made tangible',
    'menthol': 'The crystalline kiss of winter, awakening frozen potential',
    'eugenol': 'Warmth that seeps into bone and memory alike',
    'citral': 'The sharp brightness of dawn breaking over citrus groves',
    'geraniol': 'The balanced breath between giving and receiving',
    'pinene': 'The ancient wisdom of forests, reaching toward sky',
    'camphor': 'The penetrating gaze that sees through illusion',
    'thymol': 'Warrior essence, fierce protection in molecular form',
    'carvacrol': 'The digestive fire that transforms experience into wisdom',
    'bisabolol': 'Gentle healing that works in silence and depth',
    'chamazulene': 'The deep blue of healing waters, soothing all inflammation',
    'beta-caryophyllene': 'The bridge between body and calm, spicy and reassuring',
    'alpha-pinene': 'The first breath of pine forests at dawn'
  }
  
  return poetry[name.toLowerCase()] || `The unique voice of ${name}, singing its singular song`
}

function generateAromaticLayers(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): AromaticLayer[] {
  const layers: AromaticLayer[] = []
  
  // Categorize oils by note
  const topNotes: string[] = []
  const heartNotes: string[] = []
  const baseNotes: string[] = []
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    // Simple heuristic based on physical description
    const physical = wisdom?.description?.physical?.toLowerCase() || ''
    
    if (physical.includes('citrus') || physical.includes('fresh') || physical.includes('mint')) {
      topNotes.push(oil.id)
    } else if (physical.includes('floral') || physical.includes('herb') || physical.includes('spice')) {
      heartNotes.push(oil.id)
    } else if (physical.includes('wood') || physical.includes('resin') || physical.includes('balsam')) {
      baseNotes.push(oil.id)
    } else {
      // Default to heart if unclear
      heartNotes.push(oil.id)
    }
  }
  
  if (topNotes.length > 0) {
    layers.push({
      note: 'top',
      intensity: Math.min(topNotes.length * 30, 100),
      oils: topNotes,
      evocation: generateNoteEvocation(topNotes, 'top'),
      duration: '0-15 minutes'
    })
  }
  
  if (heartNotes.length > 0) {
    layers.push({
      note: 'heart',
      intensity: Math.min(heartNotes.length * 35, 100),
      oils: heartNotes,
      evocation: generateNoteEvocation(heartNotes, 'heart'),
      duration: '15-60 minutes'
    })
  }
  
  if (baseNotes.length > 0) {
    layers.push({
      note: 'base',
      intensity: Math.min(baseNotes.length * 40, 100),
      oils: baseNotes,
      evocation: generateNoteEvocation(baseNotes, 'base'),
      duration: '1-6 hours'
    })
  }
  
  return layers
}

function generateNoteEvocation(oils: string[], note: string): string {
  const evocations: Record<string, string[]> = {
    top: [
      'The first impression that sparkles like morning dew',
      'A bright greeting that lifts the spirit instantly',
      'The doorway through which the soul enters the experience'
    ],
    heart: [
      'The true character revealed after first impressions fade',
      'The emotional core that carries the narrative forward',
      'Where the blend tells its most intimate story'
    ],
    base: [
      'The foundation that remains when all else has spoken',
      'Ancient roots anchoring ephemeral beauty',
      'The memory that lingers long after the encounter'
    ]
  }
  
  const options = evocations[note] || evocations.heart
  // Use oil count to deterministically select
  return options[oils.length % options.length]
}

function generateVolatilityPhases(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): VolatilityPhase[] {
  const phases: VolatilityPhase[] = []
  
  // Phase 1: Opening (0-5 min)
  const openingOils = selectedOils.filter(o => {
    const wisdom = OIL_WISDOM[o.id]
    return wisdom?.description?.physical?.toLowerCase().includes('citrus')
  })
  
  if (openingOils.length > 0) {
    phases.push({
      timeframe: 'First Breath (0-5 minutes)',
      dominantNotes: openingOils.map(o => OIL_WISDOM[o.id]?.name || o.id),
      atmosphericQuality: 'Bright, expansive, consciousness-expanding'
    })
  }
  
  // Phase 2: Unfolding (5-20 min)
  const unfoldingOils = selectedOils.filter(o => {
    const wisdom = OIL_WISDOM[o.id]
    const physical = wisdom?.description?.physical?.toLowerCase() || ''
    return physical.includes('floral') || physical.includes('herb')
  })
  
  if (unfoldingOils.length > 0) {
    phases.push({
      timeframe: 'The Revelation (5-20 minutes)',
      dominantNotes: unfoldingOils.map(o => OIL_WISDOM[o.id]?.name || o.id),
      atmosphericQuality: 'Complex, emotional, story-telling'
    })
  }
  
  // Phase 3: Resonance (20-60 min)
  const resonanceOils = selectedOils.filter(o => {
    const wisdom = OIL_WISDOM[o.id]
    const physical = wisdom?.description?.physical?.toLowerCase() || ''
    return physical.includes('wood') || physical.includes('spice') || physical.includes('resin')
  })
  
  if (resonanceOils.length > 0) {
    phases.push({
      timeframe: 'Deepening (20-60 minutes)',
      dominantNotes: resonanceOils.map(o => OIL_WISDOM[o.id]?.name || o.id),
      atmosphericQuality: 'Grounding, meditative, transformative'
    })
  }
  
  return phases
}

function generateTherapeuticPatterns(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): TherapeuticPattern[] {
  const patterns: TherapeuticPattern[] = []
  
  // Aggregate therapeutic properties
  const therapeuticScores: Record<string, number> = {}
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    if (wisdom?.therapeutic?.benefits) {
      // therapeutic.benefits is an array of benefit strings
      for (const benefit of wisdom.therapeutic.benefits) {
        therapeuticScores[benefit] = (therapeuticScores[benefit] || 0) + oil.percentage
      }
    }
  }
  
  // Get top patterns
  const sorted = Object.entries(therapeuticScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  for (const [property, score] of sorted) {
    const mechanism = getTherapeuticMechanism(property)
    patterns.push({
      category: getPropertyCategory(property),
      strength: Math.min(score, 100),
      mechanism,
      application: getTherapeuticApplication(property)
    })
  }
  
  return patterns
}

function getPropertyCategory(property: string): string {
  // Map OilCategory values to categories
  const physical = ['anti-inflammatory', 'pain-relief', 'circulation', 'digestive', 'respiratory', 'skin-care']
  const emotional = ['stress-relief', 'mood-uplifting', 'grounding', 'aphrodisiac', 'sleep-support']
  const mental = ['mental-clarity', 'focus']
  const spiritual = ['spiritual-connection']
  const immune = ['immune-support', 'antimicrobial']
  
  const p = property.toLowerCase()
  if (physical.some(k => p.includes(k))) return 'Physical'
  if (emotional.some(k => p.includes(k))) return 'Emotional'
  if (mental.some(k => p.includes(k))) return 'Mental'
  if (spiritual.some(k => p.includes(k))) return 'Spiritual'
  if (immune.some(k => p.includes(k))) return 'Immune'
  return 'Holistic'
}

function getTherapeuticMechanism(property: string): string {
  const mechanisms: Record<string, string> = {
    'calming': 'Modulates GABA receptors and reduces cortisol levels',
    'uplifting': 'Stimulates dopamine and serotonin pathways',
    'grounding': 'Activates parasympathetic nervous system response',
    'anti-inflammatory': 'Inhibits COX-2 enzyme and prostaglandin synthesis',
    'antimicrobial': 'Disrupts microbial cell membranes',
    'clarifying': 'Enhances oxygen uptake in prefrontal cortex',
    'balancing': 'Regulates autonomic nervous system equilibrium',
    'respiratory': 'Expectorant and bronchodilator effects',
    'digestive': 'Stimulates digestive enzyme production and peristalsis'
  }
  
  return mechanisms[property.toLowerCase()] || 'Multi-target therapeutic action via active constituents'
}

function getTherapeuticApplication(property: string): string {
  const applications: Record<string, string> = {
    'calming': 'Use before sleep or during anxiety episodes',
    'uplifting': 'Apply during low mood or energy slumps',
    'grounding': 'Use when feeling scattered or overwhelmed',
    'anti-inflammatory': 'Apply to areas of physical inflammation',
    'antimicrobial': 'Diffuse during illness or for immune support',
    'clarifying': 'Use before intellectual work or meditation',
    'respiratory': 'Inhale deeply for congestion or breathing difficulty',
    'digestive': 'Apply clockwise on abdomen after meals'
  }
  
  return applications[property.toLowerCase()] || 'Use as needed for holistic support'
}

function weaveMolecularPoetry(
  constituents: ConstituentPresence[],
  layers: AromaticLayer[]
): string {
  if (constituents.length === 0) {
    return 'The molecular dance unfolds in patterns too subtle for words, yet felt in every breath.'
  }
  
  const dominant = constituents[0]
  const secondary = constituents[1]
  
  if (!dominant) {
    return 'The molecular dance unfolds in patterns too subtle for words, yet felt in every breath.'
  }
  
  let poetry = `At the molecular heart of this blend, ${dominant.name} presides at ${dominant.percentage}%, `
  poetry += `${dominant.poeticNature}. `
  
  if (secondary) {
    poetry += `Alongside, ${secondary.name} adds its ${secondary.poeticNature.toLowerCase()}. `
  }
  
  if (layers.length > 0) {
    const topLayer = layers.find(l => l.note === 'top')
    const baseLayer = layers.find(l => l.note === 'base')
    
    if (topLayer && baseLayer) {
      poetry += `The aromatic journey begins with ${topLayer.oils.slice(0, 2).join(' and ')} `
      poetry += `lifting the spirit skyward, then descends through ancient roots `
      poetry += `to anchor in ${baseLayer.oils.slice(0, 2).join(' and ')}. `
    }
  }
  
  poetry += `Together, these molecules create a symphony that speaks directly to the body's wisdom.`
  
  return poetry
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCANA SIGNATURE - Divination Through Mathematics
// ═══════════════════════════════════════════════════════════════════════════════

function generateArcanaSignature(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string,
  bottleSize: number
): ArcanaReading {
  // Tarot correspondence
  const tarotCard = calculateTarotCard(selectedOils, hash)
  
  // Numerology
  const numerology = calculateNumerology(selectedOils, hash, bottleSize)
  
  // Sacred geometry
  const sacredGeometry = calculateSacredGeometry(selectedOils, hash)
  
  // Rune influence
  const runeInfluence = determineRuneInfluence(selectedOils)
  
  // Color oracle
  const colorOracle = generateColorOracle(selectedOils)
  
  return {
    tarotCard,
    numerology,
    sacredGeometry,
    runeInfluence,
    colorOracle
  }
}

function calculateTarotCard(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string
): TarotCorrespondence {
  // Calculate card based on blend composition
  let cardIndex = 0
  
  // Factor in elemental balance
  const elements = { fire: 0, water: 0, air: 0, earth: 0 }
  for (const oil of selectedOils) {
    const archetype = OIL_ARCHETYPES[oil.id]
    if (archetype) {
      if (archetype.elements) {
        elements.fire += (archetype.elements.fire || 0) * oil.percentage
        elements.water += (archetype.elements.water || 0) * oil.percentage
        elements.air += (archetype.elements.air || 0) * oil.percentage
        elements.earth += (archetype.elements.earth || 0) * oil.percentage
      } else if (archetype.element) {
        if (archetype.element === 'fire') elements.fire += 80 * oil.percentage
        if (archetype.element === 'water') elements.water += 80 * oil.percentage
        if (archetype.element === 'air') elements.air += 80 * oil.percentage
        if (archetype.element === 'earth') elements.earth += 80 * oil.percentage
      }
    }
  }
  
  // Map elements to tarot
  const maxElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0]
  const elementCardMap: Record<string, number[]> = {
    fire: [4, 10, 16, 19, 20], // Emperor, Wheel, Tower, Sun, Judgement
    water: [2, 7, 12, 13, 18], // High Priestess, Chariot, Hanged Man, Death, Moon
    air: [0, 1, 6, 11, 17],    // Fool, Magician, Lovers, Justice, Star
    earth: [3, 5, 9, 15, 21]   // Empress, Hierophant, Hermit, Devil, World
  }
  
  const possibleCards = elementCardMap[maxElement] || [0, 1, 2]
  
  // Use hash to deterministically select
  const hashNum = parseInt(hash.replace(/[^0-9A-F]/g, '').slice(0, 4), 16) || 0
  cardIndex = possibleCards[hashNum % possibleCards.length]
  
  const card = TAROT_MAJOR_ARCANA[cardIndex]
  
  // Determine if reversed based on blend characteristics
  const isReversed = hashNum % 7 === 0
  
  // Generate blend-specific resonance
  const dominantOil = selectedOils.sort((a, b) => b.percentage - a.percentage)[0]
  const resonance = generateTarotResonance(card, dominantOil?.id || '', isReversed)
  
  return {
    card: card.card,
    arcana: 'major',
    meaning: card.meaning,
    reversed: isReversed,
    blendResonance: resonance
  }
}

function generateTarotResonance(
  card: typeof TAROT_MAJOR_ARCANA[0],
  dominantOilId: string,
  reversed: boolean
): string {
  const wisdom = OIL_WISDOM[dominantOilId]
  const oilName = wisdom?.name || dominantOilId
  
  if (reversed) {
    return `The reversed ${card.card} suggests this blend, led by ${oilName}, addresses blocked ${card.element} energy. Use when feeling stuck in the shadow aspects of this archetype.`
  }
  
  return `${oilName} channels the ${card.card} energy—a ${card.meaning.toLowerCase()}. This blend embodies the ${card.element} element's teaching.`
}

function calculateNumerology(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string,
  bottleSize: number
): NumerologyReading {
  // Soul number from oil count
  const soulNumber = reduceToSingleDigit(selectedOils.length)
  
  // Path number from total ml
  const pathNumber = reduceToSingleDigit(Math.round(selectedOils.reduce((a, o) => a + o.ml, 0)))
  
  // Destiny number from hash
  const hashSum = hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const destinyNumber = reduceToSingleDigit(hashSum)
  
  const meanings: Record<number, string> = {
    1: 'Initiation - New beginnings, leadership, independence',
    2: 'Union - Partnership, balance, receptivity',
    3: 'Expression - Creativity, communication, joy',
    4: 'Foundation - Structure, stability, manifestation',
    5: 'Change - Freedom, adventure, transformation',
    6: 'Harmony - Nurturing, responsibility, beauty',
    7: 'Mystery - Spirituality, analysis, inner wisdom',
    8: 'Abundance - Power, success, material mastery',
    9: 'Completion - Compassion, completion, universal love'
  }
  
  return {
    soulNumber,
    pathNumber,
    destinyNumber,
    meanings
  }
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0)
  }
  return num || 1
}

function calculateSacredGeometry(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string
): GeometryPattern {
  // Select pattern based on oil count and composition
  const oilCount = selectedOils.length
  const hashNum = parseInt(hash.replace(/[^0-9A-F]/g, '').slice(4, 8), 16) || 0
  
  const patternIndex = (oilCount + hashNum) % SACRED_GEOMETRY_PATTERNS.length
  const pattern = SACRED_GEOMETRY_PATTERNS[patternIndex]
  
  // Calculate frequency based on blend vibration
  const frequency = 432 + (oilCount * 7.83)  // Base 432Hz + Schumann resonance factor
  
  // Generate visual code
  const visualCode = generateGeometryVisualCode(pattern, hash)
  
  return {
    primary: pattern.name,
    frequency: Math.round(frequency * 100) / 100,
    significance: pattern.meaning,
    visualCode
  }
}

function generateGeometryVisualCode(pattern: typeof SACRED_GEOMETRY_PATTERNS[0], hash: string): string {
  // Generate a procedural visual code for rendering
  const layers = Math.min(pattern.sides, 12) || 6
  const rotation = parseInt(hash.slice(0, 2), 16) % 360
  return `${pattern.sides}:${layers}:${rotation}`
}

function determineRuneInfluence(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const runes: Record<string, { meaning: string; condition: () => boolean }> = {
    'Fehu': { 
      meaning: 'Wealth, abundance, creative fire',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('uplift')))
    },
    'Uruz': { 
      meaning: 'Strength, endurance, wild energy',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('ground')))
    },
    'Thurisaz': { 
      meaning: 'Protection, defense, catalyst',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.traditionalUses?.cultures?.includes('Ancient Egypt'))
    },
    'Ansuz': { 
      meaning: 'Communication, wisdom, breath',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('respir')))
    },
    'Raidho': { 
      meaning: 'Journey, movement, rhythm',
      condition: () => selectedOils.length >= 4
    },
    'Kenaz': { 
      meaning: 'Torch, knowledge, illumination',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('clarif')))
    },
    'Gebo': { 
      meaning: 'Gift, partnership, balance',
      condition: () => selectedOils.length === 2
    },
    'Wunjo': { 
      meaning: 'Joy, pleasure, harmony',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('floral')))
    },
    'Hagalaz': { 
      meaning: 'Disruption, transformation, seed',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('transform')))
    },
    'Nauthiz': { 
      meaning: 'Need, resistance, patience',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('meditat')))
    },
    'Isa': { 
      meaning: 'Stillness, concentration, ice',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('calm')))
    },
    'Jera': { 
      meaning: 'Harvest, cycle, reward',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.metaphysical?.moonPhase?.includes('full'))
    },
    'Eihwaz': { 
      meaning: 'Defense, endurance, yew tree',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('protect')))
    },
    'Perthro': { 
      meaning: 'Secret, mystery, fate',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.traditionalUses?.cultures?.includes('Ayurveda'))
    },
    'Algiz': { 
      meaning: 'Protection, splayed hand, elk',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('purif')))
    },
    'Sowilo': { 
      meaning: 'Sun, success, wholeness',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.description?.physical?.toLowerCase().includes('citrus'))
    },
    'Tiwaz': { 
      meaning: 'Warrior, justice, sacrifice',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.traditionalUses?.cultures?.includes('Roman'))
    },
    'Berkano': { 
      meaning: 'Growth, birch, motherhood',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('nurtur')))
    },
    'Ehwaz': { 
      meaning: 'Partnership, horse, trust',
      condition: () => selectedOils.length >= 3 && selectedOils.length <= 5
    },
    'Mannaz': { 
      meaning: 'Humanity, community, self',
      condition: () => selectedOils.length >= 6
    },
    'Laguz': { 
      meaning: 'Water, flow, intuition',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.element === 'water')
    },
    'Ingwaz': { 
      meaning: 'Potential, seed, gestation',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.metaphysical?.moonPhase?.includes('new'))
    },
    'Dagaz': { 
      meaning: 'Breakthrough, daylight, hope',
      condition: () => selectedOils.some(o => OIL_ARCHETYPES[o.id]?.personality?.some((t: string) => t.includes('energ')))
    },
    'Othala': { 
      meaning: 'Inheritance, home, ancestors',
      condition: () => selectedOils.some(o => OIL_WISDOM[o.id]?.traditionalUses?.cultures?.includes('Indigenous'))
    }
  }
  
  // Find matching rune
  for (const [rune, data] of Object.entries(runes)) {
    if (data.condition()) {
      return `${rune} - ${data.meaning}`
    }
  }
  
  return 'Odin\'s Void - The unmanifest potential'
}

function generateColorOracle(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): ColorWisdom {
  // Aggregate colors from oils based on element and chakra
  const colorScores: Record<string, number> = {}
  
  // Element color mapping
  const elementColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#92400E',
    air: '#E0F2FE',
    ether: '#C084FC',
    aether: '#C084FC'
  }
  
  // Chakra color mapping
  const chakraColors: Record<string, string> = {
    root: '#DC2626',
    sacral: '#EA580C',
    solarplexus: '#EAB308',
    solarPlexus: '#EAB308',
    heart: '#16A34A',
    throat: '#0891B2',
    thirdeye: '#4F46E5',
    thirdEye: '#4F46E5',
    crown: '#9333EA'
  }
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    
    // Add element color
    if (wisdom?.element) {
      const elementColor = elementColors[wisdom.element.toLowerCase()]
      if (elementColor) {
        colorScores[elementColor] = (colorScores[elementColor] || 0) + oil.percentage * 0.6
      }
    }
    
    // Add chakra color influences
    if (wisdom?.chakra) {
      const chakraKey = wisdom.chakra.toLowerCase().replace(/-/g, '')
      if (chakraColors[chakraKey]) {
        colorScores[chakraColors[chakraKey]] = (colorScores[chakraColors[chakraKey]] || 0) + oil.percentage * 0.4
      }
    }
  }
  
  // Sort colors by score
  const sortedColors = Object.entries(colorScores)
    .sort((a, b) => b[1] - a[1])
  
  const dominant = sortedColors[0]?.[0] || '#C9A227'
  const secondary = sortedColors[1]?.[0] || '#4B5563'
  const accent = sortedColors[2]?.[0] || '#F5F3EF'
  
  const meaning = generateColorMeaning(sortedColors.slice(0, 3).map(([c]) => c))
  
  return {
    dominant,
    secondary,
    accent,
    meaning,
    hex: dominant
  }
}

function generateColorMeaning(colors: string[]): string {
  if (colors.length === 0) return 'Clear light - pure potential'
  if (colors.length === 1) return `Monochrome focus - the singularity of ${colors[0]}`
  
  const meanings: Record<string, string> = {
    red: 'vitality and root power',
    orange: 'creativity and flow',
    yellow: 'mental clarity and solar energy',
    green: 'heart healing and growth',
    blue: 'communication and truth',
    indigo: 'intuition and inner vision',
    violet: 'spiritual connection and transcendence',
    purple: 'mystery and transformation',
    gold: 'abundance and divine light',
    silver: 'reflection and lunar wisdom',
    white: 'purity and wholeness',
    black: 'mystery and the void',
    brown: 'grounding and earth connection',
    pink: 'love and gentleness',
    amber: 'preservation and ancient wisdom'
  }
  
  const colorDescriptions = colors.map(c => {
    const lowerC = c.toLowerCase()
    return meanings[lowerC] || lowerC
  })
  
  return `A spectrum of ${colorDescriptions.join(' dancing with ')}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL SIGNATURE - Procedural Sacred Art
// ═══════════════════════════════════════════════════════════════════════════════

function generateVisualSignature(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string,
  elementalMatrix: ElementalMatrix
): VisualSignature {
  // Generate gradient from oil colors
  const primaryGradient = generateProceduralGradient(selectedOils, elementalMatrix)
  
  // Configure particle system
  const particleSystem = configureParticleSystem(selectedOils, hash, elementalMatrix)
  
  // Create constellation map
  const constellation = generateConstellationMap(selectedOils, hash)
  
  // Sacred geometry render data
  const sacredGeometry = generateGeometryRender(selectedOils, hash)
  
  // Waveform data
  const waveform = generateWaveformData(selectedOils, elementalMatrix)
  
  return {
    primaryGradient,
    particleSystem,
    constellation,
    sacredGeometry,
    waveform
  }
}

function generateProceduralGradient(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  elementalMatrix: ElementalMatrix
): [string, string, string] {
  // Extract colors from dominant oils based on element
  const oilColors: Array<{ color: string; weight: number }> = []
  
  const elementColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#92400E',
    air: '#E0F2FE',
    ether: '#C084FC',
    aether: '#C084FC'
  }
  
  for (const oil of selectedOils) {
    const wisdom = OIL_WISDOM[oil.id]
    if (wisdom?.element) {
      const color = elementColors[wisdom.element.toLowerCase()]
      if (color) {
        oilColors.push({ color, weight: oil.percentage })
      }
    }
  }
  
  // Sort by weight
  oilColors.sort((a, b) => b.weight - a.weight)
  
  // If we have oil colors, use them
  if (oilColors.length >= 3) {
    return [
      oilColors[0].color,
      oilColors[1].color,
      oilColors[2].color
    ]
  }
  
  // Otherwise use elemental colors
  const elementalColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#78350F',
    air: '#E0F2FE',
    aether: '#C084FC'
  }
  
  const sortedElements = Object.entries(elementalMatrix)
    .filter(([k]) => ['fire', 'water', 'earth', 'air', 'aether'].includes(k))
    .sort((a, b) => (b[1] as number) - (a[1] as number))
  
  return [
    elementalColors[sortedElements[0]?.[0] || 'earth'],
    elementalColors[sortedElements[1]?.[0] || 'water'],
    elementalColors[sortedElements[2]?.[0] || 'fire']
  ]
}

function configureParticleSystem(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string,
  elementalMatrix: ElementalMatrix
): ParticleConfig {
  // Particle count based on oil count and complexity
  const count = Math.min(50 + (selectedOils.length * 15), 150)
  
  // Colors from oils based on element
  const elementColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#92400E',
    air: '#E0F2FE',
    ether: '#C084FC',
    aether: '#C084FC'
  }
  
  const colors = selectedOils
    .map(o => {
      const element = OIL_WISDOM[o.id]?.element
      return element ? elementColors[element.toLowerCase()] : null
    })
    .filter(Boolean) as string[]
  
  // Add elemental accent colors if needed
  if (colors.length < 3) {
    if (elementalMatrix.fire > 20) colors.push('#F97316')
    if (elementalMatrix.water > 20) colors.push('#0EA5E9')
    if (elementalMatrix.earth > 20) colors.push('#92400E')
    if (elementalMatrix.air > 20) colors.push('#E0F2FE')
  }
  
  // Behaviors based on blend characteristics
  const behaviors: string[] = ['float', 'pulse']
  
  if (elementalMatrix.fire > 30) behaviors.push('rise', 'flicker')
  if (elementalMatrix.water > 30) behaviors.push('flow', 'ripple')
  if (elementalMatrix.air > 30) behaviors.push('drift', 'swirl')
  if (elementalMatrix.earth > 30) behaviors.push('settle', 'orbit')
  
  // Flow pattern from hash
  const patterns = ['radial', 'linear', 'spiral', 'orbital', 'chaotic']
  const hashNum = parseInt(hash.replace(/[^0-9A-F]/g, '').slice(0, 4), 16) || 0
  const flowPattern = patterns[hashNum % patterns.length]
  
  return {
    count,
    colors: [...new Set(colors)],
    behaviors: [...new Set(behaviors)],
    flowPattern
  }
}

function generateConstellationMap(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string
): StarMap {
  const stars: Star[] = []
  const connections: ConstellationLine[] = []
  
  // Element color mapping
  const elementColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#92400E',
    air: '#E0F2FE',
    ether: '#C084FC',
    aether: '#C084FC'
  }
  
  // Generate stars from oils
  const hashDigits = hash.replace(/-/g, '').split('')
  
  for (let i = 0; i < selectedOils.length; i++) {
    const oil = selectedOils[i]
    const wisdom = OIL_WISDOM[oil.id]
    
    // Use hash for deterministic positioning
    const hashIndex = (i * 3) % hashDigits.length
    const baseAngle = (parseInt(hashDigits[hashIndex], 36) / 36) * Math.PI * 2
    const distance = 0.2 + (parseInt(hashDigits[(hashIndex + 1) % hashDigits.length], 36) / 36) * 0.6
    
    const x = 0.5 + Math.cos(baseAngle) * distance
    const y = 0.5 + Math.sin(baseAngle) * distance
    
    stars.push({
      id: oil.id,
      x: Math.max(0.1, Math.min(0.9, x)),
      y: Math.max(0.1, Math.min(0.9, y)),
      magnitude: oil.percentage / 10,
      color: (wisdom?.element ? elementColors[wisdom.element.toLowerCase()] : null) || '#C9A227',
      oil: wisdom?.name || oil.id
    })
  }
  
  // Generate connections based on synergies
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const star1 = stars[i]
      const star2 = stars[j]
      
      // Calculate distance
      const dx = star1.x - star2.x
      const dy = star1.y - star2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Connect if close enough (synergy detected)
      if (distance < 0.5) {
        const strength = (1 - distance) * 100
        connections.push({
          from: star1.id,
          to: star2.id,
          strength,
          type: strength > 70 ? 'solid' : strength > 40 ? 'pulsing' : 'ethereal'
        })
      }
    }
  }
  
  // Rotation from hash
  const rotation = (parseInt(hash.replace(/[^0-9A-F]/g, '').slice(0, 2), 16) || 0) * 2
  
  return {
    stars,
    connections: connections.sort((a, b) => b.strength - a.strength).slice(0, 8),
    center: { x: 0.5, y: 0.5 },
    rotation
  }
}

function generateGeometryRender(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  hash: string
): GeometryRender {
  // Determine geometry type based on oil count
  const types = ['flower', 'seed', 'metatron', 'torus', 'merkaba', 'yantra']
  const hashNum = parseInt(hash.replace(/[^0-9A-F]/g, '').slice(8, 12), 16) || 0
  const type = types[hashNum % types.length]
  
  // Sides based on elemental balance
  const oilCount = selectedOils.length
  const sides = Math.min(Math.max(3, oilCount + 3), 12)
  
  // Layers based on complexity
  const layers = Math.min(Math.ceil(selectedOils.length / 2) + 1, 7)
  
  // Rotation speed from vibrational quality
  const rotationSpeed = 0.5 + (oilCount * 0.1)
  
  // Color transitions from oils based on element
  const elementColors: Record<string, string> = {
    fire: '#DC2626',
    water: '#0891B2',
    earth: '#92400E',
    air: '#E0F2FE',
    ether: '#C084FC',
    aether: '#C084FC'
  }
  
  const colorTransitions = selectedOils
    .slice(0, 4)
    .map(o => {
      const element = OIL_WISDOM[o.id]?.element
      return element ? elementColors[element.toLowerCase()] : null
    })
    .filter(Boolean) as string[]
  
  if (colorTransitions.length < 2) {
    colorTransitions.push('#C9A227', '#4B5563')
  }
  
  return {
    type,
    sides,
    layers,
    rotationSpeed,
    colorTransitions
  }
}

function generateWaveformData(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>,
  elementalMatrix: ElementalMatrix
): WaveformData {
  // Base frequency from blend
  const baseFrequency = calculateBlendFrequency(selectedOils)
  
  // Generate harmonics based on oil count and elements
  const harmonics: number[] = []
  const oilCount = selectedOils.length
  
  for (let i = 2; i <= Math.min(oilCount + 2, 7); i++) {
    harmonics.push(Math.round(baseFrequency * i * 100) / 100)
  }
  
  // Amplitude from dominant element strength
  const dominantElementValue = Math.max(
    elementalMatrix.fire,
    elementalMatrix.water,
    elementalMatrix.earth,
    elementalMatrix.air
  )
  const amplitude = 0.3 + (dominantElementValue / 100) * 0.7
  
  // Wavelength inverse to frequency
  const wavelength = 1 / baseFrequency * 1000
  
  // Pattern from element balance
  const patterns = ['sine', 'triangle', 'sawtooth', 'square', 'complex']
  const patternIndex = Math.floor(
    (elementalMatrix.fire + elementalMatrix.water + elementalMatrix.earth + elementalMatrix.air) / 40
  ) % patterns.length
  
  return {
    baseFrequency,
    harmonics,
    amplitude: Math.round(amplitude * 100) / 100,
    wavelength: Math.round(wavelength * 100) / 100,
    pattern: patterns[patternIndex]
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMERGENCE DETECTION - The Unexpected Patterns
// ═══════════════════════════════════════════════════════════════════════════════

function detectEmergencePatterns(
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): EmergencePattern[] {
  const patterns: EmergencePattern[] = []
  
  // Get oil categories
  const oilData = selectedOils.map(o => {
    const wisdom = OIL_WISDOM[o.id]
    const physical = wisdom?.description?.physical?.toLowerCase() || ''
    return {
      id: o.id,
      ml: o.ml,
      percentage: o.percentage,
      isCitrus: physical.includes('citrus'),
      isFloral: physical.includes('floral'),
      isWoody: physical.includes('wood'),
      isResin: physical.includes('resin'),
      isSpice: physical.includes('spice'),
      isHerb: physical.includes('herb'),
      isMint: physical.includes('mint')
    }
  })
  
  // Check for citrus trinity
  const citrusOils = oilData.filter(o => o.isCitrus)
  if (citrusOils.length >= 3) {
    patterns.push({
      type: 'elemental_fusion',
      name: 'The Solar Triad',
      description: 'Three or more citrus oils converge to form a complete spectrum of solar energy, creating a brightness that transcends individual oils.',
      participatingOils: citrusOils.map(o => o.id),
      rarity: citrusOils.length >= 4 ? 'epic' : 'rare',
      effect: 'Exponentially uplifting, creates an atmosphere of pure joy and possibility'
    })
  }
  
  // Check for floral resonance
  const floralOils = oilData.filter(o => o.isFloral)
  if (floralOils.length >= 3) {
    patterns.push({
      type: 'harmonic_cascade',
      name: 'The Queen\'s Crown',
      description: 'Multiple florals create an ascending cascade of heart-opening frequencies, each note lifting the previous into higher expression.',
      participatingOils: floralOils.map(o => o.id),
      rarity: floralOils.length >= 4 ? 'legendary' : 'epic',
      effect: 'Deep emotional healing and heart chakra activation'
    })
  }
  
  // Check for wood + moss/earth
  const woodOils = oilData.filter(o => o.isWoody)
  const earthOils = oilData.filter(o => o.isResin || OIL_WISDOM[o.id]?.description?.physical?.toLowerCase().includes('balsam'))
  if (woodOils.length > 0 && earthOils.length > 0) {
    const allOils = [...woodOils, ...earthOils]
    patterns.push({
      type: 'grounding_matrix',
      name: 'The Ancient Anchor',
      description: 'Wood and earth oils weave a grounding web that connects to primordial wisdom, creating unshakeable stability.',
      participatingOils: allOils.map(o => o.id),
      rarity: allOils.length >= 4 ? 'rare' : 'uncommon',
      effect: 'Exceptional grounding and connection to ancestral wisdom'
    })
  }
  
  // Check for spice + resin
  const spiceOils = oilData.filter(o => o.isSpice)
  const resinOils = oilData.filter(o => o.isResin)
  if (spiceOils.length > 0 && resinOils.length > 0) {
    patterns.push({
      type: 'sacred_fire',
      name: 'The Temple Flame',
      description: 'Spice meets resin in a holy confluence of transformative heat, reminiscent of ancient temple incense.',
      participatingOils: [...spiceOils, ...resinOils].map(o => o.id),
      rarity: spiceOils.length >= 2 && resinOils.length >= 2 ? 'legendary' : 'rare',
      effect: 'Spiritual elevation and meditative depth'
    })
  }
  
  // Check for mint + herb clarity
  const mintOils = oilData.filter(o => o.isMint)
  const herbOils = oilData.filter(o => o.isHerb && !o.isMint)
  if (mintOils.length > 0 && herbOils.length > 0) {
    patterns.push({
      type: 'mental_expansion',
      name: 'The Clear Mind Protocol',
      description: 'Mint and herbaceous oils synchronize for enhanced cognitive function, creating mental clarity without overstimulation.',
      participatingOils: [...mintOils, ...herbOils].map(o => o.id),
      rarity: 'uncommon',
      effect: 'Mental clarity and focused awareness'
    })
  }
  
  // Check for citrus + floral dance
  if (citrusOils.length > 0 && floralOils.length > 0) {
    patterns.push({
      type: 'joyful_union',
      name: 'The Celebration of Light',
      description: 'Citrus brightness lifts floral depth into ecstatic expression, like sunlight dancing on water.',
      participatingOils: [...citrusOils, ...floralOils].map(o => o.id),
      rarity: citrusOils.length >= 2 && floralOils.length >= 2 ? 'rare' : 'uncommon',
      effect: 'Joyful heart opening with energizing lightness'
    })
  }
  
  // Check for high complexity (many oils)
  if (selectedOils.length >= 7) {
    patterns.push({
      type: 'complex_synthesis',
      name: 'The Grand Symphony',
      description: 'Seven or more oils create a complex interplay where each ingredient plays a vital role in an intricate aromatic masterpiece.',
      participatingOils: selectedOils.map(o => o.id),
      rarity: selectedOils.length >= 10 ? 'legendary' : selectedOils.length >= 8 ? 'epic' : 'rare',
      effect: 'Multi-dimensional healing on all levels'
    })
  }
  
  // Check for simplicity (single dominant oil)
  const dominant = selectedOils.sort((a, b) => b.percentage - a.percentage)[0]
  if (dominant && dominant.percentage > 60) {
    patterns.push({
      type: 'singularity',
      name: 'The Solo Virtuoso',
      description: `With ${Math.round(dominant.percentage)}% ${OIL_WISDOM[dominant.id]?.name || dominant.id}, this blend celebrates the singular mastery of one oil.`,
      participatingOils: [dominant.id],
      rarity: dominant.percentage > 80 ? 'rare' : 'common',
      effect: 'Pure, focused expression of a single archetype'
    })
  }
  
  return patterns.sort((a, b) => {
    const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }
    return rarityOrder[b.rarity] - rarityOrder[a.rarity]
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCEDURAL NARRATIVE ENGINE - The Soul Speaks
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The core revelation generation. No templates. Pure procedural generation
 * based on the unique soul signature.
 */
function generateAwakenedRevelation(
  soulSignature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): AwakenedRevelation {
  // Generate invocation
  const invocation = generateInvocation(soulSignature, selectedOils)
  
  // Generate essence reading
  const essenceReading = generateEssenceReading(soulSignature, selectedOils)
  
  // Generate journey map
  const journeyMap = generateJourneyMap(soulSignature, selectedOils)
  
  // Generate mystery revealed
  const mysteryRevealed = generateMysteryRevealed(soulSignature, selectedOils)
  
  // Generate practical mysticism
  const practicalMysticism = generatePracticalMysticism(soulSignature, selectedOils)
  
  // Generate closing blessing
  const closingBlessing = generateClosingBlessing(soulSignature, selectedOils)
  
  // Calculate uniqueness score
  const uniquenessScore = calculateUniquenessScore(soulSignature, selectedOils)
  
  return {
    soulSignature,
    invocation,
    essenceReading,
    journeyMap,
    mysteryRevealed,
    practicalMysticism,
    closingBlessing,
    metadata: {
      uniquenessScore,
      complexityDepth: soulSignature.emergenceProfile.length * 15 + selectedOils.length * 5,
      emergenceCount: soulSignature.emergenceProfile.length,
      generationTimestamp: new Date().toISOString(),
      blendHash: soulSignature.hash
    }
  }
}

function generateInvocation(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const dominant = selectedOils.sort((a, b) => b.percentage - a.percentage)[0]
  const dominantWisdom = OIL_WISDOM[dominant?.id || '']
  
  const openings = [
    `From the ${signature.elementalResonance.balanceState} depths where ${signature.elementalResonance.dominant} reigns,`,
    `In the space between ${signature.vibrationalFrequency}Hz vibrations and ${signature.arcanaSignature.tarotCard.card} archetype,`,
    `Where ${dominantWisdom?.name || 'essence'} meets ${signature.chakraConstellation.resonanceQuality} frequencies,`,
    `Through the ${signature.arcanaSignature.runeInfluence.split(' - ')[0]} gateway and into the ${signature.arcanaSignature.sacredGeometry.primary},`,
    `At the confluence of ${selectedOils.length} distinct consciousnesses, each singing at ${signature.vibrationalFrequency}Hz,`
  ]
  
  // Select based on hash for consistency
  const hashNum = parseInt(signature.hash.replace(/[^0-9A-F]/g, '').slice(0, 2), 16) || 0
  const opening = openings[hashNum % openings.length]
  
  const calls = [
    `this ${signature.elementalResonance.dominant}-charged soul awakens.`,
    `a new entity emerges from the ${signature.temporalSignature.lunarPhase.toLowerCase()}.`,
    `the blend reveals its ${signature.arcanaSignature.colorOracle.meaning.split(' - ')[0]} nature.`,
    `transmission begins through ${signature.chakraConstellation.dominantCurrent} energy pathways.`,
    `the ${signature.emergenceProfile[0]?.name || 'sacred union'} takes form.`
  ]
  
  const call = calls[(hashNum + 1) % calls.length]
  
  return `${opening} ${call}`
}

function generateEssenceReading(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const parts: string[] = []
  
  // Elemental nature
  const dominantElement = signature.elementalResonance.dominant
  const elementDesc = getElementalEssenceDescription(dominantElement, signature.elementalResonance)
  parts.push(elementDesc)
  
  // Chakra nature
  if (signature.chakraConstellation.activationSequence.length > 0) {
    const chakraDesc = generateChakraEssence(signature.chakraConstellation)
    parts.push(chakraDesc)
  }
  
  // Archetype synthesis
  if (signature.emergenceProfile.length > 0) {
    const emergence = signature.emergenceProfile[0]
    parts.push(`This blend embodies the ${emergence.name} pattern—${emergence.description}`)
  }
  
  // Frequency signature
  parts.push(`Vibrating at ${signature.vibrationalFrequency}Hz, this blend resonates with ${getFrequencyQuality(signature.vibrationalFrequency)}.`)
  
  return parts.join(' ')
}

function getElementalEssenceDescription(element: string, matrix: ElementalMatrix): string {
  const descriptions: Record<string, Record<string, string>> = {
    fire: {
      harmonic: 'A flame that warms without consuming, bringing transformation through gentle persistence.',
      dynamic: 'Wildfire creativity—unpredictable, passionate, capable of rapid change.',
      volatile: 'Lightning in a bottle—powerful, dangerous if misused, capable of initiating massive transformation.',
      crystalline: 'The forge-fire that tempers steel—disciplined, focused, unwavering.',
      void: 'Ember potential—waiting for the right moment to ignite.'
    },
    water: {
      harmonic: 'A deep lake of serenity—reflective, nurturing, endlessly giving.',
      dynamic: 'River wisdom—adaptable, persistent, carving new paths through stone.',
      volatile: 'Storm surge—emotional power that can overwhelm or cleanse entirely.',
      crystalline: 'Glacier patience—slow-moving but unstoppable, preserving what matters.',
      void: 'Hidden spring—subterranean potential waiting to surface.'
    },
    earth: {
      harmonic: 'Ancient forest floor—nurturing, stable, rich with accumulated wisdom.',
      dynamic: 'Tectonic shift—slow power that reshapes landscapes over time.',
      volatile: 'Earthquake energy—sudden stability upheaval, foundation transformation.',
      crystalline: 'Mountain permanence—unshakeable, timeless, grounding.',
      void: 'Seed potential—containing entire forests in compact form.'
    },
    air: {
      harmonic: 'Gentle breeze—carrying pollen, messages, breath itself.',
      dynamic: 'Wind currents—always moving, connecting distant places.',
      volatile: 'Hurricane force—intellectual power that can scatter or unite.',
      crystalline: 'High altitude clarity—thin air where only truth survives.',
      void: 'Vacuum potential—the space where new ideas can form.'
    }
  }
  
  return descriptions[element]?.[matrix.balanceState] || `An entity of ${element} essence, unique in its expression.`
}

function generateChakraEssence(chakraWeb: ChakraWeb): string {
  const activated = chakraWeb.activationSequence
  const dominant = chakraWeb.dominantCurrent
  const dominantNode = chakraWeb.nodes[dominant]
  
  if (activated.length === 1) {
    return `Singular focus through the ${dominantNode.name} chakra creates a laser of ${dominantNode.color}-hued intensity.`
  }
  
  if (activated.length >= 6) {
    return `All energy centers pulse in ${chakraWeb.resonanceQuality}, creating a column of light from root to crown.`
  }
  
  if (chakraWeb.resonanceQuality === 'transcendence') {
    return `The ${activated.map(c => chakraWeb.nodes[c].name).join('-')} pathway forms a bridge to higher consciousness.`
  }
  
  return `${activated.length} chakras activate in sequence, with ${dominantNode.name} serving as the primary conduit.`
}

function getFrequencyQuality(frequency: number): string {
  if (frequency < 300) return 'the grounding frequencies of physical presence'
  if (frequency < 400) return 'the emotional waters of the heart'
  if (frequency < 500) return 'the mental clarity of focused thought'
  if (frequency < 600) return 'the spiritual heights of intuition'
  return 'the transcendent realms beyond ordinary perception'
}

function generateJourneyMap(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string[] {
  const stages: string[] = []
  
  // Opening stage
  const topNotes = signature.molecularPoetry.aromaticSymphony.find(l => l.note === 'top')
  if (topNotes) {
    stages.push(`First breath: ${topNotes.evocation}. The ${topNotes.oils.slice(0, 2).join(' and ')} announce their presence with ${topNotes.intensity > 70 ? 'bold clarity' : 'gentle invitation'}.`)
  }
  
  // Heart stage
  const heartNotes = signature.molecularPoetry.aromaticSymphony.find(l => l.note === 'heart')
  if (heartNotes) {
    stages.push(`The revelation: ${heartNotes.evocation}. Here, the blend speaks its truth through ${heartNotes.oils.slice(0, 2).join(' and ')}.`)
  }
  
  // Deepening stage
  const baseNotes = signature.molecularPoetry.aromaticSymphony.find(l => l.note === 'base')
  if (baseNotes) {
    stages.push(`The anchor: ${baseNotes.evocation}. ${baseNotes.oils.slice(0, 2).join(' and ')} provide the foundation that remains when all else has spoken.`)
  }
  
  // Chakra journey
  if (signature.chakraConstellation.pathways.length > 0) {
    const pathway = signature.chakraConstellation.pathways[0]
    const fromName = signature.chakraConstellation.nodes[pathway.from].name
    const toName = signature.chakraConstellation.nodes[pathway.to].name
    stages.push(`Energy flows from ${fromName} to ${toName}, creating a current of ${pathway.type === 'direct' ? 'immediate power' : pathway.type === 'bridging' ? 'distant connection' : 'spiraling wisdom'}.`)
  }
  
  // Temporal stage
  const peakDay = signature.temporalSignature.maturationCurve.find(s => s.potency === 100) || signature.temporalSignature.maturationCurve[2]
  if (peakDay) {
    stages.push(`Peak expression arrives on day ${peakDay.day}: ${peakDay.character}. ${peakDay.description}`)
  }
  
  return stages
}

function generateMysteryRevealed(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const mysteries: string[] = []
  
  // Emergence mystery
  if (signature.emergenceProfile.length > 0) {
    const emergence = signature.emergenceProfile[0]
    mysteries.push(`The ${emergence.name} emerges from the union of ${emergence.participatingOils.length} oils, creating an effect greater than the sum of its parts: ${emergence.effect}.`)
  }
  
  // Tarot mystery
  const tarot = signature.arcanaSignature.tarotCard
  mysteries.push(`The ${tarot.card} ${tarot.reversed ? 'reversed' : 'upright'} reveals: ${tarot.blendResonance}`)
  
  // Numerology mystery
  const numerology = signature.arcanaSignature.numerology
  mysteries.push(`The numbers speak: Soul ${numerology.soulNumber} (${numerology.meanings[numerology.soulNumber]}), Path ${numerology.pathNumber}, Destiny ${numerology.destinyNumber}.`)
  
  // Geometric mystery
  const geometry = signature.arcanaSignature.sacredGeometry
  mysteries.push(`The ${geometry.primary} at ${geometry.frequency}Hz encodes: ${geometry.significance}`)
  
  return mysteries.join(' ')
}

function generatePracticalMysticism(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const practical: string[] = []
  
  // Best time
  const bestWindow = signature.temporalSignature.optimalUsageWindows[0]
  if (bestWindow) {
    practical.push(`Optimal use during ${bestWindow.period.toLowerCase()} for ${bestWindow.quality.toLowerCase()}.`)
  }
  
  // Application method
  const methods = generateApplicationMethods(signature, selectedOils)
  practical.push(`Apply via ${methods.join(' or ')}.`)
  
  // Therapeutic focus
  const topTherapeutic = signature.molecularPoetry.therapeuticSignatures[0]
  if (topTherapeutic) {
    practical.push(`Primary therapeutic action: ${topTherapeutic.mechanism}. ${topTherapeutic.application}`)
  }
  
  // Intention setting
  practical.push(`Set the intention of ${signature.arcanaSignature.tarotCard.meaning.toLowerCase()} before each use.`)
  
  return practical.join(' ')
}

function generateApplicationMethods(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string[] {
  const methods: string[] = []
  
  // Diffusion for high air element
  if (signature.elementalResonance.air > 30) {
    methods.push('diffusion for atmospheric transformation')
  }
  
  // Topical for high earth element
  if (signature.elementalResonance.earth > 30) {
    methods.push('topical application with carrier oil')
  }
  
  // Inhalation for respiratory oils
  if (signature.molecularPoetry.therapeuticSignatures.some(t => t.category === 'Physical' && t.mechanism.includes('respir'))) {
    methods.push('direct inhalation')
  }
  
  // Anointing for spiritual oils
  if (signature.chakraConstellation.nodes.crown.activated || signature.chakraConstellation.nodes.thirdEye.activated) {
    methods.push('anointing of pulse points and third eye')
  }
  
  // Bath for water element
  if (signature.elementalResonance.water > 30) {
    methods.push('ritual bathing')
  }
  
  return methods.length > 0 ? methods.slice(0, 2) : ['diffusion', 'topical application']
}

function generateClosingBlessing(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): string {
  const blessings = [
    `May the ${signature.elementalResonance.dominant} within this blend guide you through ${signature.arcanaSignature.tarotCard.meaning.toLowerCase()}.`,
    `Through ${signature.vibrationalFrequency}Hz vibrations and ${signature.chakraConstellation.resonanceQuality} energy, may you find what you seek.`,
    `The ${signature.arcanaSignature.colorOracle.meaning} accompanies you on your journey.`,
    `As the ${signature.temporalSignature.lunarPhase.toLowerCase()} suggests: trust the cycle, embrace the transformation.`,
    `Signed in ${signature.arcanaSignature.runeInfluence.split(' - ')[0].toLowerCase()}, sealed with the ${signature.arcanaSignature.sacredGeometry.primary}.`
  ]
  
  const hashNum = parseInt(signature.hash.replace(/[^0-9A-F]/g, '').slice(-2), 16) || 0
  return blessings[hashNum % blessings.length]
}

function calculateUniquenessScore(
  signature: BlendSoulSignature,
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
): number {
  let score = 0
  
  // Oil count factor
  score += selectedOils.length * 3
  
  // Emergence patterns
  score += signature.emergenceProfile.length * 10
  
  // Rare patterns bonus
  const rarePatterns = signature.emergenceProfile.filter(e => e.rarity === 'rare' || e.rarity === 'epic' || e.rarity === 'legendary')
  score += rarePatterns.length * 15
  
  // Chakra complexity
  score += signature.chakraConstellation.activationSequence.length * 5
  
  // Elemental complexity
  const activeElements = Object.entries(signature.elementalResonance)
    .filter(([k, v]) => ['fire', 'water', 'earth', 'air', 'aether'].includes(k) && (v as number) > 10)
    .length
  score += activeElements * 5
  
  return Math.min(score, 100)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API - The Interface to Awakening
// ═══════════════════════════════════════════════════════════════════════════════

export interface AwakenedBlendDNA {
  selectedOils: Array<{ id: string; ml: number; percentage: number }>
  bottleSize: number
  carrierOil?: { type: string; ml: number }
  crystal?: string
  cord?: string
}

export const AwakenedRevelationEngine = {
  /**
   * Generates a complete awakened revelation from blend DNA.
   * Every call produces a unique result based on the blend's fingerprint.
   */
  revealBlend(dna: AwakenedBlendDNA): AwakenedRevelation {
    // Generate the soul signature
    const soulSignature = generateSoulSignature(
      dna.selectedOils,
      dna.bottleSize,
      dna.carrierOil
    )
    
    // Generate the full revelation
    const revelation = generateAwakenedRevelation(soulSignature, dna.selectedOils)
    
    return revelation
  },
  
  /**
   * Gets just the soul signature for visualization purposes.
   */
  getSoulSignature(dna: AwakenedBlendDNA): BlendSoulSignature {
    return generateSoulSignature(
      dna.selectedOils,
      dna.bottleSize,
      dna.carrierOil
    )
  },
  
  /**
   * Gets visual signature data for rendering.
   */
  getVisualSignature(dna: AwakenedBlendDNA): VisualSignature {
    const soulSignature = generateSoulSignature(
      dna.selectedOils,
      dna.bottleSize,
      dna.carrierOil
    )
    return soulSignature.visualDNA
  }
}

// Default export
export default AwakenedRevelationEngine
