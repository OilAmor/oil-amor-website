'use client'

import { forwardRef, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'miron' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300',
      'focus-visible:outline-2 focus-visible:outline-gold-pure focus-visible:outline-offset-4',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'magnetic btn-lift'
    )

    const variants = {
      primary: cn(
        'bg-miron-dark text-cream-pure',
        'hover:bg-miron-mid',
        'active:scale-[0.98]'
      ),
      secondary: cn(
        'bg-cream-pure text-miron-dark border border-miron-dark/20',
        'hover:bg-cream-warm hover:border-miron-dark/40',
        'active:scale-[0.98]'
      ),
      ghost: cn(
        'bg-transparent text-miron-dark',
        'hover:bg-miron-dark/5',
        'active:scale-[0.98]'
      ),
      gold: cn(
        'bg-gold-pure text-miron-void',
        'hover:bg-gold-warm',
        'active:scale-[0.98]',
        'shadow-glow'
      ),
      miron: cn(
        'bg-miron-void text-gold-pure border border-gold-pure/30',
        'hover:bg-miron-depth hover:border-gold-pure/50',
        'active:scale-[0.98]'
      ),
      outline: cn(
        'bg-transparent text-miron-dark border-2 border-miron-dark',
        'hover:bg-miron-dark hover:text-cream-pure',
        'active:scale-[0.98]'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs tracking-wider uppercase rounded-md',
      md: 'px-6 py-3 text-sm rounded-lg',
      lg: 'px-8 py-4 text-base rounded-lg',
      xl: 'px-10 py-5 text-lg rounded-xl',
    }

    const Component = asChild ? motion.span : motion.button

    return (
      <Component
        ref={ref as any}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        {...(props as any)}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span className={cn(isLoading && 'opacity-0')}>{children}</span>
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export default Button
