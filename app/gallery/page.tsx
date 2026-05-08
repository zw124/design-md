"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Download, ExternalLink, Globe2, Layers2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import {
  DEFAULT_GALLERY_ITEMS,
  GALLERY_DELETED_DEFAULTS_KEY,
  GALLERY_STORAGE_KEY,
  type GalleryItem,
  screenshotUrl,
} from "@/lib/gallery-data"

function loadDeletedDefaultIds() {
  try {
    const stored = localStorage.getItem(GALLERY_DELETED_DEFAULTS_KEY)
    return new Set(stored ? (JSON.parse(stored) as string[]) : [])
  } catch {
    return new Set<string>()
  }
}

function loadGalleryItems() {
  if (typeof window === "undefined") return DEFAULT_GALLERY_ITEMS
  try {
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY)
    const custom = stored ? (JSON.parse(stored) as GalleryItem[]) : []
    const deletedDefaultIds = loadDeletedDefaultIds()
    const defaults = DEFAULT_GALLERY_ITEMS.filter((item) => !deletedDefaultIds.has(item.id))
    return [...custom, ...defaults]
  } catch {
    const deletedDefaultIds = loadDeletedDefaultIds()
    return DEFAULT_GALLERY_ITEMS.filter((item) => !deletedDefaultIds.has(item.id))
  }
}

function downloadMarkdown(item: GalleryItem) {
  const blob = new Blob([item.markdown || `# DESIGN.md - ${item.name}\n`], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${item.url.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "design"}.design.md`
  anchor.click()
  URL.revokeObjectURL(url)
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-border bg-[#0d0d0b] px-4 py-2.5 text-sm text-foreground">
      {children}
    </span>
  )
}

function PanelSection({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded bg-[#151513]">{icon}</span>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </section>
  )
}

function DetailView({ item, onBack }: { item: GalleryItem; onBack: () => void }) {
  return (
    <section className="min-h-screen pt-20">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 border-t border-border lg:grid-cols-[minmax(0,3fr)_minmax(360px,1fr)]">
        <div className="bg-[#10100e] p-5 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-sm text-muted transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-sm text-muted transition hover:text-foreground"
            >
              Visit site
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <img
              src={screenshotUrl(item.href)}
              alt={`${item.name} website screenshot`}
              className="w-full object-cover object-top"
            />
          </div>
        </div>

        <aside className="border-l border-border bg-[#0d0d0b] p-6 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <div className="mb-10 rounded-lg bg-[#151515] p-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-black text-xl font-bold text-white">
                {item.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold text-foreground">{item.name}</h1>
                <p className="truncate text-sm text-[#8f94a8]">{item.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <PanelSection title="Page Types" icon={<span className="text-lg">◢</span>}>
              {item.pageTypes.map((value) => (
                <Chip key={value}>{value}</Chip>
              ))}
            </PanelSection>

            <PanelSection title="UX Patterns" icon={<Layers2 className="h-4 w-4 text-accent" />}>
              {item.uxPatterns.map((value) => (
                <Chip key={value}>{value}</Chip>
              ))}
            </PanelSection>

            <PanelSection title="UI Elements" icon={<span className="text-lg">▣</span>}>
              {item.uiElements.map((value) => (
                <Chip key={value}>{value}</Chip>
              ))}
            </PanelSection>

            <PanelSection
              title="Colors"
              icon={<span className="text-lg">◒</span>}
              action={
                <button
                  onClick={() => downloadMarkdown(item)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#202026] px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-[#27272f]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              }
            >
              {item.colors.map((color) => (
                <span
                  key={`${color.name}-${color.value}`}
                  className="inline-flex items-center gap-3 rounded-lg border border-border bg-[#0d0d0b] px-4 py-2.5 text-sm text-foreground"
                >
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color.value }} />
                  {color.name}
                </span>
              ))}
            </PanelSection>
          </div>

          <div className="mt-10 grid grid-cols-[1fr_auto_auto] gap-3">
            <button
              onClick={() => downloadMarkdown(item)}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#202026] px-5 text-sm font-semibold text-foreground transition hover:bg-[#27272f]"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="grid h-14 w-14 place-items-center rounded-full bg-[#202026] text-foreground transition hover:bg-[#27272f]"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="grid h-14 w-14 place-items-center rounded-full bg-[#202026] text-foreground transition hover:bg-[#27272f]"
            >
              <Globe2 className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default function GalleryPage() {
  const [items, setItems] = useState(DEFAULT_GALLERY_ITEMS)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useEffect(() => {
    setItems(loadGalleryItems())
  }, [])

  return (
    <main className="min-h-screen">
      <Nav />
      {selected ? (
        <DetailView item={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">
                Gallery
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Ready-to-use DESIGN.md examples
              </h1>
              <p className="mt-5 max-w-xl font-mono text-sm leading-7 text-muted">
                Browse generated references with source screenshots and reusable design system notes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="group overflow-hidden rounded-lg border border-border bg-surface text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#3a3a36] hover:bg-[#151513]"
                >
                  <div className="aspect-[16/10] overflow-hidden border-b border-border bg-[#080807]">
                    <img
                      src={screenshotUrl(item.href)}
                      alt={`${item.name} website screenshot`}
                      className="h-full w-full object-cover object-top opacity-95 transition duration-500 group-hover:scale-[1.015] group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      {item.name}
                    </h2>
                    <p className="mt-1 font-mono text-sm text-muted">{item.url}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <Footer />
        </>
      )}
    </main>
  )
}
