import { notFound } from "next/navigation";
import { Database } from "lucide-react";
import { getTeamBySlug, getTeamRefBySlug } from "@/lib/features/teams/mock";
import { MostSelectedXI } from "@/components/features/teams/most-selected-xi";
import { NextInLine } from "@/components/features/teams/next-in-line";
import { LeagueStanding } from "@/components/features/teams/league-standing";
import { TeamProfileRadar } from "@/components/features/teams/team-profile-radar";

export default async function TeamOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getTeamBySlug(slug);
  const ref = getTeamRefBySlug(slug);
  if (!data && !ref) notFound();

  // Stub state — team is in the search index but not fully seeded yet.
  if (!data && ref) {
    return (
      <div className="space-y-8">
        <header className="border-b border-white/5 pb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-white">{ref.name}</h1>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            {ref.league} · {ref.country} · 2025/2026
          </p>
        </header>
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] py-16 text-center">
          <Database className="mx-auto h-6 w-6 text-zinc-500" />
          <p className="mt-3 font-mono text-sm text-zinc-300">
            {ref.name} data lands when the league ingest pipeline ships
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            We have the team registered. Squad, formations, standings, and style profile populate
            once match-data sync covers {ref.league}.
          </p>
        </div>
      </div>
    );
  }
  if (!data) notFound();

  const me = data.standing.find((s) => s.teamSlug === slug);
  const totalRecord = me
    ? { won: me.won, drawn: me.drawn, lost: me.lost, gf: me.gf, ga: me.ga }
    : { won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 };

  return (
    <div className="space-y-8">
      {/* Top heading */}
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">Overview</h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">2025/2026</p>
      </header>

      <MostSelectedXI formation={data.formation} />

      <NextInLine backups={data.backups} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LeagueStanding
          standing={data.standing}
          myPosition={data.myPosition}
          mySlug={slug}
          totalRecord={totalRecord}
        />
        <TeamProfileRadar attributes={data.styleAttributes} styleTags={data.styleTags} />
      </div>
    </div>
  );
}
