"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Users,
  Search,
  ChevronDown,
  Shield,
  ScrollText,
  Bookmark,
  Sparkles,
  Menu,
  X,
  Compass,
  ArrowRight,
  Flame,
  LayoutDashboard,
  UserPlus
} from "lucide-react";
import { NavSearch } from "@/components/shared/nav/nav-search";
import { LanguagePicker } from "@/components/shared/nav/language-picker";
import { DarkUserMenu } from "@/components/shared/nav/dark-user-menu";

export type MarketingNavInitialAuth = {
  email: string | null;
  displayName: string | null;
  role: "user" | "scout" | "admin";
} | null;

interface MarketingNavProps {
  initialAuth?: MarketingNavInitialAuth;
  featured?: {
    players?: { slug: string; name: string; tail?: string }[];
    teams?: { slug: string; name: string; tail?: string }[];
  };
}

export function MarketingNav({ initialAuth = null, featured }: MarketingNavProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Only ever real, published players — the layout supplies them from the
  // database. A hardcoded fallback list here linked to profiles that had no
  // page behind them, so the menu 404'd whenever those names weren't in the
  // roster. No players yet simply means no featured section.
  const featuredPlayers = featured?.players ?? [];

  const topLeagues = [
    { name: "CAF Champions League", country: "Africa Continental", href: "/leagues" },
    { name: "NPFL (Nigeria)", country: "West Africa", href: "/leagues" },
    { name: "PSL Premiership", country: "South Africa", href: "/leagues" },
    { name: "Botola Pro", country: "Morocco", href: "/leagues" },
    { name: "Belgian Pro League", country: "Landing League", href: "/leagues" },
    { name: "Ligue 1", country: "France", href: "/leagues" },
  ];

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080B0E]/90 backdrop-blur-xl transition-all"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="font-mono text-base font-black text-slate-950 tracking-tighter">
                  SR
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-400 border-2 border-[#080B0E]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-sm md:text-base group-hover:text-emerald-400 transition-colors">
                    SCOUTING REPORT
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AFRICA
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider hidden sm:block">
                  Talent Intelligence & Scout Network
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Players Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === "players" ? null : "players")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname.startsWith("/players") || openMenu === "players"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Players</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      openMenu === "players" ? "rotate-180 text-emerald-400" : "text-slate-400"
                    }`}
                  />
                </button>

                {openMenu === "players" && (
                  <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0c1218]/98 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                        <Flame className="h-3 w-3" /> Featured Prodigies
                      </span>
                      <Link
                        href="/players"
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                        onClick={() => setOpenMenu(null)}
                      >
                        All Players →
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {featuredPlayers.slice(0, 5).map((p) => (
                        <Link
                          key={p.slug}
                          href={`/players/${p.slug}`}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              {p.name}
                            </p>
                            {p.tail && (
                              <p className="text-[10px] text-slate-400">{p.tail}</p>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link
                        href="/players"
                        onClick={() => setOpenMenu(null)}
                        className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold transition-colors"
                      >
                        <Search className="h-3.5 w-3.5" /> Launch Players Filter Suite
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Leagues Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === "leagues" ? null : "leagues")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname.startsWith("/leagues") || openMenu === "leagues"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Leagues</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      openMenu === "leagues" ? "rotate-180 text-emerald-400" : "text-slate-400"
                    }`}
                  />
                </button>

                {openMenu === "leagues" && (
                  <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0c1218]/98 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Competitions
                      </span>
                      <Link
                        href="/leagues"
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                        onClick={() => setOpenMenu(null)}
                      >
                        View All →
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {topLeagues.map((l) => (
                        <Link
                          key={l.name}
                          href={l.href}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {l.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{l.country}</p>
                          </div>
                          <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Scout Workspace */}
              <Link
                href="/scout"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname.startsWith("/scout")
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ScrollText className="h-3.5 w-3.5 text-emerald-400" />
                <span>Scout Hub</span>
              </Link>

              {/* Watchlists */}
              <Link
                href="/watchlists"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname.startsWith("/watchlists")
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>Watchlists</span>
              </Link>

              {/* FPL Hub */}
              <Link
                href="/fpl"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname === "/fpl"
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Fantasy / FPL</span>
              </Link>
            </nav>
          </div>

          {/* Center/Right Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm justify-center">
            <NavSearch />
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <LanguagePicker />
            </div>

            {initialAuth ? (
              <DarkUserMenu
                email={initialAuth.email}
                displayName={initialAuth.displayName}
                role={initialAuth.role}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/sign-in"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  Join Scout Network
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="px-2">
              <NavSearch />
            </div>

            <div className="space-y-1 px-2 font-medium">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                Dashboard
              </Link>
              <Link
                href="/players"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <Users className="h-4 w-4 text-emerald-400" />
                Players Catalogue
              </Link>
              <Link
                href="/leagues"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                Leagues & Competitions
              </Link>
              <Link
                href="/scout"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <ScrollText className="h-4 w-4 text-emerald-400" />
                Scout Hub & Reports
              </Link>
              <Link
                href="/watchlists"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <Bookmark className="h-4 w-4 text-amber-400" />
                Watchlists
              </Link>
              <Link
                href="/fpl"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Fantasy / FPL Tools
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 text-white text-sm"
              >
                <Compass className="h-4 w-4 text-slate-400" />
                Settings & Preferences
              </Link>
            </div>

            <div className="pt-2 border-t border-white/10 px-4">
              <LanguagePicker />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
