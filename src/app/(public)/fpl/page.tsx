import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, CalendarDays, LineChart, ShieldCheck, Flame, Star, ArrowRight, TrendingUp, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "African Stars Fantasy & FPL Differential Intelligence · ScoutingReport Africa",
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
    slug: "lamine-camara",
  },
];

export default function FPLHubPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-10 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(224,192,178,0.12)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
            <Zap className="h-3.5 w-3.5 text-[#CC5500]" />
            <span>FPL African Differentials & Underlying Telemetry</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            African Fantasy Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Track low-ownership African differentials (&lt; 15%), underlying xG + xA spikes, fixture ticker swings, and AFCON form trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/players"
            className="px-4 py-2.5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
          >
            Database Profiles
          </Link>
          <Link
            href="/watchlists"
            className="px-4 py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider transition-all"
          >
            FPL Shortlist
          </Link>
        </div>
      </div>

      {/* Gameweek Strategy Banner */}
      <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-['Public_Sans'] font-black uppercase tracking-wider text-[#FFB693] border border-[#CC5500]/30">
            Gameweek Tactical Briefing
          </span>
          <h2 className="font-['Public_Sans'] text-xl sm:text-2xl font-black text-white uppercase">
            High Differential Potential: West African Wingers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Upcoming fixture swings favor dynamic transitional attackers. Kudus and Jackson maintain top-tier xGI numbers while under-owned in over 85% of active squads.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] px-4 py-2 text-center">
            <div className="text-[10px] font-['Public_Sans'] font-bold uppercase text-slate-400">Average xGI</div>
            <div className="font-mono text-xl font-black text-[#FFB693]">0.52 / 90</div>
          </div>
        </div>
      </div>

      {/* Differentials Grid */}
      <div className="space-y-6">
        <h2 className="font-['Public_Sans'] text-xl font-black uppercase text-white tracking-tight">
          Spotlight Differentials (&lt; 15% Ownership)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AFRICAN_DIFFERENTIALS.map((diff) => (
            <div
              key={diff.name}
              className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 hover:border-[#CC5500]/50 hover:bg-[#171B23] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{diff.flag}</span>
                      <span className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-wider text-slate-400">
                        {diff.club}
                      </span>
                    </div>
                    <h3 className="font-['Public_Sans'] text-base font-black text-white mt-0.5">
                      {diff.name}
                    </h3>
                  </div>

                  <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#FFB693] border border-[#CC5500]/30">
                    {diff.position}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[rgba(224,192,178,0.06)] font-mono text-xs">
                  <div className="rounded-[4px] bg-[#0C0E12] p-2 border border-[rgba(224,192,178,0.06)]">
                    <div className="text-[9px] font-['Public_Sans'] uppercase text-slate-400 font-bold">Price</div>
                    <div className="font-bold text-white">{diff.price}</div>
                  </div>
                  <div className="rounded-[4px] bg-[#0C0E12] p-2 border border-[rgba(224,192,178,0.06)]">
                    <div className="text-[9px] font-['Public_Sans'] uppercase text-slate-400 font-bold">Owned</div>
                    <div className="font-bold text-[#FFB693]">{diff.ownership}</div>
                  </div>
                  <div className="rounded-[4px] bg-[#0C0E12] p-2 border border-[rgba(224,192,178,0.06)]">
                    <div className="text-[9px] font-['Public_Sans'] uppercase text-slate-400 font-bold">xGI/90</div>
                    <div className="font-bold text-white">{diff.xGI90}</div>
                  </div>
                  <div className="rounded-[4px] bg-[#0C0E12] p-2 border border-[rgba(224,192,178,0.06)]">
                    <div className="text-[9px] font-['Public_Sans'] uppercase text-slate-400 font-bold">Form</div>
                    <div className="font-bold text-[#FFB693]">{diff.form}</div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-slate-400">
                    Upcoming 3 Fixtures
                  </div>
                  <div className="flex gap-1.5 font-mono text-[11px]">
                    {diff.fixtures.map((f, i) => (
                      <span
                        key={i}
                        className="flex-1 py-1 rounded-[3px] bg-[#0C0E12] border border-[rgba(224,192,178,0.08)] text-center text-slate-200 font-bold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/players/${diff.slug}`}
                className="flex items-center justify-between pt-3 border-t border-[rgba(224,192,178,0.08)] text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white transition-colors"
              >
                <span>Full Scout Dossier</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#CC5500]" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
