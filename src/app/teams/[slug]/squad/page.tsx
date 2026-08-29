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
        <header className="border-b border-white/5 pb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
            Squad
          </h1>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            {ref.name} · {ref.league}
          </p>
        </header>
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] py-16 text-center">
          <Database className="mx-auto h-6 w-6 text-zinc-500" />
          <p className="mt-3 font-mono text-sm text-zinc-300">
            {ref.name} squad data lands when the league ingest pipeline ships
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            The club is registered. Roster, minutes, and per-player output
            populate once match-data sync covers {ref.league}.
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
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">Squad</h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">{all.length} players · 2025/2026</p>
      </header>

      <div className="rounded-xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-white/5">
            <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3 text-right">Apps</th>
              <th className="px-4 py-3 text-right">Mins</th>
              <th className="px-4 py-3 text-right">Goals</th>
              <th className="px-4 py-3 text-right">Assists</th>
              <th className="px-4 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-zinc-500">{p.shirtNumber}</td>
                <td className="px-4 py-3 text-white">
                  {linkable.has(p.slug) ? (
                    <Link href={`/players/${p.slug}`} className="hover:text-cyan-300">
                      {p.shortName}
                    </Link>
                  ) : (
                    p.shortName
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-400">{p.position}</td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">{p.appearances}</td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                  {p.minutes.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">{p.goals}</td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">{p.assists}</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-cyan-300">
                  {p.rating.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-zinc-500">
        <Users className="mr-1 inline h-3 w-3" />
        Sortable filters and aggregated per-90 stats land in the next pass.
      </p>
    </div>
  );
}
