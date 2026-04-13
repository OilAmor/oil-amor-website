import {
  DEFAULT_CACHE_TTL,
  type BottleSize,
  type TierLevel,
  type Chakra,
  type Element,
  type Zodiac,
  type Intention,
} from '../types'

describe('Types', () => {
  describe('DEFAULT_CACHE_TTL', () => {
    it('should have correct TTL values', () => {
      expect(DEFAULT_CACHE_TTL.SYNERGY).toBe(60 * 60 * 24) // 24 hours
      expect(DEFAULT_CACHE_TTL.CRYSTAL).toBe(60 * 60 * 6) // 6 hours
      expect(DEFAULT_CACHE_TTL.CORD).toBe(60 * 60 * 2) // 2 hours
      expect(DEFAULT_CACHE_TTL.OIL).toBe(60 * 60 * 12) // 12 hours
    })
  })

  describe('Type exports', () => {
    it('should export all type aliases', () => {
      // These are compile-time checks
      const bottleSize: BottleSize = '15ml'
      const tier: TierLevel = 'luminary'
      const chakra: Chakra = 'heart'
      const element: Element = 'fire'
      const zodiac: Zodiac = 'scorpio'
      const intention: Intention = 'love'

      expect(bottleSize).toBe('15ml')
      expect(tier).toBe('luminary')
      expect(chakra).toBe('heart')
      expect(element).toBe('fire')
      expect(zodiac).toBe('scorpio')
      expect(intention).toBe('love')
    })
  })
})
