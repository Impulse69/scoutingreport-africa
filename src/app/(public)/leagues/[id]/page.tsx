import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, FileText, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompetitionDetail } from "@/lib/features/competitions/detail";

type Props = { params: Promise<{ id: string }> };
const linkClass = "text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getCompetitionDetail((await params).id);
  if (result.state !== "ready") return { title: "Competition", robots: { index: false } };
  return {
    title: result.competition.name,
    description: `Published player dossiers and scouting reports explicitly linked to ${result.competition.name}.`,
  };
}

export default async function CompetitionPage({ params }: Props) {
  const result = await getCompetitionDetail((await params).id);
  if (result.state === "missing") notFound();
  if (result.state === "unavailable") return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <Link href="/leagues" className={linkClass}>Back to competitions</Link>
      <EmptyState icon={AlertTriangle} title="Competition data is temporarily unavailable" description="Please try again later. No substitute data is being shown." />
    </div>
  );
  const { competition, players, reports } = result;
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <header className="space-y-4 border-b border-border pb-8">
        <Link href="/leagues" className={linkClass}>Back to competitions</Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{competition.name}</h1>
        <p className="text-sm text-muted-foreground">
          {competition.countries?.flag_emoji} {competition.countries?.name ?? "Pan-African"} · {competition.type.replaceAll("_", " ")}
        </p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Only explicitly linked, published scouting evidence appears here. Player nationality and club names are not used to infer competition membership.</p>
      </header>

      <section aria-labelledby="competition-players" className="space-y-4">
        <h2 id="competition-players" className="text-lg font-semibold">Current player dossiers</h2>
        {players.unavailable ? (
          <EmptyState icon={AlertTriangle} title="Player coverage is unavailable" description="Please try again later; an unavailable query does not mean there are no players." />
        ) : players.rows.length === 0 ? (
          <EmptyState icon={Users} title="No published players linked yet" description="Published dossiers appear when a scout assigns this as their current competition." />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Showing {players.rows.length}{players.total !== null ? ` of ${players.total}` : ""} published dossiers, ordered by name.</p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.rows.map((player) => (
                <li key={player.id} className="space-y-2 rounded-lg border border-border bg-card p-5">
                  <Link href={`/players/${player.slug}`} className={linkClass}>{player.full_name}</Link>
                  <p className="text-sm text-muted-foreground">{player.current_club ?? "Club not recorded"} · {player.primary_position_code ?? "Position not recorded"}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="competition-reports" className="space-y-4">
        <h2 id="competition-reports" className="text-lg font-semibold">Published match reports</h2>
        <p className="text-sm text-muted-foreground">Historical reports use their recorded match competition, independently of a player’s current assignment.</p>
        {reports.unavailable ? (
          <EmptyState icon={AlertTriangle} title="Report coverage is unavailable" description="Please try again later. No substitute reports are being shown." />
        ) : reports.rows.length === 0 ? (
          <EmptyState icon={FileText} title="No published reports linked yet" description="Reports appear after publication with this competition recorded in their match context and a published player dossier." />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Showing {reports.rows.length}{reports.total !== null ? ` of ${reports.total}` : ""} reports, newest publication first.</p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {reports.rows.map((report) => (
                <li key={report.id} className="space-y-2 rounded-lg border border-border bg-card p-5">
                  <Link href={`/players/${report.players.slug}/reports/${report.id}`} className={linkClass}>{report.players.full_name} — {report.match_description ?? "Scouting report"}</Link>
                  <p className="text-sm text-muted-foreground">{report.match_date ? <time dateTime={report.match_date}>{report.match_date}</time> : "Match date not recorded"}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <p className="rounded-lg border border-border bg-muted p-5 text-sm text-muted-foreground">Fixtures and standings are not available yet. Match observations are scouting evidence, not a complete fixture schedule.</p>
    </div>
  );
}
