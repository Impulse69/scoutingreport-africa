import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Flag,
  Globe2,
  GraduationCap,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  listCompetitions,
  type CompetitionListItem,
  type CompetitionType,
} from "@/lib/features/competitions/queries";

export const metadata: Metadata = {
  title: "Competitions & Leagues",
  description:
    "Browse the verified African football competition catalogue maintained by ScoutingReport Africa.",
};

const GROUPS: Array<{
  type: CompetitionType;
  label: string;
  description: string;
  icon: typeof Trophy;
}> = [
  {
    type: "continental_club",
    label: "Continental club competitions",
    description: "CAF competitions contested by clubs from across Africa.",
    icon: Trophy,
  },
  {
    type: "national_team",
    label: "National team competitions",
    description: "Senior and age-group competitions for African national teams.",
    icon: Flag,
  },
  {
    type: "domestic",
    label: "Domestic competitions",
    description: "National competitions in the current scouting reference catalogue.",
    icon: Shield,
  },
  {
    type: "youth",
    label: "Youth competitions",
    description: "Verified youth competition records.",
    icon: Users,
  },
  {
    type: "academy",
    label: "Academy competitions",
    description: "Verified academy competition records.",
    icon: GraduationCap,
  },
  {
    type: "friendly",
    label: "Friendly competitions",
    description: "Verified friendly competition records.",
    icon: Globe2,
  },
];

function groupCompetitions(competitions: CompetitionListItem[]) {
  return GROUPS.map((group) => ({
    ...group,
    competitions: competitions.filter(
      (competition) => competition.type === group.type,
    ),
  })).filter((group) => group.competitions.length > 0);
}

export default async function LeaguesPage() {
  const { competitions, unavailable } = await listCompetitions();
  const groups = groupCompetitions(competitions);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      <header className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Verified reference data
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Competitions &amp; Leagues
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Browse competition records maintained in the scouting database. We
            only show confirmed reference data—never invented rankings,
            tactical scores, or club coverage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/players"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Browse players
          </Link>
          <Link
            href="/scout"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Scout workspace
          </Link>
        </div>
      </header>

      {unavailable ? (
        <EmptyState
          icon={AlertTriangle}
          title="Competition data is temporarily unavailable"
          description="The scouting database could not be reached. No substitute or cached rankings are being shown."
        />
      ) : competitions.length === 0 ? (
        <EmptyState
          icon={Globe2}
          title="No competitions have been published"
          description="Competition records will appear here after an administrator adds them to the reference catalogue."
        />
      ) : (
        <div className="space-y-12">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-3xl font-semibold text-foreground">
                {competitions.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                verified competition records
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-3xl font-semibold text-foreground">
                {groups.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                competition categories represented
              </p>
            </div>
          </div>

          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <section key={group.type} className="space-y-5">
                <div className="flex items-start gap-3 border-b border-border pb-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {group.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.competitions.map((competition) => (
                    <article
                      key={competition.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {competition.countryName ?? "Pan-African"}
                          </p>
                          <h3 className="mt-2 text-base font-bold leading-snug text-foreground">
                            {competition.name}
                          </h3>
                        </div>
                        <span
                          className="text-2xl"
                          aria-label={
                            competition.countryName
                              ? `${competition.countryName} flag`
                              : "Continental competition"
                          }
                        >
                          {competition.flagEmoji ?? "🌍"}
                        </span>
                      </div>

                      {competition.countryCode ? (
                        <Link
                          href={`/players?nat=${competition.countryCode}`}
                          className="mt-5 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
                        >
                          Players from {competition.countryName}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : (
                        <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                          Continental reference record
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <p className="rounded-xl border border-border bg-muted/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            Player and fixture coverage will appear only when verified records
            are linked to a competition. Missing coverage is left empty rather
            than inferred.
          </p>
        </div>
      )}
    </div>
  );
}
