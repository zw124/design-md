import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { GallerySection } from "@/components/gallery-section"
import { Footer } from "@/components/footer"
import { WelcomeIntro } from "@/components/welcome-intro"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <WelcomeIntro />
      <Nav />
      <HeroSection />
      <GallerySection />
      <Footer />
    </main>
  )
}
