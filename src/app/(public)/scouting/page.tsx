import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Eye, FileText, Route, Sparkles, ArrowRight, ShieldCheck, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "African Football Scouting Methodology & Workflows",
  description: "Structured workflows for live match scouting, player evaluation matrices, and recruitment dossiers.",
};

const WORKFLOW = [
  {
    step: "01",
    title: "Identify & Screen",
    description: "Scan on-ground tournament fixtures, CAF academies, and domestic lineups with clear role criteria.",
    icon: Eye,
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    step: "02",
    title: "Evaluate & Grade",
    description: "Assess physical ceiling, technical execution under pressure, tactical awareness, and mental grit across 4 structured categories.",
    icon: ClipboardCheck,
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    step: "03",
    title: "Synthesize & Explain",
    description: "Translate subjective observation and objective data into compelling recruitment intelligence that empowers club decision-makers.",
    icon: FileText,
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
];

export default function ScoutingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Department Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Scouting Methodology & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            How ScoutingReport Africa standardizes on-ground match scouting across 54 nations to deliver verified, actionable recruitment dossiers.
          </p>
        </div>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid md:grid-cols-3 gap-6">
        {WORKFLOW.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-slate-400">{item.step}</span>
                <div className={`p-2 rounded-xl border ${item.accent}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">{item.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ground Truth Banner */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1218] p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Built for On-Ground Verification</h2>
            <p className="text-xs text-slate-400">Separating viral highlight reels from durable, scalable player traits.</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Many recruitment teams struggle when assessing African prospects due to disparate video quality, lack of consistent optical tracking, and irregular tournament reporting. Our standardized scouting framework anchors evaluations around live match context, psychological resilience, and scalable physical metrics.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            href="/scout/reports/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all"
          >
            Launch Scouting Template
          </Link>
          <Link
            href="/players"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Browse Verified Profiles
          </Link>
        </div>
      </div>
    </div>
  );
}
