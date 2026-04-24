import { CartManager } from '../cart-manager'
import { Redis } from '@upstash/redis'
import { createMockCart, createMockCartItem } from '@/lib/test-utils'

jest.mock('@upstash/redis')

describe('CartManager', () => {
  let cartManager: CartManager
  let mockRedis: jest.Mocked<Redis>
  
  beforeEach(() => {
    mockRedis = new Redis({ url: 'http://localhost', token: 'test' }) as jest.Mocked<Redis>
    cartManager = new CartManager(mockRedis)
  })
  
  describe('createCart', () => {
    it('creates a new cart with default values', async () => {
      mockRedis.set = jest.fn().mockResolvedValue('OK')
      
      const cart = await cartManager.createCart()
      
      expect(cart.items).toHaveLength(0)
      expect(cart.summary?.total).toBe(0)
    })
    
    it('creates cart with customer info', async () => {
      mockRedis.set = jest.fn().mockResolvedValue('OK')
      
      const cart = await cartManager.createCart('cust_123', 'test@email.com')
      
      expect(cart.customerId).toBe('cust_123')
    })
  })
  
  describe('addItem', () => {
    it('adds item to empty cart', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(createMockCart())
      mockRedis.set = jest.fn().mockResolvedValue('OK')
      
      const result = await cartManager.addItem('cart_123', {
        variantId: 'variant_123',
        quantity: 1,
      })
      
      expect(result.cart.items).toHaveLength(1)
    })
  })
})
