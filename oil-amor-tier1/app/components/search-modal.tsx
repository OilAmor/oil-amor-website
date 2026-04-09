'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'

// Sample search results - in production, this would hit Shopify/Sanity API
const mockProducts = [
  { id: '1', title: 'True Lavender', handle: 'true-lavender', price: 48, image: '/lavender.jpg' },
  { id: '2', title: 'Sacred Sandalwood', handle: 'sacred-sandalwood', price: 68, image: '/sandalwood.jpg' },
  { id: '3', title: 'Damask Rose', handle: 'damask-rose', price: 78, image: '/rose.jpg' },
]

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof mockProducts>([])
  const [isLoading, setIsLoading] = useState(false)

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const filtered = mockProducts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setResults(filtered)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 150)
    return () => clearTimeout(timeout)
  }, [query, search])

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:border-miron-void hover:text-miron-void transition-colors"
        data-cursor="search"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="hidden xl:inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">⌘K</kbd>
      </button>

      {/* Mobile Search Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-11 h-11 flex items-center justify-center text-miron-void"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-miron-void/60 backdrop-blur-sm z-[2001]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed inset-x-4 top-[10vh] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl bg-white rounded-xl shadow-2xl z-[2002] overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search oils, crystals, collections..."
                  className="flex-1 text-lg outline-none placeholder:text-gray-400"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hidden sm:block px-2 py-1 text-xs text-gray-400 border border-gray-200 rounded"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-gold-pure/20 border-t-gold-pure rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : query && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p>No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm mt-2">Try searching for oils, crystals, or benefits</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Products
                    </div>
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/oil/${product.handle}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-miron-mid/10 rounded overflow-hidden relative flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-miron-void group-hover:text-gold-pure transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500">Essential Oil</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg">{formatPrice(product.price)}</span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold-pure transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Lavender', 'Sandalwood', 'Rose', 'Grounding', 'Sleep', 'Anxiety'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-miron-void hover:text-white rounded-full transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        Trending Now
                      </div>
                      <div className="space-y-2">
                        {mockProducts.slice(0, 3).map((product) => (
                          <Link
                            key={product.id}
                            href={`/oil/${product.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                          >
                            <div className="w-10 h-10 bg-miron-mid/10 rounded" />
                            <span className="text-sm">{product.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
