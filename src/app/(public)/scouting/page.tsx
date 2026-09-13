import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Eye, FileText } from "lucide-react";
import {
  RATING_CATEGORIES,
  RATING_CATEGORY_LABELS,
  RATING_SUB_AREAS_BY_CATEGORY,
} from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "Scouting method",
  description:
    "How reports on this platform are structured: match context, 1–5 ratings across four categories, and a recruitment call.",
};

const WORKFLOW = [
  {
    step: "01",
    title: "Identify",
    description:
      "Find players through regional coverage and clear role criteria, rather than whatever the highlight reels surface.",
    icon: Eye,
  },
  {
    step: "02",
    title: "Evaluate",
    description:
      "Rate technical, tactical, physical and mentality sub-areas 1–5 against the same template every time, with the match context recorded alongside.",
    icon: ClipboardCheck,
  },
  {
    step: "03",
    title: "Recommend",
    description:
      "Close on a decision — sign now, monitor, revisit or pass — and the level the player can realistically hold.",
    icon: FileText,
  },
];

export default function ScoutingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-8">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          How scouting works here
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Two reports are only comparable if they were written to the same
          structure. Every report on this platform follows the one below.
        </p>
      </header>

      {/* Workflow */}
      <section className="grid gap-4 md:grid-cols-3">
        {WORKFLOW.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {item.step}
              </span>
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-sm font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {/* The rating template */}
      <section>
        <h2 className="text-base font-semibold">What every report rates</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Four categories, each scored 1–5 on the sub-areas below plus an
          overall. The player profile averages these across every published
          report.
        </p>

        <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {RATING_CATEGORIES.map((cat) => (
            <div key={cat} className="bg-card px-5 py-4">
              <h3 className="text-sm font-semibold">
                {RATING_CATEGORY_LABELS[cat]}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {RATING_SUB_AREAS_BY_CATEGORY[cat]
                  .filter((s) => s.key !== "overall")
                  .map((s) => (
                    <li key={s.key} className="text-sm text-muted-foreground">
                      {s.label}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section className="rounded-lg border border-border bg-muted p-6">
        <h2 className="text-base font-semibold">Built around match context</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Assessing African prospects is harder than it should be — video
          quality varies, optical tracking is patchy, and tournament reporting
          is irregular. The template compensates by anchoring every rating to a
          specific fixture, a stated role, and the number of minutes actually
          watched.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/scout/reports/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a report
          </Link>
          <Link
            href="/players"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Browse players
          </Link>
        </div>
      </section>
    </div>
  );
}
