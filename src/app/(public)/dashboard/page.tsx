import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bookmark,
  Target,
  Sparkles,
  TrendingUp,
  Layers,
  Users,
  Trophy,
  ScrollText,
  UserPlus,
  ArrowRight,
  Flame,
  Star,
  Activity,
  Globe2,
  ShieldAlert,
  Compass,
  Clock
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { HubCard, type HubCardProps } from "@/components/features/dashboard/hub-card";
import { ScoutHubBanner } from "@/components/features/dashboard/dismissible-banner";
import { AccountFooter } from "@/components/features/dashboard/account-footer";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { CAF_COUNTRIES, POSITIONS } from "@/lib/shared/constants";

export const metadata = { title: "Scout Intelligence Dashboard" };

export default async function DashboardPage() {
  const [me, publishedPlayers] = await Promise.all([
    getCurrentUser(),
    listPublishedPlayers(8),
  ]);

  if (!me) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  const role = me.role;
  const isScout = role === "scout" || role === "admin";

  const metrics = [
    {
      label: "Scouted Prospects",
      value: `${publishedPlayers.length}+`,
      sub: "Published in database",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "CAF Nations Covered",
      value: "54",
      sub: "All regional associations",
      icon: Globe2,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Active Watchlists",
      value: "12",
      sub: "Tracked talent shortlists",
      icon: Bookmark,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Scout Verification",
      value: isScout ? "Verified Pro" : "Free Explorer",
      sub: isScout ? "Full Report Permissions" : "Read-only access",
      icon: Star,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Scout Command Hub · {role.toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {me.email?.split("@")[0] ?? "Scout"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Monitor rising African talents, draft comprehensive scouting evaluations, and track your recruitment pipeline across domestic and European leagues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isScout && (
              <>
                <Link
                  href="/scout/reports/new"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <ScrollText className="h-4 w-4" /> New Report
                </Link>
                <Link
                  href="/scout/players/new"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4 text-emerald-400" /> Add Player
                </Link>
              </>
            )}
            <Link
              href="/players"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Search className="h-4 w-4" /> Search Database
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl bg-[#0c1218] border border-white/10 flex items-center gap-4 hover:border-white/20 transition-all"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${m.color}`}>
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.label}</p>
              <p className="text-xl font-mono font-black text-white">{m.value}</p>
              <p className="text-[10px] text-slate-400">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Spotlight Prospects in Database */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg font-black text-white tracking-tight">
              Recently Scouted Talent Spotlight
            </h2>
          </div>
          <Link
            href="/players"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All ({publishedPlayers.length}) <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {publishedPlayers.slice(0, 4).map((p) => {
            const country = CAF_COUNTRIES.find((c) => c.code === p.nationalityCode);
            const pos = POSITIONS.find((pos) => pos.code === p.primaryPositionCode);
            return (
              <Link
                key={p.id}
                href={`/players/${p.slug}`}
                className="group p-4 rounded-2xl bg-[#0c1218] border border-white/10 hover:border-emerald-500/40 hover:bg-[#10171e] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base">{country?.flagEmoji ?? "⚽"}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      {pos?.code ?? "PL"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                    {p.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {p.currentClub ?? "Unattached"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{country?.name ?? "Africa"}</span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Dossier →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scout Workspace Hub Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Intelligence & Analysis Workspaces
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access tools for profiling, shortlisting, report submission, and fantasy tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <HubCard
            href="/players"
            icon={Search}
            title="Player Intelligence Catalogue"
            description="Deep database filter by position, nationality, rating, physical traits, and role."
            accent="emerald"
          />
          <HubCard
            href="/watchlists"
            icon={Bookmark}
            title="Talent Watchlists"
            description="Organize shortlisted prospects into custom recruitment pipelines and track evolution."
            accent="amber"
          />
          <HubCard
            href="/scout"
            icon={ScrollText}
            title="Scout Reports & Drafts"
            description="Review all published and draft scouting assessments filed by your department."
            accent="emerald"
          />
          <HubCard
            href="/leagues"
            icon={Trophy}
            title="Continental Competitions"
            description="Browse CAF Champions League, African domestic divisions, and European landing leagues."
            accent="amber"
          />
          <HubCard
            href="/fpl"
            icon={Sparkles}
            title="Fantasy & Differential Tracker"
            description="Track African talent gameweek performance, xGI spikes, and fixture swings."
            accent="cyan"
          />
          <HubCard
            href="/settings"
            icon={Compass}
            title="Scout Settings & Preferences"
            description="Manage your recruitment focus regions, alert frequencies, and account profile."
            accent="emerald"
          />
        </div>
      </div>

      <AccountFooter email={me.email} role={me.role} />
    </div>
  );
}
