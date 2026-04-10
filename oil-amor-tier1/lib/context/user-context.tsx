'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  memberSince: string
  collectorLevel: number
  totalXP: number
  nextLevelXP: number
  streakDays: number
}

export interface Order {
  id: string
  customerId?: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  total: number
}

export interface OrderItem {
  oilId: string
  name: string
  size: string
  type: 'pure' | 'enhanced'
  ratio?: number
  price: number
  customMix?: import('@/lib/db/schema/orders').OrderCustomMix
}

export interface UnlockedBlendRefill {
  blendId: string
  name: string
  description?: string
  normalizedRecipe: {
    mode: 'pure' | 'carrier'
    oils: Array<{ oilId: string; percentage: number }>
    carrierRatio?: number
  }
  originalVolume: number
  unlockedAt: string
  unlockedBy: string
  shareCode?: string
}

export interface UnlockedOil {
  oilId: string
  unlockedAt: string
  unlockedBy: string
  type: 'pure' | 'enhanced'
}

export interface UserState {
  user: User | null
  orders: Order[]
  unlockedOils: UnlockedOil[]
  unlockedBlendRefills: UnlockedBlendRefill[]
  isAuthenticated: boolean
  isDemo: boolean
  isLoading: boolean
}

interface UserContextType extends UserState {
  login: (email: string, password: string) => Promise<void>
  loginDemo: () => void
  logout: () => void
  unlockOil: (oilId: string, orderId: string, type: 'pure' | 'enhanced') => void
  isOilUnlocked: (oilId: string, type?: 'pure' | 'enhanced') => boolean
  getUnlockedOilIds: () => string[]
  addOrder: (order: Order) => void
  unlockBlendRefill: (blend: UnlockedBlendRefill) => void
  getUnlockedBlendRefills: () => UnlockedBlendRefill[]
  totalSavings: number
  refreshUserData: () => Promise<void>
}

const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@oilamor.com',
  firstName: 'Alexandra',
  lastName: 'Rose',
  name: 'Alexandra',
  memberSince: '2026-01-15',
  collectorLevel: 3,
  totalXP: 875,
  nextLevelXP: 1000,
  streakDays: 12,
}

const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2026-03-15',
    status: 'delivered',
    items: [
      { oilId: 'lavender', name: 'Lavender', size: '30ml', type: 'pure', price: 30.95 },
      { oilId: 'eucalyptus', name: 'Blue Mallee Eucalyptus', size: '30ml', type: 'pure', price: 28.95 },
    ],
    total: 59.90,
  },
  {
    id: 'ORD-002',
    date: '2026-02-28',
    status: 'delivered',
    items: [
      { oilId: 'tea-tree', name: 'Tea Tree', size: '30ml', type: 'enhanced', ratio: 25, price: 24.95 },
    ],
    total: 24.95,
  },
]

const DEMO_UNLOCKED_OILS: UnlockedOil[] = [
  { oilId: 'lavender', unlockedAt: '2026-03-15', unlockedBy: 'ORD-001', type: 'pure' },
  { oilId: 'eucalyptus', unlockedAt: '2026-03-15', unlockedBy: 'ORD-001', type: 'pure' },
  { oilId: 'tea-tree', unlockedAt: '2026-02-28', unlockedBy: 'ORD-002', type: 'enhanced' },
]

const STORAGE_KEY = 'oil_amor_user_state_v2'
const BLEND_REFILLS_KEY = 'oil_amor_blend_refills_v2'

function loadStateFromStorage(): Partial<UserState> | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const blendRefillsStored = localStorage.getItem(BLEND_REFILLS_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    if (blendRefillsStored) {
      parsed.unlockedBlendRefills = JSON.parse(blendRefillsStored)
    }
    return parsed
  } catch (e) {
    console.error('Failed to load user state:', e)
  }
  return null
}

