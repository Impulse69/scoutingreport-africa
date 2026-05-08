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
  Sun,
  ChevronDown,
} from "lucide-react";
import type { TeamRef } from "@/lib/features/teams/mock";

type TeamSidebarProps = {
  team: TeamRef;
  season: string;
  seasons: string[];
};

const NAV = [
  { href: "", label: "Overview", icon: LayoutGrid },
  { href: "squad", label: "Squad", icon: Users },
  { href: "performance", label: "Performance", icon: TrendingUp },
  { href: "fixtures", label: "Fixtures", icon: Calendar },
  { href: "trends", label: "Trends", icon: LineChart },
] as const;

export function TeamSidebar({ team, season, seasons }: TeamSidebarProps) {
  const pathname = usePathname();
  const base = `/teams/${team.slug}`;

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-[#070707] px-5 py-6">
      {/* Crest + name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative h-16 w-16 mb-3">
          {team.crestUrl ? (
            <Image
              src={team.crestUrl}
              alt={team.name}
              fill
              sizes="64px"
              className="object-contain"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-orange-600 flex items-center justify-center font-mono font-bold">
              {team.shortName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <p className="font-mono text-sm font-semibold text-white">{team.name}</p>
        <p className="mt-1 text-[11px] text-zinc-500">{team.league}</p>
      </div>

      {/* Season selector */}
      <div className="mt-6 mb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10 transition-colors"
        >
          <span>{season}</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
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
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-mono transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="mt-6 space-y-2 border-t border-white/5 pt-5 text-[11px] font-mono text-zinc-500">
        <Link
          href={`/leagues/${team.leagueSlug}`}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          {team.league}
        </Link>
        <button
          type="button"
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Sun className="h-3 w-3" />
          Toggle Theme
        </button>
      </div>
      {/* season-list reference (sidebar selector kept simple for now) */}
      <span className="sr-only">{seasons.join(", ")}</span>
    </aside>
  );
}
