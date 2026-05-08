"use client"

import { AnimatePresence, motion } from "framer-motion"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Check,
  ExternalLink,
  Globe,
  LayoutGrid,
  PaintBucket,
  Search,
  Sparkles,
  Type,
  Wand2,
  X,
} from "lucide-react"
import { GenerationResult } from "./generation-result"

const STATUS_STEPS = [
  "Fetching page structure...",
  "Extracting color tokens...",
  "Analyzing typography...",
  "Mapping spacing scale...",
  "Identifying component patterns...",
  "Generating DESIGN.md...",
]

const QUICK_TRIES = ["stripe.com", "linear.app", "vercel.com", "apple.com"]
const FREE_GENERATION_LIMIT = 3
const USAGE_STORAGE_KEY = "designmd:generation-count"

const LIBRARY_TABS = [
  { id: "page-types", label: "Page Types", icon: "sunset" },
  { id: "ux-patterns", label: "UX Patterns", icon: "stack" },
  { id: "ui-elements", label: "UI Elements", icon: "glass" },
  { id: "fonts", label: "Fonts", icon: "loop" },
  { id: "colors", label: "Colors", icon: "swatch" },
] as const

const PAGE_TYPE_FILTERS = [
  "All",
  "Dashboard",
  "Product Page & Landing",
  "Paywall & Subscription",
  "Log In",
  "Product Details",
  "Profile & Account",
  "Blog",
  "About",
]

const LOGO_TRACK = [
  { name: "Cursor", domain: "cursor.com", ring: "#e8eefc" },
  { name: "OpenAI", domain: "openai.com", ring: "#e9e5db" },
  { name: "Anthropic", domain: "anthropic.com", ring: "#efe5d8" },
  { name: "Gemini", domain: "gemini.google.com", ring: "#ece9ff" },
  { name: "Windsurf", domain: "windsurf.com", ring: "#e7eefb" },
  { name: "Perplexity", domain: "perplexity.ai", ring: "#e8f0ec" },
] as const

type LibraryItem = {
  title: string
  site: string
  screenshot: string
  pageType: string
  uxPatterns: string[]
  uiElements: string[]
  fonts: string[]
  colors: string[]
}

const LIBRARY_ITEMS: LibraryItem[] = [
  {
    title: "Calendly",
    site: "calendly.com",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://calendly.com/",
    pageType: "Dashboard",
    uxPatterns: ["Empty State", "Guided Setup"],
    uiElements: ["Cards & Tiles", "Button", "Dropdown", "Sidebar & Drawer", "Icon", "Avatar"],
    fonts: ["Proxima Nova"],
    colors: ["#006BFF", "#F6F8FF", "#111827"],
  },
  {
    title: "Stripe",
    site: "stripe.com",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://stripe.com/",
    pageType: "Paywall & Subscription",
    uxPatterns: ["Progressive Disclosure", "Contextual CTA"],
    uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Badge"],
    fonts: ["Inter", "Sohne"],
    colors: ["#635BFF", "#0A2540", "#F6F9FC"],
  },
  {
    title: "Notion",
    site: "notion.so",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://www.notion.so/",
    pageType: "Product Page & Landing",
    uxPatterns: ["Social Proof", "Sectioned Narrative"],
    uiElements: ["Button", "Illustration", "Navigation Bar", "Footer"],
    fonts: ["Inter", "Lyon"],
    colors: ["#111111", "#F7F6F3", "#E9E8E4"],
  },
  {
    title: "Linear",
    site: "linear.app",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://linear.app/",
    pageType: "Product Page & Landing",
    uxPatterns: ["Feature Comparison", "Sticky Navigation"],
    uiElements: ["Cards & Tiles", "Button", "Carousel", "Icon"],
    fonts: ["Inter"],
    colors: ["#5E6AD2", "#0D0E12", "#F4F5F8"],
  },
  {
    title: "Webflow",
    site: "webflow.com",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://webflow.com/",
    pageType: "Product Details",
    uxPatterns: ["Feature Callout", "Visual Hierarchy"],
    uiElements: ["Cards & Tiles", "Button", "Accordion & Collapse"],
    fonts: ["Inter"],
    colors: ["#146EF5", "#FFFFFF", "#0F172A"],
  },
  {
    title: "Framer",
    site: "framer.com",
    screenshot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://www.framer.com/",
    pageType: "Product Page & Landing",
    uxPatterns: ["Floating CTA", "Product Storytelling"],
    uiElements: ["Button", "Cards & Tiles", "Animation"],
    fonts: ["Inter", "Mori"],
    colors: ["#111111", "#F5F3EE", "#5A67FF"],
  },
]

