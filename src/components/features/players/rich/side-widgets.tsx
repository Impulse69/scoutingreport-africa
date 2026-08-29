import Link from "next/link";
import { Wallet, Calendar, MapPin, Building2 } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";
import { isLiveRoute } from "@/lib/shared/routes";

/**
 * Rich profiles carry names pulled from ESPN and demo fixtures, most of which
 * have no page on this site. Link a name only when it resolves — `linkable`
 * holds the slugs that actually exist — and render the rest as plain text.
 */
function canLinkPlayer(slug: string, linkable?: Set<string>) {
  return !!linkable?.has(slug);
}

export function SimilarPlayers({
  player,
  linkable,
}: {
  player: RichPlayerProfile;
  linkable?: Set<string>;
}) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Similar Players
        </p>
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
          ALL
        </span>
      </header>
      <ul className="divide-y divide-white/5">
        {player.similarPlayers.map((p) => {
          const row = (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 font-mono text-[10px] font-bold text-zinc-400">
                {p.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-semibold text-white">{p.name}</p>
                <p className="font-mono text-[10px] text-zinc-500">
                  {p.club} · {p.age} yrs
                </p>
              </div>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-cyan-300">
                {p.similarity}
              </span>
            </>
          );

          return (
            <li key={p.slug}>
              {canLinkPlayer(p.slug, linkable) ? (
                <Link
                  href={`/players/${p.slug}`}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-white/5"
                >
                  {row}
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-6 py-3">{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function DefensiveHeatmap({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Defensive Heatmap
        </p>
        <p className="font-mono text-[10px] text-zinc-500">Tackles + interceptions</p>
      </header>

      <div className="px-6 py-5">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-lg border border-white/5 bg-[#0A0F0A]">
          <svg
            viewBox="0 0 100 133"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <rect
              x="0"
              y="0"
              width="100"
              height="133"
              fill="transparent"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.4"
            />
            <line
              x1="0"
              y1="66.5"
              x2="100"
              y2="66.5"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
            <circle
              cx="50"
              cy="66.5"
              r="9"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
            <rect
              x="22"
              y="0"
              width="56"
              height="14"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
            <rect
              x="36"
              y="0"
              width="28"
              height="6"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
            <rect
              x="22"
              y="119"
              width="56"
              height="14"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
          </svg>
          {/* heatmap blobs */}
          {player.heatmap.map((h, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: "translate(-50%, -50%)",
                width: `${42 + h.intensity * 30}px`,
                height: `${42 + h.intensity * 30}px`,
                background: `radial-gradient(circle, rgba(6,182,212,${0.55 * h.intensity}) 0%, rgba(6,182,212,0) 70%)`,
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          GK · Defending
        </p>
      </div>
    </section>
  );
}

const fmtMoney = (v: number) => {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(0)}K`;
  return `€${v}`;
};

export function MarketValueCard({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Transfer History
        </p>
      </header>

      <div className="px-6 py-5">
        <div className="mb-4 rounded-lg border border-orange-500/30 bg-orange-500/5 px-4 py-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400">
            Est. Market Value
          </p>
          <p className="mt-1 font-mono text-3xl font-black tabular-nums text-white">
            {fmtMoney(player.marketValue)}
          </p>
        </div>

        <ul className="space-y-2.5 font-mono text-xs">
          {player.career.slice(0, 5).map((c, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-zinc-500">{c.season}</span>
              <Building2 className="h-3 w-3 text-zinc-600" />
              <span className="flex-1 truncate text-zinc-200">{c.club}</span>
              <span className="text-zinc-500">{c.apps}&apos;</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CareerHistory({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Character History
        </p>
        <button className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
          Full timeline →
        </button>
      </header>

      <div className="overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-white/5">
            <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-6 py-3">Season</th>
              <th className="px-3 py-3">Club</th>
              <th className="px-3 py-3">League</th>
              <th className="px-3 py-3 text-right">Apps</th>
              <th className="px-3 py-3 text-right">G</th>
              <th className="px-3 py-3 text-right">A</th>
              <th className="px-6 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {player.career.map((c, i) => (
              <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-6 py-3 text-zinc-400">{c.season}</td>
                <td className="px-3 py-3 text-white">{c.club}</td>
                <td className="px-3 py-3 text-zinc-400">{c.league}</td>
                <td className="px-3 py-3 text-right tabular-nums text-zinc-300">{c.apps}</td>
                <td className="px-3 py-3 text-right tabular-nums text-zinc-300">{c.goals}</td>
                <td className="px-3 py-3 text-right tabular-nums text-zinc-300">{c.assists}</td>
                <td className="px-6 py-3 text-right font-bold tabular-nums text-cyan-300">
                  {c.rating.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ScoutNotes lives in ./scout-notes.tsx — auth-gated and persisted.

export function AboutPlayer({
  player,
  linkable,
}: {
  player: RichPlayerProfile;
  linkable?: Set<string>;
}) {
  return (
    <section>
      <h3 className="font-mono text-sm font-bold text-white">About {player.fullName}</h3>
      <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-400">{player.about}</p>

      <h4 className="mt-8 font-mono text-sm font-bold text-white">Explore More</h4>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {player.exploreMore
          // These come from the ESPN bundle and point at league/player pages
          // that mostly don't exist here. Show only the ones that resolve.
          .filter((e) => {
            const slug = e.href.startsWith("/players/")
              ? e.href.slice("/players/".length)
              : null;
            return slug ? canLinkPlayer(slug, linkable) : isLiveRoute(e.href);
          })
          .map((e) => (
            <li key={e.label}>
              <Link
                href={e.href}
                className="block rounded-md border border-white/5 bg-[#0E0E0E] px-3 py-2 font-mono text-[11px] text-zinc-300 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-300"
              >
                {e.label}
              </Link>
            </li>
          ))}
      </ul>

      <p className="mt-6 flex items-center gap-2 font-mono text-[10px] text-zinc-600">
        <Calendar className="h-3 w-3" />
        Stats updated weekly
        <span className="mx-1">·</span>
        <MapPin className="h-3 w-3" />
        Location-based bias filtered
        <span className="mx-1">·</span>
        <Wallet className="h-3 w-3" />
        Market values estimated
      </p>
    </section>
  );
}
