import { HeroSection } from '../components/hero-section'
import { AtelierSection } from '../components/atelier-section'
import { Footer } from '../components/footer'

// Philosophy Section — Large Quote
function PhilosophyStatement() {
  return (
    <section className="py-32 lg:py-48 bg-[#0a080c] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9a227 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        {/* Quote mark */}
        <span className="font-display text-[8rem] lg:text-[12rem] text-[#c9a227]/10 leading-none block -mb-16 lg:-mb-24">
          "
        </span>
        
        {/* Quote */}
        <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] leading-[1.2] tracking-tight">
          We do not sell oils.
          <br />
          <span className="italic text-[#c9a227]">We craft vessels of transformation</span>
          <br />
          that become keepsakes of your journey.
        </blockquote>
        
        {/* Attribution */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-[#c9a227]/30" />
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]">
            Our Philosophy
          </span>
          <div className="w-12 h-px bg-[#c9a227]/30" />
        </div>
      </div>
    </section>
  )
}

// Minimal Footer for Home
function HomeFooter() {
  return (
    <footer className="py-16 lg:py-24 bg-[#0a080c] border-t border-[#1c181f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <span className="font-display text-2xl text-[#f5f3ef]">
            Oil Amor
          </span>
          
          {/* Links */}
          <nav className="flex items-center gap-8">
            <a 
              href="/oils" 
              className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
            >
              Collection
            </a>
            <a 
              href="/philosophy" 
              className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
            >
              Philosophy
            </a>
            <a 
              href="/contact" 
              className="text-[0.6875rem] uppercase tracking-[0.2em] text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
            >
              Contact
            </a>
          </nav>
          
          {/* Copyright */}
          <p className="text-[0.625rem] uppercase tracking-[0.2em] text-[#3d383f]">
            © 2026 Oil Amor
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AtelierSection />
      <PhilosophyStatement />
      <HomeFooter />
    </>
  )
}
