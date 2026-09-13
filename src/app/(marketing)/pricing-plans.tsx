"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Shield, UserCheck } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    icon: UserCheck,
    annual: "EUR 29",
    monthly: "EUR 39",
    description: "Essential access for independent scouts and regional correspondents.",
    features: [
      "Player search and public profile access",
      "3 recruitment watchlists",
      "Standard positional comparisons",
      "FPL player notes & watch reports",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro analyst",
    icon: Shield,
    annual: "EUR 79",
    monthly: "EUR 99",
    description: "Scouting tools, report workflow, and advanced player filters.",
    features: [
      "Everything in Starter",
      "Unlimited recruitment watchlists",
      "Create and export verified scouting reports",
      "Advanced per-90 metrics & radar plots",
      "Scout community verified dossiers",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Club & Agency",
    icon: Building2,
    annual: "EUR 249",
    monthly: "EUR 299",
    description: "Multi-seat access for professional clubs, federations, and agencies.",
    features: [
      "Everything in Pro analyst",
      "Up to 10 scout seats & collaborator permissions",
      "On-demand scout commissions in Africa",
      "Direct API & Data feed exports",
      "Dedicated talent recruitment support",
    ],
    cta: "Contact club sales",
    highlighted: false,
  },
];

export function PricingPlans() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="space-y-8 py-4">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pricing
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Access options for independent scouts, analysts, and recruitment departments.
        </p>

        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted p-1 text-xs font-medium mt-2">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`rounded-lg px-4 py-1.5 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
              !isAnnual
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`rounded-lg px-4 py-1.5 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
              isAnnual
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            Annual (Save 25%)
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <article
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${
                tier.highlighted
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">{tier.name}</h3>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
                      {isAnnual ? tier.annual : tier.monthly}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 border-t border-border pt-4 text-xs sm:text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/auth/sign-up"
                className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
