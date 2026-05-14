import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { GallerySection } from "@/components/gallery-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <HeroSection />
      <GallerySection />
      <Footer />
    </main>
  )
}
