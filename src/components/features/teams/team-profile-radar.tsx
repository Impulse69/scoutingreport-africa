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
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-6 py-4">
        <p className="text-sm font-semibold text-foreground">
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
                stroke="#1D4ED8"
                fill="#1D4ED8"
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
              className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
