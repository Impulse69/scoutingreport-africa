"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap, Shield, ArrowRight, Sparkles, Building2, UserCheck } from "lucide-react";

export function PricingPlans() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
          <Zap className="h-3 w-3 text-[#CC5500]" />
          <span>Professional Scout Clearance</span>
        </div>
        <h2 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Recruitment Tier Subscriptions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Tailored access for independent scouts, agency analysts, and professional club recruitment directors.
        </p>

        {/* Toggle Billing Switcher */}
        <div className="inline-flex items-center gap-3 p-1 rounded-[6px] bg-[#12151C] border border-[rgba(224,192,178,0.12)] font-['Public_Sans'] text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-[4px] transition-all ${
              !isAnnual
                ? "bg-[#CC5500] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] transition-all ${
              isAnnual
                ? "bg-[#CC5500] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-[3px] bg-[#0C0E12] px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#FFB693]">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Scout Starter */}
        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FFB693]">
                Starter Tier
              </span>
              <UserCheck className="h-4 w-4 text-slate-500" />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-white">
                  {isAnnual ? "€29" : "€39"}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Essential database access for independent scouts and regional correspondents.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-[rgba(224,192,178,0.08)] text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Full access to 2,400+ African player profiles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>3 custom recruitment watchlists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Standard positional radar comparisons</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>FPL African differential insights</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/sign-up"
            className="w-full py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider text-center transition-all"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Tier 2: Pro Analyst (Highlighted) */}
        <div className="rounded-[6px] border-2 border-[#CC5500] bg-[#171B23] p-6 space-y-6 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[4px] bg-[#CC5500] px-3 py-0.5 text-[9px] font-['Public_Sans'] font-black uppercase tracking-widest text-white shadow-md">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FFB693]">
                Pro Analyst
              </span>
              <Sparkles className="h-4 w-4 text-[#CC5500]" />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-white">
                  {isAnnual ? "€79" : "€99"}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Comprehensive scouting tools, report builder, and advanced telemetry filters.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-[rgba(224,192,178,0.1)] text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Everything in Starter Tier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Unlimited recruitment watchlists & pipelines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Create and export verified scouting dossiers (PDF)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Advanced per-90 metrics & historical match logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Priority scout community reviews</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/sign-up"
            className="w-full py-2.5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider text-center industrial-shadow transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* Tier 3: Enterprise Club */}
        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FFB693]">
                Club / Enterprise
              </span>
              <Building2 className="h-4 w-4 text-slate-500" />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-white">
                  {isAnnual ? "€249" : "€299"}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Multi-seat intelligence suite for professional clubs, federations, and agencies.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-[rgba(224,192,178,0.08)] text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Everything in Pro Analyst</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Up to 10 scout department seats</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Direct on-demand African scout commissions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>REST API data feeds & Wyscout cross-indexing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CC5500] shrink-0" />
                <span>Dedicated account director</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/sign-up"
            className="w-full py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider text-center transition-all"
          >
            Contact Club Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
