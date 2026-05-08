"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
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
        scrolled
          ? "border-b border-[#e8e1d3] bg-[rgba(247,244,237,0.82)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-6 md:px-8 xl:px-10">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-[26px] font-bold tracking-tight text-[#121212]">
            DESIGN<span className="text-[#9dc24f]">.MD</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7f786b]">
            by Parallect
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="#library"
            className="rounded-full px-4 py-2 text-sm text-[#5d584d] transition-colors hover:text-[#111111]"
          >
            Library
          </Link>
          <Link
            href="#generator"
            className="rounded-full px-4 py-2 text-sm text-[#5d584d] transition-colors hover:text-[#111111]"
          >
            Generator
          </Link>
          {isLoaded && isSignedIn && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-full border border-[#ddd6c8] bg-white px-2 py-1 text-left shadow-[0_10px_30px_rgba(17,17,17,0.06)] hover:border-[#cfc6b5]"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="size-6 rounded-full"
                />
              ) : (
                <span className="grid size-6 place-items-center rounded-full bg-[#111111] text-xs font-bold text-white">
                  {(session?.user?.name || session?.user?.email || "U").slice(0, 1)}
                </span>
              )}
              <span className="hidden max-w-32 truncate pr-2 text-xs text-[#1a1a18] md:inline">
                {session?.user?.name || session?.user?.email}
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
