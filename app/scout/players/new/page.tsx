import type { Metadata } from "next";

export const metadata: Metadata = { title: "New player" };

export default function NewPlayerPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight">Create a player</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Player creation form lands in Phase 2.
      </p>
    </div>
  );
}
