import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  BarChart3,
  FileText,
  Activity,
  GitBranch,
  Sparkles,
  Info,
  Award,
  PlusCircle
} from "lucide-react";
import { getRichPlayerProfile } from "@/lib/features/players/rich-mock";
import {
  getPlayerProfile,
  filterExistingPlayerSlugs,
} from "@/lib/features/players/queries";
import {
  fetchEspnBundle,
  bundleToRichProfile,
} from "@/lib/features/players/espn";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { getMyNoteForPlayer } from "@/lib/features/notes/actions";
import { listPublishedReportsForPlayerSlug } from "@/lib/features/reports/queries";
import { listWatchlistOptionsForPlayer } from "@/lib/features/watchlists/queries";
import { PlayerReportsList } from "@/components/features/reports/player-reports-list";
import { PlayerHero } from "@/components/features/players/rich/hero";
import {
  PlayerProfileHero,
  positionLabel,
  countryFor,
  ageFrom,
} from "@/components/features/players/db/profile-hero";
import { RatingPanel } from "@/components/features/players/db/rating-panel";
import { AddToWatchlist } from "@/components/features/players/db/add-to-watchlist";
import {
  KeyStrengths,
  PerNinetyBars,
  RecentForm,
} from "@/components/features/players/rich/strengths-and-stats";
import {
  SimilarPlayers,
  DefensiveHeatmap,
  MarketValueCard,
  AboutPlayer,
} from "@/components/features/players/rich/side-widgets";
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

import { resolvePlayerPhotoDynamic } from "@/lib/features/players/photos";

