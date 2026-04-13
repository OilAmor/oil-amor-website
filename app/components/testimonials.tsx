'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: '1',
    name: 'Alexandra M.',
    location: 'New York, NY',
    rating: 5,
    text: 'The transformation from bottle to bracelet is absolutely magical. My lavender oil bottle is now my favorite piece of jewelry, and it still carries the most beautiful scent.',
    product: 'True Lavender',
  },
  {
    id: '2',
    name: 'James R.',
    location: 'London, UK',
    rating: 5,
    text: 'Finally, a brand that understands luxury without waste. The Miron bottle is stunning on my vanity, and the sandalwood oil is the purest I\'ve ever experienced.',
    product: 'Sacred Sandalwood',
  },
  {
    id: '3',
    name: 'Sarah K.',
    location: 'Central Coast, NSW',
    rating: 5,
    text: 'I\'ve collected three bottles now, each bracelet telling a different story. The refill program makes this sustainable luxury actually affordable long-term.',
    product: 'Collection',
  },
]

export function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="section-eyebrow justify-center"
          >
            <span />
            Testimonials
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-light text-miron-void"
          >
            Words from <em className="text-miron-light italic">the circle</em>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-cream p-8 rounded-lg"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-pure text-gold-pure" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Author */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-miron-void">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
                <p className="text-xs text-gold-pure mt-2">Purchased: {testimonial.product}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-12 text-center"
        >
          <div>
            <span className="font-display text-4xl text-gold-pure block">4.9</span>
            <span className="text-sm text-gray-500">Average Rating</span>
          </div>
          <div>
            <span className="font-display text-4xl text-gold-pure block">2,000+</span>
            <span className="text-sm text-gray-500">Happy Customers</span>
          </div>
          <div>
            <span className="font-display text-4xl text-gold-pure block">98%</span>
            <span className="text-sm text-gray-500">Would Recommend</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
