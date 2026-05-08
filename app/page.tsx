import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#111111]">
      <Nav />
      <HeroSection />
    </main>
  )
}
