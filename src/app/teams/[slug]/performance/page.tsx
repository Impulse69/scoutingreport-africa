import { TrendingUp } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Performance</h1>
        <p className="mt-2 text-xs text-muted-foreground">Season form, rolling xG, finishing efficiency.</p>
      </header>
      <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center">
        <TrendingUp className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-3 text-sm text-foreground">Performance dashboards land next sprint</p>
        <p className="mt-1 text-xs text-muted-foreground">Will surface rolling xG/xGA, PPDA, possession share, and form streaks.</p>
      </div>
    </div>
  );
}
