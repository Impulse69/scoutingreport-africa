"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Activity,
  Crosshair,
  Star,
  Clock,
  Target,
  Zap,
  PenLine,
  ChevronDown,
} from "lucide-react";
import type { Formation, SquadPlayer } from "@/lib/features/teams/mock";

type StatKey = "goals" | "assists" | "rating" | "minutes" | "xg" | "shots" | "keyPasses";
type Stat = { key: StatKey; label: string; icon: typeof Activity; format: (p: SquadPlayer, per90: boolean) => string; highlight: (p: SquadPlayer) => boolean };

const STATS: Stat[] = [
  {
    key: "goals",
    label: "Goals",
    icon: Activity,
    format: (p, per90) =>
      per90 && p.minutes > 0 ? ((p.goals / p.minutes) * 90).toFixed(2) : `${p.goals}`,
    highlight: (p) => p.goals > 10,
  },
  {
    key: "assists",
    label: "Assists",
    icon: PenLine,
    format: (p, per90) =>
      per90 && p.minutes > 0 ? ((p.assists / p.minutes) * 90).toFixed(2) : `${p.assists}`,
    highlight: (p) => p.assists > 4,
  },
  {
    key: "rating",
    label: "Rating",
    icon: Star,
    format: (p) => p.rating.toFixed(2),
    highlight: (p) => p.rating > 7.5,
  },
  {
    key: "minutes",
    label: "Minutes",
    icon: Clock,
    format: (p) => `${p.minutes}'`,
    highlight: (p) => p.minutes > 1500,
  },
  {
    key: "xg",
    label: "xG",
    icon: Crosshair,
    format: (p, per90) =>
      per90 && p.minutes > 0 ? ((p.xg / p.minutes) * 90).toFixed(2) : p.xg.toFixed(1),
    highlight: (p) => p.xg > 8,
  },
  {
    key: "shots",
    label: "Shots",
    icon: Target,
    format: (p, per90) =>
      per90 && p.minutes > 0 ? ((p.shots / p.minutes) * 90).toFixed(2) : `${p.shots}`,
    highlight: (p) => p.shots > 30,
  },
  {
    key: "keyPasses",
    label: "Key Pass",
    icon: Zap,
    format: (p, per90) =>
      per90 && p.minutes > 0
        ? ((p.keyPasses / p.minutes) * 90).toFixed(2)
        : `${p.keyPasses}`,
    highlight: (p) => p.keyPasses > 15,
  },
];

export function MostSelectedXI({ formation }: { formation: Formation }) {
  const [statKey, setStatKey] = useState<StatKey>("goals");
  const [per90, setPer90] = useState(false);
  const stat = STATS.find((s) => s.key === statKey)!;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0c1218] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Tactical Formation & Starters
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Most selected tactical XI lineup · Season 2025/2026
          </p>
        </div>
        <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
          {formation.code}
        </span>
      </div>

      {/* Stat tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-6 py-3 bg-[#0a0e13]">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-2">
          Metric:
        </span>
        {STATS.map((s) => {
          const Icon = s.icon;
          const active = statKey === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStatKey(s.key)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 border border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Per 90</span>
          <button
            type="button"
            role="switch"
            aria-checked={per90}
            onClick={() => setPer90((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              per90 ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                per90 ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Pitch */}
      <Pitch formation={formation} stat={stat} per90={per90} />
    </section>
  );
}

function Pitch({ formation, stat, per90 }: { formation: Formation; stat: Stat; per90: boolean }) {
  return (
    <div className="relative mx-auto my-6 aspect-[3/4] w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#070e0a]">
      {/* Pitch lines */}
      <svg
        viewBox="0 0 100 133"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="100" height="133" fill="transparent" stroke="rgba(16,185,129,0.2)" strokeWidth="0.4" />
        {/* halfway line */}
        <line x1="0" y1="66.5" x2="100" y2="66.5" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        {/* center circle */}
        <circle cx="50" cy="66.5" r="9" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        <circle cx="50" cy="66.5" r="0.5" fill="rgba(16,185,129,0.4)" />
        {/* boxes */}
        <rect x="22" y="0" width="56" height="14" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        <rect x="36" y="0" width="28" height="6" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        <rect x="22" y="119" width="56" height="14" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        <rect x="36" y="127" width="28" height="6" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
        {/* grid hint */}
        <pattern id="grid" width="6.66" height="6.66" patternUnits="userSpaceOnUse">
          <path d="M 6.66 0 L 0 0 0 6.66" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="0.2" />
        </pattern>
        <rect width="100" height="133" fill="url(#grid)" />
      </svg>

      {/* Players */}
      {formation.slots.map(({ player, x, y }) => {
        const value = stat.format(player, per90);
        const isHi = stat.highlight(player);
        return (
          <div
            key={player.id}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-emerald-500/40 bg-slate-800 shadow-md">
                {player.photoUrl ? (
                  <Image src={player.photoUrl} alt={player.shortName} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-xs font-black text-emerald-300">
                    {player.shortName.slice(0, 2)}
                  </div>
                )}
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#0c1218] font-mono text-[9px] font-bold text-white shadow-sm">
                {player.shirtNumber}
              </span>
            </div>
            <p className="text-[11px] font-bold text-white drop-shadow-md">{player.shortName}</p>
            <span
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                isHi
                  ? "border border-amber-500/50 bg-amber-500/20 text-amber-300"
                  : "border border-white/10 bg-black/70 text-slate-300"
              }`}
            >
              <stat.icon className="h-2.5 w-2.5" />
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
