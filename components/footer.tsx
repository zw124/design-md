import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-foreground">DESIGN</span>
          <span className="font-display text-accent">.MD</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted">
            by Parallect
          </span>
        </div>
        <p className="text-xs text-muted font-mono text-center">
          © 2026 DESIGN.MD by Parallect — Built for people who care about design systems
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="#features" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
            Features
          </Link>
          <Link href="#generator" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
            Generator
          </Link>
          <Link href="/terms-and-conditions" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
            Terms
          </Link>
          <Link href="/privacy-policy" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
            Privacy
          </Link>
          <Link href="/refund-policy" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
            Refunds
          </Link>
        </div>
      </div>
    </footer>
  )
}
