import { TrendingUp } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">Performance</h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">Season form, rolling xG, finishing efficiency.</p>
      </header>
      <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] py-16 text-center">
        <TrendingUp className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 font-mono text-sm text-zinc-300">Performance dashboards land next sprint</p>
        <p className="mt-1 text-xs text-zinc-500">Will surface rolling xG/xGA, ppda, possession share, and form streaks.</p>
      </div>
    </div>
  );
}
