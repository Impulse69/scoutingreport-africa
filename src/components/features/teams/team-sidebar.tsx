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
  Trophy
} from "lucide-react";
import type { TeamRef } from "@/lib/features/teams/mock";

type TeamSidebarProps = {
  team: TeamRef;
  contextLabel: string;
};

const NAV = [
  { href: "", label: "Overview", icon: LayoutGrid },
  { href: "squad", label: "Squad", icon: Users },
  { href: "performance", label: "Performance", icon: TrendingUp },
  { href: "fixtures", label: "Fixtures", icon: Calendar },
  { href: "trends", label: "Trends", icon: LineChart },
] as const;

export function TeamSidebar({ team, contextLabel }: TeamSidebarProps) {
  const pathname = usePathname();
  const base = `/teams/${team.slug}`;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card px-6 py-8 md:flex">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-xl font-semibold text-primary-foreground">
              {team.shortName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">{team.name}</h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{team.league}</p>
      </div>

      {/* Season badge */}
      <div className="mt-6 mb-4">
        <div className="flex w-full items-center justify-between rounded-md border border-border bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground">
          <span>{contextLabel}</span>
          <Trophy className="h-3.5 w-3.5 text-primary" />
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
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-muted text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs text-muted-foreground">
        <Link
          href="/leagues"
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span>All competitions</span>
        </Link>
        <Link
          href="/players"
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>Players</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 border-t border-border pt-2 font-medium transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
