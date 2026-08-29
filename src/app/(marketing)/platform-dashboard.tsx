"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  Sparkles,
  TrendingUp,
  Flame,
  ArrowRight,
  Shield,
  Star,
  Activity,
  CheckCircle2,
  Sliders,
  Layers,
  Crosshair
} from "lucide-react";

type Prospect = {
  slug: string;
  name: string;
  age: number;
  club: string;
  league: string;
  nation: string;
  flag: string;
  position: string;
  role: string;
  rating: number;
  marketValue: string;
  attributes: {
    pace: number;
    dribbling: number;
    shooting: number;
    passing: number;
    physical: number;
    defense: number;
  };
  strengths: string[];
};

const FEATURED_PROSPECTS: Prospect[] = [
  {
    slug: "victor-boniface",
    name: "Victor Boniface",
    age: 24,
    club: "Bayer Leverkusen",
    league: "Bundesliga",
    nation: "Nigeria",
    flag: "🇳🇬",
    position: "Forward (ST)",
    role: "Complete Forward / Physical Target",
    rating: 8.6,
    marketValue: "€45,000,000",
    attributes: { pace: 85, dribbling: 88, shooting: 89, passing: 78, physical: 92, defense: 42 },
    strengths: ["Explosive Hold-up Play", "Ball-Striking Velocity", "1v1 Isolation Dominance"],
  },
  {
    slug: "mohammed-kudus",
    name: "Mohammed Kudus",
    age: 24,
    club: "West Ham United",
    league: "Premier League",
    nation: "Ghana",
    flag: "🇬🇭",
    position: "Winger (RW/AM)",
    role: "Dynamic Inside Forward",
    rating: 8.7,
    marketValue: "€50,000,000",
    attributes: { pace: 90, dribbling: 94, shooting: 84, passing: 81, physical: 86, defense: 54 },
    strengths: ["World-class Take-on Rate", "Low Center of Gravity", "Transition Drive"],
  },
  {
    slug: "lamine-camara",
    name: "Lamine Camara",
    age: 21,
    club: "AS Monaco",
    league: "Ligue 1",
    nation: "Senegal",
    flag: "🇸🇳",
    position: "Midfielder (CM/DM)",
    role: "Box-to-Box Engine",
    rating: 8.3,
    marketValue: "€18,000,000",
    attributes: { pace: 79, dribbling: 82, shooting: 77, passing: 86, physical: 84, defense: 83 },
    strengths: ["Set-piece Delivery", "Pressing Intensity", "Vertical Line-Breaking"],
  },
  {
    slug: "nicolas-jackson",
    name: "Nicolas Jackson",
    age: 23,
    club: "Chelsea",
    league: "Premier League",
    nation: "Senegal",
    flag: "🇸🇳",
    position: "Forward (ST)",
    role: "Mobile Channel Runner",
    rating: 8.2,
    marketValue: "€40,000,000",
    attributes: { pace: 88, dribbling: 84, shooting: 81, passing: 76, physical: 83, defense: 45 },
    strengths: ["Blind-side Channel Runs", "Ball-Carrying Under Pressure", "High-Volume Box Entries"],
  },
  {
    slug: "simon-adingra",
    name: "Simon Adingra",
    age: 23,
    club: "Brighton & Hove Albion",
    league: "Premier League",
    nation: "Côte d'Ivoire",
    flag: "🇨🇮",
    position: "Winger (LW/RW)",
    role: "Direct 1v1 Specialist",
    rating: 8.1,
    marketValue: "€30,000,000",
    attributes: { pace: 91, dribbling: 89, shooting: 78, passing: 77, physical: 72, defense: 48 },
    strengths: ["Bilateral Crossing", "Sudden Deceleration", "Decisive AFCON Pedigree"],
  },
];

