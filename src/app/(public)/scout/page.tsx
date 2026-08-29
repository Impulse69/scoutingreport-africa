import Link from "next/link";
import {
  ScrollText,
  Plus,
  UserPlus,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  Search,
  Sparkles,
  Award
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listMyReports } from "@/lib/features/reports/queries";
import { listMyPlayers } from "@/lib/features/players/actions";
import { PlayerPicker } from "@/components/features/reports/player-picker";

export const metadata = { title: "Scout Workspace & Assessment Hub" };

export default async function ScoutHomePage() {
  const me = (await getCurrentUser())!;

  const [drafts, published, myPlayers] = await Promise.all([
    listMyReports(me.id, "draft"),
    listMyReports(me.id, "published"),
    listMyPlayers(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl px-4 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5" /> Department Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Scout Assessment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Select a player from the directory to start a structured report, or register a new prospect to begin tracking.
          </p>
        </div>
      </div>

      {/* Report Starter */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Start New Scouting Assessment</h2>
          </div>
          <Link
            href="/scout/players/new"
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Register New Player</span>
          </Link>
        </div>

        <PlayerPicker />
      </div>

      {/* Registered Players by Me */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-emerald-400" />
            <span>Prospects Registered by You ({myPlayers.length})</span>
          </h2>
          <Link
            href="/scout/players/new"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
          >
            + Add Another Player
          </Link>
        </div>

        {myPlayers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c1218]/50 p-6 text-center text-xs text-slate-400">
            You haven&apos;t registered any player profiles yet. Click &ldquo;Register New Player&rdquo; to add a prospect.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myPlayers.map((p) => (
              <Link
                key={p.id}
                href={`/scout/players/${p.id}/edit`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0c1218] p-4 hover:border-emerald-500/40 hover:bg-[#121921] transition-all shadow-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {p.fullName}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        p.status === "published"
                          ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                          : "border border-amber-500/40 bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {p.primaryPositionCode ?? "PL"} · {p.currentClub ?? "Free agent"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Drafts Section */}
      <ReportListSection
        title="Draft Assessments"
        icon={Clock}
        reports={drafts}
        emptyText="No draft reports in progress. Pick a player above to start a report."
        accent="amber"
      />

      {/* Published Section */}
      <ReportListSection
        title="Published Department Reports"
        icon={CheckCircle2}
        reports={published}
        emptyText="No scouting reports published yet."
        accent="emerald"
      />
    </div>
  );
}

function ReportListSection({
  title,
  icon: Icon,
  reports,
  emptyText,
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  reports: Awaited<ReturnType<typeof listMyReports>>;
  emptyText: string;
  accent: "amber" | "emerald";
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent === "amber" ? "text-amber-400" : "text-emerald-400"}`} />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {title} <span className="text-white">({reports.length})</span>
        </h2>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c1218]/50 p-6 text-center text-xs text-slate-400">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-2.5">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/scout/reports/${r.id}/edit`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c1218] p-4 sm:p-5 hover:border-emerald-500/40 hover:bg-[#121921] transition-all shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                    {r.player?.full_name ?? "Player Assessment"}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {r.match_description ?? "Match Context Pending"} · {r.match_date ?? "Recent Match"} · Last modified {new Date(r.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-emerald-400 hidden sm:inline">
                  Edit Assessment
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
