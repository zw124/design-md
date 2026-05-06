import Link from "next/link"

type LegalSection = {
  title: string
  body: string[]
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-display text-lg font-bold text-foreground">
          DESIGN<span className="text-accent">.MD</span>
        </Link>

        <div className="mt-12 border-b border-border pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
            Last updated: {updated}
          </p>
          <h1 className="font-display text-4xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-5 font-mono text-sm leading-7 text-muted">
            {intro}
          </p>
        </div>

        <div className="space-y-9 py-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-display text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="font-mono text-sm leading-7 text-foreground/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-border pt-6 font-mono text-xs text-muted">
          For questions about these policies, contact the DESIGN.MD operator through the support channel listed in your deployment or repository.
        </div>
      </div>
    </main>
  )
}
