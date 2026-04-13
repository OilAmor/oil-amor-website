import { Metadata } from 'next'
import { Accessibility, Keyboard, Eye, Volume2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accessibility | Oil Amor',
  description: 'Our commitment to making Oil Amor accessible to everyone.',
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <Accessibility className="w-12 h-12 text-[#c9a227] mx-auto mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              Accessibility
            </h1>
            <p className="text-[#a69b8a] text-lg">
              Oil Amor is committed to ensuring digital accessibility for people with disabilities.
            </p>
          </div>

          <div className="space-y-16">
            <section className="p-8 border border-[#262228] bg-[#141218]/30">
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Our Commitment</h2>
              <p className="text-[#a69b8a] leading-relaxed">
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards to ensure we provide equal access to all users. We believe 
                everyone deserves to experience the transformative power of our products.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="p-6 border border-[#262228]">
                <Keyboard className="w-8 h-8 text-[#c9a227] mb-4" />
                <h3 className="font-display text-xl text-[#f5f3ef] mb-3">Keyboard Navigation</h3>
                <p className="text-[#a69b8a] text-sm">
                  Our website is fully navigable using a keyboard. Skip links are provided to 
                  help users jump to main content quickly.
                </p>
              </section>

              <section className="p-6 border border-[#262228]">
                <Eye className="w-8 h-8 text-[#c9a227] mb-4" />
                <h3 className="font-display text-xl text-[#f5f3ef] mb-3">Visual Design</h3>
                <p className="text-[#a69b8a] text-sm">
                  We maintain high contrast ratios and scalable text. Our design works with 
                  screen readers and supports zoom up to 200%.
                </p>
              </section>

              <section className="p-6 border border-[#262228]">
                <Volume2 className="w-8 h-8 text-[#c9a227] mb-4" />
                <h3 className="font-display text-xl text-[#f5f3ef] mb-3">Screen Readers</h3>
                <p className="text-[#a69b8a] text-sm">
                  All images have descriptive alt text. ARIA labels are used throughout to 
                  ensure compatibility with assistive technologies.
                </p>
              </section>

              <section className="p-6 border border-[#262228]">
                <Accessibility className="w-8 h-8 text-[#c9a227] mb-4" />
                <h3 className="font-display text-xl text-[#f5f3ef] mb-3">Standards Compliance</h3>
                <p className="text-[#a69b8a] text-sm">
                  We aim to conform to WCAG 2.1 Level AA standards and regularly audit our 
                  site for accessibility issues.
                </p>
              </section>
            </div>

            <section>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-6">Feedback</h2>
              <p className="text-[#a69b8a] leading-relaxed mb-6">
                We welcome your feedback on the accessibility of Oil Amor. If you encounter 
                any barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="p-6 border border-[#262228] bg-[#141218]/30">
                <p className="text-[#f5f3ef] mb-2">Email</p>
                <a href="mailto:accessibility@oilamor.com" className="text-[#c9a227] hover:underline">
                  accessibility@oilamor.com
                </a>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-6">Third-Party Content</h2>
              <p className="text-[#a69b8a] leading-relaxed">
                While we strive to ensure accessibility across our entire site, some third-party 
                content or integrations may not fully meet our accessibility standards. We are 
                actively working with partners to improve these areas.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
