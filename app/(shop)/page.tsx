import { HeroSection } from '../components/hero-section'
import { AtelierSection } from '../components/atelier-section'
import { AwakeningSection } from '../components/awakening-section'
import { Footer } from '../components/footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AtelierSection />
      <AwakeningSection />
      <Footer />
    </>
  )
}
