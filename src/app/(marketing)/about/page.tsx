import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Eye, FileText, ShieldCheck } from "lucide-react";
import {
  RATING_CATEGORY_LABELS,
  RATING_CATEGORIES,
  RATING_SUB_AREAS_BY_CATEGORY,
} from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "How ScoutingReport Africa turns match observation into structured, comparable recruitment evidence on African football talent.",
};

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Watched, not scraped",
    body: "Every report on this platform comes from a scout who watched the player, live or on video, and records the fixture context.",
  },
  {
    icon: ClipboardCheck,
    title: "One structure, every report",
    body: "The same four categories and the same sub-areas, rated 1-5, make reports easier to compare across scouts and leagues.",
  },
  {
    icon: FileText,
    title: "A decision, not a description",
    body: "Each report closes on a recruitment call, projection level, strengths, and risks, so notes can travel inside a club.",
  },
  {
    icon: ShieldCheck,
    title: "Attributable",
    body: "Reports carry their author and publication date. Material edits move the timestamp so the record remains clear.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Human-scouted intelligence on African football talent
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          ScoutingReport Africa puts a consistent, attributable written record
          behind players, so a club deciding on a prospect in Kumasi can read the
          same kind of evidence they would expect from an established market.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <article key={p.title} className="rounded-lg border border-border bg-card p-5">
            <p.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-base font-semibold text-foreground">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="text-base font-semibold text-foreground">What a report covers</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Match context first: fixture, date, competition, the role the player
          occupied, and the minutes observed. Then a 1-5 rating on every
          sub-area below, strengths and risks, a projection, and a final
          recruitment call.
        </p>

        <div className="mt-6 grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2">
          {RATING_CATEGORIES.map((cat) => (
            <div key={cat} className="border-b border-border px-5 py-4 md:border-r">
              <h3 className="text-sm font-semibold text-foreground">
                {RATING_CATEGORY_LABELS[cat]}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {RATING_SUB_AREAS_BY_CATEGORY[cat]
                  .filter((s) => s.key !== "overall")
                  .map((s) => (
                    <li key={s.key} className="text-xs text-muted-foreground">
                      {s.label}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card px-5 py-6">
        <h2 className="text-base font-semibold text-foreground">Scouting with us</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Scout accounts can create player profiles and publish reports that
          appear on the public roster. Access is granted by an admin so the
          record stays accountable.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/players"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Browse players
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Create an account
          </Link>
        </div>
      </section>
    </div>
  );
}
