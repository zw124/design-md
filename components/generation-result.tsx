"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Copy, Download, ExternalLink } from "lucide-react"

interface GenerationResultProps {
  url: string
  content: string
  isGenerating?: boolean
  colorPayload?: unknown
  onClose: () => void
  contentRef?: React.RefObject<HTMLDivElement | null>
}

type ExportTab = "DESIGN.md" | "Tailwind v4" | "CSS Variables" | "Design Tokens"
type Density = "Compact" | "Extended"

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
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

function colorTokenRows(markdown: string) {
  const matches = [...markdown.matchAll(/#(?:[0-9a-fA-F]{3}){1,2}/g)].map((match) => match[0].toUpperCase())
  return Array.from(new Set(matches)).slice(0, 10)
}

function buildTailwind(hostname: string, markdown: string, density: Density) {
  const colors = colorTokenRows(markdown)
  const colorLines = colors.length
    ? colors.map((color, index) => `  --color-site-${index + 1}: ${color};`).join("\n")
    : "  --color-site-1: #7AB8F5;\n  --color-site-2: #C8F04A;\n  --color-surface: #0D1016;"
  const compact = `@import "tailwindcss";

@theme inline {
${colorLines}
  --font-sans: var(--font-sans);
  --radius-card: 8px;
}`

  if (density === "Compact") return compact

  return `${compact}

@layer components {
  .${slugify(hostname)}-surface {
    background: var(--color-surface, #0D1016);
    border: 1px solid color-mix(in srgb, var(--color-site-1) 18%, transparent);
    border-radius: var(--radius-card);
  }

  .${slugify(hostname)}-button {
    background: var(--color-site-1);
    color: #080A0F;
    min-height: 40px;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
  }
}`
}

function buildCssVariables(hostname: string, markdown: string, density: Density) {
  const colors = colorTokenRows(markdown)
  const colorLines = colors.length
    ? colors.map((color, index) => `  --site-color-${index + 1}: ${color};`).join("\n")
    : "  --site-color-1: #7AB8F5;\n  --site-color-2: #C8F04A;\n  --site-surface: #0D1016;"
  const base = `:root {
${colorLines}
  --site-radius-card: 8px;
  --site-radius-control: 8px;
  --site-space-section: 64px;
  --site-space-card: 24px;
}`

  if (density === "Compact") return base

  return `${base}

[data-source="${slugify(hostname)}"] {
  color: var(--site-color-1);
  background: var(--site-surface, #0D1016);
}

.site-card {
  border-radius: var(--site-radius-card);
  padding: var(--site-space-card);
}

.site-section {
  padding-block: var(--site-space-section);
}`
}

function buildDesignTokens(hostname: string, markdown: string, density: Density) {
  const colors = colorTokenRows(markdown)
  const tokenPayload = {
    name: hostname,
    source: `https://${hostname}`,
    colors: Object.fromEntries(
      (colors.length ? colors : ["#7AB8F5", "#C8F04A", "#0D1016"]).map((color, index) => [
        `site-${index + 1}`,
        { value: color, type: "color" },
      ]),
    ),
    typography: {
      display: { value: "48px/56px", type: "typography" },
      heading: { value: "32px/40px", type: "typography" },
      body: { value: "16px/24px", type: "typography" },
    },
    spacing: {
      section: { value: "64px", type: "dimension" },
      card: { value: "24px", type: "dimension" },
    },
  }

  if (density === "Compact") {
    return `// Design Tokens: compact color package for ${hostname}
${JSON.stringify({ name: tokenPayload.name, source: tokenPayload.source, colors: tokenPayload.colors }, null, 2)}`
  }

  return `// Design Tokens: full package for ${hostname}
${JSON.stringify(tokenPayload, null, 2)}`
}

function getExportContent(tab: ExportTab, density: Density, hostname: string, markdown: string) {
  if (tab === "Tailwind v4") return buildTailwind(hostname, markdown, density)
  if (tab === "CSS Variables") return buildCssVariables(hostname, markdown, density)
  if (tab === "Design Tokens") return buildDesignTokens(hostname, markdown, density)
  return density === "Compact" ? compactMarkdown(markdown) : markdown
}

function extensionFor(tab: ExportTab) {
  if (tab === "Design Tokens") return "json"
  if (tab === "DESIGN.md") return "md"
  return "css"
}

function renderInline(text: string) {
  if (!text) return text
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`|\[[^\]]+\]\([^)]+\))/g)

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-semibold text-[#F5F7FB]">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="syntax-code">{part.slice(1, -1)}</code>
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a key={idx} href={linkMatch[2]} className="text-[#7AB8F5] hover:underline" target="_blank" rel="noreferrer">
          {linkMatch[1]}
        </a>
      )
    }
    return <span key={idx}>{part}</span>
  })
}

function renderTable(lines: string[], startIdx: number) {
  const rows = lines
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && !row.every((cell) => cell.match(/^[-:]+$/)))

  if (!rows.length) return null

  return (
    <div key={startIdx} className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx === 0 ? "border-b border-border font-semibold text-foreground" : "border-b border-border/50 text-[#C8CEDA]"}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="whitespace-nowrap px-3 py-2">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (/^#\s+/.test(trimmedLine)) {
      elements.push(<h1 key={i} className="syntax-h1 mb-4 pt-2">{renderInline(trimmedLine.replace(/^#\s+/, ""))}</h1>)
    } else if (/^##\s+/.test(trimmedLine)) {
      elements.push(<h2 key={i} className="syntax-h2 mb-3 mt-7">{renderInline(trimmedLine.replace(/^##\s+/, ""))}</h2>)
    } else if (/^###\s+/.test(trimmedLine)) {
      elements.push(<h3 key={i} className="syntax-h3 mb-2 mt-5">{renderInline(trimmedLine.replace(/^###\s+/, ""))}</h3>)
    } else if (trimmedLine.startsWith("---") || trimmedLine.startsWith("***")) {
      elements.push(<hr key={i} className="my-5 border-border" />)
    } else if (trimmedLine.startsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim())
        i++
      }
      const table = renderTable(tableLines, i - tableLines.length)
      if (table) elements.push(table)
      continue
    } else if (trimmedLine.match(/^[-*]\s/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={i - items.length} className="my-3 list-inside list-disc space-y-1.5 text-sm leading-7 text-[#D8DDE8]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      continue
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""))
        i++
      }
      elements.push(
        <ol key={i - items.length} className="my-3 list-inside list-decimal space-y-1.5 text-sm leading-7 text-[#D8DDE8]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      )
      continue
    } else if (trimmedLine === "") {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="my-1 text-sm leading-7 text-[#D8DDE8]">{renderInline(line)}</p>)
    }
    i++
  }

  return elements
}

export function GenerationResult({ url, content, isGenerating, onClose, contentRef }: GenerationResultProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("DESIGN.md")
  const [density, setDensity] = useState<Density>("Extended")
  const normalizedUrl = useMemo(() => {
    if (!url) return "https://stripe.com"
    return url.startsWith("http") ? url : `https://${url}`
  }, [url])

  const hostname = useMemo(() => normalizedUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, ""), [normalizedUrl])
  const previewUrl = useMemo(() => {
    return `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  }, [normalizedUrl])
  const exportContent = useMemo(() => getExportContent(activeTab, density, hostname, content), [activeTab, density, hostname, content])

  const downloadMarkdown = () => {
    const blob = new Blob([exportContent], { type: "text/plain;charset=utf-8" })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = `${slugify(hostname || "site")}.${slugify(activeTab)}.${extensionFor(activeTab)}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  }

  const copyMarkdown = () => navigator.clipboard.writeText(exportContent)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-8">
        <div className="font-display text-2xl font-bold tracking-tight text-foreground">Parallect</div>
        <a href={normalizedUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground md:inline-flex">
          Visit site
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(520px,0.98fr)]">
        <section className="min-h-0 overflow-y-auto border-r border-border bg-background">
          <div className="space-y-14 p-6 md:p-9">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <img src={previewUrl} alt={`${hostname} screenshot`} className="aspect-[16/10] w-full object-cover object-top" />
            </div>

            <section>
              <h1 className="font-display text-5xl leading-none text-foreground md:text-6xl">{hostname.replace(/^www\./, "")}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
                A generated style reference built from the live website. The left side summarizes the visual system; the right side keeps the full DESIGN.md ready for copy or download.
              </p>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold">Color Palette</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {["#7AB8F5", "#C8F04A", "#F5F7FB", "#8B93A7", "#0D1016", "#080A0F"].map((color) => (
                  <div key={color}>
                    <div className="h-28 rounded-xl border border-border" style={{ backgroundColor: color }} />
                    <p className="mt-3 font-mono text-sm text-foreground">{color}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold">Typography</h2>
              <div className="overflow-hidden rounded-xl border border-border">
                {[
                  ["display-hero", "The quick brown fox jumps", "64px"],
                  ["heading-lg", "The quick brown fox jumps", "40px"],
                  ["body", "The quick brown fox jumps", "16px"],
                ].map(([label, sample, size]) => (
                  <div key={label} className="border-b border-border p-6 last:border-b-0">
                    <div className="mb-4 flex justify-between font-mono text-sm text-muted">
                      <span>{label}</span>
                      <span>{size} · 500 · 1.1</span>
                    </div>
                    <p className="truncate text-4xl text-foreground md:text-6xl">{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold">Guidelines</h2>
              <div className="space-y-4 text-base leading-8 text-[#D8DDE8]">
                {["Keep dark surfaces crisp and neutral.", "Use accent color only for action and focus.", "Prefer direct hierarchy over decorative panels.", "Keep generated references close to the source site."].map((item) => (
                  <p key={item} className="flex gap-3"><span className="text-[#62D28F]">✓</span>{item}</p>
                ))}
              </div>
            </section>
          </div>
        </section>

        <aside className="min-h-0 border-l border-border bg-[#10131A]">
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
                      layoutId="generation-export-tab"
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
                        layoutId="generation-density-tab"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={copyMarkdown} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface">
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button onClick={downloadMarkdown} disabled={!content} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface disabled:opacity-40">
                  <Download className="h-4 w-4" />
                  .{extensionFor(activeTab)}
                </button>
              </div>
            </div>
            <div ref={contentRef} className="min-h-0 flex-1 overflow-hidden px-6 py-5 font-mono">
              <div key={`${activeTab}-${density}`} className="h-full overflow-y-auto overscroll-contain">
                  {activeTab === "DESIGN.md" ? (
                    <>
                      {renderMarkdown(exportContent)}
                      {isGenerating && <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-accent align-middle" />}
                    </>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-[#D8DDE8]">{exportContent}</pre>
                  )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
