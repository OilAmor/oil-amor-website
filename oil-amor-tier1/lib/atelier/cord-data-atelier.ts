/**
 * Atelier Cord Options - EXACT match to Collection
 * Using real pricing from attachment-options.ts
 */

export interface AtelierCordOption {
  id: string;
  name: string;
  material: string;
  color: string;
  hexColor: string;
  price: number;
  description: string;
  sustainability?: {
    biodegradable: boolean;
    origin: string;
    certifications?: string[];
  };
  properties: {
    durability: number;
    waterResistance: number;
    flexibility: number;
    texture: string;
  };
  aesthetic: string;
  symbolism: string;
  energeticQuality: 'grounding' | 'flowing' | 'protective' | 'activating';
}

// EXACT cords from collection with correct pricing
export const ATELIER_CORD_OPTIONS: AtelierCordOption[] = [
  {
    id: 'waxed-cotton-natural',
    name: 'Heritage Waxed Cotton',
    material: 'waxed-cotton',
    color: 'Natural Brown',
    hexColor: '#8B7355',
    price: 0, // Free
    description: 'Classic waxed cotton cord with a heritage feel. Water-resistant and ages beautifully with a natural patina.',
    sustainability: {
      biodegradable: true,
      origin: 'Australia',
      certifications: ['OEKO-TEX'],
    },
    properties: {
      durability: 8,
      waterResistance: 9,
      flexibility: 7,
      texture: 'smooth',
    },
    aesthetic: 'rustic',
    symbolism: 'Heritage, tradition, and timeless connection to earth',
    energeticQuality: 'grounding',
  },
  {
    id: 'waxed-cotton-black',
    name: 'Midnight Waxed Cotton',
    material: 'waxed-cotton',
    color: 'Black',
    hexColor: '#1a1a1a',
    price: 0, // Free
    description: 'Sleek black waxed cotton for a modern, sophisticated look.',
    sustainability: {
      biodegradable: true,
      origin: 'Australia',
    },
    properties: {
      durability: 8,
      waterResistance: 9,
      flexibility: 7,
      texture: 'smooth',
    },
    aesthetic: 'minimal',
    symbolism: 'Mystery, protection, and modern elegance',
    energeticQuality: 'protective',
  },
  {
    id: 'hemp-natural',
    name: 'Raw Hemp Fiber',
    material: 'hemp',
    color: 'Natural Green-Brown',
    hexColor: '#4A5D23',
    price: 0, // Free
    description: 'Sustainably grown hemp with natural texture. Strong, durable, and eco-friendly. Softens with use.',
    sustainability: {
      biodegradable: true,
      origin: 'Nepal',
      certifications: ['GOTS', 'Fair Trade'],
    },
    properties: {
      durability: 9,
      waterResistance: 5,
      flexibility: 6,
      texture: 'textured',
    },
    aesthetic: 'bohemian',
    symbolism: 'Sustainability, strength, and connection to nature',
    energeticQuality: 'grounding',
  },
  {
    id: 'vegan-leather-black',
    name: 'Midnight Vegan Leather',
    material: 'vegan-leather',
    color: 'Black',
    hexColor: '#0a0a0a',
    price: 2.00, // $2.00 premium
    description: 'Premium Italian vegan leather. Sophisticated, durable, and cruelty-free.',
    sustainability: {
      biodegradable: false,
      origin: 'Italy',
    },
    properties: {
      durability: 10,
      waterResistance: 8,
      flexibility: 8,
      texture: 'smooth',
    },
    aesthetic: 'luxury',
    symbolism: 'Luxury, protection, and conscious elegance',
    energeticQuality: 'protective',
  },
];

export const DEFAULT_ATELIER_CORD = ATELIER_CORD_OPTIONS[0];

export function getAtelierCordById(id: string): AtelierCordOption {
  return ATELIER_CORD_OPTIONS.find(c => c.id === id) || DEFAULT_ATELIER_CORD;
}
