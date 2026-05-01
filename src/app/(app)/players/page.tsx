import type { Metadata } from "next";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Search scouted African footballers by position, age, nationality, and rating.",
};

export default function PlayersPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="mt-2 text-muted-foreground">
            Search and filter scouted African players.
          </p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-20 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="mt-4 font-medium">No players yet</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Once scouts publish their first reports, players will appear here with
          search, filters, and aggregated ratings.
        </p>
      </div>
    </div>
  );
}
