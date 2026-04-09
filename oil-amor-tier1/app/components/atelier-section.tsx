'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { getProducts, getMetafieldValue, ShopifyProduct } from '../lib/shopify'

const EASE = {
  luxury: [0.16, 1, 0.3, 1],
}

// Editorial Product Card — Art Piece Treatment
function ProductCard({ product, index }: { product: ShopifyProduct; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  
  const crystalName = getMetafieldValue(product, 'custom', 'crystal_name') 
    || product.tags?.find(t => t.includes('crystal'))?.split(':')[1] 
    || 'Clear Quartz'
  
  const origin = getMetafieldValue(product, 'custom', 'origin')
    || product.tags?.find(t => t.includes('origin'))?.split(':')[1]
    || 'Bulgaria'

  const price = product.priceRange?.minVariantPrice?.amount
    ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}`
    : '$48'

  // Alternate layout for editorial feel
  const isLarge = index === 0 || index === 3

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 1, 
        ease: EASE.luxury,
        delay: index * 0.15 
      }}
      className={`group ${isLarge ? 'md:col-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/oil/${product.handle}`} className="block">
        {/* Image Container — Large, editorial */}
        <div className={`relative overflow-hidden bg-[#141218] ${isLarge ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 1.2, ease: EASE.luxury }}
          >
            {product.featuredImage ? (
              <img
                src={product.featuredImage.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#262228] to-[#0a080c] flex items-center justify-center">
                <span className="text-[#c9a227]/20 font-display text-8xl italic">
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a080c]/60 via-transparent to-transparent" />

          {/* Origin badge — minimal */}
          <div className="absolute top-6 left-6">
            <span className="text-[0.625rem] uppercase tracking-[0.25em] text-[#f5f3ef]/80">
              {origin}
            </span>
          </div>

          {/* Crystal badge — if large card */}
          {isLarge && (
            <div className="absolute top-6 right-6">
              <span className="text-[0.625rem] uppercase tracking-[0.25em] text-[#c9a227]">
                {crystalName}
              </span>
            </div>
          )}
        </div>

        {/* Product Info — Minimal, elegant */}
        <div className="mt-6 flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl lg:text-3xl text-[#f5f3ef] font-light tracking-tight">
              {product.title}
            </h3>
            <p className="mt-1 text-[0.75rem] text-[#a69b8a] uppercase tracking-[0.15em]">
              {crystalName} Infusion
            </p>
          </div>
          <span className="font-display text-xl text-[#c9a227]">
            {price}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// Section Header — Editorial
function SectionHeader() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div 
      ref={ref}
      className="max-w-3xl mb-20 lg:mb-32"
    >
      {/* Eyebrow */}
      <motion.p 
        className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE.luxury }}
      >
        The Collection
      </motion.p>
      
      {/* Title */}
      <motion.h2 
        className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f5f3ef] leading-[1.05] tracking-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: EASE.luxury, delay: 0.1 }}
      >
        Sacred Oils,
        <br />
        <span className="italic text-[#c9a227]">Crystal Infused</span>
      </motion.h2>
      
      {/* Description */}
      <motion.p 
        className="mt-6 text-[#a69b8a] text-base max-w-lg leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE.luxury, delay: 0.2 }}
      >
        Each oil is paired with a complementary crystal — chosen not by trend, 
        but by energetic resonance. Every bottle becomes a vessel of intention.
      </motion.p>
    </motion.div>
  )
}

// Main Section
export function AtelierSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts(6)
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <section id="collection" className="py-32 lg:py-48 bg-[#0a080c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#141218] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Take only 3 products for the editorial layout
  const featuredProducts = products.slice(0, 3)

  return (
    <section 
      ref={sectionRef}
      id="collection" 
      className="relative py-32 lg:py-48 bg-[#0a080c]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader />
        
        {/* Editorial Grid — Asymmetric, magazine-style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16">
          {/* First product — Large, takes up 7 columns */}
          {featuredProducts[0] && (
            <div className="lg:col-span-7">
              <ProductCard product={featuredProducts[0]} index={0} />
            </div>
          )}
          
          {/* Second product — Smaller, offset, takes up 5 columns */}
          {featuredProducts[1] && (
            <div className="lg:col-span-5 lg:mt-32">
              <ProductCard product={featuredProducts[1]} index={1} />
            </div>
          )}
          
          {/* Third product — Full width, dramatic */}
          {featuredProducts[2] && (
            <div className="lg:col-span-12 mt-8">
              <ProductCard product={featuredProducts[2]} index={2} />
            </div>
          )}
        </div>

        {/* View All CTA — Minimal */}
        <motion.div 
          className="mt-24 flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE.luxury }}
        >
          <Link
            href="/oils"
            className="btn-luxury-dark"
          >
            View Complete Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
