"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Trophy,
  Users,
  Search,
  Menu,
  X,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Activity,
  Award
} from "lucide-react";
import { NavSearch } from "./nav-search";

const FEATURED_PRODIGIES = [
  { name: "Victor Boniface", role: "Striker (ST)", club: "Bayer Leverkusen", flag: "🇳🇬", slug: "victor-boniface" },
  { name: "Mohammed Kudus", role: "Attacking Mid (AM)", club: "West Ham United", flag: "🇬🇭", slug: "mohammed-kudus" },
  { name: "Lamine Camara", role: "Central Mid (CM)", club: "AS Monaco", flag: "🇸🇳", slug: "lamine-camara" },
  { name: "Nicolas Jackson", role: "Striker (ST)", club: "Chelsea", flag: "🇸🇳", slug: "nicolas-jackson" },
  { name: "Simon Adingra", role: "Winger (RW)", club: "Brighton & Hove Albion", flag: "🇨🇮", slug: "simon-adingra" },
];

const COMPETITIONS = [
  { name: "CAF Champions League", tag: "Tier 1 Continental", flag: "🏆" },
  { name: "Nigeria Premier Football League", tag: "NPFL · West Africa", flag: "🇳🇬" },
  { name: "South African Premiership", tag: "PSL · Southern Africa", flag: "🇿🇦" },
  { name: "Botola Pro 1", tag: "Morocco · North Africa", flag: "🇲🇦" },
  { name: "Belgian Pro League", tag: "European Gateway", flag: "🇧🇪" },
];

export type MarketingNavProps = {
  initialAuth?: {
    email: string | null;
    displayName: string | null;
    role: "user" | "scout" | "admin";
  } | null;
  featured?: {
    players?: { slug: string; name: string; tail?: string }[];
    teams?: { slug: string; name: string; tail?: string }[];
  };
};

export function MarketingNav({ initialAuth, featured }: MarketingNavProps = {}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [talentsOpen, setTalentsOpen] = useState(false);
  const [leaguesOpen, setLeaguesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0C0E12]/95 backdrop-blur-md border-b border-[rgba(224,192,178,0.12)] transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Insignia */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#CC5500] to-[#9C3F00] text-white shadow-md font-['Public_Sans'] font-black text-sm">
                SR
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Public_Sans'] text-sm font-black tracking-tight text-white group-hover:text-[#FFB693] transition-colors">
                    SCOUTING REPORT
                  </span>
                  <span className="rounded-[4px] bg-[#CC5500]/20 px-1.5 py-0.2 text-[9px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693] border border-[#CC5500]/30">
                    AFRICA
                  </span>
                </div>
                <span className="text-[10px] font-['Inter'] text-slate-400 font-semibold tracking-wider uppercase">
                  Kinetic Archive Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4 text-xs font-['Public_Sans'] font-bold uppercase tracking-wider">
              {/* Database Link */}
              <Link
                href="/players"
                className={`px-3 py-2 rounded-[6px] transition-colors ${
                  pathname === "/players"
                    ? "bg-[#171B23] text-[#FFB693]"
                    : "text-slate-300 hover:text-white hover:bg-[#12151C]"
                }`}
              >
                Database
              </Link>

              {/* Prodigies Mega-Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setTalentsOpen(true)}
                onMouseLeave={() => setTalentsOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 rounded-[6px] text-slate-300 hover:text-white hover:bg-[#12151C] transition-colors"
                >
                  <span>Featured Prodigies</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {talentsOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-72 z-50">
                    <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] p-2 shadow-2xl space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#FFB693] border-b border-[rgba(224,192,178,0.1)]">
                        Spotlight Dossiers
                      </div>
                      {FEATURED_PRODIGIES.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/players/${p.slug}`}
                          className="flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#171B23] transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{p.flag}</span>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[#FFB693] transition-colors">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {p.club}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.role.split(" ")[0]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Competitions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setLeaguesOpen(true)}
                onMouseLeave={() => setLeaguesOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 rounded-[6px] text-slate-300 hover:text-white hover:bg-[#12151C] transition-colors"
                >
                  <span>Competitions</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {leaguesOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-80 z-50">
                    <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] p-2 shadow-2xl space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#FFB693] border-b border-[rgba(224,192,178,0.1)]">
                        Continental & Domestic Leagues
                      </div>
                      {COMPETITIONS.map((c) => (
                        <Link
                          key={c.name}
                          href="/leagues"
                          className="flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#171B23] transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{c.flag}</span>
                            <span className="text-xs font-bold text-white group-hover:text-[#FFB693] transition-colors">
                              {c.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {c.tag}
                          </span>
                        </Link>
                      ))}
                      <div className="pt-1.5 border-t border-[rgba(224,192,178,0.1)]">
                        <Link
                          href="/leagues"
                          className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-[#CC5500] hover:text-[#FFB693] transition-colors"
                        >
                          <span>Explore All 54 CAF Divisions</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scout Hub */}
              <Link
                href="/scout"
                className={`px-3 py-2 rounded-[6px] transition-colors ${
                  pathname === "/scout"
                    ? "bg-[#171B23] text-[#FFB693]"
                    : "text-slate-300 hover:text-white hover:bg-[#12151C]"
                }`}
              >
                Scout Hub
              </Link>

              {/* Watchlists */}
              <Link
                href="/watchlists"
                className={`px-3 py-2 rounded-[6px] transition-colors ${
                  pathname === "/watchlists"
                    ? "bg-[#171B23] text-[#FFB693]"
                    : "text-slate-300 hover:text-white hover:bg-[#12151C]"
                }`}
              >
                Watchlists
              </Link>

              {/* Fantasy / FPL */}
              <Link
                href="/fpl"
                className={`px-3 py-2 rounded-[6px] transition-colors ${
                  pathname === "/fpl"
                    ? "bg-[#171B23] text-[#FFB693]"
                    : "text-slate-300 hover:text-white hover:bg-[#12151C]"
                }`}
              >
                FPL Hub
              </Link>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Omni-Search Bar */}
            <div className="w-48 sm:w-64 lg:w-72">
              <NavSearch />
            </div>

            {/* Scout Portal CTA */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-[6px] bg-gradient-to-r from-[#9C3F00] to-[#C45100] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
              >
                Command Hub
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-[6px] text-slate-400 hover:text-white hover:bg-[#171B23] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[rgba(224,192,178,0.12)] py-4 px-2 space-y-2 bg-[#0C0E12] font-['Public_Sans'] font-bold text-xs uppercase">
            <Link
              href="/players"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] text-slate-300 hover:bg-[#171B23] hover:text-white"
            >
              Player Catalogue
            </Link>
            <Link
              href="/leagues"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] text-slate-300 hover:bg-[#171B23] hover:text-white"
            >
              Competitions & Leagues
            </Link>
            <Link
              href="/scout"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] text-slate-300 hover:bg-[#171B23] hover:text-white"
            >
              Scout Workspace
            </Link>
            <Link
              href="/watchlists"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] text-slate-300 hover:bg-[#171B23] hover:text-white"
            >
              Recruitment Watchlists
            </Link>
            <Link
              href="/fpl"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] text-slate-300 hover:bg-[#171B23] hover:text-white"
            >
              African Stars FPL
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-[6px] bg-[#CC5500]/20 text-[#FFB693] font-black"
            >
              Scout Command Hub →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
