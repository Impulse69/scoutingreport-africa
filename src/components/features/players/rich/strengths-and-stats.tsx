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

export function KeyStrengths({
  player,
  strengths,
}: {
  player?: RichPlayerProfile;
  strengths?: { label: string; value: number }[];
}) {
  const data = strengths ?? player?.keyStrengths ?? [];

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Tactical & Physical Superpowers
        </p>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-primary border border-border">
          Scout Index
        </span>
      </header>

      <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-4">
          {data.map((s) => (
            <li key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{s.label}</span>
                <span className="font-mono font-bold tabular-nums text-primary">{s.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted overflow-hidden rounded-none">
                <div
                  className="h-full bg-primary"
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
              data={data.map((s) => ({
                attr: s.label,
                value: s.value,
                fullMark: 100,
              }))}
            >
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="attr"
                stroke="#64748B"
                tick={{ fill: "#64748B", fontSize: 10, fontFamily: "Inter" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="transparent"
                tick={false}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#1D4ED8"
                strokeWidth={2}
                fill="#1D4ED8"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export function PerNinetyBars({
  stats,
}: {
  stats: { label: string; value: number; max: number; unit?: string }[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Standardized Per 90 Output
        </p>
        <span className="font-mono text-[10px] text-muted-foreground">vs Positional Peers</span>
      </header>

      <div className="p-6 space-y-4">
        {stats.map((st) => {
          const pct = Math.min(100, Math.round((st.value / st.max) * 100));
          return (
            <div key={st.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{st.label}</span>
                <span className="font-mono font-bold text-foreground tabular-nums">
                  {st.value} {st.unit ?? ""}
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted overflow-hidden rounded-none">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function RecentForm({
  matches,
}: {
  matches: { date: string; opponent: string; result: "W" | "D" | "L"; rating: number }[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Recent Match Form Trajectory
        </p>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {matches.map((m, i) => (
            <div
              key={i}
              className="rounded-md bg-muted border border-border p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] font-semibold ${
                    m.result === "W"
                      ? "bg-muted text-primary"
                      : m.result === "D"
                      ? "bg-muted text-muted-foreground"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {m.result}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {m.rating.toFixed(1)}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-foreground truncate">
                  vs {m.opponent}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {new Date(m.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
