import Link from "next/link";
import { FileText, PlusCircle, ArrowRight, Clock, CheckCircle2, UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listMyReports } from "@/lib/features/reports/queries";
import { listMyPlayers } from "@/lib/features/players/actions";
import { PlayerPicker } from "@/components/features/reports/player-picker";

export const metadata = {
  title: "Scout workspace",
  description: "Draft and publish structured scouting reports.",
};

export default async function ScoutWorkspacePage() {
  const user = (await getCurrentUser())!; // the /scout layout already gates this

  const [drafts, published, myPlayers] = await Promise.all([
    listMyReports(user.id, "draft"),
    listMyReports(user.id, "published"),
    listMyPlayers(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Scout workspace
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            Pick a player to start a report. Adding someone new? Create their
            profile first.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scout/reports/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            New report
          </Link>
          <Link
            href="/scout/players/new"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <UserPlus className="h-4 w-4" />
            New player
          </Link>
        </div>
      </div>

      {/* Player picker */}
      <section className="rounded-lg border border-border bg-card">
        <header className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Start a report</h2>
        </header>
        <div className="p-5">
          <PlayerPicker />
        </div>
      </section>

      {/* My players */}
      <Section
        title="My players"
        icon={UserPlus}
        count={myPlayers.length}
        empty="You haven't added any players yet."
      >
        {myPlayers.map((p) => (
          <Link
            key={p.id}
            href={`/scout/players/${p.id}/edit`}
            className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-medium group-hover:text-primary">
                  {p.fullName}
                </span>
                <span
                  className={`rounded border px-1.5 py-0.5 text-[11px] font-medium capitalize ${
                    p.status === "published"
                      ? "border-border bg-muted text-muted-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {p.primaryPositionCode ?? "—"} · {p.currentClub ?? "Free agent"}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
        ))}
      </Section>

      {/* Drafts */}
      <ReportSection
        title="Drafts"
        icon={Clock}
        reports={drafts}
        empty="No drafts. Start a report above."
      />

      {/* Published */}
      <ReportSection
        title="Published"
        icon={CheckCircle2}
        reports={published}
        empty="Nothing published yet."
      />
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  count,
  empty,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">
          {title}{" "}
          <span className="font-normal text-muted-foreground tabular-nums">
            ({count})
          </span>
        </h2>
      </div>

      {count === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {children}
        </div>
      )}
    </section>
  );
}

function ReportSection({
  title,
  icon,
  reports,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  reports: Awaited<ReturnType<typeof listMyReports>>;
  empty: string;
}) {
  return (
    <Section title={title} icon={icon} count={reports.length} empty={empty}>
      {reports.map((r) => (
        <Link
          key={r.id}
          href={`/scout/reports/${r.id}/edit`}
          className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60"
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium group-hover:text-primary">
              {r.player?.full_name ?? "Unknown player"}
            </span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {r.match_description ?? "No match context"} · {r.match_date ?? "—"}{" "}
              · edited {new Date(r.updated_at).toLocaleDateString()}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
        </Link>
      ))}
    </Section>
  );
}