export function PlatformDashboard() {
  const [selectedProspect, setSelectedProspect] = useState<Prospect>(FEATURED_PROSPECTS[0]);
  const [filterPos, setFilterPos] = useState<"ALL" | "ATT" | "MID">("ALL");

  const filtered = FEATURED_PROSPECTS.filter((p) => {
    if (filterPos === "ATT") return p.position.includes("Forward") || p.position.includes("Winger");
    if (filterPos === "MID") return p.position.includes("Midfielder");
    return true;
  });

  return (
    <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] overflow-hidden shadow-2xl">
      {/* Top Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[rgba(224,192,178,0.12)] bg-[#12151C] px-6 py-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 rounded-full bg-[#CC5500]" />
          <div>
            <h3 className="font-['Public_Sans'] text-sm font-extrabold uppercase tracking-wider text-white">
              Kinetic Evaluation Matrix
            </h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Live Positional Benchmark & Technical Split (2025/2026 Season)
            </p>
          </div>
        </div>

        {/* Position Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-[6px] bg-[#0C0E12] p-1 border border-[rgba(224,192,178,0.1)] font-['Public_Sans'] text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setFilterPos("ALL")}
            className={`rounded-[4px] px-3 py-1 transition-all ${
              filterPos === "ALL"
                ? "bg-[#CC5500] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Roles
          </button>
          <button
            type="button"
            onClick={() => setFilterPos("ATT")}
            className={`rounded-[4px] px-3 py-1 transition-all ${
              filterPos === "ATT"
                ? "bg-[#CC5500] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attackers
          </button>
          <button
            type="button"
            onClick={() => setFilterPos("MID")}
            className={`rounded-[4px] px-3 py-1 transition-all ${
              filterPos === "MID"
                ? "bg-[#CC5500] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Midfielders
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Prospect Selector List */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[rgba(224,192,178,0.12)] bg-[#12151C]/60 p-4 space-y-2">
          <div className="px-2 py-1 text-[10px] font-['Public_Sans'] font-black uppercase tracking-widest text-[#FFB693]">
            Select Scouted Prospect
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((p) => {
              const active = selectedProspect.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedProspect(p)}
                  className={`w-full text-left rounded-[6px] p-3.5 transition-all border ${
                    active
                      ? "border-[#CC5500]/60 bg-[#171B23] shadow-md"
                      : "border-transparent bg-[#0C0E12] hover:bg-[#151820]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{p.flag}</span>
                      <div>
                        <div className="font-['Public_Sans'] text-sm font-extrabold text-white">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {p.club} · {p.league}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end font-mono text-xs font-black text-[#FFB693]">
                        <Star className="h-3 w-3 fill-[#CC5500] text-[#CC5500]" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {p.marketValue}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Prospect Tactical Breakdown */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0C0E12] flex flex-col justify-between space-y-6">
          {/* Top Profile Strip */}
          <div className="space-y-3 pb-5 border-b border-[rgba(224,192,178,0.1)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedProspect.flag}</span>
                  <span className="rounded-[4px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693] border border-[#CC5500]/30">
                    {selectedProspect.position}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Age {selectedProspect.age}</span>
                </div>
                <h4 className="font-['Public_Sans'] text-2xl font-black text-white mt-1">
                  {selectedProspect.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedProspect.role} · {selectedProspect.club} ({selectedProspect.league})
                </p>
              </div>

              <div className="flex flex-col items-end">
                <div className="rounded-[6px] border border-[#CC5500]/40 bg-[#CC5500]/10 px-3.5 py-1.5 text-center">
                  <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
                    Scout Grade
                  </div>
                  <div className="font-mono text-xl font-black text-white">
                    {selectedProspect.rating.toFixed(1)} / 10
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Percentile Bars */}
          <div className="space-y-3">
            <div className="text-[10px] font-['Public_Sans'] font-black uppercase tracking-widest text-slate-400">
              Positional Percentile vs Continental Benchmark
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {[
                { label: "Pace & Acceleration", val: selectedProspect.attributes.pace },
                { label: "1v1 Dribbling & Ball Carry", val: selectedProspect.attributes.dribbling },
                { label: "Finishing & Ball Striking", val: selectedProspect.attributes.shooting },
                { label: "Key Passes & Chance Creation", val: selectedProspect.attributes.passing },
                { label: "Physical Duels & Stamina", val: selectedProspect.attributes.physical },
                { label: "Defensive Engagement", val: selectedProspect.attributes.defense },
              ].map((attr) => (
                <div key={attr.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{attr.label}</span>
                    <span className="font-mono font-bold text-[#FFB693]">{attr.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-none bg-[#1E232D] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9C3F00] to-[#CC5500]"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Scouted Strengths */}
          <div className="space-y-2 pt-4 border-t border-[rgba(224,192,178,0.1)]">
            <div className="text-[10px] font-['Public_Sans'] font-black uppercase tracking-widest text-slate-400">
              Verified Tactical Superpowers
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProspect.strengths.map((str) => (
                <span
                  key={str}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.12)] px-2.5 py-1 text-xs text-slate-200 font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#CC5500]" />
                  <span>{str}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CTA Link */}
          <div className="pt-2">
            <Link
              href={`/players/${selectedProspect.slug}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-[6px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
            >
              <span>Inspect Full Dossier ({selectedProspect.name})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
