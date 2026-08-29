import { BarChart3 } from "lucide-react";
import type { CategoryAverage } from "@/lib/features/players/queries";
import { RATING_CATEGORY_LABELS } from "@/lib/shared/constants";

const CATEGORY_ACCENT: Record<string, string> = {
  technical: "bg-orange-500",
  tactical: "bg-cyan-500",
  physical: "bg-emerald-500",
  mentality: "bg-violet-500",
};

/**
 * Averaged 1–5 ratings across every published report on this player, broken
 * down by the four report categories and their sub-areas.
 */
export function RatingPanel({
  ratings,
  reportCount,
}: {
  ratings: CategoryAverage[];
  reportCount: number;
}) {
  const hasAnything = ratings.some(
    (r) => r.overall !== null || r.subAreas.length > 0,
  );

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-zinc-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
            Scouting ratings
          </p>
        </div>
        <p className="font-mono text-[10px] text-zinc-500">
          {reportCount === 0
            ? "no published reports"
            : `averaged over ${reportCount} report${reportCount === 1 ? "" : "s"}`}
        </p>
      </header>

      {!hasAnything ? (
        <p className="px-6 py-10 text-center font-mono text-[11px] text-zinc-500">
          Ratings appear here once a scout publishes a report on this player.
        </p>
      ) : (
        <div className="grid gap-px bg-white/5 md:grid-cols-2">
          {ratings.map((cat) => (
            <div key={cat.category} className="bg-[#0E0E0E] px-6 py-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                  {RATING_CATEGORY_LABELS[cat.category]}
                </h3>
                <span className="font-mono text-lg font-bold tabular-nums text-white">
                  {cat.overall !== null ? cat.overall.toFixed(1) : "—"}
                  <span className="ml-0.5 text-[10px] font-normal text-zinc-600">
                    /5
                  </span>
                </span>
              </div>

              {cat.subAreas.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {cat.subAreas.map((sub) => (
                    <li key={sub.key} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 truncate font-mono text-[10px] text-zinc-500">
                        {sub.label}
                      </span>
                      <span
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5"
                        role="img"
                        aria-label={`${sub.label}: ${sub.avg} out of 5`}
                      >
                        <span
                          className={`block h-full rounded-full ${
                            CATEGORY_ACCENT[cat.category] ?? "bg-zinc-500"
                          }`}
                          style={{ width: `${(sub.avg / 5) * 100}%` }}
                        />
                      </span>
                      <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums text-zinc-400">
                        {sub.avg.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 font-mono text-[10px] text-zinc-600">
                  No sub-area detail recorded.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
