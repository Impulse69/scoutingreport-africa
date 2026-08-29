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
  CheckCircle2
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
    strengths: ["Blindside Movement", "Box Entry Timing", "Counter-attack Catalyst"],
  },
  {
    slug: "simon-adingra",
    name: "Simon Adingra",
    age: 23,
    club: "Brighton & Hove Albion",
    league: "Premier League",
    nation: "Ivory Coast",
    flag: "🇨🇮",
    position: "Winger (LW/RW)",
    role: "Direct 1v1 Specialist",
    rating: 8.1,
    marketValue: "€30,000,000",
    attributes: { pace: 91, dribbling: 89, shooting: 78, passing: 77, physical: 72, defense: 48 },
    strengths: ["Two-footed Delivery", "Rapid Deceleration", "High-pressing Value"],
  },
];

export function PlatformDashboard() {
  const [selectedSlug, setSelectedSlug] = useState<string>("victor-boniface");
  const [activeCategory, setActiveCategory] = useState<"all" | "FWD" | "MID" | "DEF">("all");

  const current = FEATURED_PROSPECTS.find((p) => p.slug === selectedSlug) ?? FEATURED_PROSPECTS[0];

  const filtered = FEATURED_PROSPECTS.filter((p) => {
    if (activeCategory === "FWD") return p.position.includes("Forward") || p.position.includes("Winger");
    if (activeCategory === "MID") return p.position.includes("Midfielder");
    if (activeCategory === "DEF") return p.position.includes("Defender");
    return true;
  });

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-[#0c1218] p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === "all"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Positions
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("FWD")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === "FWD"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attackers
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("MID")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === "MID"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Midfielders
          </button>
        </div>

        <Link
          href="/players"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
        >
          View 200+ scouted players in database <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Showcase Panel */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Prospects List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filtered.map((p) => {
            const isSelected = p.slug === selectedSlug;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setSelectedSlug(p.slug)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-[#121c22] border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : "bg-[#0c1218]/90 border-white/10 hover:border-white/20 hover:bg-[#10171e]"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg font-black border border-white/10 shadow-inner">
                    {p.flag}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">{p.name}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                        {p.nation}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {p.club} · {p.position}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 ml-3">
                  <div className="flex items-center gap-1 text-emerald-400 font-mono font-black text-sm">
                    <Star className="h-3 w-3 fill-emerald-400" />
                    <span>{p.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{p.marketValue}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Deep Intelligence Breakdown */}
        <div className="lg:col-span-7 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0e161c] to-[#0a1014] p-6 lg:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{current.flag}</span>
                  <h4 className="text-2xl font-black text-white tracking-tight">{current.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                    Verified Scout Profile
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {current.role} · <span className="text-slate-200">{current.club}</span> ({current.league})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Scout Score</p>
                  <p className="text-2xl font-mono font-black text-emerald-400">{current.rating} / 10</p>
                </div>
              </div>
            </div>

            {/* Tactical Strengths */}
            <div className="my-6">
              <p className="text-[11px] uppercase font-bold tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Key Tactical Superpowers
              </p>
              <div className="flex flex-wrap gap-2">
                {current.strengths.map((str) => (
                  <span
                    key={str}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-200"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> {str}
                  </span>
                ))}
              </div>
            </div>

            {/* Radar / Stat Bars */}
            <div className="space-y-3.5 my-6">
              <p className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Benchmark Percentiles (vs Position Cohort)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(current.attributes).map(([attr, val]) => (
                  <div
                    key={attr}
                    className="p-3 rounded-2xl bg-[#131d24] border border-white/5 space-y-1.5"
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className="uppercase font-bold text-slate-400">{attr}</span>
                      <span className="font-mono font-bold text-emerald-400">{val}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Estimated Market Valuation: <span className="font-bold text-white">{current.marketValue}</span>
            </div>
            <Link
              href={`/players/${current.slug}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Open Full Scout Dossier <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
