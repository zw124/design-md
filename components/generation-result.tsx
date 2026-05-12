"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Copy, Download, ExternalLink } from "lucide-react"

interface GenerationResultProps {
  url: string
  content: string
  isGenerating?: boolean
  colorPayload?: unknown
  onClose: () => void
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

export function GenerationResult({ url, content, isGenerating, onClose }: GenerationResultProps) {
  const normalizedUrl = useMemo(() => {
    if (!url) return "https://stripe.com"
    return url.startsWith("http") ? url : `https://${url}`
  }, [url])

  const hostname = useMemo(() => normalizedUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, ""), [normalizedUrl])
  const previewUrl = useMemo(() => {
    return `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  }, [normalizedUrl])

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = `DESIGN-${hostname || "site"}.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  }

  const copyMarkdown = () => navigator.clipboard.writeText(content)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-foreground text-xl font-bold leading-none transition hover:bg-foreground hover:text-background" />
          <div className="min-w-0 truncate text-lg font-semibold md:text-2xl">
            <span className="text-muted">/</span> Styles <span className="text-muted">/</span> {hostname.replace(/^www\./, "")}
          </div>
        </div>
        <a href={normalizedUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground md:inline-flex">
          Visit site
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(520px,0.98fr)]">
        <motion.section
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-0 overflow-y-auto border-r border-border bg-background"
        >
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
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="min-h-0 border-l border-border bg-[#10131A]"
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex h-16 shrink-0 items-center gap-8 border-b border-border px-6 text-sm font-semibold">
              <span className="border-b border-foreground py-5 text-foreground">DESIGN.md</span>
              <span className="py-5 text-muted">Tailwind v4</span>
              <span className="py-5 text-muted">CSS Variables</span>
              <span className="py-5 text-muted">Design Tokens</span>
            </div>
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
              <div className="flex gap-8 text-sm">
                <span className="text-muted">Compact</span>
                <span className="border-b-2 border-foreground pb-4 text-foreground">Extended</span>
              </div>
              <div className="flex gap-2">
                <button onClick={copyMarkdown} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface">
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button onClick={downloadMarkdown} disabled={!content} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface disabled:opacity-40">
                  <Download className="h-4 w-4" />
                  .md
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-6 py-5 font-mono">
              {renderMarkdown(content)}
              {isGenerating && <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-accent align-middle" />}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
