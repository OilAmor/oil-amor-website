import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        miron: {
          violet: '#3D2B5A',
          void: '#0a0612',
          depth: '#120a1f',
          base: '#1a0f2e',
          mid: '#251440',
          light: '#3d2066',
          glow: '#5a3d8c',
          dark: '#1a0f2e',
        },
        gold: {
          DEFAULT: '#C9A227',
          pure: '#c9a227',
          warm: '#d4af37',
          light: '#e8d5a3',
          dark: '#9a7b1a',
        },
        cream: {
          DEFAULT: '#F5F1E8',
          pure: '#f8f6f3',
          warm: '#f0ebe5',
          cool: '#e8e4de',
          dark: '#E8E0D0',
          light: '#FFFCF5',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
