"use client"

import Link from "next/link"
import { Globe, ExternalLink } from "lucide-react"

interface GenerationCardProps {
  id: string
  url: string
  domain: string
  date: string
  tokenCount: number
  favicon?: string
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = (now.getTime() - then.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function GenerationCard({ id, url, domain, date, tokenCount, favicon }: GenerationCardProps) {
  return (
    <Link href={`/r/${id}`} className="group block">
      <div className="p-5 rounded-lg bg-surface border border-border hover:border-[#444442] hover:bg-[#151513] transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          {/* Favicon + domain */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#1a1a18] border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              {favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={favicon} alt={domain} width={16} height={16} className="w-4 h-4" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <p className="text-sm font-mono text-foreground font-medium leading-none mb-0.5">
                {domain}
              </p>
              <p className="text-xs text-muted font-mono">{url}</p>
            </div>
          </div>

          <ExternalLink className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" strokeWidth={1.5} />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-mono">{timeAgo(date)}</span>
          <span className="text-xs text-muted font-mono">
            <span className="text-accent">{tokenCount}</span> tokens
          </span>
        </div>
      </div>
    </Link>
  )
}
