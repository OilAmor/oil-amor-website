'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useCart } from '../../hooks/use-cart'
import { RichTooltip } from '../../components/ui/Tooltip'
import { formatPrice } from '../../lib/utils'

export interface OilProduct {
  id: string
  title: string
  handle: string
  description: string
  price: number
  compareAtPrice?: number
  images: { url: string; altText?: string }[]
  tags: string[]
  crystalPairing?: {
    name: string
    description: string
    image: string
  }
  synergy?: string
  isNew?: boolean
  isLimited?: boolean
}

export interface ProductCardProps {
  product: OilProduct
  variant?: 'default' | 'featured' | 'compact'
  showSynergy?: boolean
  className?: string
}

export function ProductCard({
  product,
  variant = 'default',
  showSynergy = true,
  className,
}: ProductCardProps) {
  const { addItem } = useCart()

  const imageUrl = product.images[0]?.url || '/placeholder-bottle.jpg'
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      quantity: 1,
      properties: {
        title: product.title,
        price: String(product.price),
        image: imageUrl,
      },
    })
  }

  if (variant === 'compact') {
    return (
      <Link href={`/oil/${product.handle}`} className={cn('group block', className)}>
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-miron-dark/5 mb-3">
          <Image
            src={imageUrl}
            alt={product.images[0]?.altText || product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.isNew && (
            <Badge variant="gold" size="sm" className="absolute top-2 left-2">
              New
            </Badge>
          )}
        </div>
        <h3 className="font-medium text-sm text-miron-dark group-hover:text-gold-dark transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="text-sm text-miron-dark/60 mt-0.5">{formatPrice(product.price)}</p>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/oil/${product.handle}`} className={cn('group block', className)}>
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image
                src={imageUrl}
                alt={product.images[0]?.altText || product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {(product.isNew || product.isLimited) && (
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isNew && <Badge variant="gold">New Arrival</Badge>}
                  {product.isLimited && <Badge variant="tier" tier="crystal">Limited</Badge>}
                </div>
              )}
            </div>
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <span className="section-eyebrow">Featured Blend</span>
              <h3 className="font-display text-2xl lg:text-3xl text-miron-dark mb-3">
                {product.title}
              </h3>
              <p className="text-miron-dark/70 leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>
              {showSynergy && product.crystalPairing && (
                <div className="flex items-center gap-2 mb-6 p-3 bg-gold-pure/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                  <span className="text-sm text-miron-dark">
                    Paired with <strong>{product.crystalPairing.name}</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-miron-dark">
                  {formatPrice(product.price)}
                </span>
                {isOnSale && (
                  <span className="text-miron-dark/40 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
                <Button onClick={handleAddToCart} className="ml-auto">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/oil/${product.handle}`} className={cn('group block', className)}>
      <Card variant="default" padding="none" className="overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.images[0]?.altText || product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="gold">New</Badge>}
            {product.isLimited && <Badge variant="tier" tier="crystal">Limited</Badge>}
            {isOnSale && <Badge variant="success">Sale</Badge>}
          </div>

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button onClick={handleAddToCart} className="w-full" size="sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>

          {/* Crystal Synergy Badge */}
          {showSynergy && product.crystalPairing && (
            <div className="absolute top-3 right-3">
              <RichTooltip
                title={product.crystalPairing.name}
                description={product.crystalPairing.description}
                image={product.crystalPairing.image}
                properties={[
                  { label: 'Synergy', value: product.synergy || 'Harmony' },
                ]}
              >
                <button
                  className="w-8 h-8 rounded-full bg-cream-pure/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  aria-label={`Paired with ${product.crystalPairing.name}`}
                >
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                </button>
              </RichTooltip>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-miron-dark group-hover:text-gold-dark transition-colors line-clamp-1 mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-miron-dark/60 line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-miron-dark">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-miron-dark/40 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
