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
        title="No detailed stats available"
        description="Detailed stats appear here once ESPN exposes a comprehensive split for this player. Top European and African premier leagues are richest."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((g) => (
        <section
          key={g.label}
          className="rounded-lg border border-border bg-card p-5 shadow-lg"
        >
          <header className="border-b border-border pb-3 mb-3">
            <p className="text-xs font-bold  tracking-normal text-primary">
              {g.label}
            </p>
          </header>
          <ul className="divide-y divide-border">
            {g.rows.map((r, i) => (
              <li
                key={`${g.label}-${i}`}
                className="flex items-center justify-between gap-3 py-2.5 text-xs"
              >
                <span className="text-muted-foreground font-medium">{r.label}</span>
                <span className="font-mono font-bold tabular-nums text-primary">{r.value}</span>
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
        title="No recent match log entries"
        description="Match logs update weekly with minutes played, ratings, and key attacking/defensive contributions."
      />
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden ">
      <header className="border-b border-border px-6 py-4">
        <p className="text-xs font-bold  tracking-normal text-primary">
          Match-by-Match Log (2025/2026)
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-[10px] font-semibold  tracking-normal text-muted-foreground border-b border-border">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Opponent</th>
              <th className="px-5 py-3">Result</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Mins</th>
              <th className="px-5 py-3">Goals</th>
              <th className="px-5 py-3">Assists</th>
              <th className="px-5 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium text-muted-foreground">
            {log.map((m, i) => (
              <tr key={i} className="hover:bg-muted transition-colors">
                <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">
                  {new Date(m.date).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 font-bold text-foreground">{m.opponent}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold  ${
                      m.result === "W"
                        ? "bg-muted text-primary"
                        : m.result === "D"
                        ? "bg-muted text-primary"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {m.result}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono">{m.score}</td>
                <td className="px-5 py-3 font-mono">{m.minutes}&apos;</td>
                <td className="px-5 py-3 font-mono text-primary font-bold">{m.goals}</td>
                <td className="px-5 py-3 font-mono text-primary font-bold">{m.assists}</td>
                <td className="px-5 py-3 text-right font-mono font-bold text-primary">
                  {m.rating?.toFixed(1) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Trends Tab ──────────────────────────────────────────────────

export function TrendsTab({ player }: { player: RichPlayerProfile }) {
  const log = (player.matchLog ?? []).filter((m) => typeof m.rating === "number");
  if (log.length < 2) {
    return (
      <Empty
        icon={TrendingUp}
        title="Not enough match history for trends"
        description="Rating trends plot once at least two competitive match ratings are recorded."
      />
    );
  }

  const ratings = log.map((m) => m.rating);
  const min = Math.max(0, Math.min(...ratings) - 0.5);
  const max = Math.min(10, Math.max(...ratings) + 0.5);
  const span = Math.max(max - min, 1);

  return (
    <section className="rounded-lg border border-border bg-card p-6  space-y-4">
      <header className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <p className="text-xs font-bold  tracking-normal text-primary flex items-center gap-1.5">
            <Activity className="h-4 w-4" /> Match Rating Performance Curve
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Performance progression across the current season
          </p>
        </div>
      </header>

      <div className="relative h-48 w-full pt-4">
        <svg viewBox="0 0 600 200" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            fill="url(#trend-fill)"
            points={[
              ...log.map((l, i) => {
                const x = (i / Math.max(log.length - 1, 1)) * 600;
                const y = 200 - ((l.rating - min) / span) * 180 - 10;
                return `${x},${y}`;
              }),
              "600,200",
              "0,200",
            ].join(" ")}
          />

          {/* Line */}
          <polyline
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinejoin="round"
            points={log
              .map((l, i) => {
                const x = (i / Math.max(log.length - 1, 1)) * 600;
                const y = 200 - ((l.rating - min) / span) * 180 - 10;
                return `${x},${y}`;
              })
              .join(" ")}
          />

          {/* Points */}
          {log.map((l, i) => {
            const x = (i / Math.max(log.length - 1, 1)) * 600;
            const y = 200 - ((l.rating - min) / span) * 180 - 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="var(--primary)"
                stroke="var(--card)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>{log[0]?.date ? new Date(log[0].date).toLocaleDateString() : ""}</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" /> Season Rating Trajectory
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
      title="Scouting timeline and evolution"
      description={`Chronological department evaluations for ${player.shortName} — ratings, ceiling projections, and scouting notes — are catalogued here.`}
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
        title="No tactical insights generated yet"
        description="Stat-driven takeaways generate once appearance and action tracking data is logged."
      />
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6  space-y-4">
      <header className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <p className="text-xs font-bold  tracking-normal text-primary flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> AI & Scout Synthesized Insights
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Derived from match stats and positional metrics
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {insights.map((line, i) => (
          <li key={i} className="flex items-start gap-3.5 p-4 rounded-lg bg-muted border border-border">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-muted text-primary font-mono text-xs font-semibold">
              {i + 1}
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{line}</p>
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
    <div className="rounded-lg border border-dashed border-border bg-card/60 py-14 px-6 text-center space-y-2">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-sm font-bold text-foreground">{title}</p>
      {description && (
        <p className="mx-auto max-w-md text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
