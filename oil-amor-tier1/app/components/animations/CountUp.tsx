'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  once?: boolean
  separator?: string
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  once = true,
  separator = ',',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState(start)

  const motionValue = useMotionValue(start)
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  })

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(end)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, end, delay, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(parseFloat(latest.toFixed(decimals)))
    })
    return unsubscribe
  }, [springValue, decimals])

  const formatNumber = (num: number) => {
    const parts = num.toFixed(decimals).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return parts.join('.')
  }

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </motion.span>
  )
}

// Price counter with currency formatting
export function PriceCountUp({
  end,
  currency = 'AUD',
  ...props
}: Omit<CountUpProps, 'prefix' | 'suffix'> & { currency?: string }) {
  const prefix = currency === 'AUD' ? '$' : currency + ' '
  return <CountUp end={end} prefix={prefix} decimals={2} {...props} />
}

// Animated stat card
export interface StatCardProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  description?: string
  className?: string
}

export function StatCard({
  value,
  label,
  prefix = '',
  suffix = '',
  description,
  className,
}: StatCardProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="font-display text-4xl lg:text-5xl text-miron-dark mb-2">
        <CountUp end={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-sm font-medium uppercase tracking-wider text-gold-dark mb-1">
        {label}
      </div>
      {description && (
        <p className="text-xs text-miron-dark/60">{description}</p>
      )}
    </div>
  )
}

export default CountUp
