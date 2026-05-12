"use client"

import { useLayoutEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Code2, FileText, Layers3, Sparkles } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    icon: FileText,
    title: "Source-backed systems",
    body: "DESIGN.md turns live websites into implementation-grade design references instead of vague inspiration boards.",
  },
  {
    icon: Layers3,
    title: "Readable craft",
    body: "Every output is structured around tokens, hierarchy, spacing, component rules, and practical constraints.",
  },
  {
    icon: Code2,
    title: "Builder-first exports",
    body: "The same reference can become Markdown, Tailwind v4 tokens, CSS variables, or portable design-token JSON.",
  },
]

export default function ParallectPage() {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-parallect-hero]",
        { y: 52, opacity: 0, filter: "blur(16px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power4.out" },
      )

      gsap.fromTo(
        "[data-parallect-card]",
        { y: 80, opacity: 0, rotateX: 10, transformOrigin: "50% 100%" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-parallect-grid]",
            start: "top 78%",
            end: "bottom 56%",
            scrub: 0.7,
          },
        },
      )

      gsap.to("[data-parallect-line]", {
        scaleX: 1,
        transformOrigin: "0% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      })
    }, root)

    return () => context.revert()
  }, [])

  return (
    <main ref={rootRef} className="min-h-screen bg-background text-foreground">
      <Nav />
      <div data-parallect-line className="fixed left-0 top-14 z-40 h-px w-full scale-x-0 bg-accent" />

      <section className="px-6 pb-20 pt-32">
        <div data-parallect-hero className="mx-auto max-w-6xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-accent" />
            Parallect
          </div>
          <h1 className="max-w-5xl font-display text-5xl font-bold leading-tight md:text-7xl">
            A compact design intelligence lab for builders.
          </h1>
          <p className="mt-7 max-w-2xl font-mono text-base leading-8 text-muted">
            Parallect builds tools that convert taste, references, and production details into artifacts engineers can actually use.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/#generator" className="inline-flex h-11 items-center gap-2 rounded bg-accent px-5 text-sm font-semibold text-[#080A0F] transition hover:bg-accent-muted">
              Generate DESIGN.md
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#gallery" className="inline-flex h-11 items-center gap-2 rounded border border-border px-5 text-sm font-semibold text-muted transition hover:text-foreground">
              View gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div data-parallect-grid className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3 [perspective:1200px]">
          {principles.map((principle) => {
            const Icon = principle.icon
            return (
              <article
                key={principle.title}
                data-parallect-card
                className="rounded-lg border border-border bg-surface p-7 shadow-[0_28px_90px_rgba(0,0,0,0.20)] transition hover:-translate-y-1 hover:border-[#3A4354]"
              >
                <div className="mb-9 grid h-11 w-11 place-items-center rounded border border-border text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-foreground">{principle.title}</h2>
                <p className="mt-4 font-mono text-sm leading-7 text-muted">{principle.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl border-t border-border pt-12">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">Operating note</p>
          <p className="mt-5 max-w-3xl text-2xl leading-10 text-foreground">
            The goal is not decoration. The goal is a reference surface where motion, structure, and generated code all explain the same system.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
