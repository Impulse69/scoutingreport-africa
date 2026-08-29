import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Shield,
  Star,
  Activity,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { POSITIONS, CAF_COUNTRIES } from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "African Football Talent Catalogue",
  description:
    "Search scouted African footballers by position, age, nationality, physical metrics, and verified ratings.",
};

function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
}

function flagFor(code: string | null): string {
  if (!code) return "⚽";
  return CAF_COUNTRIES.find((c) => c.code === code)?.flagEmoji ?? "⚽";
}

function countryName(code: string | null): string {
  if (!code) return "African Talent";
  return CAF_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pos?: string; nat?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const players = await listPublishedPlayers(200);

  const q = (sp.q ?? "").trim().toLowerCase();
  const filtered = players.filter((p) => {
    if (sp.pos && p.primaryPositionCode !== sp.pos) return false;
    if (sp.nat && p.nationalityCode !== sp.nat) return false;
    if (q && !p.fullName.toLowerCase().includes(q) && !countryName(p.nationalityCode).toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <Users className="h-3.5 w-3.5" /> Intelligence Catalogue
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Scouted African Talents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Verified player dossiers across all 54 CAF national associations, domestic divisions, and diaspora landing leagues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scout/reports/new"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all"
          >
            Submit Report
          </Link>
          <Link
            href="/watchlists"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all"
          >
            My Watchlists
          </Link>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1218]/90 p-4 sm:p-6 space-y-4 shadow-xl">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Text Input */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Search by player name or keyword…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Position Selector */}
          <div className="lg:col-span-3">
            <select
              name="pos"
              defaultValue={sp.pos ?? ""}
              className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-[#121921] text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">All Tactical Positions</option>
              {POSITIONS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Nationality Selector */}
          <div className="lg:col-span-3">
            <select
              name="nat"
              defaultValue={sp.nat ?? ""}
              className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-[#121921] text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">All CAF Nationalities (54)</option>
              {CAF_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div className="lg:col-span-1 flex items-center gap-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </form>

        {/* Quick Position Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] uppercase font-bold text-slate-400 mr-1">Position Shortcuts:</span>
          {[
            { label: "All", pos: "" },
            { label: "Strikers (FW)", pos: "FW" },
            { label: "Wingers (LW/RW)", pos: "RW" },
            { label: "Central Mids (CM)", pos: "CM" },
            { label: "Defensive Mids (DM)", pos: "DM" },
            { label: "Center Backs (CB)", pos: "CB" },
            { label: "Full Backs (RB/LB)", pos: "RB" },
            { label: "Goalkeepers (GK)", pos: "GK" },
          ].map((item) => {
            const isActive = (sp.pos ?? "") === item.pos;
            const queryParams = new URLSearchParams();
            if (sp.q) queryParams.set("q", sp.q);
            if (item.pos) queryParams.set("pos", item.pos);
            if (sp.nat) queryParams.set("nat", sp.nat);

            return (
              <Link
                key={item.label}
                href={`/players?${queryParams.toString()}`}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                    : "bg-[#121921] hover:bg-white/10 text-slate-300 border border-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-bold text-white">{filtered.length}</span> talent dossiers
        </span>
        {(sp.q || sp.pos || sp.nat) && (
          <Link
            href="/players"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            Clear Active Filters ✕
          </Link>
        )}
      </div>

      {/* Players Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q || sp.pos || sp.nat ? "No players match your filters" : "No published players yet"}
          description={
            q || sp.pos || sp.nat
              ? "Try broadening your nationality or position filters, or use omni-search (⌘K) to scan global clubs."
              : "Scouts have not published dossiers yet. Be the first to submit a scouting evaluation."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const flag = flagFor(p.nationalityCode);
            const country = countryName(p.nationalityCode);
            const pos = positionLabel(p.primaryPositionCode);

            return (
              <Link
                key={p.id}
                href={`/players/${p.slug}`}
                className="group rounded-3xl border border-white/10 bg-[#0c1218] p-5 hover:border-emerald-500/40 hover:bg-[#111a22] transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  {/* Photo / Avatar */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.fullName}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-base font-black text-emerald-400/80 bg-gradient-to-br from-[#121921] to-[#0c1218]">
                        {p.fullName
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{flag}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {p.primaryPositionCode ?? "PL"}
                      </span>
                    </div>

                    <h2 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                      {p.fullName}
                    </h2>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {p.currentClub ?? "Free agent"}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="truncate">{country}</span>
                    <span>·</span>
                    <span className="text-[11px] text-slate-400 font-medium">{pos}</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Dossier <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
