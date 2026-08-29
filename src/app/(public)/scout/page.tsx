import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listMyReports, listLatestPublishedReports, type ReportWithJoins } from "@/lib/features/reports/queries";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = {
  title: "Scout Department Workspace · ScoutingReport Africa",
  description: "Draft, verify, and publish standardized African football scouting dossiers.",
};

export default async function ScoutWorkspacePage() {
  const user = await getCurrentUser();
  const draftReports = user ? await listMyReports(user.id, "draft") : [];
  const recentPublished: ReportWithJoins[] = await listLatestPublishedReports(10);
  const players = await listPublishedPlayers(12);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-10 font-['Inter']">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(224,192,178,0.12)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
            <Award className="h-3.5 w-3.5 text-[#CC5500]" />
            <span>Kinetic Archive Scout Department</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Scouting Operations & Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Evaluate, rate, and verify tactical abilities for prospects across all 54 African national associations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scout/reports/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Report</span>
          </Link>
          <Link
            href="/scout/players/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>Register Player</span>
          </Link>
        </div>
      </div>

      {/* 3 Steps Pipeline Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-[#CC5500]">PHASE 01</span>
            <Users className="h-4 w-4 text-[#FFB693]" />
          </div>
          <h3 className="font-['Public_Sans'] text-sm font-extrabold text-white uppercase">
            Register or Select Prospect
          </h3>
          <p className="text-xs text-slate-400">
            Identify the talent, verify their CAF federation, date of birth, primary role, and club affiliation.
          </p>
        </div>

        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-[#CC5500]">PHASE 02</span>
            <FileText className="h-4 w-4 text-[#FFB693]" />
          </div>
          <h3 className="font-['Public_Sans'] text-sm font-extrabold text-white uppercase">
            Live Match Observation
          </h3>
          <p className="text-xs text-slate-400">
            Record minutes watched, competitive match context, weather conditions, and opponent strength.
          </p>
        </div>

        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-[#CC5500]">PHASE 03</span>
            <Award className="h-4 w-4 text-[#FFB693]" />
          </div>
          <h3 className="font-['Public_Sans'] text-sm font-extrabold text-white uppercase">
            Standardized Grading
          </h3>
          <p className="text-xs text-slate-400">
            Score technical, tactical, physical, and mentality sub-attributes to produce a verified recruitment score.
          </p>
        </div>
      </div>

      {/* Main Workspace Split: My Drafts & Published Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Player Picker */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Public_Sans'] text-lg font-black uppercase text-white tracking-tight">
              Start Evaluation on Prospect
            </h2>
            <Link
              href="/players"
              className="text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white"
            >
              Browse All →
            </Link>
          </div>

          <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] divide-y divide-[rgba(224,192,178,0.06)] max-h-[460px] overflow-y-auto">
            {players.map((p) => (
              <div
                key={p.id}
                className="p-3.5 flex items-center justify-between hover:bg-[#171B23] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] text-[#FFB693] font-mono text-xs font-black">
                    {p.primaryPositionCode ?? "PL"}
                  </div>
                  <div>
                    <div className="font-['Public_Sans'] text-xs font-bold text-white group-hover:text-[#FFB693] transition-colors">
                      {p.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {p.currentClub ?? "Free agent"} · {p.nationalityCode ?? "CAF"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/scout/reports/new?player=${p.id}`}
                  className="px-3 py-1 rounded-[4px] bg-[#CC5500]/20 hover:bg-[#CC5500]/30 text-[#FFB693] border border-[#CC5500]/40 font-['Public_Sans'] text-[11px] font-bold uppercase tracking-wider transition-all"
                >
                  Write Report
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Published Reports Feed */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Public_Sans'] text-lg font-black uppercase text-white tracking-tight">
              Recently Published Evaluations
            </h2>
            <span className="font-mono text-xs text-slate-400">
              {recentPublished.length} Reports Logged
            </span>
          </div>

          <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] divide-y divide-[rgba(224,192,178,0.06)] max-h-[460px] overflow-y-auto">
            {recentPublished.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <FileText className="h-8 w-8 mx-auto text-slate-500 mb-2" />
                <p className="font-['Public_Sans'] text-sm font-bold text-white">No published evaluations yet</p>
                <p className="text-xs text-slate-400">
                  Be the first scout to submit and publish an evaluation dossier.
                </p>
              </div>
            ) : (
              recentPublished.map((report: ReportWithJoins) => {
                const totalRatings = report.ratings.map((r) => r.rating).filter(Boolean);
                const avgRating = totalRatings.length > 0 ? (totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length).toFixed(1) : "—";
                return (
                  <div key={report.id} className="p-4 hover:bg-[#171B23] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#FFB693] font-bold">
                        {report.match_date ?? "Live Observation"}
                      </span>
                      <span className="text-xs font-mono font-black text-white bg-[#0C0E12] px-2 py-0.5 rounded-[3px] border border-[rgba(224,192,178,0.1)]">
                        Grade: {avgRating}
                      </span>
                    </div>
                    <h4 className="font-['Public_Sans'] text-sm font-bold text-white mt-1">
                      {report.player?.full_name ?? "Prospect Dossier"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {report.projection || report.recommendation_notes || "Comprehensive technical evaluation."}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
