import Link from "next/link";
import { Shield, Sparkles, Trophy, Users, ScrollText, Compass, ExternalLink } from "lucide-react";

export function DarkFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#06080B] pt-14 pb-10 text-slate-400">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20 text-slate-950 font-mono font-black text-sm">
                SR
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">
                  SCOUTING REPORT AFRICA
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Apex
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier intelligence and analytics network tracking emerging prodigies, domestic champions, and generational talents across all 54 African football associations and diaspora pipelines.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Scouting Network Active
              </span>
            </div>
          </div>

          {/* Scouting Directory */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-400" /> Scouting Hub
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/players" className="hover:text-emerald-400 transition-colors">
                  Player Intelligence Catalogue
                </Link>
              </li>
              <li>
                <Link href="/scout" className="hover:text-emerald-400 transition-colors">
                  Scout Workspace & Reports
                </Link>
              </li>
              <li>
                <Link href="/watchlists" className="hover:text-emerald-400 transition-colors">
                  Talent Watchlists
                </Link>
              </li>
              <li>
                <Link href="/fpl" className="hover:text-emerald-400 transition-colors">
                  Fantasy & Differential Hub
                </Link>
              </li>
              <li>
                <Link href="/scout/reports/new" className="hover:text-emerald-400 transition-colors">
                  Submit Scouting Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Competitions & Leagues */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-400" /> Competitions
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/leagues" className="hover:text-amber-400 transition-colors">
                  All Competitions Index
                </Link>
              </li>
              <li>
                <Link href="/leagues" className="hover:text-amber-400 transition-colors">
                  CAF Champions League
                </Link>
              </li>
              <li>
                <Link href="/leagues" className="hover:text-amber-400 transition-colors">
                  African Domestic Leagues
                </Link>
              </li>
              <li>
                <Link href="/leagues" className="hover:text-amber-400 transition-colors">
                  European Landing Leagues
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                  Platform Command Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-cyan-400" /> Platform
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Scout Settings & Preferences
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Scouting Report Africa. All rights reserved. Dedicated to African football excellence.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <Link href="/scout/players/new" className="hover:text-slate-300 transition-colors">
              Register Prospect
            </Link>
            <span>•</span>
            <Link href="/auth/sign-in" className="hover:text-slate-300 transition-colors">
              Scout Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
