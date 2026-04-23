'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { ShopifyProduct, ShopifyProductVariant } from '../types'
import DOMPurify from 'isomorphic-dompurify'

// Strict allowlist for Shopify product descriptions in quick view
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  ],
  ALLOWED_ATTR: ['class', 'style'],
  KEEP_CONTENT: true,
}

interface Props {
  product: ShopifyProduct | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  if (!product) return null

  const variant = selectedVariant || product.variants.edges[0]?.node
  const hasMultipleVariants = product.variants.edges.length > 1

  const handleAdd = async () => {
    if (!variant) return
    
    setIsAdding(true)
    await addItem({ productId: variant.id, quantity })
    setIsAdding(false)
    setIsAdded(true)
    
    setTimeout(() => {
      setIsAdded(false)
      onClose()
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-miron-void/70 backdrop-blur-sm z-[1500]"
            onClick={onClose}
          />

          {/* Modal - Positioned below header on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-0 top-[60px] bottom-0 sm:inset-4 lg:inset-4 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-4xl lg:h-auto lg:max-h-[90vh] bg-white sm:rounded-xl shadow-2xl z-[1501] overflow-hidden flex flex-col"
          >
            <div className="flex flex-col lg:flex-row h-full overflow-auto">
              {/* Image */}
              <div className="lg:w-1/2 bg-gradient-to-br from-miron-mid to-miron-base relative aspect-square lg:aspect-auto">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-miron-mid to-miron-base" />
                )}
                
                {/* Close button (mobile) */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details */}
              <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col">
                {/* Close button (desktop) */}
                <button
                  onClick={onClose}
                  className="hidden lg:flex absolute top-4 right-4 w-10 h-10 hover:bg-gray-100 rounded-full items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <span className="text-xs uppercase tracking-[0.15em] text-gold-dark font-medium mb-2">
                  {product.productType || 'Essential Oil'}
                </span>

                <h2 className="font-display text-3xl lg:text-4xl text-miron-void mb-2">
                  {product.title}
                </h2>

                <p className="text-gray-500 italic mb-4">
                  {product.tags?.find(t => t.includes('botanical'))?.replace('botanical:', '') || ''}
                </p>

                <div 
                  className="text-gray-600 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.descriptionHtml || '', PURIFY_CONFIG) }}
                />

                {/* Variants */}
                {hasMultipleVariants && (
                  <div className="mb-6">
                    <span className="text-sm font-medium text-miron-void block mb-2">Size</span>
                    <div className="flex gap-2">
                      {product.variants.edges.map(({ node: v }) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 text-sm border transition-colors ${
                            variant?.id === v.id
                              ? 'border-miron-void bg-miron-void text-white'
                              : 'border-gray-200 hover:border-miron-void'
                          }`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <span className="text-sm font-medium text-miron-void block mb-2">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-miron-void transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-miron-void transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-3xl text-miron-void">
                      {variant ? formatPrice(Number(variant.price.amount), variant.price.currencyCode) : ''}
                    </span>
                    {variant?.compareAtPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(Number(variant.compareAtPrice.amount), variant.compareAtPrice.currencyCode)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAdd}
                      disabled={isAdding || isAdded || !variant?.availableForSale}
                      className={`flex-1 py-4 text-sm uppercase tracking-wide font-medium transition-colors ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : !variant?.availableForSale
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-miron-void text-white hover:bg-gold-pure hover:text-miron-void'
                      }`}
                    >
                      {isAdding ? 'Adding...' : isAdded ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Added
                        </span>
                      ) : !variant?.availableForSale ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <Link
                      href={`/oil/${product.handle}`}
                      onClick={onClose}
                      className="px-6 py-4 border border-miron-void text-miron-void text-sm uppercase tracking-wide font-medium hover:bg-miron-void hover:text-white transition-colors"
                    >
                      View Full
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
