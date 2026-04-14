import { HeroSection } from '../components/hero-section'
import { CodexSection } from '../components/codex-section'
import { LaboratorySection } from '../components/laboratory-section'
import { CommunityStrip } from '../components/community-strip'
import { CircleSection } from '../components/circle-section'
import { AwakeningSection } from '../components/awakening-section'
import { AscensionSection } from '../components/ascension-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CodexSection />
      <LaboratorySection />
      <CommunityStrip />
      <CircleSection />
      <AwakeningSection />
      <AscensionSection />
    </>
  )
}
