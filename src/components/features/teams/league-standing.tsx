import Image from "next/image";
import Link from "next/link";
import { getTeamRefBySlug, type StandingRow } from "@/lib/features/teams/mock";

type Props = {
  standing: StandingRow[];
  myPosition: number;
  mySlug: string;
  totalRecord: { won: number; drawn: number; lost: number; gf: number; ga: number };
};

/**
 * A standings table lists every club in the division, but only clubs in the
 * team index have a page. Link the ones that resolve and render the rest as
 * plain text rather than sending people to a 404.
 */
function TeamCell({ row, me }: { row: StandingRow; me: boolean }) {
  const crest = row.crestUrl ? (
    <Image src={row.crestUrl} alt="" width={16} height={16} className="rounded-sm" />
  ) : (
    <span className="h-4 w-4 rounded-sm bg-muted" />
  );

  const tone = me ? "font-medium text-foreground" : "text-foreground";

  if (!getTeamRefBySlug(row.teamSlug)) {
    return (
      <span className={`flex items-center gap-2 ${tone}`}>
        {crest}
        {row.teamName}
      </span>
    );
  }

  return (
    <Link
      href={`/teams/${row.teamSlug}`}
      className={`flex items-center gap-2 transition-colors ${tone} ${
        me ? "" : "hover:text-primary"
      }`}
    >
      {crest}
      {row.teamName}
    </Link>
  );
}

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
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-5 py-3.5">
        <p className="text-sm font-semibold">League standing</p>
      </header>

      <div className="border-b border-border px-5 py-5">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-semibold tabular-nums text-primary">
            {myPosition}
            <span className="text-base text-primary/70">{ordinalSuffix(myPosition)}</span>
          </span>
          <div className="pb-1">
            <p className="text-xs font-medium text-muted-foreground">League position</p>
            <p className="mt-1 text-xs tabular-nums text-muted-foreground">
              {totalRecord.won}W {totalRecord.drawn}D {totalRecord.lost}L · {totalRecord.gf} GF{" "}
              {totalRecord.ga} GA
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left text-xs font-medium text-muted-foreground">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Team</th>
              <th className="px-3 py-2 text-right font-medium">P</th>
              <th className="px-3 py-2 text-right font-medium">W</th>
              <th className="px-3 py-2 text-right font-medium">D</th>
              <th className="px-3 py-2 text-right font-medium">L</th>
              <th className="px-3 py-2 text-right font-medium">GD</th>
              <th className="px-3 py-2 text-right font-medium">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standing.map((row) => {
              const me = row.teamSlug === mySlug;
              return (
                <tr
                  key={row.teamSlug}
                  className={`border-t border-border hover:bg-muted/60 ${
                    me ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                    {row.rank}
                  </td>
                  <td className="px-3 py-2.5">
                    <TeamCell row={row} me={me} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{row.played}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{row.won}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{row.drawn}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{row.lost}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold tabular-nums ${
                      me ? "text-primary" : "text-foreground"
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
