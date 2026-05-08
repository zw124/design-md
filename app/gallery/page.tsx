import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"

const GALLERY_ITEMS = [
  {
    name: "Stripe",
    url: "stripe.com",
    href: "https://stripe.com",
  },
  {
    name: "Linear",
    url: "linear.app",
    href: "https://linear.app",
  },
  {
    name: "Apple",
    url: "apple.com",
    href: "https://apple.com",
  },
]

function screenshotUrl(href: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url`
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">
            Gallery
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Ready-to-use DESIGN.md examples
          </h1>
          <p className="mt-5 max-w-xl font-mono text-sm leading-7 text-muted">
            Open a generated reference and use the site screenshot, name, URL, and DESIGN.md structure as a starting point.
          </p>
        </div>

        <div className="grid gap-8">
          {GALLERY_ITEMS.map((item) => (
            <Link
              key={item.url}
              href={`/#generator`}
              className="group overflow-hidden rounded-lg border border-border bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-[#3a3a36] hover:bg-[#151513]"
            >
              <div className="aspect-[16/8] overflow-hidden border-b border-border bg-[#080807]">
                <img
                  src={screenshotUrl(item.href)}
                  alt={`${item.name} website screenshot`}
                  className="h-full w-full object-cover object-top opacity-95 transition duration-500 group-hover:scale-[1.015] group-hover:opacity-100"
                />
              </div>
              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {item.name}
                  </h2>
                  <p className="mt-1 font-mono text-sm text-muted">{item.url}</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-accent opacity-70 transition group-hover:opacity-100">
                  Open DESIGN.md
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
