"use client";

import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface PercentilePizzaProps {
  data: {
    metric: string;
    value: number; // 0-100
    category: "attacking" | "possession" | "defending";
  }[];
}

const CATEGORY_COLORS = {
  attacking: {
    stroke: "#2563eb",
    fill: "#60a5fa",
  },
  possession: {
    stroke: "#059669",
    fill: "#34d399",
  },
  defending: {
    stroke: "#dc2626",
    fill: "#f87171",
  },
};

export function PercentilePizza({ data }: PercentilePizzaProps) {
  // Sort data by category to group them visually
  const sortedData = [...data].sort((a, b) => {
    const order = { attacking: 1, possession: 2, defending: 3 };
    return order[a.category] - order[b.category];
  });

  return (
    <div className="w-full h-[400px] bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-stone-900">Performance Percentiles</h3>
        <p className="text-sm text-stone-500">Compared to league average for this position</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sortedData}>
          <PolarGrid stroke="#e7e5e4" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: "#78716c", fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: "#a8a29e", fontSize: 10 }}
            axisLine={false}
          />
          
          {/* We'll use multiple Radars or just one with dynamic fill if possible */}
          {/* For simplicity and clean look, one radar with a subtle gradient-like feel or multiple sections */}
          <Radar
            name="Percentile"
            dataKey="value"
            stroke="#ea580c"
            fill="#fb923c"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs font-medium text-stone-600">Percentile Rank</span>
        </div>
      </div>
    </div>
  );
}
