import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Bookmark, ArrowLeft, Trash2, ArrowRight } from "lucide-react";
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
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/watchlists"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all watchlists
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
              <Bookmark className="h-3.5 w-3.5" /> Pipeline Dossier
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{watchlist.name}</h1>
            <p className="text-xs text-slate-400">
              Created on {new Date(watchlist.createdAt).toLocaleDateString()} · {watchlist.playerCount} tracked prospect{watchlist.playerCount === 1 ? "" : "s"}
            </p>
          </div>

          <Link
            href="/players"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Add Prospects</span> <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Players in Watchlist */}
      {players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No players added to this pipeline yet"
          description="Browse the Player Intelligence Catalogue and click 'Add to Watchlist' on any player dossier."
        />
      ) : (
        <div className="space-y-3">
          {players.map((p) => {
            const flag = flagFor(p.nationalityCode);
            const pos = positionLabel(p.primaryPositionCode);

            return (
              <div
                key={p.id}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0c1218] p-4 sm:p-5 hover:border-emerald-500/40 hover:bg-[#111a22] transition-all shadow-lg"
              >
                <Link href={`/players/${p.slug}`} className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.fullName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-sm font-black text-emerald-400/80 bg-[#121921]">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{flag}</span>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                        {p.fullName}
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {p.primaryPositionCode ?? "PL"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {pos} {p.currentClub ? `· ${p.currentClub}` : "· Free agent"}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center text-xs text-slate-400">
                    Added {new Date(p.addedAt).toLocaleDateString()}
                  </div>
                </Link>

                <div className="shrink-0 flex items-center gap-2">
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
