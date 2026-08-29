import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Eye, FileText, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/shared/nav/marketing-nav";
import { DarkFooter } from "@/components/shared/nav/dark-footer";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import {
  RATING_CATEGORY_LABELS,
  RATING_CATEGORIES,
  RATING_SUB_AREAS_BY_CATEGORY,
} from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "How ScoutingReport Africa turns live match observation into structured, comparable recruitment evidence on African football talent.",
};

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Watched, not scraped",
    body: "Every report on this platform comes from a scout who watched the player — live or on video — and says which it was, for how many minutes, in which fixture.",
  },
  {
    icon: ClipboardCheck,
    title: "One structure, every report",
    body: "The same four categories and the same sub-areas, rated 1–5, on every player. That is what makes two reports by two scouts on two continents comparable at all.",
  },
  {
    icon: FileText,
    title: "A decision, not a description",
    body: "Each report closes on a recruitment call — sign now, monitor, revisit, pass — plus the level the scout believes the player can hold. Notes without a verdict do not travel inside a club.",
  },
  {
    icon: ShieldCheck,
    title: "Attributable",
    body: "Reports carry their author and publication date. Nothing is anonymous, and nothing is retroactively edited without the timestamp moving.",
  },
];

export default async function AboutPage() {
  const me = await getCurrentUser();
  const initialAuth = me
    ? {
        email: me.email ?? null,
        displayName: me.email?.split("@")[0] ?? null,
        role: me.role,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-zinc-100">
      <MarketingNav initialAuth={initialAuth} />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl space-y-14 px-6 py-16">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
              About
            </p>
            <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight text-white">
              Human-scouted intelligence on African football talent
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              African football produces more talent than it gets credit for, and
              far more than any highlight reel can sort. ScoutingReport Africa
              exists to put a consistent, attributable written record behind the
              players — so a club deciding on a 19-year-old in Kumasi is reading
              the same kind of evidence they would get on one in Lisbon.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <article
                key={p.title}
                className="rounded-xl border border-white/5 bg-[#0E0E0E] p-6"
              >
                <p.icon className="h-5 w-5 text-orange-500" />
                <h2 className="mt-4 font-mono text-sm font-semibold text-white">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{p.body}</p>
              </article>
            ))}
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
              What a report covers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Match context first — fixture, date, competition, the role the
              player actually occupied and the minutes observed. Then a 1–5
              rating on every sub-area below, strengths and risks as explicit
              bullets, a projection, and a final recruitment call.
            </p>

            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 md:grid-cols-2">
              {RATING_CATEGORIES.map((cat) => (
                <div key={cat} className="bg-[#0E0E0E] px-6 py-5">
                  <h3 className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                    {RATING_CATEGORY_LABELS[cat]}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {RATING_SUB_AREAS_BY_CATEGORY[cat]
                      .filter((s) => s.key !== "overall")
                      .map((s) => (
                        <li
                          key={s.key}
                          className="font-mono text-[11px] text-zinc-500"
                        >
                          {s.label}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/5 bg-gradient-to-br from-[#171008] via-[#0E0E0E] to-[#0B0B0B] px-6 py-8">
            <h2 className="font-mono text-lg font-bold text-white">
              Scouting with us
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Scout accounts can create player profiles and publish reports that
              appear on the public roster. Access is granted by an admin rather
              than self-serve, so the record stays worth reading.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/players"
                className="rounded-md bg-orange-600 px-4 py-2.5 font-mono text-xs font-medium text-white transition-colors hover:bg-orange-700"
              >
                Browse scouted players
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                Create an account
              </Link>
            </div>
          </section>
        </div>
      </main>

      <DarkFooter />
    </div>
  );
}
