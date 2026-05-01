import type { Metadata } from "next";

export const metadata: Metadata = { title: "All players" };

export default function AdminPlayersPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">All players</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Includes drafts. Lands in Phase 2.
      </p>
    </div>
  );
}
