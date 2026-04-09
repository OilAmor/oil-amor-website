'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  initialDelay?: number
  className?: string
  once?: boolean
  amount?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  className,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  distance = 30,
}: StaggerItemProps) {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// Grid stagger with automatic child staggering
export function StaggerGrid({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  className,
  once = true,
}: StaggerContainerProps) {
  return (
    <StaggerContainer
      staggerDelay={staggerDelay}
      initialDelay={initialDelay}
      className={cn('grid', className)}
      once={once}
    >
      {children}
    </StaggerContainer>
  )
}

export default StaggerContainer
