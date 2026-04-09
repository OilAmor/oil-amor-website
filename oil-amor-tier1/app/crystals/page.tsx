import { Metadata } from 'next'
import { getAllCrystals } from '@/lib/content/oil-crystal-synergies'

export const metadata: Metadata = {
  title: 'Crystal Guide | Oil Amor',
  description: 'Learn about the healing properties of our ethically-sourced crystals and their synergies with essential oils.',
}

export default function CrystalsPage() {
  const crystals = getAllCrystals()

  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 lg:mb-32 text-center">
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] block mb-6">
            Crystal Guide
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
            Stones of <span className="italic text-[#c9a227]">Intention</span>
          </h1>
          <p className="text-[#a69b8a] max-w-2xl mx-auto leading-relaxed">
            Each crystal is ethically sourced and selected for its unique energetic properties. 
            Paired with our essential oils, they create powerful synergies for mind, body, and spirit.
          </p>
        </div>

        {/* Crystals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crystals.length > 0 ? (
            crystals.map((crystal) => (
              <article 
                key={crystal.id} 
                className="group p-8 border border-[#262228] bg-[#141218]/30 hover:border-[#c9a227]/30 transition-colors duration-500"
              >
                {/* Color Indicator */}
                <div 
                  className="w-16 h-16 rounded-full mb-6 mx-auto"
                  style={{ backgroundColor: crystal.color }}
                />
                
                {/* Name */}
                <h2 className="font-display text-2xl text-[#f5f3ef] text-center mb-2">
                  {crystal.name}
                </h2>
                
                {/* Properties */}
                <div className="text-center mb-4">
                  <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[#c9a227]">
                    {crystal.chakra} Chakra
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-[#a69b8a] text-center text-sm leading-relaxed">
                  {crystal.description}
                </p>
                
                {/* Energy */}
                <div className="mt-6 pt-6 border-t border-[#262228]">
                  <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] block mb-2">
                    Primary Energy
                  </span>
                  <span className="text-[#f5f3ef] capitalize">
                    {crystal.energy}
                  </span>
                </div>
              </article>
            ))
          ) : (
            // Fallback content if no crystals
            <>
              <CrystalCard 
                name="Amethyst"
                color="#9966cc"
                chakra="Crown"
                energy="Calming & Spiritual"
                description="The stone of spiritual protection and purification. Amethyst creates a shield of light around the body."
              />
              <CrystalCard 
                name="Clear Quartz"
                color="#e8e8e8"
                chakra="All"
                energy="Amplification & Clarity"
                description="The master healer. Clear quartz amplifies energy and thought, bringing clarity to the mind."
              />
              <CrystalCard 
                name="Rose Quartz"
                color="#f4c2c2"
                chakra="Heart"
                energy="Love & Compassion"
                description="The stone of unconditional love. Rose Quartz opens the heart to all forms of love."
              />
              <CrystalCard 
                name="Citrine"
                color="#e4a010"
                chakra="Solar Plexus"
                energy="Abundance & Joy"
                description="The merchant's stone. Citrine carries the power of the sun, bringing energy and creativity."
              />
              <CrystalCard 
                name="Black Tourmaline"
                color="#1a1a1a"
                chakra="Root"
                energy="Protection & Grounding"
                description="A powerful grounding stone. Black Tourmaline creates a protective shield around the body."
              />
              <CrystalCard 
                name="Carnelian"
                color="#e25822"
                chakra="Sacral"
                energy="Creativity & Courage"
                description="The artist's stone. Carnelian boosts creativity, motivation, and courage."
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CrystalCard({ 
  name, 
  color, 
  chakra, 
  energy, 
  description 
}: { 
  name: string
  color: string
  chakra: string
  energy: string
  description: string
}) {
  return (
    <article className="group p-8 border border-[#262228] bg-[#141218]/30 hover:border-[#c9a227]/30 transition-colors duration-500">
      <div 
        className="w-16 h-16 rounded-full mb-6 mx-auto"
        style={{ backgroundColor: color }}
      />
      <h2 className="font-display text-2xl text-[#f5f3ef] text-center mb-2">
        {name}
      </h2>
      <div className="text-center mb-4">
        <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[#c9a227]">
          {chakra} Chakra
        </span>
      </div>
      <p className="text-[#a69b8a] text-center text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-6 pt-6 border-t border-[#262228]">
        <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] block mb-2">
          Primary Energy
        </span>
        <span className="text-[#f5f3ef]">{energy}</span>
      </div>
    </article>
  )
}
