"use client"

import gsap from "gsap"
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
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
const TRUST_WORDMARKS = [
  { id: "openai", label: "OpenAI", icon: "https://api.iconify.design/simple-icons:openai.svg?color=%23ffffff" },
  { id: "anthropic", label: "Anthropic", icon: "https://api.iconify.design/simple-icons:anthropic.svg?color=%23ffffff" },
  { id: "gemini", label: "Gemini", icon: "https://api.iconify.design/simple-icons:googlegemini.svg?color=%23ffffff" },
  { id: "windsurf", label: "Windsurf", icon: "https://api.iconify.design/simple-icons:windsurf.svg?color=%23ffffff" },
  { id: "cursor", label: "Cursor", icon: "https://api.iconify.design/simple-icons:cursor.svg?color=%23ffffff" },
]

function TrustWordmark({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex h-12 w-[190px] shrink-0 items-center justify-center gap-3 text-[#F0EDE4]">
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
  const glowRef = useRef<HTMLDivElement>(null)

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
    const section = sectionRef.current
    if (!section) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    let cleanupPointer = () => {}

    const ctx = gsap.context(() => {
      gsap.set(".gsap-reveal", { opacity: 0, y: 28, filter: "blur(10px)" })
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-ambient-a", { opacity: 1, scale: 1, duration: 1.2 }, 0)
        .to(".hero-ambient-b", { opacity: 0.85, scale: 1, duration: 1.4 }, 0.1)
        .to(".hero-field-line", { scaleX: 1, opacity: 1, stagger: 0.045, duration: 0.9 }, 0.15)
        .to(".gsap-reveal", { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.09, duration: 0.86 }, 0.22)

      gsap.to(".hero-ambient-a", {
        xPercent: 4,
        yPercent: -3,
        rotate: 5,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      gsap.to(".hero-ambient-b", {
        xPercent: -5,
        yPercent: 4,
        rotate: -4,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      gsap.to(".hero-scan", {
        xPercent: 120,
        duration: 8,
        repeat: -1,
        ease: "none",
      })

      const moveX = gsap.quickTo(glowRef.current, "x", { duration: 0.55, ease: "power3.out" })
      const moveY = gsap.quickTo(glowRef.current, "y", { duration: 0.55, ease: "power3.out" })
      const tiltX = gsap.quickTo(".hero-interactive-panel", "rotateX", { duration: 0.7, ease: "power3.out" })
      const tiltY = gsap.quickTo(".hero-interactive-panel", "rotateY", { duration: 0.7, ease: "power3.out" })

      const onPointerMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        moveX((px - 0.5) * 72)
        moveY((py - 0.5) * 48)
        tiltX((0.5 - py) * 2.2)
        tiltY((px - 0.5) * 2.6)
      }

      const onPointerLeave = () => {
        moveX(0)
        moveY(0)
        tiltX(0)
        tiltY(0)
      }

      section.addEventListener("pointermove", onPointerMove)
      section.addEventListener("pointerleave", onPointerLeave)

      cleanupPointer = () => {
        section.removeEventListener("pointermove", onPointerMove)
        section.removeEventListener("pointerleave", onPointerLeave)
      }
    }, section)

    return () => {
      cleanupPointer()
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current)
      if (generationAbort.current) generationAbort.current.abort()
    }
  }, [])

  return (
    <>
    <section ref={sectionRef} id="generator" className="designmd-hero-bg relative overflow-hidden px-6 pb-24 pt-32">
      <div className="hero-ambient-a pointer-events-none absolute left-1/2 top-10 h-[520px] w-[820px] -translate-x-1/2 scale-95 rounded-full opacity-0 blur-3xl" />
      <div className="hero-ambient-b pointer-events-none absolute bottom-[-180px] left-[8%] h-[430px] w-[560px] scale-95 rounded-full opacity-0 blur-3xl" />
      <div ref={glowRef} className="hero-pointer-glow pointer-events-none absolute left-1/2 top-[38%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="hero-scan pointer-events-none absolute inset-y-0 left-[-45%] w-[42%]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-warm/20 to-transparent" />
      <div className="hero-field pointer-events-none absolute inset-x-6 top-24 mx-auto hidden max-w-5xl gap-4 md:grid">
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={index} className="hero-field-line h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#f0ede41f] to-transparent opacity-0" />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">

        {/* Eyebrow pill */}
        <div className="gsap-reveal inline-flex items-center gap-2 rounded-full border border-[#f0ede429] bg-[#11110fea] px-3 py-1.5 text-sm text-muted shadow-[0_14px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
          <span>Generate source-backed DESIGN.md files</span>
        </div>

        {/* H1 */}
        <h1 className="gsap-reveal font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
          Turn any website into{" "}
          <br />
          <em className="hero-title-accent text-warm not-italic font-display italic">DESIGN.MD</em>
        </h1>

        {/* Subheading */}
        <p className="gsap-reveal font-mono text-base text-muted leading-relaxed mb-10 max-w-xl mx-auto text-pretty">
          Paste a URL and get a clean DESIGN.md with AI analysis, verified colors, typography guidance, layout rules, and component specs.
        </p>

        {/* Input bar */}
        <div className="gsap-reveal hero-interactive-panel">
          <div className="hero-input-shell mx-auto mb-4 flex max-w-2xl gap-2 rounded-lg border border-[#f0ede426] bg-[#11110fe6] p-1.5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
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
              className="px-5 py-2.5 text-sm font-medium bg-accent text-[#0A0A08] rounded hover:bg-accent-muted transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
            >
              {loading ? "Generating..." : "Generate →"}
            </button>
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
            {QUICK_TRIES.map((site) => (
              <button
                key={site}
                onClick={() => handleGenerate(site)}
                className="text-xs px-2.5 py-1 rounded border border-border text-muted hover:text-foreground hover:border-[#444442] transition-all"
              >
                {site}
              </button>
            ))}
          </div>
        </div>

        <div className="gsap-reveal relative mt-12 mb-12 overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0A0A08] via-[#0A0A08] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0A0A08] via-[#0A0A08] to-transparent" />
          <div className="trust-marquee relative h-12 overflow-hidden">
            <div className="trust-marquee-track flex w-max items-center">
              {[...TRUST_WORDMARKS, ...TRUST_WORDMARKS].map((item, index) => (
                <TrustWordmark key={`${item.id}-${index}`} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        </div>

        {/* Loading bar + status */}
        {loading && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="h-0.5 bg-border rounded-full overflow-hidden mb-3">
              <div className="h-full bg-accent animate-loading-bar rounded-full" />
            </div>
            <p className="text-xs text-muted font-mono text-center">
              {STATUS_STEPS[statusIndex]}
            </p>
          </div>
        )}
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
