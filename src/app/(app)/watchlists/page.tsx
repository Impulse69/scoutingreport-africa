import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Plus, Users, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listWatchlistsForUser } from "@/lib/features/watchlists/queries";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateWatchlistForm } from "./create-form";

export const metadata: Metadata = { title: "My watchlists" };

export default async function WatchlistsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in?next=/watchlists");

  const watchlists = await listWatchlistsForUser(user.id);

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <PageHeader
        eyebrow="Saved"
        title="My watchlists"
        description="Group players you want to come back to. Each list is private to you."
      />

      <div className="mb-8 rounded-2xl border border-border/60 bg-card/40 p-5">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
          <Plus className="h-3.5 w-3.5" />
          New watchlist
        </p>
        <CreateWatchlistForm />
      </div>

      {watchlists.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No watchlists yet"
          description="Create one above, then visit a player profile to add them."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {watchlists.map((w) => (
            <li key={w.id}>
              <Link
                href={`/watchlists/${w.id}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-orange-500/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold group-hover:text-orange-500 transition-colors">
                    {w.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {w.playerCount} player{w.playerCount === 1 ? "" : "s"}
                    <span className="mx-1">•</span>
                    {new Date(w.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-orange-500" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
