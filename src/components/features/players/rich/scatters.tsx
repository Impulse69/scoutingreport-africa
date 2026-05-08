"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
  ZAxis,
} from "recharts";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";

export function LeagueDistribution({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            League Distribution
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-600">La Liga</p>
        </div>
        <button className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-cyan-300">
          Compare
        </button>
      </header>

      <div className="h-[260px] px-6 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="tackles"
              type="number"
              name="Tackles per 90"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              label={{
                value: "Tackles per 90",
                fill: "rgba(255,255,255,0.4)",
                fontSize: 10,
                position: "insideBottom",
                offset: -5,
              }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis
              dataKey="interceptions"
              type="number"
              name="Interceptions per 90"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              label={{
                value: "Interceptions per 90",
                fill: "rgba(255,255,255,0.4)",
                fontSize: 10,
                angle: -90,
                position: "insideLeft",
              }}
              stroke="rgba(255,255,255,0.1)"
            />
            <ZAxis dataKey="size" range={[40, 120]} />
            <Scatter data={player.leagueDistribution}>
              {player.leagueDistribution.map((d, i) => (
                <Cell key={i} fill={d.player ? "#06b6d4" : "rgba(255,255,255,0.18)"} />
              ))}
              <LabelList
                dataKey="label"
                position="top"
                fill="#06b6d4"
                fontSize={10}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function PositionalScatter({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Positional Profile
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-600">
            Relative to GKs in La Liga
          </p>
        </div>
        <button className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-300 hover:bg-white/10 transition-colors">
          Filters
        </button>
      </header>

      <div className="h-[260px] px-6 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="saves"
              type="number"
              name="Saves per 90"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              label={{
                value: "Saves per 90",
                fill: "rgba(255,255,255,0.4)",
                fontSize: 10,
                position: "insideBottom",
                offset: -5,
              }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis
              dataKey="cleanSheets"
              type="number"
              name="Clean Sheets"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              label={{
                value: "Clean Sheets",
                fill: "rgba(255,255,255,0.4)",
                fontSize: 10,
                angle: -90,
                position: "insideLeft",
              }}
              stroke="rgba(255,255,255,0.1)"
            />
            <ZAxis dataKey="size" range={[40, 120]} />
            <Scatter data={player.positionalScatter}>
              {player.positionalScatter.map((d, i) => (
                <Cell key={i} fill={d.player ? "#06b6d4" : "rgba(255,255,255,0.18)"} />
              ))}
              <LabelList
                dataKey="label"
                position="top"
                fill="#06b6d4"
                fontSize={10}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
