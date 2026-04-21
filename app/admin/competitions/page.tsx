import type { Metadata } from "next";

export const metadata: Metadata = { title: "Competitions" };

export default function AdminCompetitionsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Competitions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reference data. Seeded from `supabase/seed.sql`.
      </p>
    </div>
  );
}
