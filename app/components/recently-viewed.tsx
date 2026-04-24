'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { CatalogProduct } from '../types'

interface ViewedItem {
  id: string
  handle: string
  title: string
  price: string
  image: string | null
}

export function RecentlyViewed() {
  const [recentItems, setRecentItems] = useState<ViewedItem[]>([])

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed')
    if (viewed) {
      try {
        const items = JSON.parse(viewed)
        setRecentItems(items.slice(0, 4))
      } catch {
        setRecentItems([])
      }
    }
  }, [])

  if (recentItems.length === 0) return null

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="font-display text-2xl text-miron-void mb-8">
          Recently Viewed
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/oil/${item.handle}`}
              className="group"
            >
              <div className="relative aspect-square bg-gradient-to-br from-miron-mid to-miron-base rounded-lg overflow-hidden mb-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-miron-mid to-miron-base" />
                )}
              </div>
              <h3 className="font-medium text-miron-void text-sm group-hover:text-gold-pure transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{formatPrice(Number(item.price))}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Helper function to add item to recently viewed
export function addToRecentlyViewed(product: CatalogProduct) {
  if (typeof window === 'undefined') return
  
  const viewed: ViewedItem[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  
  // Remove if already exists
  const filtered = viewed.filter(item => item.id !== product.id)
  
  // Add to beginning
  const newItem: ViewedItem = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: product.variants.edges[0]?.node.price.amount || '0',
    image: product.featuredImage?.url || null,
  }
  
  filtered.unshift(newItem)
  
  // Keep only last 8
  localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 8)))
}
