import { Share2, Star, Sparkles, BookmarkPlus, Shield } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";
import { PlayerPhoto } from "./photo";
import Link from "next/link";

export function PlayerHero({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e171f] via-[#0b1116] to-[#080c10] px-6 sm:px-8 py-8 shadow-2xl">
      {/* Dim ambient glow background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-slate-900 shadow-xl">
            <PlayerPhoto src={player.photoUrl} name={player.fullName} size={96} rounded="xl" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {player.fullName}
              </h1>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {player.position}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {player.club} · <span className="text-slate-400">{player.league}</span> · <span className="text-emerald-400 font-bold">{player.nationality}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="text-white font-bold">{player.age} yrs</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>{player.heightCm} cm</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="capitalize">{player.preferredFoot} foot</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-amber-400 font-bold">{player.estimatedProfile}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/watchlists"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-amber-400" />
              Track in Watchlist
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4 sm:gap-6 text-center sm:text-right p-4 rounded-2xl bg-[#080d12]/90 border border-white/5 shadow-inner">
            {[
              { label: "Apps", value: player.appearances },
              { label: "Goals", value: player.goals },
              { label: "Assists", value: player.assists },
              { label: "Rating", value: player.rating.toFixed(2), highlight: true },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-xl sm:text-2xl font-mono font-black tabular-nums ${s.highlight ? "text-emerald-400" : "text-white"}`}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
