"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { TeamStyleAttribute } from "@/lib/features/teams/mock";

type Props = {
  attributes: TeamStyleAttribute[];
  styleTags: string[];
};

export function TeamProfileRadar({ attributes, styleTags }: Props) {
  const data = attributes.map((a) => ({ attribute: a.label, value: a.value, fullMark: 100 }));

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Team Profile
        </p>
      </header>

      <div className="px-6 py-4">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="78%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="attribute"
                tick={{
                  fill: "rgba(255,255,255,0.55)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Style"
                dataKey="value"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {styleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
