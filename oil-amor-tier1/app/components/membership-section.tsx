'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

export function MembershipSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail('')
    }, 2000)
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 lg:py-32 bg-cream"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-eyebrow">
              The Circle
            </span>
            
            <h2 className="font-display text-4xl lg:text-5xl font-light text-miron-void leading-tight mb-6">
              Join those who<br />wear their <em className="text-miron-light italic">rituals</em>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
              Members receive exclusive access to limited editions, complimentary crystal refreshers with every refill, and invitations to private blending events.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-5 py-3 bg-white border border-cream-cool text-miron-void placeholder:text-gray-400 focus:outline-none focus:border-gold-pure transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`px-6 py-3 flex items-center gap-2 text-sm uppercase tracking-wide font-medium transition-all duration-300 magnetic ${
                    isSubmitted 
                      ? 'bg-green-700 text-white' 
                      : 'bg-miron-void text-white hover:bg-gold-pure hover:text-miron-void'
                  }`}
                  data-cursor="submit"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Welcome</span>
                    </>
                  ) : (
                    <>
                      <span>Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                No correspondence without value.
              </p>
            </form>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-64 h-64 mx-auto"
          >
            {/* Rings */}
            <div className="absolute inset-0">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border border-gold-pure rounded-full"
                  style={{ 
                    inset: i * 25,
                    opacity: 1 - i * 0.3,
                  }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    delay: i * 0.5 
                  }}
                />
              ))}
            </div>
            
            {/* Center Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-gold-pure">◈</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
