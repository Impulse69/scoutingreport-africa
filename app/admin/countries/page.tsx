import type { Metadata } from "next";

export const metadata: Metadata = { title: "Countries" };

export default function AdminCountriesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        CAF nations seeded at install time.
      </p>
    </div>
  );
}
