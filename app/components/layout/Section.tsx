'use client'

import { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Container } from './Container'

export interface SectionProps {
  children: ReactNode
  variant?: 'default' | 'miron' | 'cream' | 'gradient' | 'dark'
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  id?: string
}

export function Section({
  children,
  variant = 'default',
  spacing = 'lg',
  className,
  containerSize = 'xl',
  id,
}: SectionProps) {
  const variants = {
    default: 'bg-transparent',
    miron: 'bg-miron-void text-white',
    cream: 'bg-cream-pure',
    gradient: 'bg-gradient-to-b from-cream-pure to-cream-warm',
    dark: 'bg-miron-dark text-white',
  }

  const spacings = {
    sm: 'py-8 lg:py-12',
    md: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-24',
    xl: 'py-24 lg:py-32',
    '2xl': 'py-32 lg:py-40',
  }

  return (
    <section id={id} className={cn(variants[variant], spacings[spacing], className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}

// Section with eyebrow heading
export interface SectionWithEyebrowProps extends SectionProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionWithEyebrow({
  eyebrow,
  title,
  description,
  align = 'center',
  children,
  ...sectionProps
}: SectionWithEyebrowProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <Section {...sectionProps}>
      <div className={cn('mb-12 lg:mb-16', alignments[align])}>
        <span className="section-eyebrow justify-center">{eyebrow}</span>
        <h2 className="font-display text-3xl lg:text-4xl text-miron-dark mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-miron-dark/70 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </Section>
  )
}

export default Section
