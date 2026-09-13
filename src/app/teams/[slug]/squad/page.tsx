import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Database } from "lucide-react";
import { getTeamBySlug, getTeamRefBySlug } from "@/lib/features/teams/mock";
import { filterExistingPlayerSlugs } from "@/lib/features/players/queries";

export default async function SquadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getTeamBySlug(slug);

  // The team layout renders for any club in the search index, but only some are
  // fully seeded. Match the overview page and show the "not seeded yet" state
  // instead of 404ing on a tab the sidebar itself links to.
  if (!data) {
    const ref = getTeamRefBySlug(slug);
    if (!ref) notFound();

    return (
      <div className="space-y-6">
        <header className="border-b border-border pb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Squad</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {ref.name} · {ref.league}
          </p>
        </header>
        <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center">
          <Database className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">
            Squad data for {ref.name} isn&apos;t loaded yet
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            The club is registered. Roster, minutes and per-player output appear
            once match-data sync covers {ref.league}.
          </p>
        </div>
      </div>
    );
  }

  const all = [
    ...data.formation.slots.map((s) => s.player),
    ...data.backups.GK,
    ...data.backups.DEF,
    ...data.backups.MID,
    ...data.backups.FWD,
  ];

  // Squad rosters come from the club feed, not from our own player table. Only
  // link the names that have a profile behind them — the rest would 404.
  const linkable = await filterExistingPlayerSlugs(all.map((p) => p.slug));

  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Squad</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {all.length} players · 2025/2026
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-2.5">#</th>
              <th className="px-4 py-2.5">Player</th>
              <th className="px-4 py-2.5">Pos</th>
              <th className="px-4 py-2.5 text-right">Apps</th>
              <th className="px-4 py-2.5 text-right">Mins</th>
              <th className="px-4 py-2.5 text-right">Goals</th>
              <th className="px-4 py-2.5 text-right">Assists</th>
              <th className="px-4 py-2.5 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr
                key={p.id}
                className="border-t border-border transition-colors hover:bg-muted/60"
              >
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                  {p.shirtNumber}
                </td>
                <td className="px-4 py-2.5 font-medium">
                  {linkable.has(p.slug) ? (
                    <Link
                      href={`/players/${p.slug}`}
                      className="text-primary hover:underline"
                    >
                      {p.shortName}
                    </Link>
                  ) : (
                    p.shortName
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.position}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {p.appearances}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {p.minutes.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{p.goals}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{p.assists}</td>
                <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                  {p.rating.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        Sortable filters and aggregated per-90 stats land in the next pass.
      </p>
    </div>
  );
}
