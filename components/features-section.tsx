import { Sparkles, Palette, Type, Grid3x3, Code2, RefreshCw } from "lucide-react"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Guided Analysis",
    description: "An OpenAI-compatible model writes site-specific guidance while code preserves valid Markdown structure.",
  },
  {
    icon: Palette,
    title: "Color Token System",
    description: "Verified primary, neutral, and detected semantic colors with source-backed hex values.",
  },
  {
    icon: Type,
    title: "Typography Scale",
    description: "Font stacks, type scale tables, line heights, and letter spacing — all production-ready.",
  },
  {
    icon: Grid3x3,
    title: "Spacing & Layout",
    description: "Grid systems, spacing scales, breakpoints, and border radii extracted from the source site.",
  },
  {
    icon: Code2,
    title: "Multi-format Export",
    description: "Download as Markdown, CSS Custom Properties, Tailwind config, or JSON design tokens.",
  },
  {
    icon: RefreshCw,
    title: "Drift Monitoring",
    description: "Re-run on demand to detect design drift. Know when a site updates its visual system.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      {/* Headline */}
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Built for clean DESIGN.md output
        </h2>
        <p className="text-muted font-mono text-sm max-w-md mx-auto">
          AI writes the analysis. The app enforces formatting and source-backed colors.
        </p>
      </div>

      {/* 3x2 grid with border separators */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-border rounded-lg overflow-hidden">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          const isLastRow = i >= 3
          const isLastCol = (i + 1) % 3 === 0
          return (
            <div
              key={feature.title}
              className={`
                group p-8 bg-surface transition-all duration-200
                hover:bg-[#151513] hover:-translate-y-0.5
                ${!isLastRow ? "border-b border-border" : ""}
                ${!isLastCol ? "md:border-r md:border-border" : ""}
              `}
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded bg-[#1a2010] border border-[#2a3a18] mb-4">
                <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2 text-[0.95rem]">
                {feature.title}
              </h3>
              <p className="font-mono text-xs text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
