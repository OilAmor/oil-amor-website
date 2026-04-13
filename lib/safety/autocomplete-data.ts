/**
 * Autocomplete Data for Medications & Allergies
 * 
 * Searchable databases for real-time autocomplete functionality
 */

import { COMMON_MEDICATIONS } from './medication-database';

// ============================================================================
// MEDICATION SEARCH
// ============================================================================

export interface MedicationSearchResult {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  matchType: 'generic' | 'brand' | 'class' | 'searchTerm';
  matchText: string;
}

export function searchMedications(query: string): MedicationSearchResult[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  const results: MedicationSearchResult[] = [];
  const seen = new Set<string>();

  for (const med of COMMON_MEDICATIONS) {
    // Check generic name
    if (med.genericName.toLowerCase().includes(lowerQuery)) {
      const id = `med-${med.genericName}`;
      if (!seen.has(id)) {
        seen.add(id);
        results.push({
          id,
          genericName: med.genericName,
          brandNames: med.brandNames || [],
          drugClass: med.drugClass,
          matchType: 'generic',
          matchText: med.genericName,
        });
      }
      continue;
    }

    // Check brand names
    const matchingBrand = med.brandNames?.find(b => 
      b.toLowerCase().includes(lowerQuery)
    );
    if (matchingBrand) {
      const id = `med-${med.genericName}`;
      if (!seen.has(id)) {
        seen.add(id);
        results.push({
          id,
          genericName: med.genericName,
          brandNames: med.brandNames || [],
          drugClass: med.drugClass,
          matchType: 'brand',
          matchText: matchingBrand,
        });
      }
      continue;
    }

    // Check drug class
    if (med.drugClass.toLowerCase().includes(lowerQuery)) {
      const id = `med-${med.genericName}`;
      if (!seen.has(id)) {
        seen.add(id);
        results.push({
          id,
          genericName: med.genericName,
          brandNames: med.brandNames || [],
          drugClass: med.drugClass,
          matchType: 'class',
          matchText: med.drugClass,
        });
      }
      continue;
    }

    // Check search terms
    const matchingTerm = med.searchTerms?.find(t => 
      t.toLowerCase().includes(lowerQuery)
    );
    if (matchingTerm) {
      const id = `med-${med.genericName}`;
      if (!seen.has(id)) {
        seen.add(id);
        results.push({
          id,
          genericName: med.genericName,
          brandNames: med.brandNames || [],
          drugClass: med.drugClass,
          matchType: 'searchTerm',
          matchText: matchingTerm,
        });
      }
    }
  }

  // Sort: generic matches first, then brand, then class, then search terms
  const priority = { generic: 0, brand: 1, class: 2, searchTerm: 3 };
  return results
    .sort((a, b) => priority[a.matchType] - priority[b.matchType])
    .slice(0, 10); // Limit to 10 results
}

// ============================================================================
// ESSENTIAL OIL ALLERGIES SEARCH
// ============================================================================

export interface AllergySearchResult {
  id: string;
  name: string;
  type: 'essential-oil' | 'component' | 'botanical' | 'chemical';
  relatedOils: string[];
  crossReactivity: string[];
}

