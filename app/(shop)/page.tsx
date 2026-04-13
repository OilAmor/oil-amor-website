import { HeroSection } from '../components/hero-section'
import { SectionTransition } from '../components/section-transition'
import { CodexSection } from '../components/codex-section'
import { LaboratorySection } from '../components/laboratory-section'
import { CommunityStrip } from '../components/community-strip'
import { CircleSection } from '../components/circle-section'
import { AwakeningSection } from '../components/awakening-section'
import { AscensionSection } from '../components/ascension-section'
import { Footer } from '../components/footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionTransition type="wave" />
      <CodexSection />
      <SectionTransition type="curve" flip />
      <LaboratorySection />
      <CommunityStrip />
      <SectionTransition type="arch" />
      <CircleSection />
      <SectionTransition type="peak" flip />
      <AwakeningSection />
      <AscensionSection />
      <Footer />
    </>
  )
}
