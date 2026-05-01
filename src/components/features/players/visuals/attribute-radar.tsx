"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface AttributeRadarProps {
  data: {
    attribute: string;
    value: number;
    fullMark: number;
  }[];
  label?: string;
}

export function AttributeRadar({ data, label = "Player" }: AttributeRadarProps) {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e7e5e4" />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: "#57534e", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 20]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name={label}
            dataKey="value"
            stroke="#ea580c"
            fill="#fb923c"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
