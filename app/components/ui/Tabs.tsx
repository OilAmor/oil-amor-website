'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className,
}: TabsProps) {
  const baseStyles = 'flex items-center'

  const variants = {
    default: 'gap-1 p-1 bg-miron-dark/5 rounded-xl',
    pills: 'gap-2',
    underlined: 'gap-6 border-b border-miron-dark/10',
  }

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn(baseStyles, variants[variant], sizes[size], className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200',
              variant === 'underlined'
                ? 'pb-3 text-miron-dark/60 hover:text-miron-dark'
                : 'rounded-lg',
              isActive &&
                (variant === 'underlined'
                  ? 'text-miron-dark'
                  : variant === 'pills'
                  ? 'bg-miron-dark text-cream-pure'
                  : 'bg-cream-pure text-miron-dark shadow-sm'),
              !isActive && variant !== 'underlined' && 'text-miron-dark/60 hover:text-miron-dark'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 text-[10px] rounded-full',
                  isActive ? 'bg-gold-pure/20 text-miron-dark' : 'bg-miron-dark/10'
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && variant === 'underlined' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-miron-dark"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface TabPanelProps {
  tabId: string
  activeTab: string
  children: ReactNode
  className?: string
}

export function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  const isActive = activeTab === tabId

  if (!isActive) return null

  return (
    <motion.div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Tabs
