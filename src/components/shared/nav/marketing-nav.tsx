"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Trophy,
  TrendingUp,
  Search,
  Activity,
  ChevronDown,
  Globe,
} from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { LanguagePicker } from "@/components/shared/nav/language-picker";
import { NavSearch } from "@/components/shared/nav/nav-search";
import { createClient } from "@/lib/core/supabase/client";

type AuthState = {
  ready: boolean;
  email: string | null;
  displayName: string | null;
  role: "user" | "scout" | "admin";
};

export type MarketingNavInitialAuth = {
  email: string | null;
  displayName: string | null;
  role: "user" | "scout" | "admin";
} | null;

type Item = { label: string; href: string; tail?: string };
type Section = { label?: string; items: Item[] };
type MenuColumn = { heading?: string; sections: Section[] };

const LEAGUES: MenuColumn[] = [
  {
    heading: "Browse",
    sections: [
      {
        items: [
          { label: "All Leagues", href: "/leagues" },
          { label: "Today's Fixtures", href: "/fixtures" },
        ],
      },
    ],
  },
  {
    heading: "Top Leagues",
    sections: [
      {
        items: [
          { label: "Premier League", href: "/leagues/premier-league" },
          { label: "La Liga", href: "/leagues/la-liga" },
          { label: "Bundesliga", href: "/leagues/bundesliga" },
          { label: "Serie A", href: "/leagues/serie-a" },
          { label: "Ligue 1", href: "/leagues/ligue-1" },
        ],
      },
    ],
  },
  {
    heading: "Europe",
    sections: [
      {
        label: "British Isles",
        items: [
          { label: "Championship", href: "/leagues/championship", tail: "England" },
          { label: "League One", href: "/leagues/league-one", tail: "England" },
          { label: "League Two", href: "/leagues/league-two", tail: "England" },
          { label: "Premiership", href: "/leagues/premiership", tail: "Scotland" },
        ],
      },
      {
        label: "Western Europe",
        items: [
          { label: "Eredivisie", href: "/leagues/eredivisie", tail: "Netherlands" },
          { label: "Eerste Divisie", href: "/leagues/eerste-divisie", tail: "Netherlands" },
          { label: "Pro League", href: "/leagues/pro-league", tail: "Belgium" },
          { label: "Super League", href: "/leagues/super-league-ch", tail: "Switzerland" },
          { label: "Bundesliga", href: "/leagues/bundesliga-at", tail: "Austria" },
        ],
      },
      {
        label: "Southern Europe",
        items: [
          { label: "Liga Portugal", href: "/leagues/liga-portugal", tail: "Portugal" },
          { label: "Süper Lig", href: "/leagues/super-lig", tail: "Turkey" },
          { label: "Super League", href: "/leagues/super-league-gr", tail: "Greece" },
          { label: "Ligat ha'Al", href: "/leagues/ligat-haal", tail: "Israel" },
        ],
      },
    ],
  },
  {
    heading: "Europe",
    sections: [
      {
        label: "Scandinavia",
        items: [
          { label: "Superliga", href: "/leagues/superliga-dk", tail: "Denmark" },
          { label: "Allsvenskan", href: "/leagues/allsvenskan", tail: "Sweden" },
          { label: "Eliteserien", href: "/leagues/eliteserien", tail: "Norway" },
          { label: "Veikkausliiga", href: "/leagues/veikkausliiga", tail: "Finland" },
        ],
      },
      {
        label: "Eastern Europe",
        items: [
          { label: "Ekstraklasa", href: "/leagues/ekstraklasa", tail: "Poland" },
          { label: "Chance Liga", href: "/leagues/chance-liga", tail: "Czech Republic" },
          { label: "1. HNL", href: "/leagues/hnl", tail: "Croatia" },
          { label: "Superliga", href: "/leagues/superliga-ro", tail: "Romania" },
          { label: "Premier League", href: "/leagues/premier-league-ru", tail: "Russia" },
          { label: "First League", href: "/leagues/first-league-bg", tail: "Bulgaria" },
        ],
      },
    ],
  },
  {
    heading: "Americas",
    sections: [
      {
        items: [
          { label: "Brasileirão Série A", href: "/leagues/serie-a-br", tail: "Brazil" },
          { label: "Brasileirão Série B", href: "/leagues/serie-b-br", tail: "Brazil" },
          { label: "Liga Profesional", href: "/leagues/liga-profesional", tail: "Argentina" },
          { label: "Liga MX", href: "/leagues/liga-mx", tail: "Mexico" },
          { label: "MLS", href: "/leagues/mls", tail: "USA" },
          { label: "Primera División", href: "/leagues/primera-uy", tail: "Uruguay" },
        ],
      },
    ],
  },
  {
    heading: "More",
    sections: [
      {
        label: "Second Tiers",
        items: [
          { label: "2. Bundesliga", href: "/leagues/2-bundesliga", tail: "Germany" },
          { label: "La Liga 2", href: "/leagues/la-liga-2", tail: "Spain" },
          { label: "Serie B", href: "/leagues/serie-b-it", tail: "Italy" },
          { label: "Ligue 2", href: "/leagues/ligue-2", tail: "France" },
          { label: "1. Lig", href: "/leagues/1-lig", tail: "Turkey" },
        ],
      },
      {
        label: "Women's Football",
        items: [
          { label: "WSL", href: "/leagues/wsl", tail: "England" },
          { label: "A-League Women", href: "/leagues/a-league-women", tail: "Australia" },
          { label: "Brasileiro Women", href: "/leagues/brasileiro-women", tail: "Brazil" },
        ],
      },
    ],
  },
  {
    heading: "Asia & Oceania",
    sections: [
      {
        items: [
          { label: "Saudi Pro League", href: "/leagues/spl", tail: "Saudi Arabia" },
          { label: "J1 League", href: "/leagues/j1", tail: "Japan" },
          { label: "K League 1", href: "/leagues/k-league", tail: "South Korea" },
          { label: "A-League Men", href: "/leagues/a-league-men", tail: "Australia" },
          { label: "V-League", href: "/leagues/v-league", tail: "Vietnam" },
          { label: "Super League", href: "/leagues/super-league-cn", tail: "China" },
          { label: "Indian Super League", href: "/leagues/isl", tail: "India" },
          { label: "UAE Pro League", href: "/leagues/uae-pl", tail: "UAE" },
          { label: "Stars League", href: "/leagues/stars-league", tail: "Qatar" },
          { label: "Persian Gulf Pro League", href: "/leagues/pgpl", tail: "Iran" },
        ],
      },
      {
        label: "Africa",
        items: [
          { label: "Botola Pro", href: "/leagues/botola", tail: "Morocco" },
          { label: "Premier League", href: "/leagues/epl-eg", tail: "Egypt" },
        ],
      },
    ],
  },
];

