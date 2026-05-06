"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For designers and engineers generating DESIGN.md files regularly.",
    features: [
      "AI-guided site analysis",
      "Verified primary and neutral colors",
      "Markdown copy and download",
      "Generation history in Neon",
      "Higher monthly generation limit",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams documenting competitive sites, products, and design systems.",
    features: [
      "Everything in Pro",
      "Team-scale generation limit",
      "Shared billing plan status",
      "Source-backed color extraction",
      "Ready for Vercel production use",
    ],
  },
] as const

export function PricingSection() {
  const { isSignedIn } = useUser()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const startCheckout = async (plan: "pro" | "team") => {
    setLoadingPlan(plan)
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to create checkout")
      window.location.href = payload.url
    } catch (error: any) {
      alert(error?.message || "Unable to create checkout")
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Plans for real usage
        </h2>
        <p className="text-muted font-mono text-sm max-w-xl mx-auto">
          Subscribe through Lemon Squeezy. Auth is handled by Clerk and plan state is stored in Neon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-lg p-8 flex flex-col bg-surface border border-border"
          >
            <div className="mb-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-display text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted font-mono">{plan.period}</span>
              </div>
              <p className="text-xs text-muted font-mono">{plan.description}</p>
            </div>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-accent" strokeWidth={2.5} />
                  <span className="text-xs font-mono text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            {isSignedIn ? (
              <button
                onClick={() => startCheckout(plan.id)}
                disabled={loadingPlan !== null}
                className="w-full py-2.5 text-sm font-medium rounded text-center transition-all duration-150 hover:scale-[1.02] bg-accent text-[#0A0A08] hover:bg-accent-muted disabled:opacity-50 disabled:scale-100"
              >
                {loadingPlan === plan.id ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Opening checkout
                  </span>
                ) : (
                  `Start ${plan.name}`
                )}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full py-2.5 text-sm font-medium rounded text-center transition-all duration-150 hover:scale-[1.02] bg-accent text-[#0A0A08] hover:bg-accent-muted">
                  Sign in to subscribe
                </button>
              </SignInButton>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
