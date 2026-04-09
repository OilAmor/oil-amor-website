/**
 * Cart Hook
 * React hook for cart state management with real-time sync
 */

'use client'

import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput } from '@/lib/cart/types'
import { logger } from '@/lib/logging/logger'

// ============================================================================
// CART API CLIENT
// ============================================================================

interface CartApiResponse {
  success: boolean
  cart: Cart
  item?: CartItem
  error?: string
}

async function fetchCart(cartId?: string): Promise<Cart> {
  const url = cartId ? `/api/cart?cartId=${cartId}` : '/api/cart'
  
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch cart')
  }
  
  const data: CartApiResponse = await response.json()
  return data.cart
}

async function addToCartApi(
  cartId: string,
  input: AddToCartInput
): Promise<{ cart: Cart; item: CartItem }> {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, cartId }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to add item')
  }
  
  const data: CartApiResponse = await response.json()
  return { cart: data.cart, item: data.item! }
}

async function updateCartItemApi(
  cartId: string,
  input: UpdateCartItemInput
): Promise<Cart> {
  const response = await fetch('/api/cart', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, cartId }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update item')
  }
  
  const data: CartApiResponse = await response.json()
  return data.cart
}

async function removeFromCartApi(cartId: string, lineId: string): Promise<Cart> {
  const response = await fetch(`/api/cart?cartId=${cartId}&lineId=${lineId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to remove item')
  }
  
  const data: CartApiResponse = await response.json()
  return data.cart
}

async function clearCartApi(cartId: string): Promise<Cart> {
  const response = await fetch(`/api/cart?cartId=${cartId}&clear=true`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to clear cart')
  }
  
  const data: CartApiResponse = await response.json()
  return data.cart
}

async function mergeCartsApi(guestCartId: string, userCartId: string): Promise<Cart> {
  const response = await fetch('/api/cart/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestCartId, userCartId }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to merge carts')
  }
  
  const data: CartApiResponse = await response.json()
  return data.cart
}

// ============================================================================
// CART STORE
// ============================================================================

interface CartState {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
  error: string | null
  
  // Actions
  setCart: (cart: Cart) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  clearError: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,
      isOpen: false,
      error: null,
      
      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'oil-amor-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
      version: 1,
      migrate: (persistedState: any, version) => {
        // Clear any persisted mock data - always start fresh
        if (version !== 1) {
          return { cart: null } as any
        }
        // Validate that cart items are real, not mock
        if (persistedState?.cart?.items) {
          const hasMockItems = persistedState.cart.items.some((item: any) => 
            item.id?.includes('mock') || 
            item.productId?.includes('mock') ||
            item.name?.includes('Mock')
          )
          if (hasMockItems) {
            return { cart: null } as any
          }
        }
        return persistedState
      },
    }
  )
)

// ============================================================================
// CART HOOK
// ============================================================================

export function useCart() {
  const store = useCartStore()
  const initialized = useRef(false)
  
  // Initialize cart on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    
    // Delay initialization to avoid render-phase updates
    const timeoutId = setTimeout(() => {
      const initCart = async () => {
        store.setLoading(true)
        store.setError(null)
        
        try {
          const cart = await fetchCart(store.cart?.id)
          store.setCart(cart)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load cart'
          store.setError(message)
          logger.error('Cart initialization error', error as Error)
          // Create a new empty cart on error
          store.setCart({
            id: `cart_${Date.now()}`,
            items: [],
            subtotal: 0,
            taxTotal: 0,
            shippingEstimate: 0,
            discountTotal: 0,
            total: 0,
            currency: 'AUD',
            itemCount: 0,
            totalQuantity: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
        } finally {
          store.setLoading(false)
        }
      }
      
      initCart()
    }, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  // Add item to cart
  const addItem = useCallback(async (input: AddToCartInput) => {
    if (!store.cart) {
      store.setError('Cart not initialized')
      return
    }
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const { cart, item } = await addToCartApi(store.cart.id, input)
      store.setCart(cart)
      store.openCart()
      return item
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item'
      store.setError(message)
      logger.error('Add to cart error', error as Error)
      throw error
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  // Update item quantity
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!store.cart) {
      store.setError('Cart not initialized')
      return
    }
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const cart = await updateCartItemApi(store.cart.id, { lineId, quantity })
      store.setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item'
      store.setError(message)
      logger.error('Update cart item error', error as Error)
      throw error
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  // Remove item from cart
  const removeItem = useCallback(async (lineId: string) => {
    if (!store.cart) {
      store.setError('Cart not initialized')
      return
    }
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const cart = await removeFromCartApi(store.cart.id, lineId)
      store.setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item'
      store.setError(message)
      logger.error('Remove cart item error', error as Error)
      throw error
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  // Clear cart
  const clearCart = useCallback(async () => {
    if (!store.cart) {
      store.setError('Cart not initialized')
      return
    }
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const cart = await clearCartApi(store.cart.id)
      store.setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart'
      store.setError(message)
      logger.error('Clear cart error', error as Error)
      throw error
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  // Merge guest cart with user cart
  const mergeCarts = useCallback(async (guestCartId: string) => {
    if (!store.cart) {
      store.setError('Cart not initialized')
      return
    }
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const cart = await mergeCartsApi(guestCartId, store.cart.id)
      store.setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to merge carts'
      store.setError(message)
      logger.error('Merge carts error', error as Error)
      throw error
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  // Refresh cart from server
  const refreshCart = useCallback(async () => {
    if (!store.cart) return
    
    store.setLoading(true)
    store.setError(null)
    
    try {
      const cart = await fetchCart(store.cart.id)
      store.setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh cart'
      store.setError(message)
      logger.error('Refresh cart error', error as Error)
    } finally {
      store.setLoading(false)
    }
  }, [store])
  
  return {
    // State
    cart: store.cart,
    isLoading: store.isLoading,
    isOpen: store.isOpen,
    error: store.error,
    itemCount: store.cart?.summary?.itemCount || store.cart?.itemCount || 0,
    totalItems: store.cart?.summary?.itemCount || store.cart?.itemCount || 0,
    total: store.cart?.summary?.total || store.cart?.total || 0,
    checkoutUrl: store.cart?.checkoutUrl,
    cartId: store.cart?.id,
    
    // Actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    mergeCarts,
    refreshCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    clearError: store.clearError,
  }
}

// ============================================================================
// CART CONTEXT PROVIDER (for SSR compatibility)
// ============================================================================

// Note: CartProvider is not needed for Zustand-based cart
// The cart state is managed globally by the Zustand store
// Use useCart() hook directly in any component