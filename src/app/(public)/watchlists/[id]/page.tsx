import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { getWatchlist, listWatchlistPlayers } from "@/lib/features/watchlists/queries";
import { EmptyState } from "@/components/shared/empty-state";
import { POSITIONS, CAF_COUNTRIES } from "@/lib/shared/constants";
import { WatchlistRowActions } from "./row-actions";

function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
}

function flagFor(code: string | null): string {
  if (!code) return "⚽";
  return CAF_COUNTRIES.find((c) => c.code === code)?.flagEmoji ?? "⚽";
}

export default async function WatchlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const watchlist = await getWatchlist(id);
  if (!watchlist) notFound();

  const players = await listWatchlistPlayers(id);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      <Link
        href="/watchlists"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All watchlists
      </Link>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {watchlist.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Created {new Date(watchlist.createdAt).toLocaleDateString()} ·{" "}
            {watchlist.playerCount} player
            {watchlist.playerCount === 1 ? "" : "s"}
          </p>
        </div>

        <Link
          href="/players"
          className="inline-flex items-center gap-1.5 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:self-auto"
        >
          Add players <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Players */}
      {players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No players in this watchlist yet"
          description="Open a player profile and use the watchlist control to add them."
        />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {players.map((p) => {
            const flag = flagFor(p.nationalityCode);
            const pos = positionLabel(p.primaryPositionCode);

            return (
              <div
                key={p.id}
                className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/60"
              >
                <Link
                  href={`/players/${p.slug}`}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.fullName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                        {p.fullName
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span>{flag}</span>
                      <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                        {p.fullName}
                      </h3>
                      {p.primaryPositionCode && (
                        <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {p.primaryPositionCode}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {pos} {p.currentClub ? `· ${p.currentClub}` : "· Free agent"}
                    </p>
                  </div>

                  <div className="hidden items-center text-xs text-muted-foreground md:flex">
                    Added {new Date(p.addedAt).toLocaleDateString()}
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                  <WatchlistRowActions watchlistId={id} playerId={p.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
