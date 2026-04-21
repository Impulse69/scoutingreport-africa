import type { Metadata } from "next";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = { title: "My watchlists" };

export default function WatchlistsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">My watchlists</h1>
      <p className="mt-2 text-muted-foreground">
        Save players you want to come back to.
      </p>
      <div className="mt-10 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
        <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-medium">You haven't saved any players yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse players and click the bookmark icon to add them to a
          watchlist.
        </p>
      </div>
    </div>
  );
}
