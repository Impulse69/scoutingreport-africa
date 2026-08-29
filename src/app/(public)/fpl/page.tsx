import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, CalendarDays, LineChart, ShieldCheck, Flame, Star, ArrowRight, TrendingUp, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "African Stars Fantasy & FPL Differential Intelligence",
  description: "Fantasy Premier League intelligence for tracking African stars, fixture swings, xGI spikes, and differential captaincy options.",
};

const AFRICAN_DIFFERENTIALS = [
  {
    name: "Mohammed Kudus",
    club: "West Ham",
    position: "MID",
    price: "£6.8m",
    ownership: "7.4%",
    xGI90: "0.58",
    form: "7.8",
    fixtures: ["SOU (H)", "LEI (A)", "EVE (H)"],
    status: "Top Differential Pick",
    flag: "🇬🇭",
    slug: "mohammed-kudus",
  },
  {
    name: "Nicolas Jackson",
    club: "Chelsea",
    position: "FWD",
    price: "£7.9m",
    ownership: "14.2%",
    xGI90: "0.64",
    form: "8.1",
    fixtures: ["IPS (A)", "CRY (H)", "BOU (A)"],
    status: "Form Surge",
    flag: "🇸🇳",
    slug: "nicolas-jackson",
  },
  {
    name: "Simon Adingra",
    club: "Brighton",
    position: "MID",
    price: "£5.4m",
    ownership: "2.1%",
    xGI90: "0.49",
    form: "6.9",
    fixtures: ["WOL (H)", "NFO (A)", "FUL (H)"],
    status: "Budget Enabler",
    flag: "🇨🇮",
    slug: "simon-adingra",
  },
  {
    name: "Pape Matar Sarr",
    club: "Tottenham",
    position: "MID",
    price: "£5.0m",
    ownership: "1.8%",
    xGI90: "0.38",
    form: "6.7",
    fixtures: ["AVL (H)", "BRE (A)", "MUN (H)"],
    status: "Box Entry Value",
    flag: "🇸🇳",
    slug: "pape-matar-sarr",
  },
];

export default function FplPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Fantasy & FPL Differential Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            African Fantasy Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Uncover high-upside differentials, expected goal involvement (xGI) surges, and fixture difficulty matrices for African stars across top leagues.
          </p>
        </div>
      </div>

      {/* Differential Picks Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="text-xl font-black text-white">
              Featured African Differentials (&lt; 15% Ownership)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Gameweek Analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AFRICAN_DIFFERENTIALS.map((player) => (
            <div
              key={player.name}
              className="rounded-3xl border border-white/10 bg-[#0c1218] p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{player.flag}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                    {player.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white truncate">{player.name}</h3>
                <p className="text-xs text-slate-400">
                  {player.club} · <span className="font-semibold text-slate-200">{player.position}</span>
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#131d25] border border-white/5 text-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                    <span className="font-mono text-xs font-black text-white">{player.price}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Owned</span>
                    <span className="font-mono text-xs font-black text-amber-400">{player.ownership}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">xGI/90</span>
                    <span className="font-mono text-xs font-black text-emerald-400">{player.xGI90}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Upcoming Fixtures:</span>
                  <div className="flex items-center gap-1.5">
                    {player.fixtures.map((fix) => (
                      <span
                        key={fix}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                      >
                        {fix}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <Link
                  href={`/players/${player.slug}`}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  View Full Scout Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Tools Framework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#0c1218] border border-white/10 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Fixture Swing Lens</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Isolate positive 5-gameweek fixture swings for African assets and plan transfers ahead of the general curve.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0c1218] border border-white/10 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <LineChart className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Underlying Shot Volume</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identify forwards creating high non-penalty xG and midfielders dominating set-piece duty before points haul.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0c1218] border border-white/10 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">AFCON & Rotation Risk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor continental tournament call-ups, international travel loads, and recovery schedules.
          </p>
        </div>
      </div>
    </div>
  );
}
