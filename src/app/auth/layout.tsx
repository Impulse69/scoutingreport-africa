import Link from "next/link";
import { Sparkles, Shield, Compass, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#080B0E] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Cinematic Branding Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#0c161d] via-[#091015] to-[#060a0d] border-r border-white/10">
        {/* Luminous Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20 text-slate-950 font-mono font-black text-sm">
              SR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">
                  SCOUTING REPORT
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AFRICA
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Talent Intelligence & Scout Network</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-amber-400" /> Ground-Truth Intelligence
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Unearth talent <br />
            <span className="gradient-text-emerald">beyond the highlight reel.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Standardized, verified scouting dossiers and tactical radar evaluations compiled directly across all 54 CAF national associations and elite academy hubs.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full catalogue of 200+ scouted African prodigies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Custom recruitment watchlists & pipeline exports</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Verified scout dossiers and percentile visualizers</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>© {new Date().getFullYear()} ScoutingReport Africa</span>
          <span className="text-emerald-400">Authorized Personnel Portal</span>
        </div>
      </div>

      {/* Main Authentication Area */}
      <main className="flex-1 flex flex-col bg-[#080B0E]">
        <header className="lg:hidden border-b border-white/10 bg-[#080B0E]/90 backdrop-blur-md sticky top-0 z-50 p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-black text-slate-950">
                SR
              </div>
              <span className="text-sm font-extrabold text-white">ScoutingReport Africa</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
