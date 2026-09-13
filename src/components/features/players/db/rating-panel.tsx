import { BarChart3, Star, PlusCircle } from "lucide-react";
import Link from "next/link";
import type { CategoryAverage } from "@/lib/features/players/queries";
import { RATING_CATEGORY_LABELS } from "@/lib/shared/constants";

export function RatingPanel({
  ratings,
  reportCount,
  playerId,
}: {
  ratings: CategoryAverage[];
  reportCount: number;
  playerId?: string;
}) {
  const hasAnything = ratings.some(
    (r) => r.overall !== null || r.subAreas.length > 0,
  );

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Ratings
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {reportCount === 0
            ? "No ratings yet"
            : `Averaged across ${reportCount} published evaluation${reportCount === 1 ? "" : "s"}`}
        </p>
      </header>

      {!hasAnything ? (
        <div className="px-6 py-12 text-center space-y-3 bg-muted/50">
          <Star className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
          <p className="text-sm font-bold text-foreground">
            No published ratings yet
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Technical, tactical, physical, and mentality ratings will generate automatically once a verified scout publishes a match evaluation.
          </p>
          {playerId && (
            <div className="pt-2">
              <Link
                href={`/scout/reports/new?player=${playerId}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Submit report</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-border bg-card md:grid-cols-2 md:divide-x md:divide-y-0">
          {ratings.map((cat) => (
            <div key={cat.category} className="p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {RATING_CATEGORY_LABELS[cat.category]}
                </h3>
                <span className="font-mono text-lg font-semibold tabular-nums text-primary">
                  {cat.overall !== null ? cat.overall.toFixed(1) : "—"}
                  <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                    /5.0
                  </span>
                </span>
              </div>

              {cat.subAreas.length > 0 ? (
                <ul className="space-y-3">
                  {cat.subAreas.map((sub) => (
                    <li key={sub.key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{sub.label}</span>
                        <span className="font-mono font-semibold text-foreground tabular-nums">
                          {sub.avg.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(sub.avg / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-muted-foreground font-mono italic">
                  Sub-area metrics pending observation data.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
