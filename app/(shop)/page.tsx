import { HeroSection } from '../components/hero-section'
import { AtelierSection } from '../components/atelier-section'
import { LaboratorySection } from '../components/laboratory-section'
import { CircleSection } from '../components/circle-section'
import { AwakeningSection } from '../components/awakening-section'
import { Footer } from '../components/footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AtelierSection />
      <LaboratorySection />
      <CircleSection />
      <AwakeningSection />
      <Footer />
    </>
  )
}
