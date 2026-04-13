import { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { Footer } from '../components/footer'

export const metadata: Metadata = {
  title: 'Contact Us | Oil Amor',
  description: 'Get in touch with Oil Amor. We\'d love to hear from you. Email, phone, or visit our Melbourne atelier.',
  openGraph: {
    title: 'Contact Us | Oil Amor',
    description: 'Get in touch with Oil Amor.',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Hero */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] mb-6 block">
              Contact
            </span>
            <h1 className="font-display text-4xl lg:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              We&apos;d love to
              <br />
              <em className="text-[#c9a227] not-italic">hear from you</em>
            </h1>
            <p className="text-[#a69b8a] text-lg leading-relaxed">
              Whether you have a question about our oils, need help with an order, 
              or simply want to say hello, we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 lg:py-24 border-t border-[#1c181f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-8">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-8">
                Other ways to reach us
              </h2>
              
              <div className="space-y-8">
                {/* Email */}
                <div>
                  <h3 className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                    Email
                  </h3>
                  <a 
                    href="mailto:hello@oilamor.com" 
                    className="text-[#f5f3ef] hover:text-[#c9a227] transition-colors text-lg"
                  >
                    hello@oilamor.com
                  </a>
                  <p className="text-[#a69b8a] text-sm mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <h3 className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                    Phone
                  </h3>
                  <a 
                    href="tel:+61390001234" 
                    className="text-[#f5f3ef] hover:text-[#c9a227] transition-colors text-lg"
                  >
                    +61 3 9000 1234
                  </a>
                  <p className="text-[#a69b8a] text-sm mt-1">
                    Mon-Fri, 9am-5pm AEST
                  </p>
                </div>

                {/* Atelier */}
                <div>
                  <h3 className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                    Visit Our Atelier
                  </h3>
                  <address className="text-[#f5f3ef] not-italic text-lg leading-relaxed">
                    123 Fitzroy Street
                    <br />
                    Fitzroy, VIC 3065
                    <br />
                    Central Coast, NSW, Australia
                  </address>
                  <p className="text-[#a69b8a] text-sm mt-1">
                    By appointment only
                  </p>
                </div>

                {/* Social */}
                <div>
                  <h3 className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                    Social
                  </h3>
                  <div className="flex gap-6">
                    {['Instagram', 'Pinterest', 'TikTok'].map((social) => (
                      <a
                        key={social}
                        href={`https://${social.toLowerCase()}.com/oilamor`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f5f3ef] hover:text-[#c9a227] transition-colors text-sm"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 aspect-video bg-[#141218] border border-[#262228] flex items-center justify-center">
                <span className="text-[#a69b8a] text-sm">Map loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-12 lg:py-24 border-t border-[#1c181f]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">
            Quick answers
          </h2>
          <p className="text-[#a69b8a] mb-6">
            Find immediate answers to common questions in our FAQ.
          </p>
          <a href="/faq" className="btn-luxury-dark inline-block">
            View FAQ
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
