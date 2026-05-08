import { Share2, Star } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";
import { PlayerPhoto } from "./photo";

export function PlayerHero({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#1a1208] via-[#0E0A05] to-[#0B0B0B] px-6 py-6">
      {/* dim photo background */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-700/30 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5">
          <PlayerPhoto src={player.photoUrl} name={player.fullName} size={80} rounded="xl" />

          <div className="space-y-1.5">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-white">
              {player.fullName}
            </h1>
            <p className="font-mono text-xs text-zinc-400">
              {player.position} · {player.club} · {player.league}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1.5 font-mono text-[11px] text-zinc-500">
              <span>{player.age} yrs</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>{player.heightCm} cm</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span className="capitalize">{player.preferredFoot} foot</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < 1 ? "fill-orange-500 text-orange-500" : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-zinc-300 hover:bg-white/10 transition-colors"
          >
            <Share2 className="h-3 w-3" />
            Share card
          </button>
          <div className="grid grid-cols-4 gap-6 font-mono text-right">
            {[
              { label: "Apps", value: player.appearances },
              { label: "Goals", value: player.goals },
              { label: "Assists", value: player.assists },
              { label: "Rating", value: player.rating.toFixed(2) },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold tabular-nums text-white">{s.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
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
