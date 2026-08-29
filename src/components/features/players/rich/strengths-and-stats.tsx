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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Tactical & Physical Superpowers
        </p>
        <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFB693] border border-[#CC5500]/30">
          Scout Index
        </span>
      </header>

      <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-4">
          {data.map((s) => (
            <li key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{s.label}</span>
                <span className="font-mono font-bold tabular-nums text-[#FFB693]">{s.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1E232D] overflow-hidden rounded-none">
                <div
                  className="h-full bg-gradient-to-r from-[#9C3F00] to-[#CC5500]"
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
              <PolarGrid stroke="rgba(224,192,178,0.12)" />
              <PolarAngleAxis
                dataKey="attr"
                stroke="#94A3B8"
                tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "Inter" }}
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
                stroke="#CC5500"
                strokeWidth={2}
                fill="#CC5500"
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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Standardized Per 90 Output
        </p>
        <span className="font-mono text-[10px] text-slate-400">vs Positional Peers</span>
      </header>

      <div className="p-6 space-y-4">
        {stats.map((st) => {
          const pct = Math.min(100, Math.round((st.value / st.max) * 100));
          return (
            <div key={st.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{st.label}</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {st.value} {st.unit ?? ""}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#1E232D] overflow-hidden rounded-none">
                <div
                  className="h-full bg-gradient-to-r from-[#8C4E2E] to-[#CC5500]"
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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Recent Match Form Trajectory
        </p>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {matches.map((m, i) => (
            <div
              key={i}
              className="rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.08)] p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-black ${
                    m.result === "W"
                      ? "bg-[#CC5500]/20 text-[#FFB693]"
                      : m.result === "D"
                      ? "bg-slate-700/40 text-slate-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {m.result}
                </span>
                <span className="font-mono text-xs font-black text-white">
                  {m.rating.toFixed(1)}
                </span>
              </div>
              <div>
                <div className="font-['Public_Sans'] text-xs font-bold text-white truncate">
                  vs {m.opponent}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
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
