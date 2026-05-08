import Link from "next/link";
import {
  BarChart3,
  FileText,
  Activity,
  Sparkles,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";

// ─── Detailed Stats ──────────────────────────────────────────────

export function DetailedStatsTab({ player }: { player: RichPlayerProfile }) {
  const groups = player.detailedStats ?? [];
  if (groups.length === 0) {
    return (
      <Empty
        icon={BarChart3}
        title="No detailed stats yet"
        description="Detailed stats appear here once ESPN exposes a comprehensive split for this player. Top European and South American leagues are richest."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((g) => (
        <section
          key={g.label}
          className="rounded-xl border border-white/5 bg-[#0E0E0E]"
        >
          <header className="border-b border-white/5 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
              {g.label}
            </p>
          </header>
          <ul className="divide-y divide-white/5">
            {g.rows.map((r, i) => (
              <li
                key={`${g.label}-${i}`}
                className="flex items-center justify-between gap-3 px-5 py-2.5 font-mono text-xs"
              >
                <span className="text-zinc-400">{r.label}</span>
                <span className="font-bold tabular-nums text-cyan-300">{r.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ─── Match Log ───────────────────────────────────────────────────

export function MatchLogTab({ player }: { player: RichPlayerProfile }) {
  const log = player.matchLog ?? [];
  if (log.length === 0) {
    return (
      <Empty
        icon={FileText}
        title="No match log available"
        description="Match-by-match data will populate once ESPN's gamelog endpoint covers this player. Try a Premier League / La Liga / Serie A name."
      />
    );
  }

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
            Match Log
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
            Last {log.length} match{log.length === 1 ? "" : "es"} · live from ESPN gamelog
          </p>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead className="bg-white/5">
            <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-2 py-3 text-center">Result</th>
              <th className="px-2 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Mins</th>
              <th className="px-4 py-3 text-right">G</th>
              <th className="px-4 py-3 text-right">A</th>
              <th className="px-4 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {log.map((m, i) => {
              const tone =
                m.result === "W"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : m.result === "D"
                    ? "border-zinc-500/40 bg-zinc-500/10 text-zinc-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300";
              return (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-zinc-400">
                    {m.date ? new Date(m.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-white">
                    <span className="text-[10px] text-zinc-500">
                      {m.homeAway === "away" ? "@" : m.homeAway === "home" ? "vs" : ""}
                    </span>{" "}
                    {m.opponent}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded border text-[10px] font-bold ${tone}`}
                    >
                      {m.result}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums text-zinc-400">{m.score}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {m.minutes || "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {m.goals || ""}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {m.assists || ""}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-cyan-300">
                    {m.rating > 0 ? m.rating.toFixed(2) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Trends ──────────────────────────────────────────────────────

export function TrendsTab({ player }: { player: RichPlayerProfile }) {
  const log = (player.matchLog ?? []).filter((m) => m.rating > 0).slice(0, 12).reverse();
  if (log.length < 3) {
    return (
      <Empty
        icon={TrendingUp}
        title="Need more matches to chart trends"
        description={`Trend lines appear after ${3 - log.length} more rated match${3 - log.length === 1 ? "" : "es"}.`}
      />
    );
  }

  const max = Math.max(...log.map((l) => l.rating), 9);
  const min = Math.min(...log.map((l) => l.rating), 5);
  const span = max - min || 1;

  // Compute simple rolling average (window=3)
  const rolling = log.map((_, i) => {
    const window = log.slice(Math.max(0, i - 2), i + 1);
    return window.reduce((a, b) => a + b.rating, 0) / window.length;
  });

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Match Rating Trend
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
          Per-match rating + 3-game rolling average · last {log.length} games
        </p>
      </header>
      <div className="px-6 py-6">
        <svg viewBox="0 0 600 200" className="w-full h-[220px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(6,182,212,0.35)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              x2="600"
              y1={(i / 4) * 200}
              y2={(i / 4) * 200}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* per-match dots + line */}
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            points={log
              .map((l, i) => {
                const x = (i / Math.max(log.length - 1, 1)) * 600;
                const y = 200 - ((l.rating - min) / span) * 180 - 10;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {log.map((l, i) => {
            const x = (i / Math.max(log.length - 1, 1)) * 600;
            const y = 200 - ((l.rating - min) / span) * 180 - 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="rgba(255,255,255,0.4)"
              />
            );
          })}
          {/* rolling average area */}
          <polygon
            fill="url(#trend-fill)"
            points={[
              ...rolling.map((r, i) => {
                const x = (i / Math.max(rolling.length - 1, 1)) * 600;
                const y = 200 - ((r - min) / span) * 180 - 10;
                return `${x},${y}`;
              }),
              `600,200`,
              `0,200`,
            ].join(" ")}
          />
          <polyline
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinejoin="round"
            points={rolling
              .map((r, i) => {
                const x = (i / Math.max(rolling.length - 1, 1)) * 600;
                const y = 200 - ((r - min) / span) * 180 - 10;
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>{log[0]?.date ? new Date(log[0].date).toLocaleDateString() : ""}</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white/40" /> Match
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> 3-game avg
            </span>
          </span>
          <span>{log[log.length - 1]?.date ? new Date(log[log.length - 1].date).toLocaleDateString() : ""}</span>
        </div>
      </div>
    </section>
  );
}

// ─── Reverse History ─────────────────────────────────────────────

export function ReverseHistoryTab({ player }: { player: RichPlayerProfile }) {
  return (
    <Empty
      icon={GitBranch}
      title="Scouting history coming soon"
      description={`Chronological scouting history for ${player.shortName} — ratings, recommendations, and notes — will appear here once the dashboard's report flow is restructured.`}
    />
  );
}

// ─── Insights ────────────────────────────────────────────────────

export function InsightsTab({ player }: { player: RichPlayerProfile }) {
  const insights = player.insights ?? [];
  if (insights.length === 0) {
    return (
      <Empty
        icon={Sparkles}
        title="No insights yet"
        description="Stat-driven takeaways generate once we have appearance data."
      />
    );
  }

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
            Key Insights
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
            Derived from live ESPN stats
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-orange-500/70" />
      </header>
      <ul className="divide-y divide-white/5">
        {insights.map((line, i) => (
          <li key={i} className="flex items-start gap-3 px-6 py-4">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 font-mono text-[10px] font-bold text-cyan-300">
              {i + 1}
            </span>
            <p className="font-mono text-xs leading-relaxed text-zinc-200">{line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Empty state ─────────────────────────────────────────────────

function Empty({
  icon: Icon,
  title,
  description,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] py-14 px-6 text-center">
      <Icon className="mx-auto h-6 w-6 text-zinc-500" />
      <p className="mt-3 font-mono text-sm text-zinc-300">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-md text-xs text-zinc-500">{description}</p>
      ) : null}
      {cta ? <div className="mt-4">{cta}</div> : null}
    </div>
  );
}
