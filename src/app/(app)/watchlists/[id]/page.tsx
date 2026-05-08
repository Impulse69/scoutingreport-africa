import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users } from "lucide-react";
import { getWatchlist, listWatchlistPlayers } from "@/lib/features/watchlists/queries";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { POSITIONS } from "@/lib/shared/constants";
import { WatchlistRowActions } from "./row-actions";

function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
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
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <PageHeader
        eyebrow="Watchlist"
        title={watchlist.name}
        description={`${watchlist.playerCount} player${watchlist.playerCount === 1 ? "" : "s"} • created ${new Date(watchlist.createdAt).toLocaleDateString()}`}
      />

      <section className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {watchlist.playerCount} tracked
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(watchlist.createdAt).toLocaleDateString()}
        </span>
      </section>

      {players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No players in this watchlist"
          description="Add players from any player profile to see them here."
        />
      ) : (
        <ul className="space-y-3">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-orange-500/40"
            >
              <Link href={`/players/${p.slug}`} className="flex flex-1 items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border/60 bg-muted shrink-0">
                  {p.photoUrl ? (
                    <Image
                      src={p.photoUrl}
                      alt={p.fullName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-xs font-bold text-muted-foreground">
                      {p.fullName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {positionLabel(p.primaryPositionCode)}
                    {p.currentClub ? ` • ${p.currentClub}` : ""}
                    {p.nationalityCode ? ` • ${p.nationalityCode}` : ""}
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Added {new Date(p.addedAt).toLocaleDateString()}
                </Badge>
              </Link>
              <WatchlistRowActions watchlistId={id} playerId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
