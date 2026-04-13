'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const philosophyCards = [
  {
    number: '01',
    title: 'Miron Violetglass',
    description: 'Biophotonic violet glass filters harmful light while allowing beneficial violet and infrared rays to penetrate — preserving your oil\'s potency while creating an object of obsidian beauty.',
  },
  {
    number: '02',
    title: 'Drilled Crystal Chips',
    description: 'Each bottle contains ethically-sourced crystal chips with precision-drilled holes. Amethyst. Rose Quartz. Citrine. Clear Quartz. They rest in the oil, absorbing its essence.',
  },
  {
    number: '03',
    title: 'The Transformation',
    description: 'When the final drop is spent, the journey begins. Thread the crystals using the included silk cord. Create your bracelet, your necklace, your personal amulet — scented with memory.',
  },
]

export function PhilosophySection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section 
      id="philosophy" 
      ref={sectionRef}
      className="py-24 lg:py-32 bg-cream"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Sticky */}
          <div className="lg:sticky lg:top-[30vh] lg:self-start">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="section-eyebrow"
            >
              Philosophy
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-4xl lg:text-5xl font-light text-miron-void leading-tight mb-12"
            >
              We questioned the <em className="text-miron-light italic">disposability</em> of beauty.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative pl-6 border-l-2 border-gold-pure"
            >
              <span className="absolute -top-4 left-4 font-display text-6xl text-gold-pure/30 leading-none">
                &ldquo;
              </span>
              <p className="font-display text-xl lg:text-2xl italic text-gray-600 leading-relaxed">
                What if the vessel that carries your wellness ritual could become a talisman you wear?
              </p>
            </motion.div>
          </div>

          {/* Right - Cards */}
          <div className="space-y-8 lg:pt-32">
            {philosophyCards.map((card, index) => (
              <PhilosophyCard
                key={card.number}
                card={card}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhilosophyCard({ 
  card, 
  index 
}: { 
  card: typeof philosophyCards[0]
  index: number 
}) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-10%' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1 
      }}
      className="bg-white p-8 rounded shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
    >
      <span className="font-display text-sm font-semibold text-gold-pure mb-4 block">
        {card.number}
      </span>
      <h3 className="font-display text-2xl text-miron-void mb-4">
        {card.title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {card.description}
      </p>
    </motion.div>
  )
}
