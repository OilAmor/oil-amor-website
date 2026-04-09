import { formatPrice } from '@/app/lib/utils'

describe('formatPrice', () => {
  it('formats price with AUD currency', () => {
    const result = formatPrice('48.00', 'AUD')
    expect(result).toBe('A$48.00')
  })
  
  it('handles number input', () => {
    const result = formatPrice(48, 'AUD')
    expect(result).toBe('A$48.00')
  })
  
  it('rounds to 2 decimal places', () => {
    const result = formatPrice('48.999', 'AUD')
    expect(result).toBe('A$49.00')
  })
})
