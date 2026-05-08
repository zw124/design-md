"use client"

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

  return (
    <>
    <section id="generator" className="relative pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Eyebrow pill */}
        <div className="animate-fade-up-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-sm text-muted mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
          <span>Generate source-backed DESIGN.md files</span>
        </div>

        {/* H1 */}
        <h1 className="animate-fade-up-2 font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
          Turn any website into{" "}
          <br />
          <em className="text-warm not-italic font-display italic">DESIGN.MD</em>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up-3 font-mono text-base text-muted leading-relaxed mb-10 max-w-xl mx-auto text-pretty">
          Paste a URL and get a clean DESIGN.md with AI analysis, verified colors, typography guidance, layout rules, and component specs.
        </p>

        {/* Input bar */}
        <div className="animate-fade-up-4">
          <div className="flex gap-2 p-1.5 rounded-lg border border-border bg-surface max-w-2xl mx-auto mb-4">
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
