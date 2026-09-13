import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Users, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listWatchlistsForUser } from "@/lib/features/watchlists/queries";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateWatchlistForm } from "./create-form";

export const metadata: Metadata = { title: "Watchlists" };

export default async function WatchlistsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in?next=/watchlists");

  const watchlists = await listWatchlistsForUser(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Watchlists
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            Group players you want to come back to. Each list is private to you.
          </p>
        </div>

        <Link
          href="/players"
          className="self-start rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent sm:self-auto"
        >
          Browse players
        </Link>
      </div>

      {/* Create */}
      <section className="rounded-lg border border-border bg-card">
        <header className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">New watchlist</h2>
        </header>
        <div className="p-5">
          <CreateWatchlistForm />
        </div>
      </section>

      {/* Lists */}
      {watchlists.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No watchlists yet"
          description="Create one above, then add players from their profile."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {watchlists.map((w) => (
            <Link
              key={w.id}
              href={`/watchlists/${w.id}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0 space-y-1">
                <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                  {w.name}
                </h3>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span className="tabular-nums">
                    {w.playerCount} player{w.playerCount === 1 ? "" : "s"}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
