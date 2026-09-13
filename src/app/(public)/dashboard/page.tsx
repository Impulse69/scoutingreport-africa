import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Trophy,
  Award,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import {
  listPublishedPlayers,
  getPlatformCounts,
} from "@/lib/features/players/queries";
import { listWatchlistsForUser } from "@/lib/features/watchlists/queries";
import { resolvePlayerPhotoDynamic } from "@/lib/features/players/photos";
import { CAF_COUNTRIES } from "@/lib/shared/constants";
import { HubCard } from "@/components/features/dashboard/hub-card";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
  description: "Recruitment workspace for players, reports, and watchlists.",
};

function getFlag(code: string | null | undefined): string {
  if (!code) return "🌍";
  const found = CAF_COUNTRIES.find((c) => c.code === code.toUpperCase());
  return found?.flagEmoji ?? "🌍";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [rawPlayers, counts, watchlists] = await Promise.all([
    listPublishedPlayers(6),
    getPlatformCounts(),
    user ? listWatchlistsForUser(user.id) : Promise.resolve([]),
  ]);

  const spotlightPlayers = await Promise.all(
    rawPlayers.map(async (p) => {
      const photo = await resolvePlayerPhotoDynamic(p.fullName, p.photoUrl);
      return { ...p, photoUrl: photo };
    })
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Scouting Dashboard
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Track your players, scout evaluations, and recruitment watchlists from one workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/scout/reports/new" className={buttonVariants()}>
            <PlusCircle className="h-4 w-4" />
            Create report
          </Link>
          <Link href="/scout/players/new" className={buttonVariants({ variant: "outline" })}>
            Register player
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Published players</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-bold tabular-nums text-foreground">
            {counts.publishedPlayers}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Verified player dossiers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Scout reports</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-bold tabular-nums text-foreground">
            {counts.publishedReports}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Live observations & notes</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active watchlists</span>
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-bold tabular-nums text-foreground">
            {watchlists.length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Shortlisted prospects</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Account tier</span>
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold uppercase tracking-tight text-foreground">
            {user?.role ?? "Guest"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {user ? "Full scout workspace access" : "Public preview mode"}
          </p>
        </div>
      </div>

      {/* Spotlight Players with Real Cutouts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Spotlight Players</h2>
            <p className="text-xs text-muted-foreground">
              Recently scouted African prospects with verified data and ratings.
            </p>
          </div>
          <Link href="/players" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            View all players
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spotlightPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {player.photoUrl ? (
                  <Image
                    src={player.photoUrl}
                    alt={player.fullName}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold text-muted-foreground">
                    {player.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary">
                    {player.fullName}
                  </span>
                  <span className="text-xs" title={player.nationalityCode ?? "CAF"}>
                    {getFlag(player.nationalityCode)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {player.primaryPositionCode ?? "Player"}
                  </span>
                  <span>·</span>
                  <span className="truncate">{player.currentClub ?? "Free agent"}</span>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Workspace Hub Navigation */}
      <section className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Scouting Workspace</h2>
          <p className="text-xs text-muted-foreground">
            Quick access to core recruitment and evaluation tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <HubCard
            href="/players"
            icon={Users}
            title="Player Database"
            description="Search and filter thousands of players by position, nationality, and metrics."
          />
          <HubCard
            href="/scout"
            icon={Award}
            title="Scout Workspace"
            description="Draft, edit, and publish comprehensive structured scouting reports."
          />
          <HubCard
            href="/watchlists"
            icon={FolderOpen}
            title="Recruitment Watchlists"
            description="Manage target shortlists, transfer windows, and player priority tiers."
          />
          <HubCard
            href="/leagues"
            icon={Trophy}
            title="Leagues & Competitions"
            description="Analyze CAF continental championships, domestic leagues, and club profiles."
          />
          <HubCard
            href="/fpl"
            icon={Sparkles}
            title="Fantasy Analytics"
            description="Track real-time fantasy output and underlying performance metrics."
          />
          <HubCard
            href="/settings"
            icon={SlidersHorizontal}
            title="Scout Settings"
            description="Manage your account, credentials, scouting biography, and notification preferences."
          />
        </div>
      </section>
    </div>
  );
}
