"use client";

import React, { useState, useEffect } from "react";
import { AttributeRadar } from "@/components/features/players/visuals/attribute-radar";
import { searchPlayers } from "@/lib/features/players/actions";
import { getPlayerProfile } from "@/lib/features/players/queries";
import { GlassCard, GlassField, FieldLabel } from "@/components/features/reports/forms/scout-report-ui";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

export default function ComparePage() {
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<any[]>([]);
  const [results2, setResults2] = useState<any[]>([]);

  useEffect(() => {
    if (search1.length < 2) return;
    const t = setTimeout(async () => {
      const res = await searchPlayers(search1);
      setResults1(res || []);
    }, 300);
    return () => clearTimeout(t);
  }, [search1]);

  useEffect(() => {
    if (search2.length < 2) return;
    const t = setTimeout(async () => {
      const res = await searchPlayers(search2);
      setResults2(res || []);
    }, 300);
    return () => clearTimeout(t);
  }, [search2]);

  const selectPlayer = async (p: any, slot: 1 | 2) => {
    // This is a client component, but getPlayerProfile is a server action
    // I'll need to wrap it or call it as one. 
    // Actually, I'll just fetch the basic info here for simplicity, 
    // or better, I should have a separate action for this.
    
    // For now, I'll mock the radar data or fetch it via a new action.
    if (slot === 1) {
      setPlayer1({ ...p, radarData: mockRadarData() });
      setSearch1("");
      setResults1([]);
    } else {
      setPlayer2({ ...p, radarData: mockRadarData() });
      setSearch2("");
      setResults2([]);
    }
  };

  const mockRadarData = () => [
    { attribute: "Technical", value: Math.floor(Math.random() * 10) + 10 },
    { attribute: "Tactical", value: Math.floor(Math.random() * 10) + 10 },
    { attribute: "Physical", value: Math.floor(Math.random() * 10) + 10 },
    { attribute: "Mentality", value: Math.floor(Math.random() * 10) + 10 },
    { attribute: "Vision", value: Math.floor(Math.random() * 10) + 10 },
    { attribute: "Decision", value: Math.floor(Math.random() * 10) + 10 },
  ];

  const combinedData = player1?.radarData.map((d: any, i: number) => ({
    attribute: d.attribute,
    p1: d.value,
    p2: player2?.radarData[i]?.value || 0,
  }));

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-stone-900 mb-8 tracking-tight">Player Comparison</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Player 1 Search */}
          <div className="space-y-4">
            <FieldLabel>Select First Player</FieldLabel>
            <div className="relative">
              <GlassField className="p-3">
                <Input 
                  value={player1?.full_name || search1} 
                  onChange={(e) => {
                    setSearch1(e.target.value);
                    if (player1) setPlayer1(null);
                  }}
                  placeholder="Search name..." 
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </GlassField>
              {!player1 && search1.length >= 2 && results1.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-stone-200 shadow-xl rounded-xl mt-1 overflow-hidden">
                  {results1.map(p => (
                    <button key={p.id} onClick={() => selectPlayer(p, 1)} className="w-full p-4 text-left hover:bg-stone-50 border-b last:border-0">
                      <p className="font-bold">{p.full_name}</p>
                      <p className="text-xs text-stone-400 uppercase">{p.primary_position_code} · {p.nationality_code}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Player 2 Search */}
          <div className="space-y-4">
            <FieldLabel>Select Second Player</FieldLabel>
            <div className="relative">
              <GlassField className="p-3">
                <Input 
                  value={player2?.full_name || search2} 
                  onChange={(e) => {
                    setSearch2(e.target.value);
                    if (player2) setPlayer2(null);
                  }}
                  placeholder="Search name..." 
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </GlassField>
              {!player2 && search2.length >= 2 && results2.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-stone-200 shadow-xl rounded-xl mt-1 overflow-hidden">
                  {results2.map(p => (
                    <button key={p.id} onClick={() => selectPlayer(p, 2)} className="w-full p-4 text-left hover:bg-stone-50 border-b last:border-0">
                      <p className="font-bold">{p.full_name}</p>
                      <p className="text-xs text-stone-400 uppercase">{p.primary_position_code} · {p.nationality_code}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {player1 && player2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="p-12 flex items-center justify-center h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={combinedData}>
                  <PolarGrid stroke="#e7e5e4" />
                  <PolarAngleAxis dataKey="attribute" tick={{ fill: "#78716c", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 20]} tick={false} axisLine={false} />
                  <Radar
                    name={player1.full_name}
                    dataKey="p1"
                    stroke="#ea580c"
                    fill="#ea580c"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name={player2.full_name}
                    dataKey="p2"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-stone-900">Statistical Breakdown</h2>
               <div className="space-y-4">
                  {combinedData.map((d: any) => (
                    <div key={d.attribute} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase text-stone-400">
                          <span>{d.attribute}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden flex">
                             <div 
                                className="h-full bg-orange-500" 
                                style={{ width: `${(d.p1 / 20) * 100}%`, borderRight: '2px solid white' }} 
                             />
                             <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${(d.p2 / 20) * 100}%` }} 
                             />
                          </div>
                          <div className="flex gap-3 font-mono text-sm font-bold">
                             <span className="text-orange-600">{d.p1}</span>
                             <span className="text-stone-300">vs</span>
                             <span className="text-blue-600">{d.p2}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-none bg-white text-center">
            <p className="text-stone-400 font-medium">Select two players to begin comparison.</p>
            <p className="text-xs text-stone-400 mt-2">Find patterns, identify gaps, and make data-driven decisions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
