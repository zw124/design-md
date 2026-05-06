import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
