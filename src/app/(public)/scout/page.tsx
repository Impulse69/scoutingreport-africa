import Link from "next/link";
import {
  ScrollText,
  Plus,
  UserPlus,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listMyReports } from "@/lib/features/reports/queries";
import { PlayerPicker } from "@/components/features/reports/player-picker";

export const metadata = { title: "Scout workspace" };

export default async function ScoutHomePage() {
  const me = (await getCurrentUser())!; // layout already gates this

  const [drafts, published] = await Promise.all([
    listMyReports(me.id, "draft"),
    listMyReports(me.id, "published"),
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10 space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Scout workspace
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          New report
        </h1>
        <p className="mt-1.5 font-mono text-xs text-zinc-500">
          Pick a player below to start a fresh scouting report. Adding someone
          new? Create their profile first.
        </p>
      </header>

      <PlayerPicker />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/scout/players/new"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <UserPlus className="h-3 w-3" />
          New player
        </Link>
      </div>

      {/* Drafts */}
      <ReportListSection
        title="Drafts"
        icon={Clock}
        reports={drafts}
        emptyText="No drafts. Start a report above."
      />

      {/* Published */}
      <ReportListSection
        title="Published"
        icon={CheckCircle2}
        reports={published}
        emptyText="Nothing published yet."
      />
    </div>
  );
}

function ReportListSection({
  title,
  icon: Icon,
  reports,
  emptyText,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  reports: Awaited<ReturnType<typeof listMyReports>>;
  emptyText: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {title} <span className="ml-1 text-zinc-600">({reports.length})</span>
        </h2>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 bg-[#0E0E0E] p-4 font-mono text-[11px] text-zinc-500">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id}>
              <Link
                href={`/scout/reports/${r.id}/edit`}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-[#0E0E0E] px-4 py-3 transition-colors hover:border-white/15 hover:bg-[#121212]"
              >
                <ScrollText className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-orange-400" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold text-white truncate">
                    {r.player?.full_name ?? "Unknown player"}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 truncate">
                    {r.match_description ?? "No match context"} ·{" "}
                    {r.match_date ?? "—"} · last edit{" "}
                    {new Date(r.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
