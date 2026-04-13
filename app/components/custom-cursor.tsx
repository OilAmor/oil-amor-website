'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'view' | 'add' | 'external'

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(true) // Default to true to prevent SSR issues
  const [mounted, setMounted] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    if (!isVisible) setIsVisible(true)
  }, [cursorX, cursorY, isVisible])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    // Check for touch device on client side only
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(isTouchDevice)
    
    if (isTouchDevice) return

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor]')
    
    const handleElementEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const cursorType = target.dataset.cursor as CursorState
      setCursorState(cursorType || 'hover')
    }
    
    const handleElementLeave = () => {
      setCursorState('default')
    }

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleElementEnter)
      el.addEventListener('mouseleave', handleElementLeave)
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementEnter)
        el.removeEventListener('mouseleave', handleElementLeave)
      })
    }
  }, [handleMouseMove, handleMouseLeave])

  // Don't render until mounted and checked for touch
  if (!mounted || isTouch) return null

  const getCursorSize = () => {
    switch (cursorState) {
      case 'view': return 80
      case 'add': return 60
      case 'external': return 50
      case 'hover': return 60
      default: return 40
    }
  }

  const getCursorText = () => {
    switch (cursorState) {
      case 'view': return 'View'
      case 'add': return 'Add'
      case 'external': return '→'
      default: return ''
    }
  }

  const size = getCursorSize()
  const text = getCursorText()

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
      />
      
      {/* Circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] mix-blend-difference border border-white/50"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: size,
          height: size,
          opacity: isVisible ? 1 : 0,
          backgroundColor: cursorState === 'add' ? '#c9a227' : cursorState === 'hover' ? 'rgba(255,255,255,0.1)' : 'transparent',
          borderColor: cursorState === 'add' ? '#c9a227' : 'rgba(255,255,255,0.5)',
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Text */}
      {text && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[10001] text-[10px] font-medium uppercase tracking-widest"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            opacity: isVisible && (cursorState === 'view' || cursorState === 'add' || cursorState === 'external') ? 1 : 0,
            color: cursorState === 'add' ? '#0a0612' : '#ffffff',
          }}
        >
          {text}
        </motion.div>
      )}
    </>
  )
}
