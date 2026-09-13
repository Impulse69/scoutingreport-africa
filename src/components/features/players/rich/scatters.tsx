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
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="font-mono text-[10px]  tracking-wide text-muted-foreground">
            League Distribution
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">La Liga</p>
        </div>
        <button className="rounded border border-border bg-muted px-2.5 py-1 font-mono text-[10px]  text-primary">
          Compare
        </button>
      </header>

      <div className="h-[260px] px-6 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
            <CartesianGrid stroke="var(--border)" />
            <XAxis
              dataKey="tackles"
              type="number"
              name="Tackles per 90"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              label={{
                value: "Tackles per 90",
                fill: "var(--muted-foreground)",
                fontSize: 10,
                position: "insideBottom",
                offset: -5,
              }}
              stroke="var(--border)"
            />
            <YAxis
              dataKey="interceptions"
              type="number"
              name="Interceptions per 90"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              label={{
                value: "Interceptions per 90",
                fill: "var(--muted-foreground)",
                fontSize: 10,
                angle: -90,
                position: "insideLeft",
              }}
              stroke="var(--border)"
            />
            <ZAxis dataKey="size" range={[40, 120]} />
            <Scatter data={player.leagueDistribution}>
              {player.leagueDistribution.map((d, i) => (
                <Cell key={i} fill={d.player ? "var(--primary)" : "var(--muted-foreground)"} />
              ))}
              <LabelList
                dataKey="label"
                position="top"
                fill="var(--primary)"
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
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="font-mono text-[10px]  tracking-wide text-muted-foreground">
            Positional Profile
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            Relative to GKs in La Liga
          </p>
        </div>
        <button className="rounded border border-border bg-muted px-2.5 py-1 font-mono text-[10px]  text-muted-foreground hover:bg-muted transition-colors">
          Filters
        </button>
      </header>

      <div className="h-[260px] px-6 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
            <CartesianGrid stroke="var(--border)" />
            <XAxis
              dataKey="saves"
              type="number"
              name="Saves per 90"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              label={{
                value: "Saves per 90",
                fill: "var(--muted-foreground)",
                fontSize: 10,
                position: "insideBottom",
                offset: -5,
              }}
              stroke="var(--border)"
            />
            <YAxis
              dataKey="cleanSheets"
              type="number"
              name="Clean Sheets"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              label={{
                value: "Clean Sheets",
                fill: "var(--muted-foreground)",
                fontSize: 10,
                angle: -90,
                position: "insideLeft",
              }}
              stroke="var(--border)"
            />
            <ZAxis dataKey="size" range={[40, 120]} />
            <Scatter data={player.positionalScatter}>
              {player.positionalScatter.map((d, i) => (
                <Cell key={i} fill={d.player ? "var(--primary)" : "var(--muted-foreground)"} />
              ))}
              <LabelList
                dataKey="label"
                position="top"
                fill="var(--primary)"
                fontSize={10}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
