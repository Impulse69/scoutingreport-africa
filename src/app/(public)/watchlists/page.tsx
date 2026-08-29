import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Plus, Users, ArrowRight, Sparkles, FolderPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listWatchlistsForUser } from "@/lib/features/watchlists/queries";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateWatchlistForm } from "./create-form";

export const metadata: Metadata = { title: "Talent Watchlists & Recruitment Pipelines" };

export default async function WatchlistsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in?next=/watchlists");

  const watchlists = await listWatchlistsForUser(user.id);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <Bookmark className="h-3.5 w-3.5" /> Pipeline Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Talent Watchlists
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Organize scouted African footballers into recruitment pipelines, target brackets, and private shortlists.
          </p>
        </div>

        <Link
          href="/players"
          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          Browse Players to Add →
        </Link>
      </div>

      {/* Create Watchlist Container */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <FolderPlus className="h-4 w-4" />
          <span>New Recruitment Pipeline</span>
        </div>
        <CreateWatchlistForm />
      </div>

      {/* Watchlist Collections */}
      {watchlists.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No watchlists created yet"
          description="Create your first watchlist above to start organizing and monitoring rising African prospects."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {watchlists.map((w) => (
            <Link
              key={w.id}
              href={`/watchlists/${w.id}`}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0c1218] p-6 hover:border-amber-500/40 hover:bg-[#121921] transition-all shadow-lg"
            >
              <div className="min-w-0 space-y-1">
                <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors truncate">
                  {w.name}
                </h3>
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-200">
                    {w.playerCount} player{w.playerCount === 1 ? "" : "s"}
                  </span>
                  <span>•</span>
                  <span>Created {new Date(w.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-amber-500/15 group-hover:text-amber-400 transition-colors">
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