function CategoryGlyph({ kind }: { kind: (typeof LIBRARY_TABS)[number]["icon"] }) {
  const base = "inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"

  if (kind === "sunset") {
    return <span className={`${base} bg-[linear-gradient(180deg,#ffb783_0%,#ff8a6f_42%,#ffd874_100%)]`} />
  }
  if (kind === "stack") {
    return (
      <span className={`${base} bg-[linear-gradient(180deg,#ffc94b_0%,#ffc94b_42%,#1f2033_42%,#1f2033_100%)] relative`}>
        <span className="absolute bottom-1 left-1 h-2.5 w-2.5 rounded-[3px] bg-[#ff5ea6]" />
        <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-[#74b9ff]" />
      </span>
    )
  }
  if (kind === "glass") {
    return (
      <span className={`${base} bg-[linear-gradient(135deg,#ffcf54_0%,#ff83ad_25%,#f6f0d9_52%,#75d0ff_100%)] relative overflow-hidden`}>
        <span className="absolute inset-[3px] rounded-[5px] bg-white/25 backdrop-blur-[2px]" />
      </span>
    )
  }
  if (kind === "loop") {
    return (
      <span className={`${base} bg-[#fff4eb] relative overflow-hidden`}>
        <span className="absolute left-[3px] top-[9px] h-2.5 w-5 rotate-[20deg] rounded-full border-[3px] border-[#ff8a4c] border-r-transparent" />
        <span className="absolute right-[3px] top-[9px] h-2.5 w-5 -rotate-[20deg] rounded-full border-[3px] border-[#ff4f7b] border-l-transparent" />
      </span>
    )
  }
  return (
    <span className={`${base} bg-[linear-gradient(135deg,#fff0d5_0%,#ffb65b_28%,#ff7090_62%,#f7f1e6_62%,#f7f1e6_100%)] relative overflow-hidden`}>
      <span className="absolute left-1 top-1 h-3 w-3 rotate-12 rounded-[4px] bg-white/55" />
    </span>
  )
}

function LogoChip({
  logo,
}: {
  logo: (typeof LOGO_TRACK)[number]
}) {
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(logo.domain)}&sz=128`

  return (
    <div className="flex min-w-fit items-center gap-3 rounded-full border border-[#e4dfd3] bg-white/96 px-4 py-3 shadow-[0_10px_24px_rgba(17,17,17,0.06)] backdrop-blur-sm">
      <div
        className="grid h-10 w-10 place-items-center rounded-full border border-[#ece6d8] bg-white"
        style={{ boxShadow: `inset 0 0 0 6px ${logo.ring}` }}
      >
        <img src={favicon} alt={`${logo.name} logo`} className="h-5 w-5 rounded-[4px]" />
      </div>
      <div className="pr-1 text-sm font-medium tracking-[-0.02em] text-[#141414]">{logo.name}</div>
    </div>
  )
}

function LibraryDetailPanel({
  item,
  activeDetailTab,
  setActiveDetailTab,
  onClose,
}: {
  item: LibraryItem
  activeDetailTab: string
  setActiveDetailTab: (value: string) => void
  onClose: () => void
}) {
  const detailMap = {
    "page-types": [item.pageType],
    "ux-patterns": item.uxPatterns,
    "ui-elements": item.uiElements,
    fonts: item.fonts,
    colors: item.colors,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 overflow-hidden rounded-[28px] border border-[#e7e1d3] bg-white shadow-[0_26px_80px_rgba(17,17,17,0.10)]"
    >
      <div className="grid min-h-[640px] grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <div className="border-b border-[#eee7d8] p-5 xl:border-b-0 xl:border-r">
          <div className="overflow-hidden rounded-[22px] border border-[#e8e1d5] bg-[#fbfaf7]">
            <img
              src={item.screenshot}
              alt={`${item.title} screenshot`}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col bg-[#fcfbf7]">
          <div className="flex items-start justify-between border-b border-[#eee7d8] p-5">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#90897a]">Library entry</p>
              <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#111111]">{item.title}</h3>
              <p className="mt-1 truncate text-sm text-[#6c6558]">{item.site}</p>
            </div>
            <button
              onClick={onClose}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] border border-[#e9e2d4] bg-white text-[#3b3b39] transition hover:border-[#d5cebf] hover:bg-[#f7f3eb]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-[#eee7d8] p-4">
            <div className="grid gap-2">
              {LIBRARY_TABS.map((tab) => {
                const active = activeDetailTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id)}
                    className={`flex items-center gap-3 rounded-[18px] px-4 py-3 text-left transition ${
                      active
                        ? "bg-[#111111] text-white shadow-[0_14px_40px_rgba(17,17,17,0.20)]"
                        : "border border-[#ece5d8] bg-white text-[#201f1b] hover:bg-[#f5f1e8]"
                    }`}
                  >
                    <CategoryGlyph kind={tab.icon} />
                    <span className="text-[17px] font-medium tracking-[-0.02em]">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8d8676]">
                {LIBRARY_TABS.find((tab) => tab.id === activeDetailTab)?.label}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {detailMap[activeDetailTab as keyof typeof detailMap].map((value) => (
                <div
                  key={value}
                  className="rounded-full border border-[#e6dfd0] bg-white px-4 py-2 text-sm font-medium text-[#1d1d1b] shadow-[0_8px_20px_rgba(17,17,17,0.04)]"
                >
                  {value}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] border border-[#e8e2d6] bg-white p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8d8676]">Why it matters</p>
              <p className="mt-3 text-sm leading-7 text-[#585247]">
                This entry packages the visible screen with the reusable design references you actually need when
                recreating a product system: page type, interaction patterns, component families, font choices, and
                color anchors.
              </p>
            </div>
            <a
              href={`https://${item.site}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#111111] bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#262521]"
            >
              Visit original site
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const { data: session, status } = useSession()
  const isLoaded = status !== "loading"
  const isSignedIn = Boolean(session?.user)
  const [usageCount, setUsageCount] = useState(0)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [output, setOutput] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [colorPayload, setColorPayload] = useState<any>(null)
  const [mode, setMode] = useState<"library" | "generate">("library")
  const [activeLibraryTab, setActiveLibraryTab] = useState("page-types")
  const [pageTypeFilter, setPageTypeFilter] = useState("All")
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState("page-types")
  const statusInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const generationAbort = useRef<AbortController | null>(null)

  const handleGenerate = async (targetUrl?: string) => {
    const urlToUse = targetUrl ?? url
    if (!urlToUse.trim()) return
    if (!isSignedIn && usageCount >= FREE_GENERATION_LIMIT) {
      alert("Free limit reached. Sign in with Google to keep generating.")
      return
    }
    if (targetUrl) setUrl(targetUrl)

    if (generationAbort.current) {
      generationAbort.current.abort()
    }
    const controller = new AbortController()
    generationAbort.current = controller

    setLoading(true)
    setShowOutput(false)
    setOutput("")
    setStatusIndex(0)
    setIsGenerating(true)
    setColorPayload(null)

    statusInterval.current = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_STEPS.length - 1))
    }, 700)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ prompt: urlToUse }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to start generation"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage)
      }

      clearInterval(statusInterval.current!)
      setLoading(false)
      setShowOutput(true)

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("text/event-stream")) {
        const text = await response.text()
        setOutput(text)
        setIsGenerating(false)
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("No response stream")

      let buffer = ""
      const handleSseBlock = (block: string) => {
        const eventLine = block.split("\n").find((line) => line.startsWith("event:"))
        const dataLines = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s?/, ""))
        if (!eventLine || dataLines.length === 0) return

        const eventName = eventLine.replace("event:", "").trim()
        const dataText = dataLines.join("\n")
        try {
          const parsed = JSON.parse(dataText)
          if (eventName === "colors") {
            setColorPayload(parsed)
          } else if (eventName === "markdown" && typeof parsed.content === "string") {
            setOutput((prev) => prev + parsed.content)
          }
        } catch (error) {
          console.error(error)
        }
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let boundary = buffer.indexOf("\n\n")
          while (boundary !== -1) {
            const block = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)
            handleSseBlock(block)
            boundary = buffer.indexOf("\n\n")
          }
        }
        if (buffer.trim()) handleSseBlock(buffer)
      } catch (streamError) {
        console.error(streamError)
      }

      if (!isSignedIn) {
        const nextCount = Math.min(usageCount + 1, FREE_GENERATION_LIMIT)
        setUsageCount(nextCount)
        localStorage.setItem(USAGE_STORAGE_KEY, String(nextCount))
      }
      setIsGenerating(false)
    } catch (err: any) {
      if (err?.name === "AbortError") return
      console.error(err)
      clearInterval(statusInterval.current!)
      setLoading(false)
      setIsGenerating(false)
      alert(`Generation failed: ${err.message}`)
    }
  }

  useEffect(() => {
    const stored = Number(localStorage.getItem(USAGE_STORAGE_KEY) || "0")
    if (Number.isFinite(stored)) {
      setUsageCount(Math.max(0, Math.min(stored, FREE_GENERATION_LIMIT)))
    }
  }, [])

  useEffect(() => {
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current)
      if (generationAbort.current) generationAbort.current.abort()
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (pageTypeFilter === "All") return LIBRARY_ITEMS
    return LIBRARY_ITEMS.filter((item) => item.pageType === pageTypeFilter)
  }, [pageTypeFilter])

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7f4ed] text-[#111111]">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_55%),linear-gradient(180deg,#fbfaf6_0%,#f7f4ed_100%)]" />
        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-32 md:px-8 xl:px-10">
          <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1.05fr)_520px]">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e1d3] bg-white px-3 py-2 text-[12px] font-medium text-[#5b564b] shadow-[0_10px_30px_rgba(17,17,17,0.05)]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#92c35e]" />
                Design library and clean DESIGN.md generation
              </div>

              <h1 className="mt-8 max-w-[900px] text-[56px] font-semibold leading-[0.94] tracking-[-0.06em] text-[#121212] md:text-[78px] xl:text-[96px]">
                Build a clean design library, then switch into exact DESIGN.md output.
              </h1>

              <p className="mt-6 max-w-[650px] text-[18px] leading-8 text-[#5e584c]">
                White-space first. Precise cards. Real screenshot references. Category-driven inspection for page
                types, UX patterns, UI elements, fonts, and colors.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="relative inline-flex rounded-full border border-[#ddd6c6] bg-white p-1 shadow-[0_12px_30px_rgba(17,17,17,0.06)]">
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="absolute inset-y-1 rounded-full bg-[#111111]"
                    style={{
                      left: mode === "library" ? 4 : "50%",
                      width: "calc(50% - 4px)",
                    }}
                  />
                  {[
                    { id: "library", label: "Design Library", icon: LayoutGrid },
                    { id: "generate", label: "Generate DESIGN.MD", icon: Wand2 },
                  ].map((option) => {
                    const Icon = option.icon
                    const active = mode === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => setMode(option.id as "library" | "generate")}
                        className={`relative z-10 inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                          active ? "text-white" : "text-[#4f4b42]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div id="generator" className="mt-8">
                <AnimatePresence mode="wait">
                  {mode === "generate" ? (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-[30px] border border-[#e7dfd0] bg-white p-5 shadow-[0_24px_80px_rgba(17,17,17,0.08)]"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 md:flex-row">
                          <div className="flex min-h-[64px] flex-1 items-center gap-3 rounded-[22px] border border-[#e7dfd0] bg-[#fbfaf7] px-5">
                            <Globe className="h-5 w-5 text-[#938b7c]" />
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                              placeholder="https://stripe.com"
                              className="h-full w-full bg-transparent text-[16px] text-[#181818] outline-none placeholder:text-[#a7a091]"
                            />
                          </div>
                          <button
                            onClick={() => handleGenerate()}
                            disabled={loading || !isLoaded}
                            className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-[22px] bg-[#111111] px-6 text-sm font-medium text-white transition hover:bg-[#262521] disabled:opacity-50"
                          >
                            {loading ? "Generating..." : "Generate now"}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {QUICK_TRIES.map((site) => (
                            <button
                              key={site}
                              onClick={() => handleGenerate(site)}
                              className="rounded-full border border-[#e7dfd0] bg-[#fbfaf7] px-3 py-2 text-xs font-medium text-[#585247] transition hover:bg-[#f0ebdf]"
                            >
                              {site}
                            </button>
                          ))}
                        </div>

                        {!isSignedIn && usageCount < FREE_GENERATION_LIMIT && (
                          <p className="text-sm text-[#6d675d]">
                            {FREE_GENERATION_LIMIT - usageCount} free generations left in this browser.
                          </p>
                        )}
                        {!isSignedIn && usageCount >= FREE_GENERATION_LIMIT && (
                          <button
                            onClick={() => signIn("google")}
                            className="w-fit rounded-full border border-[#111111] px-4 py-2 text-sm font-medium text-[#111111] transition hover:bg-[#111111] hover:text-white"
                          >
                            Sign in with Google to continue
                          </button>
                        )}

                        {loading && (
                          <div className="rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                            <div className="h-1 overflow-hidden rounded-full bg-[#ece5d8]">
                              <div className="h-full rounded-full bg-[#111111] animate-loading-bar" />
                            </div>
                            <p className="mt-3 text-sm text-[#6e685e]">{STATUS_STEPS[statusIndex]}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="library"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="grid max-w-[780px] gap-4 sm:grid-cols-3"
                    >
                      {[
                        "Open a page and inspect the real screenshot first",
                        "Filter by page types and component families",
                        "Switch into DESIGN.md only when you need exact output",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[24px] border border-[#e7dfd0] bg-white p-5 shadow-[0_16px_40px_rgba(17,17,17,0.05)]"
                        >
                          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efe6]">
                            <Check className="h-4 w-4 text-[#111111]" />
                          </div>
                          <p className="text-sm leading-7 text-[#4f4b42]">{item}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="xl:pt-6">
              <div className="rounded-[34px] border border-[#e9e2d4] bg-white p-5 shadow-[0_28px_80px_rgba(17,17,17,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#938b7d]">Trust signals</p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#121212]">
                      Teams expect real product references.
                    </h2>
                  </div>
                  <div className="hidden rounded-full border border-[#ece5d8] bg-[#faf8f3] px-3 py-2 text-xs font-medium text-[#6e685e] md:inline-flex">
                    Updated weekly
                  </div>
                </div>

                <div className="relative space-y-4 overflow-hidden">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0)_100%)]" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,#ffffff_0%,rgba(255,255,255,0)_100%)]" />
                  {[0, 1].map((row) => (
                    <div key={row} className="overflow-hidden">
                      <motion.div
                        animate={{ x: row === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                        transition={{ duration: row === 0 ? 24 : 28, repeat: Infinity, ease: "linear" }}
                        className="flex w-max gap-4"
                      >
                        {[...LOGO_TRACK, ...LOGO_TRACK].map((logo, index) => (
                          <LogoChip key={`${row}-${logo.name}-${index}`} logo={logo} />
                        ))}
                      </motion.div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[26px] border border-[#ece5d8] bg-[#fbfaf7] p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#111111] text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#141414]">Precision-first browsing</p>
                      <p className="text-sm text-[#6f685e]">
                        Library first. Generate second. No clutter between the two.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="library" className="mt-18">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#928b7e]">Design library</p>
                  <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.05em] text-[#111111]">
                    Real interface references in a clean 3-column library.
                  </h2>
                </div>
                <div className="flex min-h-[62px] w-full max-w-[440px] items-center gap-3 rounded-full border border-[#e5decf] bg-white px-5 shadow-[0_14px_40px_rgba(17,17,17,0.05)]">
                  <Search className="h-5 w-5 text-[#9b9485]" />
                  <span className="text-sm text-[#8d8678]">Search by pattern, component, or page type</span>
                </div>
              </div>

              <div className="sticky top-[84px] z-20 rounded-[34px] border border-[#e7dfd0] bg-[rgba(255,255,255,0.88)] p-2 shadow-[0_24px_70px_rgba(17,17,17,0.08)] backdrop-blur-xl">
                <div className="relative flex flex-wrap gap-2">
                  {LIBRARY_TABS.map((tab) => {
                    const active = activeLibraryTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveLibraryTab(tab.id)}
                        className={`relative inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-[#22232a] text-white shadow-[0_12px_30px_rgba(17,17,17,0.18)]"
                            : "text-[#26251f] hover:bg-[#f1ede5]"
                        }`}
                      >
                        <CategoryGlyph kind={tab.icon} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {PAGE_TYPE_FILTERS.map((filter) => {
                  const active = pageTypeFilter === filter
                  return (
                    <button
                      key={filter}
                      onClick={() => setPageTypeFilter(filter)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#e4dccf] bg-white text-[#3f3b33] hover:bg-[#f4efe5]"
                      }`}
                    >
                      {filter}
                    </button>
                  )
                })}
              </div>

              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <motion.button
                    key={`${item.title}-${item.site}`}
                    onClick={() => {
                      setSelectedItem(item)
                      setActiveDetailTab(activeLibraryTab)
                    }}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="overflow-hidden rounded-[28px] border border-[#e6dfd1] bg-white text-left shadow-[0_20px_60px_rgba(17,17,17,0.06)] transition-shadow hover:shadow-[0_26px_80px_rgba(17,17,17,0.10)]"
                  >
                    <div className="aspect-[1.38/1] overflow-hidden border-b border-[#ece5d8] bg-[#f8f6f0]">
                      <img
                        src={item.screenshot}
                        alt={`${item.title} preview`}
                        className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-[#141414]">{item.title}</h3>
                          <p className="mt-1 text-sm text-[#6f685e]">{item.site}</p>
                        </div>
                        <span className="rounded-full border border-[#e7dfd1] bg-[#fbfaf7] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8e8679]">
                          {item.pageType}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.uiElements.slice(0, 3).map((element) => (
                          <span
                            key={element}
                            className="rounded-full border border-[#ece4d7] bg-[#fbfaf6] px-3 py-2 text-xs font-medium text-[#4c473f]"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {selectedItem && (
                  <LibraryDetailPanel
                    item={selectedItem}
                    activeDetailTab={activeDetailTab}
                    setActiveDetailTab={setActiveDetailTab}
                    onClose={() => setSelectedItem(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </section>

          <footer className="mt-20 border-t border-[#e7dfd0] py-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em] text-[#141414]">DESIGN.MD by Parallect</p>
                <p className="text-sm text-[#6e675d]">Clean design library browsing with exact DESIGN.md generation.</p>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-[#5f594e]">
                <a href="/terms-and-conditions" className="transition hover:text-[#111111]">Terms</a>
                <a href="/privacy-policy" className="transition hover:text-[#111111]">Privacy</a>
                <a href="/refund-policy" className="transition hover:text-[#111111]">Refunds</a>
              </div>
            </div>
          </footer>
        </div>
      </section>

      {showOutput && (
        <GenerationResult
          url={url}
          content={output}
          isGenerating={isGenerating}
          colorPayload={colorPayload}
          onClose={() => setShowOutput(false)}
        />
      )}
    </>
  )
}