async function loadRich(slug: string) {
  const bundled = getRichPlayerProfile(slug);
  if (bundled) {
    const photo = await resolvePlayerPhotoDynamic(bundled.fullName, bundled.photoUrl);
    return { ...bundled, photoUrl: photo };
  }

  if (slug.startsWith("espn-")) {
    const espnId = slug.slice("espn-".length);
    const bundle = await fetchEspnBundle(espnId);
    if (bundle.overview?.athlete) {
      const p = bundleToRichProfile(espnId, bundle);
      if (p) {
        const photo = await resolvePlayerPhotoDynamic(p.fullName, p.photoUrl);
        return { ...p, photoUrl: photo };
      }
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const player = await getPlayerProfile(slug);
  if (player) {
    const country = countryFor(player.nationalityCode);
    const age = ageFrom(player.dateOfBirth);
    const bits = [
      positionLabel(player.primaryPositionCode),
      age !== null ? `${age}y` : null,
      player.currentClub,
      country?.name,
    ].filter(Boolean);

    return {
      title: `${player.commonName || player.fullName}`,
      description:
        player.bio?.slice(0, 160) ||
        `Scouting profile for ${player.fullName} — ${bits.join(" · ")}.`,
      robots: player.status === "published" ? undefined : { index: false },
    };
  }

  const rich = getRichPlayerProfile(slug);
  if (rich) {
    return {
      title: `${rich.fullName}`,
      description: `Scouting profile for ${rich.fullName} — ${rich.club}.`,
    };
  }

  return { title: "Player" };
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

  const user = await getCurrentUser();

  const rawDbPlayer = await getPlayerProfile(slug);
  const dbPlayer = rawDbPlayer
    ? {
        ...rawDbPlayer,
        photoUrl: await resolvePlayerPhotoDynamic(rawDbPlayer.fullName, rawDbPlayer.photoUrl),
      }
    : null;
  const rich = dbPlayer ? null : await loadRich(slug);

  if (!dbPlayer && !rich) notFound();

  const note = user ? await getMyNoteForPlayer(slug) : null;

  if (dbPlayer) {
    const [reports, watchlists] = await Promise.all([
      listPublishedReportsForPlayerSlug(slug, 20),
      user ? listWatchlistOptionsForPlayer(user.id, dbPlayer.id) : Promise.resolve([]),
    ]);

    const canEdit =
      !!user && (user.role === "admin" || dbPlayer.createdBy === user.id);

    return (
      <div className="container mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-[10px]  tracking-tight text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/players" className="hover:text-foreground transition-colors">
            Players
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">
            {dbPlayer.commonName || dbPlayer.fullName}
          </span>
        </nav>

        {dbPlayer.status === "draft" && (
          <p className="flex items-start gap-2 rounded-md border border-border bg-muted px-4 py-3 text-xs text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              This player is in draft status. Only administrators and authors can see this page.
            </span>
          </p>
        )}

        {/* Hero */}
        <PlayerProfileHero player={dbPlayer} canEdit={canEdit} />

        {/* Attributes Breakdown */}
        <RatingPanel
          ratings={dbPlayer.ratings}
          reportCount={dbPlayer.publishedReportCount}
          playerId={dbPlayer.id}
        />

        {/* Published Reports or Empty Card */}
        {reports.length > 0 ? (
          <PlayerReportsList slug={slug} reports={reports} />
        ) : (
          <section className="rounded-lg border border-border bg-card p-8 text-center space-y-3 shadow-lg">
            <Award className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-bold text-foreground">
              No Published Scouting Reports On This Prospect Yet
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Reports record the fixture, minutes observed, and ratings across the four categories.
            </p>
            <div className="pt-2">
              <Link
                href={`/scout/reports/new?player=${dbPlayer.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:opacity-95 text-primary-foreground font-bold text-xs  tracking-normal  transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Write First Scouting Report</span>
              </Link>
            </div>
          </section>
        )}

        {/* Bio */}
        {dbPlayer.bio && (
          <section className="rounded-lg border border-border bg-card p-6 shadow-lg space-y-2">
            <h3 className="text-xs font-semibold  tracking-tight text-primary">
              Scout Background & Notes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{dbPlayer.bio}</p>
          </section>
        )}

        {/* Watchlist Action */}
        {user && (
          <AddToWatchlist playerId={dbPlayer.id} watchlists={watchlists} />
        )}

        {/* Scout Personal Notes */}
        <ScoutNotes
          playerSlug={slug}
          signedIn={!!user}
          initialNotes={note?.notes ?? ""}
          initialUpdatedAt={note?.updatedAt ?? ""}
        />
      </div>
    );
  }

  const player = rich!;

  // Comparable-player names come from ESPN/demo data; resolve which ones have a
  // profile here so the widget links those and leaves the rest as plain text.
  const linkable = await filterExistingPlayerSlugs(
    player.similarPlayers.map((p) => p.slug),
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8 py-8 ">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-[10px]  tracking-tight text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/players" className="hover:text-foreground transition-colors">
          Players
        </Link>
        <span>/</span>
        <span className="text-primary font-bold">{player.fullName}</span>
      </nav>

      {/* Hero */}
      <PlayerHero player={player} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 text-xs font-bold  tracking-normal">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <Link
              key={t.id}
              href={`/players/${slug}?tab=${t.id}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {player.keyStrengths.length > 0 && (
              <KeyStrengths strengths={player.keyStrengths} />
            )}
            {player.perNinetyStats.length > 0 && (
              <PerNinetyBars stats={player.perNinetyStats} />
            )}
            {player.recentForm.length > 0 && (
              <RecentForm matches={player.recentForm} />
            )}
          </div>
          <div className="lg:col-span-4 space-y-6">
            <AboutPlayer player={player} />
            {player.similarPlayers.length > 0 && (
              <SimilarPlayers similar={player.similarPlayers} linkable={linkable} />
            )}
            {player.heatmap.length > 0 && (
              <DefensiveHeatmap heatmap={player.heatmap} />
            )}
            {player.marketValue > 0 && (
              <MarketValueCard value={player.marketValue} history={player.marketValueHistory} />
            )}
          </div>
        </div>
      )}

      {activeTab === "stats" && <DetailedStatsTab player={player} />}
      {activeTab === "log" && <MatchLogTab player={player} />}
      {activeTab === "trends" && <TrendsTab player={player} />}
      {activeTab === "history" && <ReverseHistoryTab player={player} />}
      {activeTab === "insights" && <InsightsTab player={player} />}

      {/* Notes */}
      <ScoutNotes
        playerSlug={slug}
        signedIn={!!user}
        initialNotes={note?.notes ?? ""}
        initialUpdatedAt={note?.updatedAt ?? ""}
      />
    </div>
  );
}
