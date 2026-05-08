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
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Most selected XI
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Most-frequent starter at each slot · 2025/2026
          </p>
        </div>
        <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300">
          {formation.code}
        </span>
      </div>

      {/* Stat tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-6 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mr-2">
          Stat
        </span>
        {STATS.map((s) => {
          const Icon = s.icon;
          const active = statKey === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStatKey(s.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "text-zinc-400 border border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3 w-3" />
              {s.label}
            </button>
          );
        })}
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          More <ChevronDown className="h-3 w-3" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono uppercase tracking-wider">Per 90</span>
          <button
            type="button"
            role="switch"
            aria-checked={per90}
            onClick={() => setPer90((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              per90 ? "bg-cyan-500" : "bg-white/10"
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
    <div className="relative mx-auto my-6 aspect-[3/4] w-full max-w-[640px] overflow-hidden rounded-lg border border-white/5 bg-[#0A0F0A]">
      {/* Pitch lines */}
      <svg
        viewBox="0 0 100 133"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="100" height="133" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
        {/* halfway line */}
        <line x1="0" y1="66.5" x2="100" y2="66.5" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        {/* center circle */}
        <circle cx="50" cy="66.5" r="9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        <circle cx="50" cy="66.5" r="0.5" fill="rgba(255,255,255,0.15)" />
        {/* boxes */}
        <rect x="22" y="0" width="56" height="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        <rect x="36" y="0" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        <rect x="22" y="119" width="56" height="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        <rect x="36" y="127" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        {/* grid hint */}
        <pattern id="grid" width="6.66" height="6.66" patternUnits="userSpaceOnUse">
          <path d="M 6.66 0 L 0 0 0 6.66" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.2" />
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
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/15 bg-stone-200">
                {player.photoUrl ? (
                  <Image src={player.photoUrl} alt={player.shortName} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-xs font-bold text-stone-700">
                    {player.shortName.slice(0, 2)}
                  </div>
                )}
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#0E0E0E] font-mono text-[9px] font-bold text-white">
                {player.shirtNumber}
              </span>
            </div>
            <p className="font-mono text-[11px] font-semibold text-white">{player.shortName}</p>
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                isHi
                  ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border border-white/10 bg-black/40 text-zinc-400"
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
