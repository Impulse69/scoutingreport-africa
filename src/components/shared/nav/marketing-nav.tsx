"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { isLiveRoute, PLANNED_LABEL } from "@/lib/shared/routes";
import { DarkUserMenu } from "./dark-user-menu";
import { NavSearch } from "./nav-search";

const COMPETITIONS = [
  { name: "CAF Champions League", tag: "Continental" },
  { name: "Nigeria Premier Football League", tag: "Nigeria" },
  { name: "South African Premiership", tag: "South Africa" },
  { name: "Botola Pro 1", tag: "Morocco" },
  { name: "Belgian Pro League", tag: "Europe" },
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
  const [leaguesOpen, setLeaguesOpen] = useState(false);
  void featured;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 lg:gap-6">
          {/* Brand & Main Links */}
          <div className="flex shrink-0 items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                SR
              </div>
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">
                  ScoutingReport Africa
                </span>
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                  Players and reports
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-0.5 text-sm font-medium lg:flex">
              <NavLink href="/players" active={pathname === "/players"}>
                Players
              </NavLink>

              <div
                className="relative"
                onMouseEnter={() => setLeaguesOpen(true)}
                onMouseLeave={() => setLeaguesOpen(false)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setLeaguesOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => setLeaguesOpen((open) => !open)}
                  onFocus={() => setLeaguesOpen(true)}
                  aria-haspopup="menu"
                  aria-expanded={leaguesOpen}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span>Leagues</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {leaguesOpen && (
                  <div className="absolute left-0 top-full z-50 w-80 pt-1.5">
                    <div className="space-y-1 rounded-lg border border-border bg-card p-2 shadow-lg">
                      <div className="border-b border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        Leagues
                      </div>
                      {COMPETITIONS.map((c) => (
                        <Link
                          key={c.name}
                          href="/leagues"
                          className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <span className="text-sm font-medium text-foreground">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.tag}</span>
                        </Link>
                      ))}
                      <div className="border-t border-border pt-1.5">
                        <Link
                          href="/leagues"
                          className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-primary hover:bg-muted"
                        >
                          <span>View leagues</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <NavLink href="/scout" active={pathname === "/scout"}>
                Scout
              </NavLink>
              <NavLink href="/watchlists" active={pathname === "/watchlists"}>
                Watchlists
              </NavLink>
              <NavLink href="/fpl" active={pathname === "/fpl"}>
                FPL
              </NavLink>
            </nav>
          </div>

          {/* Right Controls: Search, Dashboard/Auth */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="hidden w-44 md:block lg:w-52 xl:w-64">
              <NavSearch />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {initialAuth ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Dashboard
                  </Link>
                  <DarkUserMenu {...initialAuth} />
                </>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Sign in
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-2 border-t border-border bg-background px-2 py-4 text-sm font-medium lg:hidden">
            <div className="pb-2 md:hidden">
              <NavSearch />
            </div>
            <MobileNavLink href="/players" onClick={() => setMobileOpen(false)}>
              Players
            </MobileNavLink>
            <MobileNavLink href="/leagues" onClick={() => setMobileOpen(false)}>
              Leagues
            </MobileNavLink>
            <MobileNavLink href="/scout" onClick={() => setMobileOpen(false)}>
              Scout
            </MobileNavLink>
            <MobileNavLink href="/watchlists" onClick={() => setMobileOpen(false)}>
              Watchlists
            </MobileNavLink>
            <MobileNavLink href="/fpl" onClick={() => setMobileOpen(false)}>
              FPL
            </MobileNavLink>
            <MobileNavLink
              href={initialAuth ? "/dashboard" : "/auth/sign-in"}
              onClick={() => setMobileOpen(false)}
              emphasis
            >
              {initialAuth ? "Dashboard" : "Sign in"}
            </MobileNavLink>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  if (!isLiveRoute(href)) {
    return (
      <span className="rounded-md px-3 py-2 text-muted-foreground opacity-60">
        {children} {PLANNED_LABEL}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  emphasis,
  children,
}: {
  href: string;
  onClick: () => void;
  emphasis?: boolean;
  children: React.ReactNode;
}) {
  if (!isLiveRoute(href)) {
    return (
      <span className="block rounded-md px-3 py-2 text-muted-foreground opacity-60">
        {children} {PLANNED_LABEL}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        emphasis
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
