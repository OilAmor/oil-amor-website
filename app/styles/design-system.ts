/**
 * OIL AMOR — Design System Tokens
 * Central source of truth for all design values
 */

export const DESIGN_TOKENS = {
  colors: {
    miron: {
      DEFAULT: '#3D2B5A',
      void: '#0a0612',
      depth: '#120a1f',
      dark: '#1a0f2e',
      mid: '#251440',
      light: '#3d2066',
      glow: '#5a3d8c',
      glass: 'rgba(61, 43, 90, 0.1)',
    },
    gold: {
      DEFAULT: '#C9A227',
      pure: '#c9a227',
      warm: '#d4af37',
      light: '#e8d5a3',
      dark: '#9a7b1a',
      shimmer: 'linear-gradient(135deg, #C9A227 0%, #F4E5A0 50%, #C9A227 100%)',
    },
    cream: {
      DEFAULT: '#F5F1E8',
      pure: '#f8f6f3',
      warm: '#f0ebe5',
      cool: '#e8e4de',
      dark: '#E8E0D0',
    },
    charcoal: '#2D2D2D',
    success: '#4A7C59',
    warning: '#D4A373',
    error: '#C45B4A',
  },

  typography: {
    heading: 'var(--font-cormorant)',
    body: 'var(--font-inter)',
    sizes: {
      display: '4.5rem',   // 72px - Hero headlines
      h1: '3rem',          // 48px
      h2: '2.25rem',       // 36px
      h3: '1.5rem',        // 24px
      h4: '1.25rem',       // 20px
      body: '1rem',        // 16px
      small: '0.875rem',   // 14px
      tiny: '0.75rem',     // 12px
      micro: '0.6875rem',  // 11px
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.05em',
      wider: '0.1em',
      widest: '0.25em',
    },
  },

  spacing: {
    '4xs': '0.125rem',  // 2px
    '3xs': '0.25rem',   // 4px
    '2xs': '0.5rem',    // 8px
    xs: '0.75rem',      // 12px
    sm: '1rem',         // 16px
    md: '1.5rem',       // 24px
    lg: '2rem',         // 32px
    xl: '3rem',         // 48px
    '2xl': '4rem',      // 64px
    '3xl': '6rem',      // 96px
    '4xl': '8rem',      // 128px
  },

  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 800,
      slowest: 1200,
    },
    easing: {
      default: [0.4, 0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      smooth: [0.25, 0.1, 0.25, 1],
      outExpo: [0.16, 1, 0.3, 1],
      outQuart: [0.25, 1, 0.5, 1],
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(61, 43, 90, 0.05)',
    DEFAULT: '0 4px 6px rgba(61, 43, 90, 0.1)',
    md: '0 8px 16px rgba(61, 43, 90, 0.12)',
    lg: '0 12px 24px rgba(61, 43, 90, 0.15)',
    xl: '0 20px 40px rgba(61, 43, 90, 0.2)',
    glow: '0 0 30px rgba(201, 162, 39, 0.3)',
    miron: '0 8px 32px rgba(61, 43, 90, 0.25)',
    lift: '0 10px 30px -10px rgba(26, 15, 46, 0.3)',
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 100,
    sticky: 500,
    fixed: 800,
    modal: 900,
    popover: 950,
    tooltip: 1000,
    toast: 1100,
    cursor: 9999,
  },
} as const

// Tier badge colors for Crystal Circle
export const TIER_COLORS = {
  seed: {
    bg: '#8B7355',
    text: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #8B7355 0%, #A0826D 100%)',
  },
  sprout: {
    bg: '#A8A8A8',
    text: '#1a0f2e',
    gradient: 'linear-gradient(135deg, #A8A8A8 0%, #C0C0C0 100%)',
  },
  bloom: {
    bg: '#C9A227',
    text: '#1a0f2e',
    gradient: 'linear-gradient(135deg, #C9A227 0%, #F4E5A0 50%, #C9A227 100%)',
  },
  harvest: {
    bg: '#4A7C59',
    text: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #4A7C59 0%, #5D9A70 100%)',
  },
  crystal: {
    bg: '#3D2B5A',
    text: '#C9A227',
    gradient: 'linear-gradient(135deg, #3D2B5A 0%, #5a3d8c 100%)',
  },
} as const

// Crystal element colors
export const ELEMENT_COLORS = {
  fire: '#C45B4A',
  water: '#4A7C9A',
  earth: '#4A7C59',
  air: '#7C9AA8',
  spirit: '#9A7BC4',
} as const

// Chakra colors
export const CHAKRA_COLORS = {
  root: '#C45B4A',
  sacral: '#D4A373',
  solar: '#E8D5A3',
  heart: '#4A7C59',
  throat: '#4A7C9A',
  thirdEye: '#5a3d8c',
  crown: '#7C7C9A',
} as const

export type DesignTokens = typeof DESIGN_TOKENS
export type TierType = keyof typeof TIER_COLORS
export type ElementType = keyof typeof ELEMENT_COLORS
export type ChakraType = keyof typeof CHAKRA_COLORS
