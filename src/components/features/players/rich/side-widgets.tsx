import Link from "next/link";
import { Wallet, Calendar, MapPin, Building2, UserCheck, Activity } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";

function canLinkPlayer(slug: string, linkable?: Set<string>) {
  return !linkable || linkable.has(slug);
}

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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Comparable Archetypes
        </p>
        <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFB693] border border-[#CC5500]/30">
          Similarity
        </span>
      </header>
      <ul className="divide-y divide-[rgba(224,192,178,0.06)]">
        {data.map((p) => {
          const row = (
            <div className="flex items-center gap-3 p-4 hover:bg-[#171B23] transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] font-mono text-[10px] font-black text-[#FFB693]">
                {p.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-['Public_Sans'] text-xs font-bold text-white">{p.name}</p>
                <p className="text-[10px] text-slate-400">
                  {p.club} · {p.age} yrs
                </p>
              </div>
              <span className="rounded-[3px] border border-[#CC5500]/30 bg-[#CC5500]/15 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-[#FFB693]">
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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Positional Territorial Heatmap
        </p>
      </header>
      <div className="p-6">
        <div className="relative aspect-[3/2] w-full rounded-[4px] border border-[rgba(224,192,178,0.1)] bg-[#0C0E12] overflow-hidden">
          {/* Pitch lines */}
          <div className="absolute inset-2 border border-slate-700/40" />
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-slate-700/40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-slate-700/40" />

          {/* Points */}
          {points.map((pt, i) => (
            <div
              key={i}
              className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                backgroundColor: `rgba(204, 85, 0, ${pt.intensity * 0.7})`,
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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Recruitment Valuation
        </p>
        <Wallet className="h-4 w-4 text-[#CC5500]" />
      </header>
      <div className="p-6 space-y-4">
        <div>
          <div className="text-[10px] font-['Public_Sans'] uppercase font-bold text-slate-400">
            Estimated Market Bracket
          </div>
          <div className="font-mono text-2xl font-black text-[#FFB693] mt-0.5">
            €{(val / 1000000).toFixed(1)}M
          </div>
        </div>

        {hist.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[rgba(224,192,178,0.08)]">
            <div className="text-[10px] font-['Public_Sans'] uppercase font-bold text-slate-400">
              Historical Valuation Trend
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {hist.map((h) => (
                <div key={h.season} className="flex justify-between">
                  <span className="text-slate-400">{h.season}</span>
                  <span className="text-white font-bold">€{(h.value / 1000000).toFixed(1)}M</span>
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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Tactical Profile Brief
        </p>
      </header>
      <div className="p-6 space-y-3 text-xs text-slate-300 leading-relaxed">
        <p>
          Standardized profile for <span className="font-bold text-white">{player.fullName}</span>, currently representing <span className="text-[#FFB693] font-bold">{player.club}</span> in {player.league}.
        </p>
        <p>
          Tactical role: <span className="text-white font-bold">{player.estimatedProfile}</span> with high physical ceiling and progressive action volume.
        </p>
      </div>
    </section>
  );
}

export function CareerHistory({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
          Career Records
        </p>
      </header>
      <div className="divide-y divide-[rgba(224,192,178,0.06)] font-mono text-xs">
        {player.career.map((c, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-['Public_Sans'] text-xs font-bold text-white">{c.club}</div>
              <div className="text-[10px] text-slate-400">{c.season} · {c.league}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#FFB693]">{c.apps} Apps · {c.goals} G</div>
              <div className="text-[10px] text-slate-400">Rating {c.rating.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
