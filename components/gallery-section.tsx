"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Download, ExternalLink, FileDown, X } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DEFAULT_GALLERY_ITEMS, type GalleryItem, screenshotUrl } from "@/lib/gallery-data"

gsap.registerPlugin(ScrollTrigger)

const GALLERY_ITEMS = DEFAULT_GALLERY_ITEMS.slice(0, 12)
type ExportTab = "DESIGN.md" | "Tailwind v4" | "CSS Variables" | "Design Tokens"
type Density = "Compact" | "Extended"

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function tokenName(value: string) {
  return slugify(value) || "color"
}

function compactMarkdown(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed.startsWith("#") || trimmed.startsWith("- **") || trimmed.startsWith("|") || trimmed.startsWith("## 1.") || trimmed.startsWith("## 2.") || trimmed.startsWith("## 3.")
    })
    .slice(0, 90)
    .join("\n")
}

function buildTailwind(item: GalleryItem, density: Density) {
  const colors = item.colors.map((color) => `  --color-${tokenName(color.name)}: ${color.value};`).join("\n")
  const compact = `@import "tailwindcss";

@theme inline {
${colors}
  --font-sans: var(--font-sans);
  --radius-card: 8px;
}`

  if (density === "Compact") return compact

  return `${compact}

@layer components {
  .${slugify(item.name)}-surface {
    background: var(--color-${tokenName(item.colors[2]?.name || item.colors[0]?.name || "surface")});
    border: 1px solid color-mix(in srgb, var(--color-${tokenName(item.colors[0]?.name || "accent")}) 18%, transparent);
    border-radius: var(--radius-card);
  }

  .${slugify(item.name)}-button {
    background: var(--color-${tokenName(item.colors[0]?.name || "accent")});
    color: #ffffff;
    min-height: 40px;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
  }
}`
}

function buildCssVariables(item: GalleryItem, density: Density) {
  const colorVars = item.colors
    .map((color) => `  --${tokenName(color.name)}: ${color.value};`)
    .join("\n")
  const base = `:root {
${colorVars}
  --radius-card: 8px;
  --radius-control: 8px;
  --space-section: 64px;
  --space-card: 24px;
}`

  if (density === "Compact") return base

  return `${base}

[data-theme="${slugify(item.name)}"] {
  color: var(--${tokenName(item.colors[1]?.name || item.colors[0]?.name || "foreground")});
  background: var(--${tokenName(item.colors[2]?.name || item.colors[0]?.name || "background")});
}

.card {
  border-radius: var(--radius-card);
  padding: var(--space-card);
}

.section {
  padding-block: var(--space-section);
}`
}

function buildDesignTokens(item: GalleryItem, density: Density) {
  const tokens = {
    name: item.name,
    source: item.href,
    colors: Object.fromEntries(
      item.colors.map((color) => [
        tokenName(color.name),
        {
          value: color.value,
          type: "color",
          description: `Verified gallery palette color for ${item.name}.`,
        },
      ]),
    ),
    typography: {
      display: { value: "48px/56px modern sans-serif", type: "typography" },
      heading: { value: "32px/40px modern sans-serif", type: "typography" },
      body: { value: "16px/24px modern sans-serif", type: "typography" },
    },
    spacing: {
      section: { value: "64px", type: "dimension" },
      card: { value: "24px", type: "dimension" },
      control: { value: "40px", type: "dimension" },
    },
    radius: {
      card: { value: "8px", type: "dimension" },
      control: { value: "8px", type: "dimension" },
    },
  }

  if (density === "Compact") {
    return `// Design Tokens: compact color package for ${item.name}
${JSON.stringify({ name: tokens.name, source: tokens.source, colors: tokens.colors }, null, 2)}`
  }

  return `// Design Tokens: full package for ${item.name}
${JSON.stringify(tokens, null, 2)}`
}

function getExportContent(item: GalleryItem, tab: ExportTab, density: Density) {
  if (tab === "Tailwind v4") return buildTailwind(item, density)
  if (tab === "CSS Variables") return buildCssVariables(item, density)
  if (tab === "Design Tokens") return buildDesignTokens(item, density)
  return density === "Compact" ? compactMarkdown(item.markdown) : item.markdown
}

function extensionFor(tab: ExportTab) {
  if (tab === "Design Tokens") return "json"
  if (tab === "DESIGN.md") return "md"
  return "css"
}

function downloadExport(item: GalleryItem, tab: ExportTab, density: Density) {
  const content = getExportContent(item, tab, density)
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = `${slugify(item.url)}.${slugify(tab)}.${extensionFor(tab)}`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

function MarkdownPane({ item }: { item: GalleryItem }) {
  const [activeTab, setActiveTab] = useState<ExportTab>("DESIGN.md")
  const [density, setDensity] = useState<Density>("Extended")
  const content = getExportContent(item, activeTab, density)

  return (
    <aside className="h-full min-h-0 border-l border-border bg-[#10131A]">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-8 overflow-x-auto border-b border-border px-6 text-sm font-semibold">
          {(["DESIGN.md", "Tailwind v4", "CSS Variables", "Design Tokens"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 py-5 transition ${activeTab === tab ? "text-foreground" : "text-muted hover:text-foreground"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="gallery-export-tab"
                  className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <div className="flex gap-8 text-sm">
            {(["Compact", "Extended"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setDensity(option)}
                className={`relative pb-4 transition ${density === option ? "text-foreground" : "text-muted hover:text-foreground"}`}
              >
                {option}
                {density === option && (
                  <motion.span
                    layoutId="gallery-density-tab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(content)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={() => downloadExport(item, activeTab, density)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface"
            >
              <Download className="h-4 w-4" />
              .{extensionFor(activeTab)}
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.pre
              key={`${activeTab}-${density}`}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="h-full overflow-y-auto whitespace-pre-wrap px-6 py-6 font-mono text-sm leading-7 text-[#D8DDE8] overscroll-contain"
            >
              {content}
            </motion.pre>
          </AnimatePresence>
        </div>
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
          <span className="shrink-0 font-display text-2xl font-bold tracking-tight text-foreground">
            Parallect
          </span>
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
            <motion.section
              initial={{ y: 34, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
                <motion.img
                  src={screenshotUrl(item.href)}
                  alt={`${item.name} website screenshot`}
                  className="aspect-[16/10] w-full object-cover object-top"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
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
            </motion.section>

            <motion.section
              initial={{ y: 34, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
            >
              <h2 className="mb-7 text-2xl font-semibold">Color Palette</h2>
              <p className="mb-5 font-mono text-sm uppercase tracking-[0.18em] text-muted">Brand</p>
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
                {item.colors.slice(0, 6).map((color) => (
                  <motion.div key={`${color.name}-${color.value}`} whileHover={{ y: -6, scale: 1.015 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
                    <motion.div className="h-28 rounded-xl border border-border" style={{ backgroundColor: color.value }} whileTap={{ scale: 0.98 }} />
                    <h3 className="mt-4 text-lg font-semibold">{color.name}</h3>
                    <p className="font-mono text-sm text-muted">{color.value}</p>
                    <p className="mt-3 text-sm leading-6 text-muted">Verified gallery palette color for {item.name}.</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ y: 34, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
            >
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
            </motion.section>

            <motion.section
              initial={{ y: 34, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
            >
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
            </motion.section>

            <motion.section
              initial={{ y: 34, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            >
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
            </motion.section>
          </div>
        </motion.section>

        <motion.div
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="h-full min-h-0"
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
