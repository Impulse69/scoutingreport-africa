"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";

export function KeyStrengths({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Key Strengths
        </p>
        <button
          type="button"
          className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-300 hover:bg-white/10 transition-colors"
        >
          Goalkeeper
        </button>
      </header>

      <div className="grid gap-6 px-6 py-5 md:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-3.5">
          {player.keyStrengths.map((s) => (
            <li key={s.label}>
              <div className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-300">{s.label}</span>
                <span className="font-bold tabular-nums text-cyan-300">{s.value}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="78%"
              data={player.keyStrengths.map((s) => ({
                attr: s.label,
                value: s.value,
                fullMark: 100,
              }))}
            >
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="attr"
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                dataKey="value"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.22}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer className="border-t border-white/5 px-6 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Estimated profile{" "}
          <span className="ml-1 rounded border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-orange-400">
            {player.estimatedProfile}
          </span>
        </p>
      </footer>
    </section>
  );
}

export function PerNinetyBars({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Per 90 Performance
        </p>
        <button className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
          All Stats →
        </button>
      </header>
      <ul className="divide-y divide-white/5">
        {player.perNinetyStats.map((s) => {
          const pct = (s.value / s.max) * 100;
          return (
            <li key={s.label} className="flex items-center gap-4 px-6 py-3.5">
              <span className="w-32 shrink-0 font-mono text-xs text-zinc-300">{s.label}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-xs font-bold tabular-nums text-cyan-300">
                {s.value.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RecentForm({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Recent Form
        </p>
        <button className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
          View all →
        </button>
      </header>
      <div className="grid grid-cols-6 gap-2 px-6 py-5">
        {player.recentForm.map((m, i) => {
          const tone =
            m.result === "W"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : m.result === "D"
                ? "border-zinc-500/40 bg-zinc-500/10 text-zinc-300"
                : "border-red-500/40 bg-red-500/10 text-red-300";
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 rounded-lg border ${tone} px-2 py-2`}
              title={`vs ${m.opponent}`}
            >
              <span className="font-mono text-xs font-bold">{m.result}</span>
              <span className="font-mono text-[9px] tabular-nums">{m.rating.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/5 px-6 py-3 text-right">
        <p className="font-mono text-[11px] text-zinc-400">
          Avg{" "}
          <span className="font-bold text-cyan-300 tabular-nums">
            {(
              player.recentForm.reduce((a, b) => a + b.rating, 0) / player.recentForm.length
            ).toFixed(2)}
          </span>
        </p>
      </div>
    </section>
  );
}
