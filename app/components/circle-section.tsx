'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { RefreshCcw, Share2, Droplets, ArrowRight } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

function OrbitCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
  position,
  delay,
}: {
  icon: React.ElementType
  title: string
  description: string
  href: string
  cta: string
  position: 'left' | 'right' | 'bottom'
  delay: number
}) {
  const isLeft = position === 'left'
  const isRight = position === 'right'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay, ease: EASE_LUXURY }}
      className={`
        group absolute w-72 border border-[#f5f3ef]/10 bg-[#050505]/80 p-6 backdrop-blur-sm
        transition-all hover:border-[#c9a227]/40 lg:w-80 lg:p-7
        ${isLeft ? 'left-0 top-[18%] lg:left-[5%] lg:top-[22%]' : ''}
        ${isRight ? 'right-0 top-[18%] lg:right-[5%] lg:top-[22%]' : ''}
        ${position === 'bottom' ? 'bottom-[4%] left-1/2 -translate-x-1/2 lg:bottom-[8%]' : ''}
      `}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[#c9a227]/20">
        <Icon className="h-4 w-4 text-[#c9a227]" />
      </div>
      <h3 className="mb-2 font-display text-lg text-[#f5f3ef]">{title}</h3>
      <p className="mb-4 text-sm font-light leading-relaxed text-[#a69b8a]/80">
        {description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}

export function CircleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const mandalaScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-32 lg:h-screen lg:min-h-[1000px] lg:py-0"
    >
      {/* Deep radial field */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 2, ease: EASE_LUXURY }}
      >
        <div
          className="h-[120vh] w-[120vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(26,15,46,0.35) 0%, rgba(5,5,5,0.9) 50%, transparent 70%)',
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center lg:absolute lg:top-16 lg:mb-0">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-4 block text-[0.6rem] uppercase tracking-[0.3em] text-[#a69b8a]"
          >
            The Circle
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
            className="font-display text-4xl leading-[1.05] tracking-tight text-[#f5f3ef] sm:text-5xl lg:text-6xl"
          >
            Join the <span className="italic text-[#c9a227]">Sanctuary</span>
          </motion.h2>
        </div>

        {/* Mandala + Architecture */}
        <div className="relative flex w-full items-center justify-center lg:h-[600px]">
          {/* SVG connecting lines */}
          <svg
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ opacity: 0.12 }}
          >
            <motion.line
              x1="50%"
              y1="50%"
              x2="18%"
              y2="32%"
              stroke="#c9a227"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6, ease: EASE_LUXURY }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="82%"
              y2="32%"
              stroke="#c9a227"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.8, ease: EASE_LUXURY }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="50%"
              y2="86%"
              stroke="#c9a227"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 1, ease: EASE_LUXURY }}
            />
          </svg>

          {/* The Living Mandala */}
          <motion.div
            style={{ scale: mandalaScale }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE_LUXURY }}
            className="relative aspect-square w-[260px] sm:w-[320px] lg:w-[360px]"
          >
            {/* Rings — pure light only */}
            {[220, 180, 140, 100, 60].map((r) => (
              <div
                key={r}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f3ef]/[0.06]"
                style={{ width: r * 2, height: r * 2 }}
              />
            ))}

            {/* Rotating gradient ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-transparent"
              style={{
                width: 280,
                height: 280,
                borderImage:
                  'conic-gradient(from 0deg, transparent, rgba(201,162,39,0.4), transparent, rgba(201,162,39,0.4), transparent) 1',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center core */}
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a227]/20 bg-[#050505]">
              <div className="h-2 w-2 rounded-full bg-[#c9a227] shadow-[0_0_30px_rgba(201,162,39,0.6)]" />
            </div>
          </motion.div>

          {/* Desktop orbit cards */}
          <div className="hidden lg:block">
            <OrbitCard
              icon={RefreshCcw}
              title="Forever Refills"
              description="Return your Miron vessel for a $5 credit. Unlock cheaper refills with every return."
              href="/refill"
              cta="Enter the Circle"
              position="left"
              delay={0.5}
            />
            <OrbitCard
              icon={Share2}
              title="Blend. Share. Earn."
              description="Create in the Atelier. Share your code. Earn 10% store credit on every purchase made with your blend."
              href="/community-blends"
              cta="Start Earning"
              position="right"
              delay={0.7}
            />
            <OrbitCard
              icon={Droplets}
              title="Close the Loop"
              description="Zero waste. Every bottle is sterilized, refilled, and reborn into the cycle."
              href="/sustainability"
              cta="Our Promise"
              position="bottom"
              delay={0.9}
            />
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-12 flex w-full flex-col gap-3 lg:hidden">
          {[
            {
              icon: RefreshCcw,
              title: 'Forever Refills',
              desc: 'Return your Miron vessel for a $5 credit.',
            },
            {
              icon: Share2,
              title: 'Blend. Share. Earn.',
              desc: 'Earn 10% store credit on every purchase with your code.',
            },
            {
              icon: Droplets,
              title: 'Close the Loop',
              desc: 'Zero waste. Every bottle is reborn.',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE_LUXURY }}
              className="border border-[#f5f3ef]/10 bg-[#050505]/60 p-5 backdrop-blur-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center border border-[#c9a227]/20">
                <card.icon className="h-4 w-4 text-[#c9a227]" />
              </div>
              <h3 className="mb-1 font-display text-base text-[#f5f3ef]">
                {card.title}
              </h3>
              <p className="text-sm font-light text-[#a69b8a]/80">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
