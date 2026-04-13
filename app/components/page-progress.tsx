'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function PageProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [key, setKey] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startProgress = useCallback(() => {
    // Force a complete reset with new key
    setKey(prev => prev + 1)
    setProgress(0)
    setIsVisible(true)
  }, [])

  const completeProgress = useCallback(() => {
    setProgress(100)
    // Hide after animation completes
    setTimeout(() => {
      setIsVisible(false)
      // Reset progress after fade out
      setTimeout(() => setProgress(0), 100)
    }, 300)
  }, [])

  useEffect(() => {
    // Start fresh on route change
    startProgress()

    // Simulate loading stages
    const stage1 = setTimeout(() => setProgress(20), 50)
    const stage2 = setTimeout(() => setProgress(50), 150)
    const stage3 = setTimeout(() => setProgress(75), 300)
    
    // Complete
    const complete = setTimeout(() => {
      completeProgress()
    }, 500)

    return () => {
      clearTimeout(stage1)
      clearTimeout(stage2)
      clearTimeout(stage3)
      clearTimeout(complete)
    }
  }, [pathname, searchParams, startProgress, completeProgress])

  // Safety cleanup on unmount
  useEffect(() => {
    return () => {
      setIsVisible(false)
      setProgress(0)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <div
          key={key}
          className="fixed top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
          }}
        >
          <motion.div
            className="h-full bg-[#c9a227]"
            initial={{ width: '0%', opacity: 1 }}
            animate={{ 
              width: `${progress}%`,
              opacity: progress === 100 ? 0 : 1,
            }}
            transition={{ 
              width: { duration: 0.3, ease: 'easeOut' },
              opacity: { duration: 0.2, delay: progress === 100 ? 0 : 0 }
            }}
            style={{
              boxShadow: progress < 100 
                ? '0 0 10px #c9a227, 0 0 5px #c9a227' 
                : 'none',
              height: '100%',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
