import Link from "next/link";
import { Wallet } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";

export function SimilarPlayers({
  player,
  similar,
  linkable,
}: {
  player?: RichPlayerProfile;
  similar?: { slug: string; name: string; club: string; age: number; similarity: number }[];
  linkable?: Set<string>;
}) {
  const data = similar ?? player?.similarPlayers ?? [];

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Similar players
        </p>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-primary border border-border">
          Similarity
        </span>
      </header>
      <ul className="divide-y divide-border">
        {data.map((p) => {
          const row = (
            <div className="flex items-center gap-3 p-4 hover:bg-muted transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted border border-border font-mono text-[10px] font-semibold text-primary">
                {p.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {p.club} · {p.age} yrs
                </p>
              </div>
              <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-primary">
                {p.similarity}%
              </span>
            </div>
          );

          // Comparable names come from ESPN/demo data and mostly have no page
          // here. Link only the slugs that resolve; the rest stay plain text
          // rather than 404ing.
          return (
            <li key={p.slug}>
              {linkable?.has(p.slug) ? (
                <Link href={`/players/${p.slug}`}>{row}</Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function DefensiveHeatmap({
  heatmap,
  player,
}: {
  heatmap?: { x: number; y: number; intensity: number }[];
  player?: RichPlayerProfile;
}) {
  const points = heatmap ?? player?.heatmap ?? [];

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Positional Territorial Heatmap
        </p>
      </header>
      <div className="p-6">
        <div className="relative aspect-[3/2] w-full rounded-md border border-border bg-muted overflow-hidden">
          {/* Pitch lines */}
          <div className="absolute inset-2 border border-border" />
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-muted" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-border" />

          {/* Points */}
          {points.map((pt, i) => (
            <div
              key={i}
              className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-md"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                opacity: Math.min(0.75, Math.max(0.15, pt.intensity * 0.7)),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketValueCard({
  value,
  history,
  player,
}: {
  value?: number;
  history?: { season: string; value: number }[];
  player?: RichPlayerProfile;
}) {
  const val = value ?? player?.marketValue ?? 0;
  const hist = history ?? player?.marketValueHistory ?? [];

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Recruitment Valuation
        </p>
        <Wallet className="h-4 w-4 text-primary" />
      </header>
      <div className="p-6 space-y-4">
        <div>
          <div className="text-[10px]  font-bold text-muted-foreground">
            Estimated Market Bracket
          </div>
          <div className="font-mono text-2xl font-semibold text-primary mt-0.5">
            €{(val / 1000000).toFixed(1)}M
          </div>
        </div>

        {hist.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="text-[10px]  font-bold text-muted-foreground">
              Historical Valuation Trend
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {hist.map((h) => (
                <div key={h.season} className="flex justify-between">
                  <span className="text-muted-foreground">{h.season}</span>
                  <span className="text-foreground font-bold">€{(h.value / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function AboutPlayer({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Tactical Profile Brief
        </p>
      </header>
      <div className="p-6 space-y-3 text-xs text-muted-foreground leading-relaxed">
        <p>{player.about}</p>
      </div>
    </section>
  );
}

export function CareerHistory({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden  ">
      <header className="border-b border-border px-6 py-4 bg-muted">
        <p className="text-xs font-semibold  tracking-normal text-foreground">
          Career Records
        </p>
      </header>
      <div className="divide-y divide-border font-mono text-xs">
        {player.career.map((c, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-foreground">{c.club}</div>
              <div className="text-[10px] text-muted-foreground">{c.season} · {c.league}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{c.apps} Apps · {c.goals} G</div>
              <div className="text-[10px] text-muted-foreground">Rating {c.rating.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
