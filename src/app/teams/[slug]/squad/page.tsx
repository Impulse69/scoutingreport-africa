import { notFound } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { getTeamBySlug } from "@/lib/features/teams/mock";

export default async function SquadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getTeamBySlug(slug);
  if (!data) notFound();

  const all = [
    ...data.formation.slots.map((s) => s.player),
    ...data.backups.GK,
    ...data.backups.DEF,
    ...data.backups.MID,
    ...data.backups.FWD,
  ];

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
                  <Link href={`/players/${p.slug}`} className="hover:text-cyan-300">
                    {p.shortName}
                  </Link>
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
