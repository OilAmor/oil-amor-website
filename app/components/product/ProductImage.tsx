'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, RotateCw } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ProductImageProps {
  images: { url: string; altText?: string }[]
  productTitle: string
  crystalVisualization?: string
  enableZoom?: boolean
  className?: string
}

export function ProductImage({
  images,
  productTitle,
  crystalVisualization,
  enableZoom = true,
  className,
}: ProductImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [rotation, setRotation] = useState(0)

  const currentImage = images[currentIndex]

  const handleZoomToggle = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Main Image */}
      <div
        className={cn(
          'relative aspect-[3/4] rounded-2xl overflow-hidden bg-miron-dark/5',
          enableZoom && 'cursor-zoom-in'
        )}
        onClick={handleZoomToggle}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage?.url || '/placeholder-bottle.jpg'}
              alt={currentImage?.altText || productTitle}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isZoomed && 'scale-150 cursor-zoom-out'
              )}
              style={{ transform: `rotate(${rotation}deg) scale(${isZoomed ? 1.5 : 1})` }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Crystal Visualization Overlay */}
        {crystalVisualization && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full overflow-hidden border-2 border-gold-pure/30 shadow-lg">
              <Image
                src={crystalVisualization}
                alt="Crystal pairing"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </div>
        )}

        {/* Zoom Indicator */}
        {enableZoom && !isZoomed && (
          <div className="absolute top-4 right-4 p-2 bg-cream-pure/90 backdrop-blur rounded-full shadow-sm opacity-0 hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-miron-dark" />
          </div>
        )}

        {/* Rotate Button (for 360 view) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleRotate()
            }}
            className="absolute top-4 left-4 p-2 bg-cream-pure/90 backdrop-blur rounded-full shadow-sm hover:bg-cream-pure transition-colors"
            aria-label="Rotate view"
          >
            <RotateCw className="w-4 h-4 text-miron-dark" />
          </button>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                currentIndex === index
                  ? 'ring-2 ring-gold-pure ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-miron-void/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full aspect-[3/4] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage?.url || '/placeholder-bottle.jpg'}
                alt={currentImage?.altText || productTitle}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductImage
