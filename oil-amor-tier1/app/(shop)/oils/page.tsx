'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  getAllOils, 
  type OilProfile, 
  type CrystalPairing,
  ALL_CRYSTALS,
  type Chakra,
  type Element 
} from '@/lib/content/oil-crystal-synergies'
import { 
  getOilPrices, 
  formatPrice, 
  OIL_PRICING,
  type OilPricing 
} from '@/lib/content/pricing-engine-final'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Sparkles, 
  Droplets,
  MoveRight,
  ArrowUpRight,
  X,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid
} from 'lucide-react'

// ============================================================================
// FILTER TYPES
// ============================================================================

type PriceRange = 'all' | 'under15' | '15to25' | '25to40' | 'over40'
type SortOption = 'name' | 'price-low' | 'price-high' | 'chakra'

interface Filters {
  search: string
  priceRange: PriceRange
  chakras: Chakra[]
  elements: Element[]
  sort: SortOption
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// ============================================================================
// OIL CARD COMPONENT
// ============================================================================

interface OilCardProps {
  oil: OilProfile
  index: number
}

function OilCard({ oil, index }: OilCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prices = getOilPrices(oil.id)
  const minPrice = Math.min(...Object.values(prices))
  const maxPrice = Math.max(...Object.values(prices))
  const oilData = OIL_PRICING.find(o => o.id === oil.id)
  
  // Get unique chakras from crystal pairings
  const chakras = Array.from(new Set(oil.crystalPairings.map(c => c.chakra)))
  
  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/oil/${oil.handle || oil.id}`}>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-[#f5f3ef]/5 transition-all duration-500 group-hover:border-[#c9a227]/30 group-hover:shadow-2xl group-hover:shadow-[#c9a227]/10">
          {/* Image */}
          <Image
            src={oil.image}
            alt={oil.commonName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Gradient Overlay - Always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a080c] via-[#0a080c]/40 to-transparent" />
          
          {/* Crystal Chips Preview - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1 mb-2">
              {oil.crystalPairings.slice(0, 3).map((crystal, i) => (
                <motion.div
                  key={crystal.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.08 + i * 0.1 }}
                  className="w-6 h-6 rounded-full border-2 border-[#f5f3ef]/30 shadow-lg"
                  style={{ backgroundColor: crystal.color }}
                  title={crystal.name}
                />
              ))}
              <span className="ml-2 text-[10px] text-[#a69b8a] uppercase tracking-wider">
                3 crystals
              </span>
            </div>
          </div>
          
          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[#0a080c]/80 backdrop-blur-sm flex flex-col justify-center items-center p-6"
              >
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[#c9a227] text-xs uppercase tracking-[0.2em] mb-2"
                >
                  {oil.origin}
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-[#f5f3ef] text-center text-sm leading-relaxed mb-4 line-clamp-3"
                >
                  {oil.description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-1"
                >
                  {oil.baseProperties.slice(0, 3).map(prop => (
                    <span
                      key={prop}
                      className="px-2 py-0.5 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-[10px]"
                    >
                      {prop}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Rarity Badge */}
          {oilData?.rarity !== 'common' && (
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                oilData?.rarity === 'luxury' 
                  ? 'bg-[#c9a227] text-[#0a080c]' 
                  : 'bg-[#f5f3ef]/10 text-[#f5f3ef]'
              }`}>
                {oilData?.rarity}
              </span>
            </div>
          )}
        </div>
        
        {/* Info Below Card */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[#f5f3ef] font-serif text-lg group-hover:text-[#c9a227] transition-colors">
                {oil.commonName}
              </h3>
              <p className="text-[#a69b8a] text-xs italic">{oil.technicalName}</p>
            </div>
            <div className="text-right">
              <p className="text-[#c9a227] font-serif">
                {formatPrice(minPrice)}
              </p>
              <p className="text-[#a69b8a] text-[10px]">
                {minPrice === maxPrice ? '' : `-${formatPrice(maxPrice)}`}
              </p>
            </div>
          </div>
          
          {/* Chakra Tags */}
          <div className="flex flex-wrap gap-1">
            {chakras.slice(0, 2).map(chakra => (
              <span
                key={chakra}
                className="text-[10px] text-[#a69b8a] capitalize"
              >
                {chakra.replace('-', ' ')}
              </span>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[#c9a227] text-xs flex items-center gap-1">
              Configure
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

interface FilterBarProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  totalOils: number
  filteredCount: number
}

function FilterBar({ filters, onFilterChange, totalOils, filteredCount }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const allChakras: Chakra[] = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown']
  const allElements: Element[] = ['earth', 'water', 'fire', 'air']
  
  const activeFiltersCount = 
    (filters.priceRange !== 'all' ? 1 : 0) +
    filters.chakras.length +
    filters.elements.length

  return (
    <div className="sticky top-20 z-40 bg-[#0a080c]/95 backdrop-blur-md border-b border-[#f5f3ef]/10 py-4">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Filter Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a69b8a]" />
            <input
              type="text"
              placeholder="Search oils..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] text-sm placeholder:text-[#a69b8a] focus:border-[#c9a227] focus:outline-none transition-colors"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={filters.priceRange}
              onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value as PriceRange })}
              className="px-4 py-2 rounded-full bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] text-sm focus:border-[#c9a227] focus:outline-none"
            >
              <option value="all">All Prices</option>
              <option value="under15">Under $15</option>
              <option value="15to25">$15 - $25</option>
              <option value="25to40">$25 - $40</option>
              <option value="over40">Over $40</option>
            </select>
            
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as SortOption })}
              className="px-4 py-2 rounded-full bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] text-sm focus:border-[#c9a227] focus:outline-none"
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="chakra">Chakra</option>
            </select>
          </div>
          
          {/* Expand Filter Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
              activeFiltersCount > 0
                ? 'bg-[#c9a227] text-[#0a080c] border-[#c9a227]'
                : 'bg-[#111] text-[#f5f3ef] border-[#f5f3ef]/10 hover:border-[#c9a227]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0a080c] text-[#c9a227] text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#a69b8a]">
          <span>Showing {filteredCount} of {totalOils} oils</span>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => onFilterChange({
                search: '',
                priceRange: 'all',
                chakras: [],
                elements: [],
                sort: 'name'
              })}
              className="flex items-center gap-1 text-[#c9a227] hover:underline"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          )}
        </div>
        
        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chakra Filter */}
                <div>
                  <p className="text-[#f5f3ef] text-sm font-medium mb-3">Chakra</p>
                  <div className="flex flex-wrap gap-2">
                    {allChakras.map(chakra => (
                      <button
                        key={chakra}
                        onClick={() => {
                          const newChakras = filters.chakras.includes(chakra)
                            ? filters.chakras.filter(c => c !== chakra)
                            : [...filters.chakras, chakra]
                          onFilterChange({ ...filters, chakras: newChakras })
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors capitalize ${
                          filters.chakras.includes(chakra)
                            ? 'bg-[#c9a227] text-[#0a080c]'
                            : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#c9a227]'
                        }`}
                      >
                        {chakra.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Element Filter */}
                <div>
                  <p className="text-[#f5f3ef] text-sm font-medium mb-3">Element</p>
                  <div className="flex flex-wrap gap-2">
                    {allElements.map(element => (
                      <button
                        key={element}
                        onClick={() => {
                          const newElements = filters.elements.includes(element)
                            ? filters.elements.filter(e => e !== element)
                            : [...filters.elements, element]
                          onFilterChange({ ...filters, elements: newElements })
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors capitalize ${
                          filters.elements.includes(element)
                            ? 'bg-[#c9a227] text-[#0a080c]'
                            : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#c9a227]'
                        }`}
                      >
                        {element}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function OilsPage() {
  const allOils = getAllOils()
  const [filters, setFilters] = useState<Filters>({
    search: '',
    priceRange: 'all',
    chakras: [],
    elements: [],
    sort: 'name'
  })

  // Filter and sort oils
  const filteredOils = useMemo(() => {
    let result = [...allOils]
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(oil =>
        oil.commonName.toLowerCase().includes(searchLower) ||
        oil.technicalName.toLowerCase().includes(searchLower) ||
        oil.baseProperties.some(p => p.toLowerCase().includes(searchLower))
      )
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      result = result.filter(oil => {
        const prices = getOilPrices(oil.id)
        const minPrice = Math.min(...Object.values(prices))
        
        switch (filters.priceRange) {
          case 'under15': return minPrice < 15
          case '15to25': return minPrice >= 15 && minPrice < 25
          case '25to40': return minPrice >= 25 && minPrice < 40
          case 'over40': return minPrice >= 40
          default: return true
        }
      })
    }
    
    // Chakra filter
    if (filters.chakras.length > 0) {
      result = result.filter(oil =>
        oil.crystalPairings.some(c => filters.chakras.includes(c.chakra))
      )
    }
    
    // Element filter
    if (filters.elements.length > 0) {
      result = result.filter(oil =>
        oil.crystalPairings.some(c => filters.elements.includes(c.element))
      )
    }
    
    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'price-low':
          return Math.min(...Object.values(getOilPrices(a.id))) - Math.min(...Object.values(getOilPrices(b.id)))
        case 'price-high':
          return Math.max(...Object.values(getOilPrices(b.id))) - Math.max(...Object.values(getOilPrices(a.id)))
        case 'chakra':
          return a.crystalPairings[0].chakra.localeCompare(b.crystalPairings[0].chakra)
        default:
          return a.commonName.localeCompare(b.commonName)
      }
    })
    
    return result
  }, [allOils, filters])

  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227] block mb-4">
              The Collection
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              Sacred Oils,
              <br />
              <span className="italic text-[#c9a227]">Crystal Infused</span>
            </h1>
            <p className="text-[#a69b8a] leading-relaxed">
              Seventeen essential oils, each paired with three carefully selected crystals. 
              Choose your format—pure essential oils or pre-diluted carrier blends.
            </p>
          </motion.div>
          
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { value: '17', label: 'Sacred Oils' },
              { value: '51', label: 'Crystal Pairings' },
              { value: '15', label: 'Premium Crystals' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/5">
                <p className="text-2xl font-serif text-[#c9a227]">{stat.value}</p>
                <p className="text-[#a69b8a] text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalOils={allOils.length}
        filteredCount={filteredOils.length}
      />

      {/* Oil Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredOils.map((oil, index) => (
              <OilCard key={oil.id} oil={oil} index={index} />
            ))}
          </motion.div>
          
          {/* Empty State */}
          {filteredOils.length === 0 && (
            <div className="text-center py-24">
              <Sparkles className="w-12 h-12 text-[#c9a227]/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#f5f3ef] mb-2">No oils found</h3>
              <p className="text-[#a69b8a]">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-[#f5f3ef] mb-4">New to Oil Amor?</h2>
          <p className="text-[#a69b8a] mb-8">
            Start with our 5ml discovery sizes. Each oil unlocks its own refill program, 
            saving you up to 50% on future purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFilters({ ...filters, priceRange: 'under15' })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Browse Starter Sizes
            </button>
            <Link
              href="/refill"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#f5f3ef]/30 text-[#f5f3ef] hover:bg-[#f5f3ef]/10 transition-colors"
            >
              <Droplets className="w-4 h-4" />
              Learn About Refills
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