const PREDICTIONS: MenuColumn[] = [
  {
    heading: "Today",
    sections: [
      {
        items: [
          { label: "Live predictions", href: "/predictions" },
          { label: "Match previews", href: "/predictions/previews" },
          { label: "xG forecasts", href: "/predictions/xg" },
        ],
      },
    ],
  },
  {
    heading: "Models",
    sections: [
      {
        items: [
          { label: "Team strength ratings", href: "/predictions/strength" },
          { label: "Form-adjusted odds", href: "/predictions/odds" },
          { label: "Title race", href: "/predictions/title-race" },
        ],
      },
    ],
  },
];

const SCOUTING: MenuColumn[] = [
  {
    heading: "Search & Compare",
    sections: [
      {
        items: [
          { label: "Advanced Search", href: "/players" },
          { label: "Compare Players", href: "/compare" },
          { label: "ScatterScout", href: "/scatterscout" },
        ],
      },
    ],
  },
  {
    heading: "Visualizations",
    sections: [
      {
        items: [
          { label: "Pizza Charts", href: "/scouting/pizza" },
          { label: "Team Styles", href: "/scouting/team-styles" },
          { label: "Tactics Board", href: "/scouting/tactics" },
        ],
      },
    ],
  },
  {
    heading: "Popular Players",
    sections: [
      {
        items: [
          { label: "Lamine Yamal", href: "/players/lamine-yamal" },
          { label: "Michael Olise", href: "/players/michael-olise" },
          { label: "Nico Paz", href: "/players/nico-paz" },
          { label: "Valentín Barco", href: "/players/valentin-barco" },
          { label: "Yunus Akgün", href: "/players/yunus-akgun" },
        ],
      },
    ],
  },
];

const FPL: MenuColumn[] = [
  {
    heading: "FPL Tools",
    sections: [
      {
        items: [
          { label: "Gameweek Hub", href: "/fpl/gameweek" },
          { label: "Team Builder", href: "/fpl/team-builder" },
          { label: "Fixture Difficulty", href: "/fpl/fdr" },
          { label: "FPL Player Search", href: "/fpl/players" },
          { label: "Player Compare", href: "/fpl/compare" },
        ],
      },
    ],
  },
];

type Tab = { key: string; labelKey: "leagues" | "predictions" | "scouting" | "fpl"; icon: typeof Trophy; columns: MenuColumn[] };
const TABS: Tab[] = [
  { key: "leagues", labelKey: "leagues", icon: Trophy, columns: LEAGUES },
  { key: "predictions", labelKey: "predictions", icon: TrendingUp, columns: PREDICTIONS },
  { key: "scouting", labelKey: "scouting", icon: Search, columns: SCOUTING },
  { key: "fpl", labelKey: "fpl", icon: Activity, columns: FPL },
];

