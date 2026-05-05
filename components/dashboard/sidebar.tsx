"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, History, Settings } from "lucide-react"

const NAV_ITEMS = [
  { label: "Generate", href: "/dashboard", icon: Zap },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-display text-lg font-bold text-foreground">DESIGN</span>
          <span className="font-display text-lg font-medium text-accent">.MD</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150
                ${isActive
                  ? "bg-[#1a1a18] text-foreground"
                  : "text-muted hover:text-foreground hover:bg-[#151513]"
                }
              `}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      <div className="p-4 border-t border-border">
        <div className="px-3 py-2.5 rounded bg-[#1a1a18] border border-border">
          <p className="text-xs text-muted font-mono mb-0.5">Current plan</p>
          <p className="text-sm text-foreground font-mono font-medium">Free — 2/3 used</p>
        </div>
      </div>
    </aside>
  )
}
