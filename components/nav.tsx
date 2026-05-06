"use client"

import { useState, useEffect } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            DESIGN<span className="text-accent">.MD</span>
          </span>
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-2">
          <Link
            href="#features"
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#generator"
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Generator
          </Link>
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 text-sm font-medium bg-accent text-[#0A0A08] rounded hover:bg-accent-muted transition-all duration-150 hover:scale-[1.02]">
                Sign in
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <UserButton />
          )}
        </div>
      </nav>
    </header>
  )
}
