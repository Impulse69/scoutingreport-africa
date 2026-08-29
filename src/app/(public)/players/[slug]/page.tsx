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
  ArrowRight,
  Shield,
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
      title: `${player.commonName || player.fullName} · Dossier`,
      description:
        player.bio?.slice(0, 160) ||
        `Scouting profile for ${player.fullName} — ${bits.join(" · ")}.`,
      robots: player.status === "published" ? undefined : { index: false },
    };
  }

  const rich = getRichPlayerProfile(slug);
  if (rich) {
    return {
      title: `${rich.fullName} · Dossier`,
      description: `Scouting profile for ${rich.fullName} — ${rich.club}.`,
    };
  }

  return { title: "Player Dossier · ScoutingReport Africa" };
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
      <div className="container mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8 py-8 font-['Inter']">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-[10px] font-['Public_Sans'] uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Archive Home
          </Link>
          <span>/</span>
          <Link href="/players" className="hover:text-white transition-colors">
            Player Directory
          </Link>
          <span>/</span>
          <span className="text-[#FFB693] font-bold">
            {dbPlayer.commonName || dbPlayer.fullName}
          </span>
        </nav>

        {dbPlayer.status === "draft" && (
          <p className="flex items-start gap-2 rounded-[4px] border border-[#CC5500]/40 bg-[#CC5500]/10 px-4 py-3 text-xs text-[#FFB693]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              This player is in draft status. Only administrators and authors can review this dossier.
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
          <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-8 text-center space-y-3 shadow-lg">
            <Award className="h-8 w-8 text-slate-500 mx-auto opacity-40" />
            <p className="font-['Public_Sans'] text-sm font-bold text-white">
              No Published Scouting Reports On This Prospect Yet
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Evaluation dossiers contain match-by-match observation notes, minutes watched, and standardized tactical grades.
            </p>
            <div className="pt-2">
              <Link
                href={`/scout/reports/new?player=${dbPlayer.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-bold text-xs uppercase tracking-wider industrial-shadow transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Write First Scouting Report</span>
              </Link>
            </div>
          </section>
        )}

        {/* Bio */}
        {dbPlayer.bio && (
          <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 shadow-lg space-y-2">
            <h3 className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FFB693]">
              Scout Background & Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{dbPlayer.bio}</p>
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
    <div className="container mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8 py-8 font-['Inter']">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-[10px] font-['Public_Sans'] uppercase tracking-widest text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Archive Home
        </Link>
        <span>/</span>
        <Link href="/players" className="hover:text-white transition-colors">
          Player Directory
        </Link>
        <span>/</span>
        <span className="text-[#FFB693] font-bold">{player.fullName}</span>
      </nav>

      {/* Hero */}
      <PlayerHero player={player} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(224,192,178,0.12)] pb-3 font-['Public_Sans'] text-xs font-bold uppercase tracking-wider">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <Link
              key={t.id}
              href={`/players/${slug}?tab=${t.id}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] transition-all ${
                active
                  ? "bg-[#CC5500] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-[#171B23]"
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
            <KeyStrengths strengths={player.keyStrengths} />
            <PerNinetyBars stats={player.perNinetyStats} />
            <RecentForm matches={player.recentForm} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <AboutPlayer player={player} />
            <SimilarPlayers similar={player.similarPlayers} linkable={linkable} />
            <DefensiveHeatmap heatmap={player.heatmap} />
            <MarketValueCard value={player.marketValue} history={player.marketValueHistory} />
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
