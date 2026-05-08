import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  BarChart3,
  FileText,
  Activity,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { getRichPlayerProfile } from "@/lib/features/players/rich-mock";
import { getPlayerProfile } from "@/lib/features/players/queries";
import {
  fetchEspnBundle,
  bundleToRichProfile,
} from "@/lib/features/players/espn";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { getMyNoteForPlayer } from "@/lib/features/notes/actions";
import { listPublishedReportsForPlayerSlug } from "@/lib/features/reports/queries";
import { PlayerReportsList } from "@/components/features/reports/player-reports-list";
import { PlayerHero } from "@/components/features/players/rich/hero";
import {
  KeyStrengths,
  PerNinetyBars,
  RecentForm,
} from "@/components/features/players/rich/strengths-and-stats";
import {
  SimilarPlayers,
  DefensiveHeatmap,
  MarketValueCard,
  CareerHistory,
  AboutPlayer,
} from "@/components/features/players/rich/side-widgets";
import {
  LeagueDistribution,
  PositionalScatter,
} from "@/components/features/players/rich/scatters";
import { ScoutNotes } from "@/components/features/players/rich/scout-notes";
import {
  DetailedStatsTab,
  MatchLogTab,
  TrendsTab,
  ReverseHistoryTab,
  InsightsTab,
} from "@/components/features/players/rich/tab-content";

type TabId = "career" | "stats" | "log" | "trends" | "history" | "insights";

const TABS: { id: TabId; label: string; icon: typeof Star }[] = [
  { id: "career", label: "CAREER", icon: Star },
  { id: "stats", label: "DETAILED STATS", icon: BarChart3 },
  { id: "log", label: "MATCH LOG", icon: FileText },
  { id: "trends", label: "TRENDS", icon: Activity },
  { id: "history", label: "REVERSE HISTORY", icon: GitBranch },
  { id: "insights", label: "INSIGHTS", icon: Sparkles },
];

function isTabId(v: string | undefined): v is TabId {
  return !!v && TABS.some((t) => t.id === v);
}

export default async function PlayerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const activeTab: TabId = isTabId(sp.tab) ? sp.tab : "career";

  let rich = getRichPlayerProfile(slug);

  if (!rich && slug.startsWith("espn-")) {
    const espnId = slug.slice("espn-".length);
    const bundle = await fetchEspnBundle(espnId);
    if (bundle.overview?.athlete) {
      rich = bundleToRichProfile(espnId, bundle) ?? null;
    }
  }

  const live = rich ? null : await getPlayerProfile(slug);

  if (!live && !rich) notFound();

  if (!rich && live) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-8 space-y-8">
        <header>
          <h1 className="font-mono text-2xl font-bold text-white">{live.fullName}</h1>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            {live.primaryPositionCode} · {live.currentClub ?? "—"}
          </p>
        </header>
        <p className="font-mono text-xs text-zinc-500">
          Rich profile sections light up once this player has fixture-grade data
          ingested.
        </p>
      </div>
    );
  }

  const player = rich!;
  const user = await getCurrentUser();
  const note = user ? await getMyNoteForPlayer(slug) : null;
  const publishedReports = await listPublishedReportsForPlayerSlug(slug, 5);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/leagues/${player.league.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-zinc-300 transition-colors"
        >
          {player.league}
        </Link>
        <span>/</span>
        <Link
          href={`/teams/${player.club.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-zinc-300 transition-colors"
        >
          {player.club}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{player.fullName}</span>
      </nav>

      <PlayerHero player={player} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === activeTab;
          return (
            <Link
              key={t.id}
              href={t.id === "career" ? `/players/${slug}` : `/players/${slug}?tab=${t.id}`}
              scroll={false}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "text-zinc-500 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <Icon className="h-3 w-3" />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "career" ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <KeyStrengths player={player} />
            <SimilarPlayers player={player} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <PerNinetyBars player={player} />
            <RecentForm player={player} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <DefensiveHeatmap player={player} />
            <MarketValueCard player={player} />
          </div>
          <CareerHistory player={player} />
          <div className="grid gap-6 lg:grid-cols-2">
            <LeagueDistribution player={player} />
            <PositionalScatter player={player} />
          </div>
          <PlayerReportsList slug={slug} reports={publishedReports} />
          <ScoutNotes
            playerSlug={slug}
            signedIn={!!user}
            initialNotes={note?.notes ?? ""}
            initialUpdatedAt={note?.updatedAt ?? ""}
          />
          <AboutPlayer player={player} />
        </>
      ) : null}

      {activeTab === "stats" ? <DetailedStatsTab player={player} /> : null}
      {activeTab === "log" ? <MatchLogTab player={player} /> : null}
      {activeTab === "trends" ? <TrendsTab player={player} /> : null}
      {activeTab === "history" ? <ReverseHistoryTab player={player} /> : null}
      {activeTab === "insights" ? <InsightsTab player={player} /> : null}

      {/* Always-visible scout notes (locked behind auth) on non-career tabs too */}
      {activeTab !== "career" ? (
        <ScoutNotes
          playerSlug={slug}
          signedIn={!!user}
          initialNotes={note?.notes ?? ""}
          initialUpdatedAt={note?.updatedAt ?? ""}
        />
      ) : null}
    </div>
  );
}
