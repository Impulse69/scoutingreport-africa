import { LineChart } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Trends</h1>
        <p className="mt-2 text-xs text-muted-foreground">Multi-season comparisons, style shifts, manager fingerprints.</p>
      </header>
      <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center">
        <LineChart className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-3 text-sm text-foreground">Trend graphs unlock once historical seasons are seeded</p>
        <p className="mt-1 text-xs text-muted-foreground">Will compare current style against prior seasons and flag changes.</p>
      </div>
    </div>
  );
}
