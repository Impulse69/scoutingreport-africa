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

/**
 * Rich profiles come from the ESPN bundle (or the single bundled demo player).
 * Everything scouted inside this app is a Supabase row and renders through the
 * database-backed profile below.
 */
async function loadRich(slug: string) {
  const bundled = getRichPlayerProfile(slug);
  if (bundled) return bundled;

  if (slug.startsWith("espn-")) {
    const espnId = slug.slice("espn-".length);
    const bundle = await fetchEspnBundle(espnId);
    if (bundle.overview?.athlete) {
      return bundleToRichProfile(espnId, bundle) ?? null;
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
      title: player.commonName || player.fullName,
      description:
        player.bio?.slice(0, 160) ||
        `Scouting profile for ${player.fullName} — ${bits.join(" · ")}.`,
      robots: player.status === "published" ? undefined : { index: false },
    };
  }

  const rich = getRichPlayerProfile(slug);
  if (rich) {
    return {
      title: rich.fullName,
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

  // A Supabase player always wins — that's a player someone here scouted.
  const dbPlayer = await getPlayerProfile(slug);
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
      <div className="container mx-auto max-w-5xl space-y-6 px-6 py-6">
        <nav className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          <Link href="/" className="transition-colors hover:text-zinc-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/players" className="transition-colors hover:text-zinc-300">
            Players
          </Link>
          <span>/</span>
          <span className="text-zinc-300">
            {dbPlayer.commonName || dbPlayer.fullName}
          </span>
        </nav>

        {dbPlayer.status === "draft" ? (
          <p className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-mono text-[11px] text-amber-200">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              This player is a draft — only you and admins can see this page.
              {canEdit ? (
                <>
                  {" "}
                  <Link
                    href={`/scout/players/${dbPlayer.id}/edit`}
                    className="underline underline-offset-4 hover:text-white"
                  >
                    Publish them
                  </Link>{" "}
                  to put them on the public roster.
                </>
              ) : null}
            </span>
          </p>
        ) : null}

        <PlayerProfileHero player={dbPlayer} canEdit={canEdit} />

        <RatingPanel
          ratings={dbPlayer.ratings}
          reportCount={dbPlayer.publishedReportCount}
        />

        {reports.length > 0 ? (
          <PlayerReportsList slug={slug} reports={reports} />
        ) : (
          <section className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] px-6 py-10 text-center">
            <p className="font-mono text-[11px] text-zinc-500">
              No published scouting reports on this player yet.
            </p>
            {canEdit ? (
              <Link
                href={`/scout/reports/new?player=${dbPlayer.id}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-orange-500/40 bg-orange-500/10 px-3 py-2 font-mono text-[11px] text-orange-300 transition-colors hover:bg-orange-500/20"
              >
                Write the first one
              </Link>
            ) : null}
          </section>
        )}

        {dbPlayer.bio ? (
          <section className="rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
              About
            </p>
            <p className="text-sm leading-6 text-zinc-300">{dbPlayer.bio}</p>
          </section>
        ) : null}

        {user ? (
          <AddToWatchlist playerId={dbPlayer.id} watchlists={watchlists} />
        ) : null}

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

  // Rich profiles name other players (similar players, "explore more") that
  // usually have no page here. Resolve which ones do so the widgets can link
  // those and leave the rest as plain text instead of 404s.
  const linkable = await filterExistingPlayerSlugs([
    ...player.similarPlayers.map((p) => p.slug),
    ...player.exploreMore
      .filter((e) => e.href.startsWith("/players/"))
      .map((e) => e.href.slice("/players/".length)),
  ]);

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-6 py-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        <Link href="/" className="transition-colors hover:text-zinc-300">
          Home
        </Link>
        <span>/</span>
        <Link href="/players" className="transition-colors hover:text-zinc-300">
          Players
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
                  ? "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                  : "border border-transparent text-zinc-500 hover:border-white/10 hover:text-white"
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
            <SimilarPlayers player={player} linkable={linkable} />
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
          <AboutPlayer player={player} linkable={linkable} />
        </>
      ) : null}

      {activeTab === "stats" ? <DetailedStatsTab player={player} /> : null}
      {activeTab === "log" ? <MatchLogTab player={player} /> : null}
      {activeTab === "trends" ? <TrendsTab player={player} /> : null}
      {activeTab === "history" ? <ReverseHistoryTab player={player} /> : null}
      {activeTab === "insights" ? <InsightsTab player={player} /> : null}

      <ScoutNotes
        playerSlug={slug}
        signedIn={!!user}
        initialNotes={note?.notes ?? ""}
        initialUpdatedAt={note?.updatedAt ?? ""}
      />
    </div>
  );
}
