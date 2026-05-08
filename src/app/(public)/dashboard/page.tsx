import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search,
  GitCompareArrows,
  ScatterChart,
  Bookmark,
  Target,
  Repeat,
  TrendingUp,
  Wallet,
  Layers,
  Users,
  Calendar,
  CalendarDays,
  Trophy,
  ListChecks,
  ArrowRight,
  ScrollText,
  UserPlus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { HubCard, type HubCardProps } from "@/components/features/dashboard/hub-card";
import { ScoutHubBanner } from "@/components/features/dashboard/dismissible-banner";
import { AccountFooter } from "@/components/features/dashboard/account-footer";

export const metadata = { title: "Dashboard" };

type Section = { heading: string; cards: HubCardProps[] };

function buildSections(role: "user" | "scout" | "admin"): Section[] {
  const isScout = role === "scout" || role === "admin";

  const scoutWorkflowSection: Section | null = isScout
    ? {
        heading: "Scout workspace",
        cards: [
          {
            href: "/scout",
            icon: ScrollText,
            title: "My reports",
            description: "Drafts and published reports — pick up where you left off.",
          },
          {
            href: "/scout/reports/new",
            icon: ScrollText,
            title: "New scouting report",
            description: "Fill in the report template and publish to the public profile.",
          },
          {
            href: "/scout/players/new",
            icon: UserPlus,
            title: "Add a player",
            description: "Create a new player profile so you can scout them.",
          },
        ],
      }
    : null;

  return [
    ...(scoutWorkflowSection ? [scoutWorkflowSection] : []),
    {
      heading: "Scouting & Analysis",
      cards: [
        {
          href: "/players",
          icon: Search,
          title: "Advanced Search",
          description: "Filter players by position, stats, league, and more.",
        },
        {
          href: "/compare",
          icon: GitCompareArrows,
          title: "Compare Players",
          description: "Side-by-side statistical comparisons.",
          locked: !isScout,
        },
        {
          href: "/scouting/scatter",
          icon: ScatterChart,
          title: "ScatterScout",
          description: "Visual scatter plot analysis tool.",
          locked: !isScout,
        },
        {
          href: "/watchlists",
          icon: Bookmark,
          title: "Watchlists",
          description: "Organize players into custom watchlists.",
          locked: !isScout,
        },
      ],
    },
    {
      heading: "Predictions & Betting",
      cards: [
        {
          href: "/predictions",
          icon: Target,
          title: "Match Predictions",
          description: "AI-powered match outcome predictions.",
        },
        {
          href: "/predictions/btts",
          icon: Repeat,
          title: "BTTS Predictions",
          description: "Both teams to score analysis.",
        },
        {
          href: "/predictions/over-under",
          icon: TrendingUp,
          title: "Over/Under 2.5",
          description: "Goal line predictions and trends.",
        },
        {
          href: "/predictions/value",
          icon: Wallet,
          title: "Value Bets",
          description: "Find odds with positive expected value.",
          locked: !isScout,
        },
        {
          href: "/predictions/acca",
          icon: Layers,
          title: "Acca Generator",
          description: "Build accumulators from top picks.",
          locked: !isScout,
        },
        {
          href: "/predictions/props",
          icon: Users,
          title: "Player Props",
          description: "Player-level statistical predictions.",
          locked: !isScout,
        },
      ],
    },
    {
      heading: "Fantasy Premier League",
      cards: [
        {
          href: "/fpl",
          icon: Calendar,
          title: "Gameweek Hub",
          description: "Weekly FPL overview and recommendations.",
        },
        {
          href: "/fpl/players",
          icon: Users,
          title: "FPL Players",
          description: "Browse and analyse FPL player data.",
        },
        {
          href: "/fpl/team",
          icon: ListChecks,
          title: "Team Builder",
          description: "Build and optimize your FPL squad.",
          locked: !isScout,
        },
        {
          href: "/fpl/fdr",
          icon: CalendarDays,
          title: "Fixture Difficulty",
          description: "Fixture difficulty ratings and rotation planner.",
          locked: !isScout,
        },
      ],
    },
    {
      heading: "Browse",
      cards: [
        {
          href: "/leagues",
          icon: Trophy,
          title: "Leagues",
          description: "Standings, stats, and squads by league.",
        },
        {
          href: "/fixtures",
          icon: Calendar,
          title: "Fixtures",
          description: "Upcoming and recent match schedules.",
        },
      ],
    },
  ];
}

export default async function DashboardPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/auth/sign-in?next=/dashboard");

  const role = me.role;
  const isFree = role === "user";
  const sections = buildSections(role);

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      {/* Header row */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-1.5 font-mono text-xs text-zinc-500">Your tools and features</p>
          {isFree ? (
            <Link
              href="/#pricing"
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Upgrade your plan <ArrowRight className="h-3 w-3" />
            </Link>
          ) : null}
        </div>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
            role === "admin"
              ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
              : role === "scout"
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-zinc-400"
          }`}
        >
          {role === "user" ? "FREE" : role.toUpperCase()}
        </span>
      </header>

      <div className="my-6 border-t border-white/5" />

      {/* Scout Hub promo */}
      <ScoutHubBanner pills={["Pipeline", "Watchlists", "Assessments"]} />

      <div className="my-10" />

      {/* Sections */}
      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              {section.heading}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((c) => (
                <HubCard key={c.title} {...c} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Upgrade banner */}
      {isFree ? (
        <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5 md:flex-row md:items-center">
          <p className="font-mono text-sm">
            <span className="font-semibold text-white">
              Unlock scouting tools, comparisons, and more.
            </span>{" "}
            <span className="text-zinc-400">Upgrade to get full access.</span>
          </p>
          <Link
            href="/#pricing"
            className="self-start whitespace-nowrap rounded-md border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white transition-colors hover:bg-white/10 md:self-auto"
          >
            See Plans <ArrowRight className="ml-1 inline h-3 w-3" />
          </Link>
        </section>
      ) : null}

      <AccountFooter email={me.email ?? null} />
    </div>
  );
}
