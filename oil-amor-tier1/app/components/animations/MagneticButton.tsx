'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  radius = 150,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < radius) {
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength,
      })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}

// Magnetic wrapper for any element
export function Magnetic({
  children,
  className,
  strength = 0.2,
}: MagneticButtonProps) {
  return (
    <MagneticButton className={className} strength={strength}>
      {children}
    </MagneticButton>
  )
}

export default MagneticButton
