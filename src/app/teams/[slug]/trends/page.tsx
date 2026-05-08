import { LineChart } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">Trends</h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">Multi-season comparisons, style shifts, manager fingerprints.</p>
      </header>
      <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] py-16 text-center">
        <LineChart className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 font-mono text-sm text-zinc-300">Trend graphs unlock once historical seasons are seeded</p>
        <p className="mt-1 text-xs text-zinc-500">Will compare current style vs prior 3 seasons and flag deltas.</p>
      </div>
    </div>
  );
}
