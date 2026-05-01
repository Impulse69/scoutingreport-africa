import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Admin dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Moderation queue and recent activity. Wired up in Phase 2.
      </p>
    </div>
  );
}
