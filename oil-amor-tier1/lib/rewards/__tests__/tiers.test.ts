/**
 * Tier System Tests
 * 
 * Comprehensive tests for tier calculation and progression logic.
 */

import {
  calculateTier,
  getNextTier,
  getSpendToNextTier,
  getProgressToNextTier,
  getTierProgressDetails,
  checkTierUpgrade,
  CRYSTAL_CIRCLE_TIERS,
  TIER_ORDER,
  type TierLevel
} from '../tiers';

describe('Tier System', () => {
  describe('calculateTier', () => {
    it('should return seed tier for $0 spend', () => {
      expect(calculateTier(0)).toBe('seed');
      expect(calculateTier(50)).toBe('seed');
      expect(calculateTier(149.99)).toBe('seed');
    });

    it('should return sprout tier for $150-$349.99 spend', () => {
      expect(calculateTier(150)).toBe('sprout');
      expect(calculateTier(200)).toBe('sprout');
      expect(calculateTier(349.99)).toBe('sprout');
    });

    it('should return bloom tier for $350-$699.99 spend', () => {
      expect(calculateTier(350)).toBe('bloom');
      expect(calculateTier(500)).toBe('bloom');
      expect(calculateTier(699.99)).toBe('bloom');
    });

    it('should return radiance tier for $700-$1499.99 spend', () => {
      expect(calculateTier(700)).toBe('radiance');
      expect(calculateTier(1000)).toBe('radiance');
      expect(calculateTier(1499.99)).toBe('radiance');
    });

    it('should return luminary tier for $1500+ spend', () => {
      expect(calculateTier(1500)).toBe('luminary');
      expect(calculateTier(5000)).toBe('luminary');
    });

    it('should handle negative spend gracefully', () => {
      expect(calculateTier(-100)).toBe('seed');
    });
  });

  describe('getNextTier', () => {
    it('should return correct next tier', () => {
      expect(getNextTier('seed')).toBe('sprout');
      expect(getNextTier('sprout')).toBe('bloom');
      expect(getNextTier('bloom')).toBe('radiance');
      expect(getNextTier('radiance')).toBe('luminary');
    });

    it('should return null for luminary tier', () => {
      expect(getNextTier('luminary')).toBeNull();
    });
  });

  describe('getSpendToNextTier', () => {
    it('should calculate correct amount needed', () => {
      expect(getSpendToNextTier(100, 'seed')).toBe(50);
      expect(getSpendToNextTier(200, 'sprout')).toBe(150);
      expect(getSpendToNextTier(500, 'bloom')).toBe(200);
      expect(getSpendToNextTier(1000, 'radiance')).toBe(500);
    });

    it('should return 0 for max tier', () => {
      expect(getSpendToNextTier(2000, 'luminary')).toBe(0);
    });

    it('should return 0 when already qualified for next tier', () => {
      expect(getSpendToNextTier(400, 'sprout')).toBe(0);
    });
  });

  describe('getProgressToNextTier', () => {
    it('should calculate correct progress percentage', () => {
      // Seed to Sprout: $100 of $150 needed = 66.67%
      expect(getProgressToNextTier(100, 'seed')).toBeCloseTo(66.67, 1);
      
      // Sprout to Bloom: $250 of $350 needed = 50%
      expect(getProgressToNextTier(250, 'sprout')).toBe(50);
      
      // At threshold: 0%
      expect(getProgressToNextTier(150, 'sprout')).toBe(0);
    });

    it('should return 100 for max tier', () => {
      expect(getProgressToNextTier(2000, 'luminary')).toBe(100);
    });
  });

  describe('getTierProgressDetails', () => {
    it('should return complete progress details', () => {
      const details = getTierProgressDetails(100, 'seed');
      
      expect(details.current).toBe(100);
      expect(details.target).toBe(150);
      expect(details.percentage).toBeCloseTo(66.67, 1);
      expect(details.amountNeeded).toBe(50);
      expect(details.nextTierName).toBe('Sprout');
    });

    it('should handle max tier correctly', () => {
      const details = getTierProgressDetails(2000, 'luminary');
      
      expect(details.percentage).toBe(100);
      expect(details.amountNeeded).toBe(0);
      expect(details.nextTierName).toBeNull();
    });
  });

  describe('checkTierUpgrade', () => {
    it('should detect tier upgrade', () => {
      const result = checkTierUpgrade(100, 200);
      
      expect(result.upgraded).toBe(true);
      expect(result.previousTier).toBe('seed');
      expect(result.newTier).toBe('sprout');
      expect(result.tiersCrossed).toContain('sprout');
    });

    it('should detect multi-tier upgrade', () => {
      const result = checkTierUpgrade(100, 800);
      
      expect(result.upgraded).toBe(true);
      expect(result.tiersCrossed).toEqual(['sprout', 'bloom', 'radiance']);
    });

    it('should not detect upgrade when tier unchanged', () => {
      const result = checkTierUpgrade(100, 120);
      
      expect(result.upgraded).toBe(false);
      expect(result.previousTier).toBe('seed');
      expect(result.newTier).toBe('seed');
      expect(result.tiersCrossed).toHaveLength(0);
    });
  });

  describe('Tier Configuration', () => {
    it('should have correct tier order', () => {
      expect(TIER_ORDER).toEqual(['seed', 'sprout', 'bloom', 'radiance', 'luminary']);
    });

    it('should have correct spend thresholds', () => {
      expect(CRYSTAL_CIRCLE_TIERS.seed.minSpend).toBe(0);
      expect(CRYSTAL_CIRCLE_TIERS.sprout.minSpend).toBe(150);
      expect(CRYSTAL_CIRCLE_TIERS.bloom.minSpend).toBe(350);
      expect(CRYSTAL_CIRCLE_TIERS.radiance.minSpend).toBe(700);
      expect(CRYSTAL_CIRCLE_TIERS.luminary.minSpend).toBe(1500);
    });

    it('should have correct refill discounts', () => {
      expect(CRYSTAL_CIRCLE_TIERS.seed.refillDiscount).toBe(0);
      expect(CRYSTAL_CIRCLE_TIERS.sprout.refillDiscount).toBe(0);
      expect(CRYSTAL_CIRCLE_TIERS.bloom.refillDiscount).toBe(0);
      expect(CRYSTAL_CIRCLE_TIERS.radiance.refillDiscount).toBe(10);
      expect(CRYSTAL_CIRCLE_TIERS.luminary.refillDiscount).toBe(15);
    });

    it('should unlock correct chains at each tier', () => {
      expect(CRYSTAL_CIRCLE_TIERS.seed.unlockedChains).toHaveLength(0);
      expect(CRYSTAL_CIRCLE_TIERS.sprout.unlockedChains).toContain('silver-plated');
      expect(CRYSTAL_CIRCLE_TIERS.bloom.unlockedChains).toContain('gold-plated');
      expect(CRYSTAL_CIRCLE_TIERS.radiance.unlockedChains).toContain('sterling-silver');
      expect(CRYSTAL_CIRCLE_TIERS.luminary.unlockedChains).toContain('14k-gold-filled');
    });
  });
});
