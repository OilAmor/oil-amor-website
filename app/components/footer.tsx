'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const footerLinks = {
  shop: [
    { href: '/oils', label: 'The Atelier' },
    { href: '/collections/bestsellers', label: 'Bestsellers' },
    { href: '/collections/new', label: 'New Arrivals' },
    { href: '/gift-cards', label: 'Gift Cards' },
    { href: '/refill', label: 'Refill Program' },
  ],
  learn: [
    { href: '/about', label: 'Our Story' },
    { href: '/philosophy', label: 'Philosophy' },
    { href: '/journal', label: 'Journal' },
    { href: '/crystals', label: 'Crystal Guide' },
    { href: '/sustainability', label: 'Sustainability' },
  ],
  support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/shipping', label: 'Shipping Info' },
    { href: '/returns', label: 'Returns' },
    { href: '/faq', label: 'FAQ' },
    { href: '/track-order', label: 'Track Order' },
  ],
}

const socialLinks = [
  { href: 'https://instagram.com/oilamor', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com/oilamor', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com/oilamor', icon: Twitter, label: 'Twitter' },
]

export function Footer() {
  return (
    <footer className="bg-miron-void text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-3xl text-gold-pure">◈</span>
              <span className="font-display text-2xl font-medium">Oil Amor</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Essential oils that transcend consumption. Each bottle becomes a crystal talisman.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gold-pure hover:text-gold-pure transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-6">
              Learn
            </h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-6">
              Join The Circle
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Exclusive access to limited editions and member pricing.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-gold-pure"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold-pure text-miron-void text-sm font-medium hover:bg-gold-light transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <span>&copy; {new Date().getFullYear()} Oil Amor. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
