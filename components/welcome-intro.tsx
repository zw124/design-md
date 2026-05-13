"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function WelcomeIntro() {
  const [visible, setVisible] = useState(true)
  const overlayRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLHeadingElement>(null)
  const startRef = useRef<HTMLSpanElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!visible || !overlayRef.current || !wordRef.current) return

    const context = gsap.context(() => {
      gsap.set([introRef.current, startRef.current], { y: 18 })

      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(wordRef.current, {
          letterSpacing: "0.22em",
        }, {
          letterSpacing: "0.08em",
          duration: 0.9,
          ease: "power3.out",
        })
        .to(introRef.current, {
          y: 0,
          duration: 0.65,
        }, "-=0.28")
        .to(startRef.current, {
          y: 0,
          duration: 0.58,
        }, "-=0.2")
    }, overlayRef)

    return () => context.revert()
  }, [visible])

  const start = () => {
    if (!overlayRef.current) {
      setVisible(false)
      return
    }

    gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => setVisible(false),
    })
      .to([startRef.current, introRef.current], { y: -14, opacity: 0, filter: "blur(8px)", duration: 0.28, stagger: 0.035 })
      .to(wordRef.current, { y: -26, opacity: 0, duration: 0.48 }, 0.04)
      .to(overlayRef.current, { opacity: 0, backdropFilter: "blur(0px)", duration: 0.56 }, 0.16)
  }

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-[#030407]/72 px-6 text-foreground backdrop-blur-xl"
    >
      <div className="w-full max-w-5xl translate-y-[-2vh] text-center">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.42em] text-[#DDE3EE]/46">
          DESIGN.MD by Parallect
        </p>
        <h1
          ref={wordRef}
          className="mx-auto w-fit whitespace-nowrap font-display text-[clamp(3.6rem,12vw,10rem)] font-semibold leading-none tracking-[0.08em] text-[#F5F7FB]"
        >
          WELCOME
        </h1>
        <p
          ref={introRef}
          style={{ color: "rgba(221, 227, 238, 0.76)" }}
          className="mx-auto mt-8 max-w-2xl text-balance text-base leading-7 text-[#DDE3EE]/76 sm:text-lg"
        >
          Turn any website into a clean, source-backed design system reference.
          Browse the gallery, inspect DESIGN.md, and export real tokens when you are ready.
        </p>
        <span
          role="button"
          tabIndex={0}
          ref={startRef}
          onClick={start}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") start()
          }}
          style={{ color: "#F5F7FB" }}
          className="mt-14 inline-block cursor-pointer select-none px-0 py-3 font-display text-2xl font-semibold uppercase tracking-[0.3em] text-[#F5F7FB]/86 transition hover:tracking-[0.38em] hover:text-foreground focus:outline-none sm:text-3xl"
        >
          Start
        </span>
      </div>
    </div>
  )
}
