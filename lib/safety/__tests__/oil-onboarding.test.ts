/**
 * Oil Onboarding System - Test Suite
 * 
 * These tests ensure that the onboarding system correctly validates
 * new oil safety profiles and catches any safety gaps.
 */

import {
  validateOilSafetyProfile,
  createOnboardingRecord,
  advanceStage,
  compareToSimilarOils,
  NewOilSafetyProfile
} from '../oil-onboarding-system';

// ============================================================================
// TEST DATA - Mock Oils
// ============================================================================

const validYlangYlangProfile: NewOilSafetyProfile = {
  id: 'ylang-ylang-complete',
  name: 'Ylang Ylang Complete',
  botanicalName: 'Cananga odorata',
  family: 'anonaceae',
  origin: 'Madagascar',
  extractionMethod: 'steam-distilled',
  
  chemicalProfile: {
    primaryComponents: [
      { name: 'linalool', casNumber: '78-70-6', percentage: 12, isAllergen: true },
      { name: 'geranyl acetate', casNumber: '105-87-3', percentage: 10, isAllergen: false },
      { name: 'caryophyllene', casNumber: '87-44-5', percentage: 12, isAllergen: false },
      { name: 'p-cresyl methyl ether', casNumber: '104-93-8', percentage: 15, isAllergen: false }
    ],
    secondaryComponents: [
      { name: 'benzyl acetate', percentage: 8, isAllergen: false },
      { name: 'geraniol', percentage: 5, isAllergen: true }
    ],
    traceComponents: [
      { name: 'eugenol', percentage: 0.5, isAllergen: false }
    ]
  },
  
  safetyFlags: {
    isPhototoxic: false,
    isNeurotoxic: false,
    isHepatotoxic: false,
    isNephrotoxic: false,
    isCarcinogenic: false,
    isSkinSensitizer: true,
    isRespiratorySensitizer: false,
    isEmmenagogue: false,
    isAbortifacient: false,
    isGalactagogue: false,
    isAnticoagulant: false,
    isHypertensive: false,
    isHypotensive: true,
    affectsBloodSugar: false,
    containsPhenols: false,
    containsKetones: false
  },
  
  interactions: {
    contraindicatedConditions: ['low-blood-pressure'],
    contraindicatedMedications: [
      {
        medicationCategory: 'antihypertensives',
        severity: 'caution',
        mechanism: 'Additive hypotensive effect',
        recommendation: 'Monitor blood pressure when using together'
      }
    ],
    potentialAllergens: ['linalool', 'geraniol'],
    crossReactsWith: ['ylang-ylang-extra', 'cananga']
  },
  
  ageRestrictions: {
    infant_0_3mo: { allowed: false, maxConcentration: null, notes: 'Avoid in infants' },
    infant_3_6mo: { allowed: false, maxConcentration: null, notes: 'Avoid in infants' },
    infant_6_12mo: { allowed: false, maxConcentration: null },
    toddler_1_2y: { allowed: true, maxConcentration: 0.5 },
    child_2_6y: { allowed: true, maxConcentration: 1.0 },
    child_6_12y: { allowed: true, maxConcentration: 1.5 },
    teen_12_18y: { allowed: true, maxConcentration: 2.0 },
    adult: { allowed: true, maxConcentration: 5.0 }
  },
  
  reproductiveSafety: {
    pregnancyTrimester1: { safety: 'caution', maxConcentration: 0.5, notes: 'Use sparingly' },
    pregnancyTrimester2: { safety: 'safe', maxConcentration: 1.0 },
    pregnancyTrimester3: { safety: 'safe', maxConcentration: 1.0 },
    breastfeeding: { safety: 'safe', maxConcentration: 1.0 },
    tryingToConceive: { safety: 'safe', maxConcentration: 2.0 }
  },
  
  routeSafety: {
    topical: { safe: true, maxConcentration: 5.0 },
    inhalation: { safe: true, notes: 'Generally safe for inhalation' },
    diffusion: { safe: true },
    oral: { safe: false, notes: 'Not recommended for oral use' }
  },
  
  maxConcentrations: {
    generalUse: 5.0,
    facialUse: 1.0,
    pregnancy: 1.0,
    children: 1.0,
    elderly: 2.0
  },
  
  references: [
    'Tisserand, R. & Young, R. (2014). Essential Oil Safety (2nd ed.). Churchill Livingstone.',
    'IFRA Standards Library - Ylang Ylang Oil (2023)'
  ],
  completedBy: 'safety-officer-1',
  completionDate: '2026-03-29',
  version: 1
};

const unsafeProfileWithErrors: NewOilSafetyProfile = {
  ...validYlangYlangProfile,
  id: 'citrus-unsafe',
  name: 'Bergamot (Unflagged)',
  family: 'rutaceae',
  safetyFlags: {
    ...validYlangYlangProfile.safetyFlags,
    isPhototoxic: false
  },
  chemicalProfile: {
    ...validYlangYlangProfile.chemicalProfile,
    primaryComponents: [
      { name: 'bergapten', percentage: 0.3, isAllergen: false, isPhototoxic: true }
    ]
  }
};

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Oil Onboarding System', () => {
  
  describe('validateOilSafetyProfile', () => {
    
    test('validates complete profile successfully', () => {
      const result = validateOilSafetyProfile(validYlangYlangProfile);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
    });
    
    test('detects missing chemical profile', () => {
      const profile = { 
        ...validYlangYlangProfile, 
        chemicalProfile: { primaryComponents: [], secondaryComponents: [], traceComponents: [] } 
      };
      const result = validateOilSafetyProfile(profile);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'chemicalProfile.primaryComponents',
          severity: 'critical'
        })
      );
    });
    
    test('detects unflagged phototoxicity in citrus family', () => {
      const result = validateOilSafetyProfile(unsafeProfileWithErrors);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'safetyFlags.isPhototoxic',
          message: expect.stringContaining('phototoxic')
        })
      );
    });
    
    test('flags missing pregnancy safety data', () => {
      const profileNoPregnancy = {
        ...validYlangYlangProfile,
        reproductiveSafety: {
          ...validYlangYlangProfile.reproductiveSafety,
          pregnancyTrimester1: undefined as any
        }
      };
      
      const result = validateOilSafetyProfile(profileNoPregnancy);
      
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'reproductiveSafety.pregnancyTrimester1',
          severity: 'critical'
        })
      );
    });
  });
  
  describe('createOnboardingRecord', () => {
    
    test('creates record with initial draft stage', () => {
      const record = createOnboardingRecord('new-oil-1', 'test-user');
      
      expect(record.oilId).toBe('new-oil-1');
      expect(record.currentStage).toBe('draft');
      expect(record.status).toHaveLength(1);
      expect(record.status[0].stage).toBe('draft');
    });
  });
  
  describe('advanceStage', () => {
    
    test('advances to chemical_analysis when data provided', () => {
      let record = createOnboardingRecord('test-oil', 'user');
      record.safetyProfile = validYlangYlangProfile;
      
      const result = advanceStage(record, 'chemical_analysis', 'chem-tech', 'GC/MS completed');
      
      expect(result.success).toBe(true);
      expect(result.record.currentStage).toBe('chemical_analysis');
    });
    
    test('blocks advancement to validation if validation not run', () => {
      let record = createOnboardingRecord('test-oil', 'user');
      record.safetyProfile = validYlangYlangProfile;
      record.currentStage = 'safety_research';
      
      const result = advanceStage(record, 'validation', 'user');
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Must run validation first');
    });
  });
});
