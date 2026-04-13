'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="h-screen w-full bg-[#0a080c] flex items-center justify-center">
        <div className="text-center">
          <div className="h-3 w-24 bg-[#c9a227]/20 mx-auto mb-8" />
          <div className="h-20 w-64 bg-white/5 mx-auto mb-4" />
          <div className="h-20 w-48 bg-white/5 mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section className="h-screen w-full relative overflow-hidden bg-[#0a080c]">
      {/* Background: Deep gradient, NO purples */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141218] via-[#0a080c] to-[#0a080c]" />
      
      {/* Subtle animated gradient orbs — very slow, elegant */}
      <motion.div 
        className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #2a2528 0%, transparent 60%)' }}
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #1c181f 0%, transparent 60%)' }}
        animate={{ 
          x: [0, -20, 0], 
          y: [0, 30, 0],
          scale: [1, 1.03, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Content — CENTERED, DRAMATIC */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Small eyebrow */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] mb-8"
        >
          Est. 2026 — Central Coast, NSW
        </motion.p>
        
        {/* Main headline — HUGE, editorial */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,10vw,9rem)] text-[#f5f3ef] leading-[0.95] tracking-[-0.04em]"
        >
          Essence
          <br />
          <span className="italic text-[#c9a227]">Transcended</span>
        </motion.h1>
        
        {/* Subline — refined */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 text-[#a69b8a] text-sm max-w-md leading-relaxed"
        >
          Essential oils that culminate in crystal jewelry. 
          A journey from bottle to keepsake.
        </motion.p>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12"
        >
          <Link href="/oils" className="btn-luxury">
            Explore Collection
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator — minimal */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div 
          className="w-px h-16 bg-gradient-to-b from-[#c9a227] to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}
