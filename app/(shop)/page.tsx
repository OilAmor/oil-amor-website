import { HeroSection } from '../components/hero-section'
import { CodexSection } from '../components/codex-section'
import { LaboratorySection } from '../components/laboratory-section'
import { CircleSection } from '../components/circle-section'
import { AwakeningSection } from '../components/awakening-section'
import { AscensionSection } from '../components/ascension-section'
import { Footer } from '../components/footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CodexSection />
      <LaboratorySection />
      <CircleSection />
      <AwakeningSection />
      <AscensionSection />
      <Footer />
    </>
  )
}
