import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, LineChart, ShieldCheck, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "FPL",
  description:
    "Fantasy Premier League planning built around scouting context, role clarity and fixture timing.",
};

/**
 * Placeholder hub.
 *
 * This page previously listed specific players with invented prices, ownership
 * percentages, xGI figures and fixture tickers, presented as live FPL
 * intelligence. None of it came from a data source, and one entry linked to the
 * wrong player. Until a real FPL feed is wired up, the page describes what the
 * tools will do rather than fabricating their output.
 */
const TOOLS = [
  {
    icon: CalendarDays,
    title: "Fixture lens",
    body: "Upcoming runs by difficulty, so you can see where favourable fixtures meet players already in form.",
  },
  {
    icon: LineChart,
    title: "Form signals",
    body: "Separate sustainable underlying output from short-term points swings, using the same per-90 measures the scouting reports use.",
  },
  {
    icon: ShieldCheck,
    title: "Risk checks",
    body: "Minutes security, rotation risk, injury flags and transfer timing — the things that decide whether a pick survives the week.",
  },
];

export default function FplPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="Fantasy"
        title="FPL"
        description="Fantasy planning that reuses the scouting data on this platform — African players in particular, where public coverage is thinnest."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <article
            key={tool.title}
            className="rounded-lg border border-border bg-card p-5"
          >
            <tool.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-sm font-semibold">{tool.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {tool.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-lg border border-border bg-muted p-6">
        <h2 className="text-base font-semibold">Not live yet</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          These tools need a fantasy data feed that isn&apos;t connected yet. Rather
          than show placeholder prices and ownership figures, this page stays
          empty until the numbers are real.
        </p>
        <p className="mt-4">
          <Link
            href="/players"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse scouted players instead
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </section>
    </div>
  );
}