const ESSENTIAL_OIL_ALLERGENS: AllergySearchResult[] = [
  // Essential Oils
  { id: 'allergy-lavender', name: 'Lavender', type: 'essential-oil', relatedOils: ['lavender', 'lavandin'], crossReactivity: ['linalool', 'linalyl acetate'] },
  { id: 'allergy-tea-tree', name: 'Tea Tree', type: 'essential-oil', relatedOils: ['tea-tree'], crossReactivity: ['terpinen-4-ol'] },
  { id: 'allergy-eucalyptus', name: 'Eucalyptus', type: 'essential-oil', relatedOils: ['eucalyptus', 'eucalyptus-radiata', 'eucalyptus-globulus'], crossReactivity: ['1,8-cineole', 'eucalyptol'] },
  { id: 'allergy-peppermint', name: 'Peppermint', type: 'essential-oil', relatedOils: ['peppermint', 'cornmint'], crossReactivity: ['menthol', 'menthone'] },
  { id: 'allergy-lemon', name: 'Lemon', type: 'essential-oil', relatedOils: ['lemon', 'lime', 'grapefruit', 'bergamot'], crossReactivity: ['limonene', 'citral'] },
  { id: 'allergy-orange', name: 'Orange', type: 'essential-oil', relatedOils: ['orange', 'sweet-orange', 'blood-orange'], crossReactivity: ['limonene'] },
  { id: 'allergy-bergamot', name: 'Bergamot', type: 'essential-oil', relatedOils: ['bergamot', 'bergamot-fcf'], crossReactivity: ['limonene', 'linalool'] },
  { id: 'allergy-cinnamon', name: 'Cinnamon', type: 'essential-oil', relatedOils: ['cinnamon-bark', 'cinnamon-leaf'], crossReactivity: ['cinnamaldehyde', 'eugenol'] },
  { id: 'allergy-clove', name: 'Clove', type: 'essential-oil', relatedOils: ['clove-bud', 'clove-leaf'], crossReactivity: ['eugenol'] },
  { id: 'allergy-rosemary', name: 'Rosemary', type: 'essential-oil', relatedOils: ['rosemary'], crossReactivity: ['1,8-cineole', 'camphor'] },
  { id: 'allergy-chamomile', name: 'Chamomile', type: 'essential-oil', relatedOils: ['roman-chamomile', 'german-chamomile'], crossReactivity: ['bisabolol', 'chamazulene'] },
  { id: 'allergy-ylang', name: 'Ylang Ylang', type: 'essential-oil', relatedOils: ['ylang-ylang'], crossReactivity: ['linalool', 'geranyl acetate'] },
  { id: 'allergy-geranium', name: 'Geranium', type: 'essential-oil', relatedOils: ['geranium', 'geranium-bourbon'], crossReactivity: ['geraniol', 'citronellol'] },
  { id: 'allergy-jasmine', name: 'Jasmine', type: 'essential-oil', relatedOils: ['jasmine'], crossReactivity: ['benzyl acetate', 'linalool'] },
  { id: 'allergy-rose', name: 'Rose', type: 'essential-oil', relatedOils: ['rose', 'rose-otto', 'rose-absolute'], crossReactivity: ['citronellol', 'geraniol'] },
  { id: 'allergy-sandalwood', name: 'Sandalwood', type: 'essential-oil', relatedOils: ['sandalwood'], crossReactivity: ['santalol'] },
  { id: 'allergy-frankincense', name: 'Frankincense', type: 'essential-oil', relatedOils: ['frankincense'], crossReactivity: ['alpha-pinene', 'limonene'] },
  { id: 'allergy-myrrh', name: 'Myrrh', type: 'essential-oil', relatedOils: ['myrrh'], crossReactivity: ['furanoedesmane'] },
  { id: 'allergy-patchouli', name: 'Patchouli', type: 'essential-oil', relatedOils: ['patchouli', 'patchouli-dark'], crossReactivity: ['patchoulol'] },
  { id: 'allergy-vetiver', name: 'Vetiver', type: 'essential-oil', relatedOils: ['vetiver'], crossReactivity: ['vetiverol'] },
  { id: 'allergy-lemongrass', name: 'Lemongrass', type: 'essential-oil', relatedOils: ['lemongrass', 'may-chang'], crossReactivity: ['citral', 'geraniol'] },
  { id: 'allergy-ginger', name: 'Ginger', type: 'essential-oil', relatedOils: ['ginger'], crossReactivity: ['zingiberene'] },
  { id: 'allergy-nutmeg', name: 'Nutmeg', type: 'essential-oil', relatedOils: ['nutmeg'], crossReactivity: ['myristicin'] },
  { id: 'allergy-wintergreen', name: 'Wintergreen', type: 'essential-oil', relatedOils: ['wintergreen', 'birch'], crossReactivity: ['methyl salicylate'] },
  { id: 'allergy-cedarwood', name: 'Cedarwood', type: 'essential-oil', relatedOils: ['cedarwood', 'cedarwood-atlas'], crossReactivity: ['cedrol'] },
  { id: 'allergy-thyme', name: 'Thyme', type: 'essential-oil', relatedOils: ['thyme', 'thyme-thymol', 'thyme-linalool'], crossReactivity: ['thymol', 'carvacrol'] },
  { id: 'allergy-oregano', name: 'Oregano', type: 'essential-oil', relatedOils: ['oregano'], crossReactivity: ['carvacrol', 'thymol'] },
  { id: 'allergy-fennel', name: 'Fennel', type: 'essential-oil', relatedOils: ['fennel', 'fennel-sweet'], crossReactivity: ['anethole', 'estragole'] },
  { id: 'allergy-anise', name: 'Anise/Aniseed', type: 'essential-oil', relatedOils: ['aniseed', 'star-anise'], crossReactivity: ['anethole'] },
  { id: 'allergy-pine', name: 'Pine', type: 'essential-oil', relatedOils: ['pine', 'scotch-pine', 'fir'], crossReactivity: ['alpha-pinene', 'delta-3-carene'] },
  { id: 'allergy-spruce', name: 'Spruce', type: 'essential-oil', relatedOils: ['spruce', 'black-spruce'], crossReactivity: ['bornyl acetate'] },
  { id: 'allergy-juniper', name: 'Juniper', type: 'essential-oil', relatedOils: ['juniper-berry', 'juniper'], crossReactivity: ['alpha-pinene'] },
  { id: 'allergy-cypress', name: 'Cypress', type: 'essential-oil', relatedOils: ['cypress'], crossReactivity: ['alpha-pinene', 'delta-3-carene'] },
  { id: 'allergy-marjoram', name: 'Marjoram', type: 'essential-oil', relatedOils: ['marjoram', 'sweet-marjoram'], crossReactivity: ['terpinen-4-ol'] },
  { id: 'allergy-basil', name: 'Basil', type: 'essential-oil', relatedOils: ['basil', 'basil-linalool'], crossReactivity: ['linalool', 'methyl chavicol'] },
  { id: 'allergy-tangerine', name: 'Tangerine', type: 'essential-oil', relatedOils: ['tangerine', 'mandarin', 'clementine'], crossReactivity: ['limonene', 'gamma-terpinene'] },
  { id: 'allergy-grapefruit', name: 'Grapefruit', type: 'essential-oil', relatedOils: ['grapefruit', 'grapefruit-pink'], crossReactivity: ['limonene', 'nootkatone'] },
  { id: 'allergy-turmeric', name: 'Turmeric', type: 'essential-oil', relatedOils: ['turmeric'], crossReactivity: ['turmerone', 'ar-turmerone'] },
  
  // Chemical Components
  { id: 'allergy-linalool', name: 'Linalool', type: 'component', relatedOils: ['lavender', 'bergamot', 'rosewood', 'ylang-ylang', 'coriander'], crossReactivity: ['lavender', 'rosewood'] },
  { id: 'allergy-limonene', name: 'Limonene', type: 'component', relatedOils: ['lemon', 'orange', 'grapefruit', 'bergamot', 'lime'], crossReactivity: ['all-citrus'] },
  { id: 'allergy-eugenol', name: 'Eugenol', type: 'component', relatedOils: ['clove-bud', 'cinnamon-leaf', 'bay'], crossReactivity: ['clove', 'cinnamon'] },
  { id: 'allergy-geraniol', name: 'Geraniol', type: 'component', relatedOils: ['geranium', 'rose', 'palmarosa', 'citronella'], crossReactivity: ['rose-family'] },
  { id: 'allergy-citronellol', name: 'Citronellol', type: 'component', relatedOils: ['rose', 'geranium', 'citronella'], crossReactivity: ['rose-family'] },
  { id: 'allergy-citral', name: 'Citral', type: 'component', relatedOils: ['lemongrass', 'may-chang', 'lemon-myrtle', 'verbena'], crossReactivity: ['lemongrass', 'verbena'] },
  { id: 'allergy-cinnamaldehyde', name: 'Cinnamaldehyde', type: 'component', relatedOils: ['cinnamon-bark', 'cassia'], crossReactivity: ['cinnamon'] },
  { id: 'allergy-menthol', name: 'Menthol', type: 'component', relatedOils: ['peppermint', 'cornmint', 'mentha-arvensis'], crossReactivity: ['mint-family'] },
  { id: 'allergy-thymol', name: 'Thymol', type: 'component', relatedOils: ['thyme', 'oregano', 'thyme-thymol'], crossReactivity: ['thyme', 'oregano'] },
  { id: 'allergy-pinene', name: 'Alpha-Pinene', type: 'component', relatedOils: ['pine', 'eucalyptus', 'rosemary', 'frankincense'], crossReactivity: ['conifers', 'eucalyptus'] },
  { id: 'allergy-cineole', name: '1,8-Cineole (Eucalyptol)', type: 'component', relatedOils: ['eucalyptus', 'rosemary', 'tea-tree', 'cajeput'], crossReactivity: ['eucalyptus', 'cajeput'] },
  { id: 'allergy-camphor', name: 'Camphor', type: 'component', relatedOils: ['camphor', 'rosemary', 'lavender', 'sage'], crossReactivity: ['camphoraceous-oils'] },
  { id: 'allergy-anethole', name: 'Anethole', type: 'component', relatedOils: ['fennel', 'aniseed', 'star-anise'], crossReactivity: ['anise-family'] },
  { id: 'allergy-safrole', name: 'Safrole', type: 'component', relatedOils: ['sassafras', 'camphor', 'nutmeg'], crossReactivity: [] },
  { id: 'allergy-methyl-salicylate', name: 'Methyl Salicylate', type: 'component', relatedOils: ['wintergreen', 'birch'], crossReactivity: ['aspirin-allergy'] },
  
  // Botanical Families
  { id: 'allergy-ragweed', name: 'Ragweed/Daisy Family (Asteraceae)', type: 'botanical', relatedOils: ['chamomile-german', 'chamomile-roman', 'yarrow', 'tansy', 'helichrysum'], crossReactivity: ['all-chamomiles'] },
  { id: 'allergy-mint-family', name: 'Mint Family (Lamiaceae)', type: 'botanical', relatedOils: ['peppermint', 'spearmint', 'lavender', 'rosemary', 'thyme', 'oregano', 'basil', 'marjoram', 'sage', 'clary-sage'], crossReactivity: ['mint-family'] },
  { id: 'allergy-citrus-family', name: 'Citrus Family (Rutaceae)', type: 'botanical', relatedOils: ['lemon', 'orange', 'lime', 'grapefruit', 'bergamot', 'mandarin', 'tangerine'], crossReactivity: ['all-citrus'] },
  { id: 'allergy-conifer', name: 'Pine/Conifer Family', type: 'botanical', relatedOils: ['pine', 'fir', 'spruce', 'cedarwood', 'cypress', 'juniper'], crossReactivity: ['conifers'] },
  { id: 'allergy-lauraceae', name: 'Laurel Family (Lauraceae)', type: 'botanical', relatedOils: ['cinnamon-bark', 'cinnamon-leaf', 'cassia', 'camphor', 'ravensara', 'bay'], crossReactivity: ['cinnamon-family'] },
  
  // Chemical Groups
  { id: 'allergy-esters', name: 'Esters (chemical group)', type: 'chemical', relatedOils: ['lavender', 'clary-sage', 'petitgrain', 'bergamot'], crossReactivity: [] },
  { id: 'allergy-aldehydes', name: 'Aldehydes (chemical group)', type: 'chemical', relatedOils: ['lemongrass', 'may-chang', 'cinnamon', 'melissa'], crossReactivity: [] },
  { id: 'allergy-phenols', name: 'Phenols (chemical group)', type: 'chemical', relatedOils: ['oregano', 'thyme', 'clove', 'cinnamon-leaf'], crossReactivity: [] },
  { id: 'allergy-ketones', name: 'Ketones (chemical group)', type: 'chemical', relatedOils: ['rosemary', 'sage', 'hyssop', 'fennel', 'spearmint'], crossReactivity: [] },
  
  // Other common allergens
  { id: 'allergy-fragrance', name: 'Synthetic Fragrance/Perfume', type: 'chemical', relatedOils: [], crossReactivity: [] },
  { id: 'allergy-nuts', name: 'Nut Allergies (almond, coconut concern)', type: 'chemical', relatedOils: [], crossReactivity: ['sweet-almond-carrier', 'fractionated-coconut'] },
  { id: 'allergy-latex', name: 'Latex Allergy', type: 'chemical', relatedOils: [], crossReactivity: ['papaya', 'pineapple'] },
];

export function searchAllergies(query: string): AllergySearchResult[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  
  return ESSENTIAL_OIL_ALLERGENS.filter(allergy => 
    allergy.name.toLowerCase().includes(lowerQuery) ||
    allergy.type.toLowerCase().includes(lowerQuery) ||
    allergy.relatedOils.some(oil => oil.toLowerCase().includes(lowerQuery))
  ).slice(0, 8);
}

export function getAllergyById(id: string): AllergySearchResult | undefined {
  return ESSENTIAL_OIL_ALLERGENS.find(a => a.id === id);
}

export function getRelatedOilsForAllergy(allergyId: string): string[] {
  const allergy = getAllergyById(allergyId);
  return allergy ? [...allergy.relatedOils, ...allergy.crossReactivity] : [];
}
