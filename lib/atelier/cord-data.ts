/**
 * Cord & Closure System - The Final Touch
 * 
 * Cords are the bridge between the blend and the wearer.
 * Each material, color, and weave carries symbolic weight.
 */

export interface CordOption {
  id: string;
  name: string;
  material: 'silk' | 'cotton' | 'hemp' | 'leather' | 'waxed-cord';
  color: string;
  colorCode: string;
  thickness: 'fine' | 'medium' | 'thick';
  length: number; // cm
  price: number;
  symbolism: string;
  energeticQuality: 'flowing' | 'grounding' | 'protective' | 'activating';
  bestFor: string[]; // archetypes this cord complements
  description: string;
  imageUrl?: string;
}

export const CORD_OPTIONS: CordOption[] = [
  // SILK - Flowing, Luxurious, Elegant
  {
    id: 'silk-midnight',
    name: 'Midnight Silk',
    material: 'silk',
    color: 'Midnight Black',
    colorCode: '#0a0a0a',
    thickness: 'fine',
    length: 45,
    price: 15,
    symbolism: 'The void from which all creation emerges. Mystery, depth, and infinite potential.',
    energeticQuality: 'flowing',
    bestFor: ['the-mystic', 'the-shadow-work', 'the-deep-dive', 'the-night-keeper'],
    description: 'Hand-spun silk in the deepest black, soft as shadow itself. For those who walk between worlds.'
  },
  {
    id: 'silk-rose',
    name: 'Rose Silk',
    material: 'silk',
    color: 'Dusty Rose',
    colorCode: '#d4a5a5',
    thickness: 'fine',
    length: 45,
    price: 15,
    symbolism: 'The opening heart. Gentleness, self-love, and compassion for the journey.',
    energeticQuality: 'flowing',
    bestFor: ['the-healer', 'the-sanctuary', 'the-dawn-bringer'],
    description: 'Soft rose silk that speaks of tenderness and heart-centered awareness.'
  },
  {
    id: 'silk-gold',
    name: 'Golden Hour Silk',
    material: 'silk',
    color: 'Antique Gold',
    colorCode: '#c9a227',
    thickness: 'fine',
    length: 45,
    price: 18,
    symbolism: 'Solar radiance captured in thread. Success, confidence, and divine timing.',
    energeticQuality: 'activating',
    bestFor: ['the-warrior', 'the-ignite', 'the-dawn-bringer', 'the-alchemist'],
    description: 'Luxurious gold silk that catches light like the setting sun. For those who shine.'
  },
  {
    id: 'silk-silver',
    name: 'Moonbeam Silk',
    material: 'silk',
    color: 'Silver',
    colorCode: '#c0c0c0',
    thickness: 'fine',
    length: 45,
    price: 18,
    symbolism: 'Lunar intuition and reflective wisdom. Dreams, cycles, and inner knowing.',
    energeticQuality: 'flowing',
    bestFor: ['the-mystic', 'the-celestial-dance', 'the-night-keeper'],
    description: 'Shimmering silver silk that mirrors moonlight. For intuitive work and dream weaving.'
  },
  
  // COTTON - Natural, Grounded, Authentic
  {
    id: 'cotton-natural',
    name: 'Raw Cotton',
    material: 'cotton',
    color: 'Natural Undyed',
    colorCode: '#e8dcc8',
    thickness: 'medium',
    length: 50,
    price: 8,
    symbolism: 'Purity and authenticity. Returning to essence, unadorned truth.',
    energeticQuality: 'grounding',
    bestFor: ['the-groundskeeper', 'the-healer', 'the-forest-whisper', 'the-alchemist'],
    description: 'Unbleached organic cotton in its natural state. Earthy, honest, and true.'
  },
  {
    id: 'cotton-charcoal',
    name: 'Charcoal Cotton',
    material: 'cotton',
    color: 'Washed Charcoal',
    colorCode: '#4a4a4a',
    thickness: 'medium',
    length: 50,
    price: 8,
    symbolism: 'Grounded strength and neutral power. The charcoal that purifies.',
    energeticQuality: 'grounding',
    bestFor: ['the-shadow-work', 'the-groundskeeper', 'the-warrior'],
    description: 'Stone-washed cotton in deep charcoal. Subtle strength for everyday warriors.'
  },
  {
    id: 'cotton-terracotta',
    name: 'Terracotta Cotton',
    material: 'cotton',
    color: 'Terracotta',
    colorCode: '#c06c4f',
    thickness: 'medium',
    length: 50,
    price: 8,
    symbolism: 'Earth mother energy. Nurturing, creative, and grounded in body wisdom.',
    energeticQuality: 'grounding',
    bestFor: ['the-healer', 'the-groundskeeper', 'the-sanctuary'],
    description: 'Warm terracotta reminiscent of desert clay and ancient pottery. Earth medicine.'
  },
  {
    id: 'cotton-forest',
    name: 'Forest Cotton',
    material: 'cotton',
    color: 'Deep Forest',
    colorCode: '#2d4a3e',
    thickness: 'medium',
    length: 50,
    price: 8,
    symbolism: 'The ancient woods. Growth, resilience, and connection to nature spirits.',
    energeticQuality: 'grounding',
    bestFor: ['the-forest-whisper', 'the-groundskeeper', 'the-healer'],
    description: 'Deep green cotton evoking old growth forests. For nature connection work.'
  },
  {
    id: 'cotton-midnight',
    name: 'Midnight Cotton',
    material: 'cotton',
    color: 'Midnight Blue',
    colorCode: '#191970',
    thickness: 'medium',
    length: 50,
    price: 8,
    symbolism: 'The night sky before stars appear. Deep contemplation and cosmic connection.',
    energeticQuality: 'grounding',
    bestFor: ['the-night-keeper', 'the-celestial-dance', 'the-mystic'],
    description: 'Rich navy blue cotton like the sky at twilight. For evening rituals and star work.'
  },
  
  // HEMP - Strong, Durable, Earthy
  {
    id: 'hemp-natural',
    name: 'Natural Hemp',
    material: 'hemp',
    color: 'Natural Beige',
    colorCode: '#b5a642',
    thickness: 'thick',
    length: 55,
    price: 10,
    symbolism: 'Endurance and natural law. What is rooted survives the storm.',
    energeticQuality: 'grounding',
    bestFor: ['the-warrior', 'the-groundskeeper', 'the-shadow-work'],
    description: 'Raw hemp cord, strong and slightly textured. The choice of endurance.'
  },
  {
    id: 'hemp-walnut',
    name: 'Walnut Hemp',
    material: 'hemp',
    color: 'Dark Walnut',
    colorCode: '#5c4a3d',
    thickness: 'thick',
    length: 55,
    price: 10,
    symbolism: 'Deep roots and ancient wisdom. The strength of the oak in cord form.',
    energeticQuality: 'grounding',
    bestFor: ['the-groundskeeper', 'the-forest-whisper', 'the-warrior'],
    description: 'Dark-stained hemp, rich and earthy. For deep grounding and protection.'
  },
  {
    id: 'hemp-rust',
    name: 'Rust Hemp',
    material: 'hemp',
    color: 'Iron Rust',
    colorCode: '#8b4513',
    thickness: 'thick',
    length: 55,
    price: 10,
    symbolism: 'Forged in fire and time. Resilience, transformation, and weathered strength.',
    energeticQuality: 'grounding',
    bestFor: ['the-warrior', 'the-shadow-work', 'the-ignite'],
    description: 'Iron-rust colored hemp. For those who have been through fire and emerged stronger.'
  },
  
  // LEATHER - Protective, Strong, Tribal
  {
    id: 'leather-black',
    name: 'Midnight Leather',
    material: 'leather',
    color: 'Black',
    colorCode: '#1a1a1a',
    thickness: 'medium',
    length: 50,
    price: 20,
    symbolism: 'The warrior shield. Protection, boundaries, and fierce self-defense.',
    energeticQuality: 'protective',
    bestFor: ['the-warrior', 'the-shadow-work', 'the-night-keeper'],
    description: 'Black leather cord, smooth and strong. For protection and boundary work.'
  },
  {
    id: 'leather-brown',
    name: 'Saddle Leather',
    material: 'leather',
    color: 'Rich Brown',
    colorCode: '#8b4513',
    thickness: 'medium',
    length: 50,
    price: 20,
    symbolism: 'The path of the journeyer. Adventure, experience, and weathered wisdom.',
    energeticQuality: 'protective',
    bestFor: ['the-messenger', 'the-groundskeeper', 'the-forest-whisper'],
    description: 'Rich brown leather that ages beautifully with wear. For the journey ahead.'
  },
  {
    id: 'leather-burgundy',
    name: 'Blood Leather',
    material: 'leather',
    color: 'Deep Burgundy',
    colorCode: '#800020',
    thickness: 'medium',
    length: 50,
    price: 22,
    symbolism: 'Life force and vitality. The blood that carries lineage and power.',
    energeticQuality: 'activating',
    bestFor: ['the-warrior', 'the-ignite', 'the-healer'],
    description: 'Deep burgundy leather, rich as wine and blood. For vitality and life force work.'
  },
  
  // WAXED CORD - Practical, Modern, Versatile
  {
    id: 'waxed-black',
    name: 'Onyx Waxed',
    material: 'waxed-cord',
    color: 'Black',
    colorCode: '#0d0d0d',
    thickness: 'fine',
    length: 45,
    price: 6,
    symbolism: 'Sleek protection and modern magic. For the urban mystic.',
    energeticQuality: 'protective',
    bestFor: ['the-mystic', 'the-night-keeper', 'the-shadow-work'],
    description: 'Sleek black waxed cord that repels water and time. Modern and mysterious.'
  },
  {
    id: 'waxed-amber',
    name: 'Amber Waxed',
    material: 'waxed-cord',
    color: 'Golden Amber',
    colorCode: '#ffbf00',
    thickness: 'fine',
    length: 45,
    price: 6,
    symbolism: 'Captured sunlight and preserved wisdom. The fossilized light of ages.',
    energeticQuality: 'activating',
    bestFor: ['the-dawn-bringer', 'the-ignite', 'the-alchemist'],
    description: 'Warm amber waxed cord like fossilized resin. For solar work and manifestation.'
  },
  {
    id: 'waxed-emerald',
    name: 'Emerald Waxed',
    material: 'waxed-cord',
    color: 'Deep Emerald',
    colorCode: '#046307',
    thickness: 'fine',
    length: 45,
    price: 6,
    symbolism: 'The heart of the forest. Growth, abundance, and natural prosperity.',
    energeticQuality: 'grounding',
    bestFor: ['the-forest-whisper', 'the-healer', 'the-groundskeeper'],
    description: 'Deep emerald green waxed cord. For heart-centered nature connection.'
  }
];

export function getCordById(id: string): CordOption | undefined {
  return CORD_OPTIONS.find(c => c.id === id);
}

export function getCordsByMaterial(material: CordOption['material']): CordOption[] {
  return CORD_OPTIONS.filter(c => c.material === material);
}

export function getCordsByArchetype(archetype: string): CordOption[] {
  return CORD_OPTIONS.filter(c => c.bestFor.includes(archetype));
}

export function suggestCordForBlend(archetype: string, crystalElement: string): CordOption[] {
  // First try to match by archetype
  let suggestions = getCordsByArchetype(archetype);
  
  // If not enough, add by element complementarity
  if (suggestions.length < 3) {
    const elementQuality: Record<string, CordOption['energeticQuality']> = {
      'fire': 'grounding',
      'water': 'activating',
      'earth': 'flowing',
      'air': 'grounding',
      'ether': 'grounding'
    };
    
    const complementary = CORD_OPTIONS.filter(c => 
      c.energeticQuality === elementQuality[crystalElement] &&
      !suggestions.includes(c)
    );
    
    suggestions = [...suggestions, ...complementary];
  }
  
  return suggestions.slice(0, 4);
}

export const DEFAULT_CORD = CORD_OPTIONS[5]; // Raw Cotton
