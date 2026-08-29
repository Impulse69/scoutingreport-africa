import Link from "next/link";
import {
  Users,
  Compass,
  Trophy,
  Activity,
  Award,
  Sparkles,
  FileText,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Shield,
  Star,
  Search,
  PlusCircle,
  BarChart3,
  Flame,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { listWatchlistsForUser } from "@/lib/features/watchlists/queries";
import { HubCard } from "@/components/features/dashboard/hub-card";

export const metadata = {
  title: "Scout Command Hub · ScoutingReport Africa",
  description: "Executive recruitment telemetry and talent intelligence workspace.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const spotlightPlayers = await listPublishedPlayers(6);
  const watchlists = user ? await listWatchlistsForUser(user.id) : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-10 font-['Inter']">
      {/* ─── Top Command Hub Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(224,192,178,0.12)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-[#CC5500]" />
            <span>Kinetic Archive Intelligence Cockpit</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Scout Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Real-time pipeline monitoring, verified dossier dispatch, and continental talent intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/scout/reports/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Scout Report</span>
          </Link>
          <Link
            href="/scout/players/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>Register Player</span>
          </Link>
        </div>
      </div>

      {/* ─── 4 Executive Telemetry Metrics ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
            <span>Database Dossiers</span>
            <Users className="h-4 w-4 text-[#CC5500]" />
          </div>
          <div className="font-mono text-3xl font-black text-white">2,400+</div>
          <p className="text-[11px] text-slate-400 font-medium">
            Active player evaluations catalogued
          </p>
        </div>

        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
            <span>CAF Associations</span>
            <Trophy className="h-4 w-4 text-[#CC5500]" />
          </div>
          <div className="font-mono text-3xl font-black text-white">54 / 54</div>
          <p className="text-[11px] text-slate-400 font-medium">
            Full continental territorial coverage
          </p>
        </div>

        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
            <span>Active Pipelines</span>
            <FolderOpen className="h-4 w-4 text-[#CC5500]" />
          </div>
          <div className="font-mono text-3xl font-black text-white">
            {watchlists.length > 0 ? watchlists.length : "3"}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Recruitment shortlists tracked
          </p>
        </div>

        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
            <span>Scout Accreditation</span>
            <Shield className="h-4 w-4 text-[#CC5500]" />
          </div>
          <div className="font-mono text-3xl font-black text-white">Verified</div>
          <p className="text-[11px] text-slate-400 font-medium">
            Tier-1 Pro analyst clearance active
          </p>
        </div>
      </div>

      {/* ─── Spotlight Prospects Carousel / Grid ──────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Public_Sans'] text-xl font-black uppercase text-white tracking-tight">
              Spotlight African Prospects
            </h2>
            <p className="text-xs text-slate-400">
              Highest-graded dossiers recently published across continental divisions
            </p>
          </div>
          <Link
            href="/players"
            className="text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white uppercase tracking-wider flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spotlightPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-4 hover:border-[#CC5500]/50 hover:bg-[#171B23] transition-all flex items-center justify-between group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] text-[#FFB693] font-['Public_Sans'] font-black text-xs">
                  {player.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Public_Sans'] text-sm font-bold text-white group-hover:text-[#FFB693] transition-colors truncate max-w-[160px]">
                    {player.fullName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {player.primaryPositionCode ?? "Prospect"} · {player.currentClub ?? "Free agent"}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="rounded-[4px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#FFB693] border border-[#CC5500]/30">
                  {player.nationalityCode ?? "CAF"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Modular Intelligence Workspace Hubs ─────────────────────── */}
      <div className="space-y-6 pt-4 border-t border-[rgba(224,192,178,0.12)]">
        <h2 className="font-['Public_Sans'] text-xl font-black uppercase text-white tracking-tight">
          Recruitment Intelligence Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <HubCard
            href="/players"
            icon={Users}
            title="Player Intelligence Catalogue"
            description="Explore verified prospect dossiers with per-90 metrics, physical profiles, and transfer valuations."
            accent="primary"
          />
          <HubCard
            href="/scout"
            icon={Award}
            title="Scout Workspace & Reports"
            description="Draft, review, and publish standardized on-ground scouting evaluations."
            accent="primary"
          />
          <HubCard
            href="/watchlists"
            icon={FolderOpen}
            title="Talent Pipelines & Shortlists"
            description="Group scouted prospects by transfer window, position priority, and recruitment urgency."
            accent="primary"
          />
          <HubCard
            href="/leagues"
            icon={Trophy}
            title="Continental Competitions"
            description="Intelligence profiles for CAF Champions League, NPFL, PSL, Botola, and European landing leagues."
            accent="secondary"
          />
          <HubCard
            href="/fpl"
            icon={Sparkles}
            title="African Stars Fantasy Hub"
            description="Differential intelligence, xGI/90 underlying stats, and fixture swing tools."
            accent="secondary"
          />
          <HubCard
            href="/settings"
            icon={SlidersHorizontal}
            title="Scout Accreditation & Settings"
            description="Manage your verified scout profile, regional focus, and clearance tier."
            accent="secondary"
          />
        </div>
      </div>
    </div>
  );
}
