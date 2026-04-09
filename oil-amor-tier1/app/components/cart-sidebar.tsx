'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { ShopifyImage } from '../types'
import Image from 'next/image'

export function CartSidebar() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  const lines = cart?.lines?.edges || []
  const subtotal = cart?.cost?.subtotalAmount
  const checkoutUrl = cart?.checkoutUrl

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-miron-void/80 z-[1999]"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-md h-screen h-dvh bg-white z-[2000] flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream-cool flex-shrink-0">
              <h2 className="font-display text-xl text-miron-void">Your Selection</h2>
              <button
                type="button"
                onClick={closeCart}
                className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-miron-void transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <span className="text-5xl text-gold-pure/50 mb-4">◈</span>
                  <p>Your vessel awaits</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 text-sm uppercase tracking-widest text-miron-void hover:text-gold-pure transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {lines.map(({ node: line }) => {
                    const merchandise = line.merchandise
                    const product = merchandise.product
                    const image = product?.featuredImage

                    return (
                      <div key={line.id} className="flex gap-4 py-4 border-b border-cream-cool last:border-0">
                        {/* Image */}
                        <div className="w-20 h-24 bg-miron-mid/10 rounded flex-shrink-0 overflow-hidden relative">
                          {image?.url ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-miron-mid to-miron-base" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg text-miron-void truncate">
                            {product?.title}
                          </h3>
                          <p className="text-sm text-gray-500">{merchandise.title}</p>
                          <p className="text-xs text-miron-light italic mt-1">
                            {/* Crystal info would come from metafields */}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateItem(line.id, line.quantity - 1)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-miron-void transition-colors disabled:opacity-50"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm">{line.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateItem(line.id, line.quantity + 1)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-miron-void transition-colors disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-display text-lg">
                              {formatPrice(
                                parseFloat(line.merchandise.price.amount) * line.quantity,
                                line.merchandise.price.currencyCode
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          disabled={isLoading}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="p-6 border-t border-cream-cool flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-display text-2xl text-miron-void">
                    {subtotal ? formatPrice(parseFloat(subtotal.amount), subtotal.currencyCode) : '$0.00'}
                  </span>
                </div>
                <a
                  href={checkoutUrl}
                  className="block w-full py-4 bg-miron-void text-white text-center text-sm uppercase tracking-widest font-medium hover:bg-gold-pure hover:text-miron-void transition-colors"
                >
                  Proceed to Checkout
                </a>
                <p className="text-xs text-center text-gray-400 mt-3">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
