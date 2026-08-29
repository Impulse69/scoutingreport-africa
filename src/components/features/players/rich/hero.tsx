import { Share2, Star, Sparkles, BookmarkPlus, Shield } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";
import { PlayerPhoto } from "./photo";
import Link from "next/link";

export function PlayerHero({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="relative overflow-hidden rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] px-6 sm:px-8 py-8 shadow-xl font-['Inter']">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative shrink-0 overflow-hidden rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] shadow-md">
            <PlayerPhoto src={player.photoUrl} name={player.fullName} size={96} rounded="md" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-['Public_Sans'] text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                {player.fullName}
              </h1>
              <span className="rounded-[3px] border border-[#CC5500]/40 bg-[#CC5500]/15 px-2.5 py-0.5 text-[10px] font-['Public_Sans'] font-black uppercase tracking-wider text-[#FFB693]">
                {player.position}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {player.club} · <span className="text-slate-400">{player.league}</span> · <span className="text-[#FFB693] font-bold">{player.nationality}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="text-white font-bold">{player.age} yrs</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>{player.heightCm} cm</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="capitalize">{player.preferredFoot} foot</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[#FFB693] font-bold">{player.estimatedProfile}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/watchlists"
              className="flex items-center gap-1.5 rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#171B23] px-3.5 py-2 text-xs font-['Public_Sans'] font-bold text-slate-200 hover:bg-[#1E232D] hover:text-white transition-all"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-[#CC5500]" />
              Track in Watchlist
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4 sm:gap-6 text-center sm:text-right p-4 rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.08)]">
            {[
              { label: "Apps", value: player.appearances },
              { label: "Goals", value: player.goals },
              { label: "Assists", value: player.assists },
              { label: "Rating", value: player.rating.toFixed(1) },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <p className="font-mono text-base font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