function saveStateToStorage(state: UserState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      orders: state.orders,
      unlockedOils: state.unlockedOils,
      isAuthenticated: state.isAuthenticated,
      isDemo: state.isDemo,
    }))
    localStorage.setItem(BLEND_REFILLS_KEY, JSON.stringify(state.unlockedBlendRefills))
  } catch (e) {
    console.error('Failed to save user state:', e)
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const DEMO_BLEND_REFILLS: UnlockedBlendRefill[] = [
  {
    blendId: 'blend-001',
    name: 'My Sleep Potion',
    description: 'A calming blend for restful sleep',
    normalizedRecipe: {
      mode: 'carrier',
      oils: [
        { oilId: 'lavender', percentage: 0.5 },
        { oilId: 'chamomile', percentage: 0.25 },
        { oilId: 'cedarwood', percentage: 0.25 },
      ],
      carrierRatio: 0.7,
    },
    originalVolume: 30,
    unlockedAt: '2026-03-15',
    unlockedBy: 'ORD-003',
    shareCode: 'OIL-A8X9-KL2M',
  },
]

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>({
    user: null,
    orders: [],
    unlockedOils: [],
    unlockedBlendRefills: [],
    isAuthenticated: false,
    isDemo: false,
    isLoading: true,
  })

  // Load from storage on mount
  useEffect(() => {
    const stored = loadStateFromStorage()
    if (stored) {
      setState(prev => ({ ...prev, ...stored, isLoading: false }))
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Save to storage when state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      saveStateToStorage(state)
    }
  }, [state])

  // Refresh user data from API
  const refreshUserData = useCallback(async () => {
    if (!state.isAuthenticated || state.isDemo) return
    
    try {
      // Fetch profile
      const profileRes = await fetch('/api/user/profile', {
        headers: {
          'x-customer-id': state.user?.id || '',
        },
      })
      
      if (profileRes.ok) {
        const profile = await profileRes.json()
        
        // Fetch orders
        const ordersRes = await fetch('/api/user/orders', {
          headers: {
            'x-customer-id': state.user?.id || '',
          },
        })
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          
          setState(prev => ({
            ...prev,
            user: {
              ...prev.user!,
              ...profile,
            },
            orders: ordersData.orders || [],
            unlockedOils: ordersData.unlockedOils || [],
          }))
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [state.isAuthenticated, state.isDemo, state.user?.id])

  const login = useCallback(async (email: string, password: string) => {
    console.log('Login attempted:', email)
    throw new Error('Real authentication not implemented yet. Use demo login.')
  }, [])

  const loginDemo = useCallback(() => {
    setState({
      user: DEMO_USER,
      orders: DEMO_ORDERS,
      unlockedOils: DEMO_UNLOCKED_OILS,
      unlockedBlendRefills: DEMO_BLEND_REFILLS,
      isAuthenticated: true,
      isDemo: true,
      isLoading: false,
    })
  }, [])

  const logout = useCallback(() => {
    setState({
      user: null,
      orders: [],
      unlockedOils: [],
      unlockedBlendRefills: [],
      isAuthenticated: false,
      isDemo: false,
      isLoading: false,
    })
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(BLEND_REFILLS_KEY)
    }
  }, [])

  const unlockOil = useCallback((oilId: string, orderId: string, type: 'pure' | 'enhanced') => {
    setState(prev => {
      const alreadyUnlocked = prev.unlockedOils.some(u => u.oilId === oilId)
      if (alreadyUnlocked) {
        const existing = prev.unlockedOils.find(u => u.oilId === oilId)
        if (existing && existing.type === 'pure' && type === 'enhanced') {
          return {
            ...prev,
            unlockedOils: prev.unlockedOils.map(u =>
              u.oilId === oilId ? { ...u, type: 'enhanced' } : u
            ),
          }
        }
        return prev
      }
      return {
        ...prev,
        unlockedOils: [
          ...prev.unlockedOils,
          {
            oilId,
            unlockedAt: new Date().toISOString(),
            unlockedBy: orderId,
            type,
          },
        ],
      }
    })
  }, [])

  const isOilUnlocked = useCallback((oilId: string, type?: 'pure' | 'enhanced'): boolean => {
    const unlocked = state.unlockedOils.find(u => u.oilId === oilId)
    if (!unlocked) return false
    if (!type) return true
    if (type === 'pure') return true
    return unlocked.type === 'enhanced'
  }, [state.unlockedOils])

  const getUnlockedOilIds = useCallback((): string[] => {
    return Array.from(new Set(state.unlockedOils.map(u => u.oilId)))
  }, [state.unlockedOils])

  const addOrder = useCallback((order: Order) => {
    setState(prev => {
      const newUnlocks: UnlockedOil[] = []
      for (const item of order.items) {
        const alreadyUnlocked = prev.unlockedOils.find(u => u.oilId === item.oilId)
        if (!alreadyUnlocked) {
          newUnlocks.push({
            oilId: item.oilId,
            unlockedAt: new Date().toISOString(),
            unlockedBy: order.id,
            type: item.type,
          })
        } else if (alreadyUnlocked.type === 'pure' && item.type === 'enhanced') {
          alreadyUnlocked.type = 'enhanced'
        }
      }
      return {
        ...prev,
        orders: [order, ...prev.orders],
        unlockedOils: [...prev.unlockedOils, ...newUnlocks],
      }
    })
  }, [])

  const unlockBlendRefill = useCallback((blend: UnlockedBlendRefill) => {
    setState(prev => {
      const alreadyExists = prev.unlockedBlendRefills.some(b => b.blendId === blend.blendId)
      if (alreadyExists) return prev
      return {
        ...prev,
        unlockedBlendRefills: [...prev.unlockedBlendRefills, blend],
      }
    })
  }, [])

  const getUnlockedBlendRefills = useCallback((): UnlockedBlendRefill[] => {
    return state.unlockedBlendRefills
  }, [state.unlockedBlendRefills])

  const totalSavings = state.unlockedOils.length * 15 + state.orders.length * 5

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        loginDemo,
        logout,
        unlockOil,
        isOilUnlocked,
        getUnlockedOilIds,
        addOrder,
        unlockBlendRefill,
        getUnlockedBlendRefills,
        totalSavings,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function useAuth(): { isAuthenticated: boolean; isDemo: boolean; user: User | null; isLoading: boolean } {
  const context = useContext(UserContext)
  if (context === undefined) {
    return { isAuthenticated: false, isDemo: false, user: null, isLoading: false }
  }
  return { 
    isAuthenticated: context.isAuthenticated, 
    isDemo: context.isDemo,
    user: context.user,
    isLoading: context.isLoading,
  }
}
