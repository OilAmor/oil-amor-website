import { Metadata } from 'next'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Oil Amor',
  description: 'Learn how Oil Amor collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <Shield className="w-12 h-12 text-[#c9a227] mx-auto mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              Privacy Policy
            </h1>
            <p className="text-[#a69b8a]">Last updated: March 2026</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <Eye className="w-6 h-6 text-[#c9a227]" />
                  <h2 className="font-display text-2xl text-[#f5f3ef] m-0">Information We Collect</h2>
                </div>
                <p className="text-[#a69b8a]">
                  We collect information you provide directly to us, including name, email address, 
                  shipping address, payment information, and any communications you send us. We also 
                  automatically collect certain information about your device and how you interact with our website.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <Lock className="w-6 h-6 text-[#c9a227]" />
                  <h2 className="font-display text-2xl text-[#f5f3ef] m-0">How We Use Your Information</h2>
                </div>
                <p className="text-[#a69b8a]">
                  We use your information to process orders, communicate with you, improve our products 
                  and services, and personalize your experience. We do not sell your personal information 
                  to third parties.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <Database className="w-6 h-6 text-[#c9a227]" />
                  <h2 className="font-display text-2xl text-[#f5f3ef] m-0">Data Security</h2>
                </div>
                <p className="text-[#a69b8a]">
                  We implement appropriate technical and organizational measures to protect your personal 
                  data against unauthorized access, alteration, disclosure, or destruction. All payment 
                  information is encrypted and processed securely.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Your Rights</h2>
                <ul className="space-y-3 text-[#a69b8a] list-none pl-0">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2.5 flex-shrink-0" />
                    Access your personal data
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2.5 flex-shrink-0" />
                    Request correction of your data
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2.5 flex-shrink-0" />
                    Request deletion of your data
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2.5 flex-shrink-0" />
                    Opt-out of marketing communications
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-[#f5f3ef] mb-4">Contact Us</h2>
                <p className="text-[#a69b8a]">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@oilamor.com" className="text-[#c9a227] hover:underline">
                    privacy@oilamor.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
