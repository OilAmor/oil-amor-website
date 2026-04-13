'use client'

import { useCart } from '../hooks/use-cart'
import { ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

export function StickyMobileCart() {
  const { cart, openCart, totalItems } = useCart()
  
  const itemCount = totalItems
  const subtotal = cart?.cost?.subtotalAmount?.amount
  
  // Only show on mobile when items in cart
  if (itemCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-lg"
      >
        <button
          onClick={openCart}
          className="w-full flex items-center justify-between bg-miron-void text-white px-4 py-3 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-pure text-miron-void text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span className="text-sm font-medium">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">Subtotal</span>
            <span className="font-display text-lg">
              {subtotal ? formatPrice(Number(subtotal), cart.cost?.subtotalAmount?.currencyCode || 'AUD') : '$0.00'}
            </span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
