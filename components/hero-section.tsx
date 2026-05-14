"use client"

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GenerationResult } from "./generation-result"

gsap.registerPlugin(ScrollTrigger)

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
const TRUST_WORDMARKS = [
  { id: "openai", label: "OpenAI", icon: "https://api.iconify.design/simple-icons:openai.svg?color=%23ffffff" },
  { id: "anthropic", label: "Anthropic", icon: "https://api.iconify.design/simple-icons:anthropic.svg?color=%23ffffff" },
  { id: "gemini", label: "Gemini", icon: "https://api.iconify.design/simple-icons:googlegemini.svg?color=%23ffffff" },
  { id: "windsurf", label: "Windsurf", icon: "https://api.iconify.design/simple-icons:windsurf.svg?color=%23ffffff" },
  { id: "cursor", label: "Cursor", icon: "https://api.iconify.design/simple-icons:cursor.svg?color=%23ffffff" },
]

function TrustWordmark({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex h-12 w-[190px] shrink-0 items-center justify-center gap-3 text-[#F5F7FB]">
      <span className="grid h-6 w-6 shrink-0 place-items-center">
        <img src={icon} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
      </span>
      <span className="text-[1.08rem] font-medium leading-none tracking-[-0.01em]">
        {label}
      </span>
    </span>
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
  const statusInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const generationAbort = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

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
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ prompt: urlToUse }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to start generation"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage);
      }
      
      clearInterval(statusInterval.current!)
      setLoading(false)
      setShowOutput(true)
      
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('text/event-stream')) {
        const text = await response.text()
        setOutput(text)
        setIsGenerating(false)
        return
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
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
        } catch (e) {
          console.error(e)
        }
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
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
      setIsGenerating(false);
    } catch(err: any) {
      if (err?.name === 'AbortError') return
      console.error(err);
      clearInterval(statusInterval.current!)
      setLoading(false)
      setIsGenerating(false);
      // Show error to user
      alert(`Generation failed: ${err.message}`);
    }
  }

  useEffect(() => {
    if (showOutput && outputRef.current) {
      outputRef.current.scrollTop = 0
    }
  }, [showOutput])

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

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const context = gsap.context(() => {
      gsap.set("[data-hero-reveal]", { y: 24, opacity: 0 })
      gsap.set("[data-hero-orbit]", { y: 10, transformOrigin: "50% 100%" })

      gsap.timeline({ defaults: { ease: "power4.out" } })
        .to("[data-hero-reveal]", {
          y: 0,
          opacity: 1,
          duration: 0.82,
          stagger: 0.07,
        })
        .to("[data-hero-orbit]", { y: 0, duration: 0.7 }, 0.12)

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      })

      const progressTarget = section.querySelector("[data-hero-progress]")

      scrollTl
        .to("[data-hero-title]", { yPercent: -7, opacity: 0.78, ease: "none" }, 0)
        .to("[data-hero-copy]", { yPercent: -10, opacity: 0.62, ease: "none" }, 0)
        .to("[data-hero-form]", { yPercent: -12, opacity: 0.78, ease: "none" }, 0)

      if (progressTarget) {
        scrollTl.to(progressTarget, { yPercent: -10, opacity: 0.68, ease: "none" }, 0)
      }

      gsap.to("[data-trust-track]", {
        xPercent: -32,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <>
    <section ref={sectionRef} id="generator" className="relative pt-32 pb-24 px-6">
      <div data-hero-content className="max-w-3xl mx-auto text-center">

        {/* H1 */}
        <h1 data-hero-reveal data-hero-title className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
          Turn any website into{" "}
          <br />
          <em className="text-warm not-italic font-display italic">DESIGN.MD</em>
        </h1>

        {/* Subheading */}
        <p data-hero-reveal data-hero-copy className="font-mono text-base text-muted leading-relaxed mb-10 max-w-xl mx-auto text-pretty">
          Paste a URL and get a clean DESIGN.md with AI analysis, verified colors, typography guidance, layout rules, and component specs.
        </p>

        {/* Input bar */}
        <div data-hero-reveal data-hero-form data-hero-orbit>
          <div className="group relative max-w-2xl mx-auto mb-4">
            <div className="pointer-events-none absolute -inset-px rounded-lg bg-[linear-gradient(90deg,rgba(200,240,74,0.0),rgba(200,240,74,0.34),rgba(122,184,245,0.22),rgba(200,240,74,0.0))] opacity-0 blur-sm transition duration-500 group-focus-within:opacity-100" />
            <div className="relative flex gap-2 p-1.5 rounded-lg border border-border bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.18)] transition duration-300 group-focus-within:border-accent/70 group-focus-within:shadow-[0_30px_110px_rgba(200,240,74,0.08)]">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="https://stripe.com"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted outline-none input-lime-focus rounded transition-all"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !isLoaded}
              className="px-5 py-2.5 text-sm font-medium bg-accent text-[#080A0F] rounded hover:bg-accent-muted transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
            >
              {loading ? "Generating..." : "Generate →"}
            </button>
            </div>
          </div>
          {!isSignedIn && usageCount < FREE_GENERATION_LIMIT && (
            <p className="mb-4 text-xs text-muted font-mono">
              {FREE_GENERATION_LIMIT - usageCount} free generations left in this browser.
            </p>
          )}
          {!isSignedIn && usageCount >= FREE_GENERATION_LIMIT && (
            <button
              onClick={() => signIn("google")}
              className="mb-4 text-xs text-accent hover:underline font-mono"
            >
              Free limit reached. Sign in with Google to keep generating.
            </button>
          )}

          {/* Quick tries */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-muted">Try:</span>
            {QUICK_TRIES.map((site, index) => (
              <button
                key={site}
                onClick={() => handleGenerate(site)}
                data-hero-chip
                style={{ transitionDelay: `${index * 35}ms` }}
                className="text-xs px-2.5 py-1 rounded border border-border text-muted hover:text-foreground hover:border-accent/60 hover:-translate-y-0.5 transition-all"
              >
                {site}
              </button>
            ))}
          </div>
        </div>

        {/* Loading bar + status */}
        {loading && (
          <div data-hero-progress className="mt-10 max-w-2xl mx-auto">
            <div className="h-1 bg-border rounded-full overflow-hidden mb-3">
              <div className="h-full bg-accent animate-loading-bar rounded-full shadow-[0_0_22px_rgba(200,240,74,0.45)]" />
            </div>
            <p className="text-xs text-muted font-mono text-center">
              {STATUS_STEPS[statusIndex]}
            </p>
          </div>
        )}

        <div data-hero-reveal className="relative mt-10 mb-12 overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#080A0F] via-[#080A0F] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#080A0F] via-[#080A0F] to-transparent" />
          <div className="trust-marquee relative h-12 overflow-hidden">
            <div data-trust-track className="trust-marquee-track flex w-max items-center">
              {[...TRUST_WORDMARKS, ...TRUST_WORDMARKS].map((item, index) => (
                <TrustWordmark key={`${item.id}-${index}`} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        </div>

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
