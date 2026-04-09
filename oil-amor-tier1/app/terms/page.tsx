import { Metadata } from 'next'
import { FileText, Scale, Truck, RotateCcw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Oil Amor',
  description: 'Terms and conditions for using Oil Amor products and services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <Scale className="w-12 h-12 text-[#c9a227] mx-auto mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              Terms of Service
            </h1>
            <p className="text-[#a69b8a]">Last updated: March 2026</p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-6 h-6 text-[#c9a227]" />
                <h2 className="font-display text-2xl text-[#f5f3ef]">Acceptance of Terms</h2>
              </div>
              <p className="text-[#a69b8a] leading-relaxed">
                By accessing and using Oil Amor website and services, you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-4">
                <Truck className="w-6 h-6 text-[#c9a227]" />
                <h2 className="font-display text-2xl text-[#f5f3ef]">Orders & Payment</h2>
              </div>
              <ul className="space-y-3 text-[#a69b8a]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  All prices are in Australian Dollars (AUD) unless otherwise stated
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  Payment must be received before orders are processed
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  We reserve the right to refuse service to anyone
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-4">
                <RotateCcw className="w-6 h-6 text-[#c9a227]" />
                <h2 className="font-display text-2xl text-[#f5f3ef]">Returns & Refunds</h2>
              </div>
              <p className="text-[#a69b8a] leading-relaxed mb-4">
                We accept returns within 30 days of delivery for unopened products in their original 
                packaging. Due to the nature of our products, we cannot accept returns on opened or 
                used items unless defective.
              </p>
              <p className="text-[#a69b8a] leading-relaxed">
                Refunds will be processed to the original payment method within 5-10 business days 
                of receiving the returned item.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Intellectual Property</h2>
              <p className="text-[#a69b8a] leading-relaxed">
                All content on this website, including text, images, logos, and designs, is the 
                property of Oil Amor and protected by copyright and other intellectual property laws. 
                You may not use our content without express written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Limitation of Liability</h2>
              <p className="text-[#a69b8a] leading-relaxed">
                Oil Amor shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our products or services. Essential 
                oils should be used as directed and kept out of reach of children.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Contact</h2>
              <p className="text-[#a69b8a]">
                Questions about these Terms? Contact us at{' '}
                <a href="mailto:legal@oilamor.com" className="text-[#c9a227] hover:underline">
                  legal@oilamor.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
