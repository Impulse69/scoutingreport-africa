"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  TrendingUp,
  Calendar,
  LineChart,
  ArrowLeft,
  ChevronDown,
  Shield,
  Trophy
} from "lucide-react";
import type { TeamRef } from "@/lib/features/teams/mock";

type TeamSidebarProps = {
  team: TeamRef;
  season: string;
  seasons: string[];
};

const NAV = [
  { href: "", label: "Overview", icon: LayoutGrid },
  { href: "squad", label: "Squad Roster", icon: Users },
  { href: "performance", label: "Tactical Metrics", icon: TrendingUp },
  { href: "fixtures", label: "Fixtures", icon: Calendar },
  { href: "trends", label: "Form Trends", icon: LineChart },
] as const;

export function TeamSidebar({ team, season, seasons }: TeamSidebarProps) {
  const pathname = usePathname();
  const base = `/teams/${team.slug}`;

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#06090c] px-6 py-8">
      {/* Crest + name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative h-18 w-18 mb-4">
          {team.crestUrl ? (
            <Image
              src={team.crestUrl}
              alt={team.name}
              fill
              sizes="72px"
              className="object-contain"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-mono font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              {team.shortName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="font-extrabold text-base text-white tracking-tight">{team.name}</h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">{team.league}</p>
      </div>

      {/* Season badge */}
      <div className="mt-6 mb-4">
        <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0c1218] px-3.5 py-2 text-xs font-mono font-bold text-slate-300">
          <span>Season {season}</span>
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const target = item.href ? `${base}/${item.href}` : base;
          const Icon = item.icon;
          const isActive =
            (item.href === "" && pathname === base) ||
            (item.href !== "" && pathname?.startsWith(target));
          return (
            <Link
              key={item.label}
              href={target}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-xs text-slate-400">
        <Link
          href="/leagues"
          className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-medium"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
          <span>All Competitions</span>
        </Link>
        <Link
          href="/players"
          className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-medium"
        >
          <Users className="h-3.5 w-3.5 text-emerald-400" />
          <span>Player Catalogue</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:text-white transition-colors font-bold pt-2 border-t border-white/5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Command Hub</span>
        </Link>
      </div>
    </aside>
  );
}