export function MarketingNav({ initialAuth = null }: { initialAuth?: MarketingNavInitialAuth }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Seed from server-side auth so the Dashboard pill is already in the SSR markup
  // — no flicker, no race when navigating back from the dashboard.
  const [auth, setAuth] = useState<AuthState>(() =>
    initialAuth
      ? {
          ready: true,
          email: initialAuth.email,
          displayName: initialAuth.displayName,
          role: initialAuth.role,
        }
      : { ready: !!initialAuth, email: null, displayName: null, role: "user" },
  );

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        const u = data.user;
        if (!u) {
          setAuth({ ready: true, email: null, displayName: null, role: "user" });
          return;
        }
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        let role: "user" | "scout" | "admin" = "user";
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1])) as {
              user_role?: "user" | "scout" | "admin";
            };
            if (payload.user_role) role = payload.user_role;
          } catch {
            /* ignore decode errors */
          }
        }
        const displayName =
          (u.user_metadata?.display_name as string | undefined) ??
          u.email?.split("@")[0] ??
          null;
        setAuth({ ready: true, email: u.email ?? null, displayName, role });
      } catch (err) {
        console.warn("[marketing-nav] auth load failed", err);
        // Always set ready, never leave the slot frozen on a skeleton
        setAuth((prev) => ({ ...prev, ready: true }));
      }
    };

    // Don't immediately re-fetch if the server already gave us a fresh user —
    // saves a render and prevents the brief skeleton flash on route changes.
    if (!initialAuth) load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [initialAuth]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0B0B]/85 backdrop-blur-md">
      <div className="flex items-center gap-4 px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-600 font-bold text-lg">
            SR
          </div>
          <span className="hidden 2xl:inline font-semibold text-lg tracking-wide text-white">
            ScoutingReport
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-start gap-3 xl:justify-center">
          <nav
            className="hidden min-w-0 items-center gap-1.5 md:flex"
            onMouseLeave={scheduleClose}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isOpen = open === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(tab.key);
                  }}
                  onFocus={() => setOpen(tab.key)}
                  className={`group relative flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isOpen
                      ? "border border-orange-500/40 bg-orange-500/10 text-white"
                      : "border border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded ${
                      isOpen ? "bg-orange-600" : "bg-white/5"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  {t(tab.labelKey)}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                  {isOpen ? (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="hidden min-w-[220px] max-w-[340px] flex-1 xl:block">
            <NavSearch />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-sm font-medium">
          <LanguagePicker tone="dark" />
          {!auth.ready ? (
            // Skeleton while we resolve session — prevents flash of "Login" for authed users
            <div className="h-9 w-28 animate-pulse rounded-md bg-white/5" />
          ) : auth.email ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 whitespace-nowrap rounded-md border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-zinc-100"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="hidden text-zinc-400 transition-colors hover:text-white md:inline"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/sign-up"
                className="whitespace-nowrap rounded-md bg-orange-600 px-5 py-2.5 text-white transition-colors hover:bg-orange-700"
              >
                + {t("getStarted")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mega-menu drawer */}
      {TABS.map((tab) => (
        <div
          key={tab.key}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={`absolute inset-x-0 top-full overflow-hidden border-b border-white/5 bg-[#0B0B0B]/95 backdrop-blur-md transition-all duration-200 ${
            open === tab.key
              ? "opacity-100 translate-y-0"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <MegaPanel columns={tab.columns} extraLink={extraLinkFor(tab.key)} />
        </div>
      ))}
    </header>
  );
}

function extraLinkFor(key: string): { label: string; href: string; icon: typeof Globe } | null {
  if (key === "leagues") return { label: "View all 60+ leagues", href: "/leagues", icon: Globe };
  return null;
}

function MegaPanel({
  columns,
  extraLink,
}: {
  columns: MenuColumn[];
  extraLink: { label: string; href: string; icon: typeof Globe } | null;
}) {
  const isWidePanel = columns.length > 4;

  return (
    <div
      className={
        isWidePanel
          ? "mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-8 py-8 md:grid-cols-2 lg:grid-cols-7"
          : "mx-auto flex max-w-4xl flex-wrap justify-center gap-12 px-8 py-8"
      }
    >
      {columns.map((col, i) => (
        <div key={i} className={isWidePanel ? "space-y-4" : "w-64 max-w-full space-y-4"}>
          {col.heading ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-500">
              {col.heading}
            </p>
          ) : null}
          {col.sections.map((sec, j) => (
            <div key={j} className="space-y-2">
              {sec.label ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  {sec.label}
                </p>
              ) : null}
              <ul className="space-y-1.5">
                {sec.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline justify-between gap-3 rounded-md px-1 py-0.5 text-sm text-zinc-200 transition-colors hover:text-orange-400"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.tail ? (
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400">
                          {item.tail}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
              {extraLink && i === columns.length - 2 ? (
                <Link
                  href={extraLink.href}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <extraLink.icon className="h-3.5 w-3.5" />
                  {extraLink.label}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
