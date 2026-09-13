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
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Tactical Formation & Starters
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Most selected tactical XI lineup · Season 2025/2026
          </p>
        </div>
        <span className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {formation.code}
        </span>
      </div>

      {/* Stat tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted px-6 py-3">
        <span className="mr-2 text-xs font-medium text-muted-foreground">
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
                  ? "border border-border bg-background text-primary"
                  : "border border-transparent text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-xs font-medium text-muted-foreground">Per 90</span>
          <button
            type="button"
            role="switch"
            aria-checked={per90}
            onClick={() => setPer90((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              per90 ? "bg-primary" : "bg-border"
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
    <div className="relative mx-auto my-6 aspect-[3/4] w-full max-w-[640px] overflow-hidden rounded-lg border border-border bg-muted">
      {/* Pitch lines */}
      <svg
        viewBox="0 0 100 133"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="100" height="133" fill="transparent" stroke="#CBD5E1" strokeWidth="0.4" />
        {/* halfway line */}
        <line x1="0" y1="66.5" x2="100" y2="66.5" stroke="#CBD5E1" strokeWidth="0.3" />
        {/* center circle */}
        <circle cx="50" cy="66.5" r="9" fill="none" stroke="#CBD5E1" strokeWidth="0.3" />
        <circle cx="50" cy="66.5" r="0.5" fill="#94A3B8" />
        {/* boxes */}
        <rect x="22" y="0" width="56" height="14" fill="none" stroke="#CBD5E1" strokeWidth="0.3" />
        <rect x="36" y="0" width="28" height="6" fill="none" stroke="#CBD5E1" strokeWidth="0.3" />
        <rect x="22" y="119" width="56" height="14" fill="none" stroke="#CBD5E1" strokeWidth="0.3" />
        <rect x="36" y="127" width="28" height="6" fill="none" stroke="#CBD5E1" strokeWidth="0.3" />
        {/* grid hint */}
        <pattern id="grid" width="6.66" height="6.66" patternUnits="userSpaceOnUse">
          <path d="M 6.66 0 L 0 0 0 6.66" fill="none" stroke="#E2E8F0" strokeWidth="0.2" />
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
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-border bg-background shadow-sm">
                {player.photoUrl ? (
                  <Image src={player.photoUrl} alt={player.shortName} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                    {player.shortName.slice(0, 2)}
                  </div>
                )}
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[9px] font-semibold tabular-nums text-foreground shadow-sm">
                {player.shirtNumber}
              </span>
            </div>
            <p className="text-[11px] font-medium text-foreground">{player.shortName}</p>
            <span
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${
                isHi
                  ? "border border-primary/40 bg-primary/10 text-primary"
                  : "border border-border bg-background text-muted-foreground"
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
