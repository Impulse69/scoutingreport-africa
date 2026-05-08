import Image from "next/image";
import Link from "next/link";
import type { StandingRow } from "@/lib/features/teams/mock";

type Props = {
  standing: StandingRow[];
  myPosition: number;
  mySlug: string;
  totalRecord: { won: number; drawn: number; lost: number; gf: number; ga: number };
};

const ordinalSuffix = (n: number) => {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export function LeagueStanding({ standing, myPosition, mySlug, totalRecord }: Props) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          League Standing
        </p>
      </header>

      <div className="border-b border-white/5 px-6 py-5">
        <div className="flex items-end gap-3">
          <span className="font-mono text-4xl font-black tabular-nums text-cyan-400">
            {myPosition}
            <span className="text-base text-cyan-300/70">{ordinalSuffix(myPosition)}</span>
          </span>
          <div className="pb-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              League position
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-300 tabular-nums">
              {totalRecord.won}W {totalRecord.drawn}D {totalRecord.lost}L · {totalRecord.gf} GF{" "}
              {totalRecord.ga} GA
            </p>
          </div>
        </div>
      </div>

      <div className="px-2 py-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Team</th>
              <th className="px-3 py-2 text-right font-semibold">P</th>
              <th className="px-3 py-2 text-right font-semibold">W</th>
              <th className="px-3 py-2 text-right font-semibold">D</th>
              <th className="px-3 py-2 text-right font-semibold">L</th>
              <th className="px-3 py-2 text-right font-semibold">GD</th>
              <th className="px-3 py-2 text-right font-semibold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standing.map((row) => {
              const me = row.teamSlug === mySlug;
              return (
                <tr
                  key={row.teamSlug}
                  className={`border-t border-white/5 font-mono ${
                    me ? "bg-cyan-500/5" : ""
                  }`}
                >
                  <td className={`px-3 py-2.5 ${me ? "text-cyan-300" : "text-zinc-400"}`}>
                    {row.rank}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/teams/${row.teamSlug}`}
                      className={`flex items-center gap-2 transition-colors ${
                        me
                          ? "font-semibold text-cyan-300"
                          : "text-zinc-200 hover:text-white"
                      }`}
                    >
                      {row.crestUrl ? (
                        <Image
                          src={row.crestUrl}
                          alt=""
                          width={16}
                          height={16}
                          className="rounded-sm"
                        />
                      ) : (
                        <span className="h-4 w-4 rounded-sm bg-zinc-800" />
                      )}
                      {row.teamName}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">{row.played}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">{row.won}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">{row.drawn}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">{row.lost}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-bold tabular-nums ${
                      me ? "text-cyan-300" : "text-cyan-400"
                    }`}
                  >
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
