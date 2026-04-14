'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f5f3ef]/5 bg-[#050505]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="lg:col-span-5"
          >
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl tracking-tight text-[#f5f3ef]">
                Oil <span className="italic text-[#c9a227]">Amor</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#a69b8a]">
              Australian-made organic essential oils for those who seek quality
              without compromise. Crafted with intention. Shared with love.
            </p>

            <div className="mt-8 flex gap-3">
              {['Instagram', 'Pinterest', 'TikTok'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="border border-[#f5f3ef]/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a] transition-colors hover:border-[#c9a227] hover:text-[#c9a227]"
                >
                  {social}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-12">
            {[
              {
                title: 'Explore',
                links: [
                  { label: 'Oils', href: '/oils' },
                  { label: 'Mixing Atelier', href: '/mixing-atelier' },
                  { label: 'Community Blends', href: '/community-blends' },
                  { label: 'Refills', href: '/refills' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Shipping', href: '/shipping' },
                  { label: 'Returns', href: '/returns' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Cookie Policy', href: '/cookies' },
                ],
              },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE_LUXURY }}
              >
                <h4 className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a227]">
                  {col.title}
                </h4>
                <ul className="mt-6 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-light text-[#a69b8a] transition-colors hover:text-[#f5f3ef]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_LUXURY }}
          className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-[#f5f3ef]/5 pt-8 sm:flex-row"
        >
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a]/50">
            © {new Date().getFullYear()} Oil Amor. Made in Australia.
          </p>
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a]/30">
            Organic · Vegan · Cruelty-Free
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
