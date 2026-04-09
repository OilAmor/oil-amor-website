/**
 * Simplified Cord Options for Mixing Atelier
 * EXACT match with Collection: waxed-cotton, hemp, vegan-leather, elastic, mystery-pendant
 */

export interface SimpleCordOption {
  id: string;
  name: string;
  material: string;
  color: string;
  colorCode: string;
  price: number;
  description: string;
  bestFor?: string[];
  energy?: string;
}

// EXACT cords from Collection product-config.ts
export const SIMPLE_CORD_OPTIONS: SimpleCordOption[] = [
  {
    id: 'waxed-cotton',
    name: 'Waxed Cotton Cord',
    material: 'Waxed Cotton',
    color: 'Dark Brown',
    colorCode: '#2C241B',
    price: 0,
    description: 'Traditional cord with natural wax coating. Water-resistant and durable.',
    bestFor: ['Everyday wear', 'Boho style', 'Layering'],
    energy: 'Grounding, earthy connection'
  },
  {
    id: 'hemp',
    name: 'Hemp Cord',
    material: 'Natural Hemp',
    color: 'Natural',
    colorCode: '#8B7355',
    price: 0,
    description: 'Eco-friendly, strong natural fiber. Earthy texture that ages beautifully.',
    bestFor: ['Eco-conscious', 'Natural look', 'Rustic style'],
    energy: 'Organic, sustainable vitality'
  },
  {
    id: 'vegan-leather',
    name: 'Vegan Leather Cord',
    material: 'Cork/Pineapple Leather',
    color: 'Brown',
    colorCode: '#4A3728',
    price: 0,
    description: 'Cruelty-free alternative with luxurious feel. Soft and comfortable.',
    bestFor: ['Premium look', 'Sensitive skin', 'Elegant style'],
    energy: 'Luxurious, compassionate protection'
  },
  {
    id: 'elastic',
    name: 'Stretch Elastic',
    material: 'Silicone Elastic',
    color: 'Black',
    colorCode: '#333333',
    price: 0,
    description: 'Comfortable stretch cord for bracelets. Easy on and off.',
    bestFor: ['Bracelets', 'Active wear', 'Easy adjustment'],
    energy: 'Flexible, adaptable flow'
  },
  {
    id: 'mystery-pendant',
    name: 'Mystery Crystal Pendant',
    material: 'Crystal + Bail',
    color: 'Mystery',
    colorCode: '#9333ea',
    price: 0,
    description: 'A surprise crystal pendant intuitively selected for your oil. Perfect for those who already have cords.',
    bestFor: ['Ready-to-wear', 'Gift surprise', 'No cord needed'],
    energy: 'Intuitive, divinely guided selection'
  },
];

export const DEFAULT_SIMPLE_CORD = SIMPLE_CORD_OPTIONS[0];

export function getSimpleCordById(id: string): SimpleCordOption {
  return SIMPLE_CORD_OPTIONS.find(c => c.id === id) || DEFAULT_SIMPLE_CORD;
}
