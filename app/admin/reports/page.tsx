import type { Metadata } from "next";

export const metadata: Metadata = { title: "All reports" };

export default function AdminReportsPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">All reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Moderate, publish, unpublish. Lands in Phase 2.
      </p>
    </div>
  );
}
