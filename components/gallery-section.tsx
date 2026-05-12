"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Download, ExternalLink, FileDown, X } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DEFAULT_GALLERY_ITEMS, type GalleryItem, screenshotUrl } from "@/lib/gallery-data"

gsap.registerPlugin(ScrollTrigger)

const GALLERY_ITEMS = DEFAULT_GALLERY_ITEMS.slice(0, 12)

function downloadMarkdown(item: GalleryItem) {
  const blob = new Blob([item.markdown], { type: "text/markdown;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = `${item.url.replace(/[^a-z0-9]+/gi, "-")}.design.md`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

function MarkdownPane({ item }: { item: GalleryItem }) {
  return (
    <aside className="min-h-0 border-l border-border bg-[#10131A]">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-8 overflow-x-auto border-b border-border px-6 text-sm font-semibold">
          <span className="shrink-0 border-b border-foreground py-5 text-foreground">DESIGN.md</span>
          <span className="shrink-0 py-5 text-muted">Tailwind v4</span>
          <span className="shrink-0 py-5 text-muted">CSS Variables</span>
          <span className="shrink-0 py-5 text-muted">Design Tokens</span>
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <div className="flex gap-8 text-sm">
            <span className="text-muted">Compact</span>
            <span className="border-b-2 border-foreground pb-4 text-foreground">Extended</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(item.markdown)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={() => downloadMarkdown(item)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface"
            >
              <Download className="h-4 w-4" />
              .md
            </button>
          </div>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap px-6 py-6 font-mono text-sm leading-7 text-[#D8DDE8]">
          {item.markdown}
        </pre>
      </div>
    </aside>
  )
}

function GalleryDetail({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const accent = item.colors[0]?.value || "#7AB8F5"
  const foreground = item.colors[1]?.value || "#F5F7FB"

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-foreground text-xl font-bold leading-none transition hover:bg-foreground hover:text-background">
            R
          </button>
          <div className="min-w-0 truncate text-lg font-semibold md:text-2xl">
            <span className="text-muted">/</span> Styles <span className="text-muted">/</span> {item.name}
          </div>
        </div>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted transition hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="grid h-[calc(100vh-68px)] grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(520px,0.98fr)]">
        <motion.section
          initial={{ x: -48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-0 overflow-y-auto border-r border-border bg-background"
        >
          <div className="space-y-14 p-6 md:p-9">
            <section>
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
                <img src={screenshotUrl(item.href)} alt={`${item.name} website screenshot`} className="aspect-[16/10] w-full object-cover object-top" />
              </div>
              <div className="mt-8 flex items-start justify-between gap-6">
                <div>
                  <h1 className="font-display text-5xl leading-none md:text-6xl">{item.name}</h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{item.description}</p>
                </div>
                <a href={item.href} target="_blank" rel="noreferrer" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border text-muted transition hover:text-foreground">
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </section>

            <section>
              <h2 className="mb-7 text-2xl font-semibold">Color Palette</h2>
              <p className="mb-5 font-mono text-sm uppercase tracking-[0.18em] text-muted">Brand</p>
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
                {item.colors.slice(0, 6).map((color) => (
                  <div key={`${color.name}-${color.value}`}>
                    <div className="h-28 rounded-xl border border-border" style={{ backgroundColor: color.value }} />
                    <h3 className="mt-4 text-lg font-semibold">{color.name}</h3>
                    <p className="font-mono text-sm text-muted">{color.value}</p>
                    <p className="mt-3 text-sm leading-6 text-muted">Verified gallery palette color for {item.name}.</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-7 text-2xl font-semibold">Typography</h2>
              <div className="overflow-hidden rounded-xl border border-border">
                {[
                  ["display-hero", "The quick brown fox jumps", "72px · 600 · 1"],
                  ["heading-lg", "The quick brown fox jumps", "40px · 600 · 1.1"],
                  ["body", "The quick brown fox jumps", "16px · 400 · 1.55"],
                ].map(([label, sample, meta]) => (
                  <div key={label} className="border-b border-border p-6 last:border-b-0">
                    <div className="mb-4 flex justify-between gap-5 font-mono text-sm text-muted">
                      <span>{label}</span>
                      <span>{meta}</span>
                    </div>
                    <p className="truncate text-4xl text-foreground md:text-6xl">{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-7 text-2xl font-semibold">Spacing & Shape</h2>
              <div className="overflow-hidden rounded-xl border border-border">
                {[
                  ["Density", "comfortable", "120px"],
                  ["Section gap", "56px", "88px"],
                  ["Card padding", "24px", "36px"],
                  ["Element gap", "16px", "28px"],
                ].map(([purpose, value, preview]) => (
                  <div key={purpose} className="grid grid-cols-[1fr_140px_1fr] items-center border-b border-border p-5 last:border-b-0">
                    <span className="text-foreground">{purpose}</span>
                    <span className="font-mono text-muted">{value}</span>
                    <span className="h-4 rounded bg-[#353B47]" style={{ width: preview }} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-7 text-2xl font-semibold">Guidelines</h2>
              <div className="space-y-4 text-base leading-8 text-[#D8DDE8]">
                {[
                  `Use ${accent} sparingly for primary interaction and active focus.`,
                  `Keep ${foreground} or the strongest neutral for readable foreground text.`,
                  "Preserve the source site's density, hierarchy, and component rhythm.",
                  "Avoid adding unrelated colors outside the verified palette.",
                  "Keep the DESIGN.md useful as implementation guidance, not just visual notes.",
                ].map((item) => (
                  <p key={item} className="flex gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-[#62D28F]" />
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </motion.section>

        <motion.div
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="min-h-0"
        >
          <MarkdownPane item={item} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]")
      const images = gsap.utils.toArray<HTMLElement>("[data-gallery-image]")

      gsap.fromTo(
        "[data-gallery-heading]",
        { y: 70, opacity: 0, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "top 38%",
            scrub: 0.65,
          },
        },
      )

      gsap.fromTo(
        cards,
        { y: 95, opacity: 0, rotateX: 8, scale: 0.94, transformOrigin: "50% 100%" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 86%",
            end: "bottom 54%",
            scrub: 0.75,
          },
        },
      )

      images.forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1.12, yPercent: -5 },
          {
            scale: 1.02,
            yPercent: 5,
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
    <>
      <section ref={sectionRef} id="gallery" className="relative overflow-hidden px-6 pb-24 pt-10 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div data-gallery-heading className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">Gallery</h2>
              <p className="mt-4 max-w-xl font-mono text-sm leading-7 text-muted">
                Scroll the references, then open one into a full style reference with the DESIGN.md beside it.
              </p>
            </div>
            <a
              href="#generator"
              className="inline-flex h-10 w-fit items-center gap-2 rounded border border-border px-3 text-xs font-medium text-muted transition hover:border-[#3A4354] hover:text-foreground"
            >
              Generate your own
              <FileDown className="h-3.5 w-3.5" />
            </a>
          </div>

          <div ref={railRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
            {GALLERY_ITEMS.map((item, index) => (
              <button
                key={item.id}
                data-gallery-card
                onClick={() => setSelected(item)}
                className="group overflow-hidden rounded-lg border border-border bg-surface/95 text-left shadow-[0_24px_80px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-[#3A4354] hover:bg-[#121722]"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-border bg-[#0B0E14]">
                  <img
                    data-gallery-image
                    src={screenshotUrl(item.href)}
                    alt={`${item.name} website screenshot`}
                    className="h-full w-full object-cover object-top opacity-90 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-100"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">{item.name}</h3>
                      <p className="mt-1 truncate font-mono text-xs text-muted">{item.url}</p>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-border text-muted transition group-hover:border-accent group-hover:text-accent">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="line-clamp-2 min-h-10 font-mono text-xs leading-5 text-muted">{item.description}</p>
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
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>{selected && <GalleryDetail item={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </>
  )
}
