"use client"

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const isLoaded = status !== "loading"
  const isSignedIn = Boolean(session?.user)

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
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            DESIGN<span className="text-accent">.MD</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted">
            by Parallect
          </span>
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-2">
          <Link
            href="/parallect"
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Parallect
          </Link>
          <Link
            href="/#generator"
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Generator
          </Link>
          {isLoaded && !isSignedIn && (
            <button
              onClick={() => signIn("google")}
              className="rounded border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground hover:border-[#444442]"
            >
              Google Login
            </button>
          )}
          {isLoaded && isSignedIn && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded border border-border px-2 py-1 text-left hover:border-[#444442]"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="size-6 rounded-full"
                />
              ) : (
                <span className="size-6 rounded-full bg-accent text-[#080A0F] grid place-items-center text-xs font-bold">
                  {(session?.user?.name || session?.user?.email || "U").slice(0, 1)}
                </span>
              )}
              <span className="hidden max-w-32 truncate text-xs text-foreground md:inline">
                {session?.user?.name || session?.user?.email}
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
