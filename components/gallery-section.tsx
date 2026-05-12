"use client"

import { useLayoutEffect, useRef } from "react"
import { ExternalLink, FileDown } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DEFAULT_GALLERY_ITEMS, screenshotUrl } from "@/lib/gallery-data"

gsap.registerPlugin(ScrollTrigger)

const GALLERY_ITEMS = DEFAULT_GALLERY_ITEMS.slice(0, 12)

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]")
      const images = gsap.utils.toArray<HTMLElement>("[data-gallery-image]")

      gsap.fromTo(
        "[data-gallery-heading]",
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "top 36%",
            scrub: 0.8,
          },
        },
      )

      gsap.fromTo(
        cards,
        { y: 72, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 82%",
            end: "bottom 58%",
            scrub: 0.9,
          },
        },
      )

      images.forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1.08, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        )
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section ref={sectionRef} id="gallery" className="relative overflow-hidden px-6 pb-24 pt-10 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <div data-gallery-heading className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Gallery
            </h2>
            <p className="mt-4 max-w-xl font-mono text-sm leading-7 text-muted">
              Twelve source references you can scroll through after generating a DESIGN.md.
            </p>
          </div>
          <a
            href="#generator"
            className="inline-flex h-10 w-fit items-center gap-2 rounded border border-border px-3 text-xs font-medium text-muted transition hover:border-[#444442] hover:text-foreground"
          >
            Generate your own
            <FileDown className="h-3.5 w-3.5" />
          </a>
        </div>

        <div ref={railRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item, index) => (
            <article
              key={item.id}
              data-gallery-card
              className="group overflow-hidden rounded-lg border border-border bg-surface/90 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition-colors hover:border-[#454139] hover:bg-[#171412]"
            >
              <a href={item.href} target="_blank" rel="noreferrer" className="block">
                <div className="aspect-[16/10] overflow-hidden border-b border-border bg-[#0f0d0b]">
                  <img
                    data-gallery-image
                    src={screenshotUrl(item.href)}
                    alt={`${item.name} website screenshot`}
                    className="h-full w-full object-cover object-top opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">
                        {item.name}
                      </h3>
                      <p className="mt-1 truncate font-mono text-xs text-muted">{item.url}</p>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-border text-muted transition group-hover:border-accent group-hover:text-accent">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="line-clamp-2 min-h-10 font-mono text-xs leading-5 text-muted">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.colors.slice(0, 4).map((color) => (
                      <span
                        key={`${item.id}-${color.value}`}
                        className="h-4 w-4 rounded-full border border-white/10"
                        style={{ backgroundColor: color.value }}
                        title={`${color.name}: ${color.value}`}
                      />
                    ))}
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
