import { BarChart3, Star, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";
import type { CategoryAverage } from "@/lib/features/players/queries";
import { RATING_CATEGORY_LABELS } from "@/lib/shared/constants";

const CATEGORY_ACCENT: Record<string, string> = {
  technical: "bg-gradient-to-r from-[#9C3F00] to-[#CC5500]",
  tactical: "bg-gradient-to-r from-[#8C4E2E] to-[#E27E12]",
  physical: "bg-gradient-to-r from-[#CC5500] to-[#FFB693]",
  mentality: "bg-gradient-to-r from-[#005AB4] to-[#0073E1]",
};

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
    <section className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] overflow-hidden shadow-xl font-['Inter']">
      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] px-6 py-4 bg-[#171B23]">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#CC5500]" />
          <p className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
            Scouting Attribute Breakdown
          </p>
        </div>
        <p className="font-mono text-[10px] text-[#FFB693] uppercase font-bold">
          {reportCount === 0
            ? "Awaiting Verification"
            : `Averaged Across ${reportCount} Published Evaluation${reportCount === 1 ? "" : "s"}`}
        </p>
      </header>

      {!hasAnything ? (
        <div className="px-6 py-12 text-center space-y-3 bg-[#0C0E12]/50">
          <Star className="h-8 w-8 text-slate-500 mx-auto opacity-40" />
          <p className="font-['Public_Sans'] text-sm font-bold text-white">
            No Published Attribute Ratings Yet
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Technical, tactical, physical, and mentality ratings will generate automatically once a verified scout publishes a match evaluation.
          </p>
          {playerId && (
            <div className="pt-2">
              <Link
                href={`/scout/reports/new?player=${playerId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-bold text-xs uppercase tracking-wider industrial-shadow transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Submit Evaluation</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[rgba(224,192,178,0.08)] bg-[#0C0E12]">
          {ratings.map((cat) => (
            <div key={cat.category} className="p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-wider text-white">
                  {RATING_CATEGORY_LABELS[cat.category]}
                </h3>
                <span className="font-mono text-lg font-black text-[#FFB693]">
                  {cat.overall !== null ? cat.overall.toFixed(1) : "—"}
                  <span className="ml-0.5 text-[10px] font-normal text-slate-500">
                    /5.0
                  </span>
                </span>
              </div>

              {cat.subAreas.length > 0 ? (
                <ul className="space-y-3">
                  {cat.subAreas.map((sub) => (
                    <li key={sub.key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">{sub.label}</span>
                        <span className="font-mono font-bold text-white tabular-nums">
                          {sub.avg.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1E232D] overflow-hidden rounded-none">
                        <div
                          className={`h-full ${CATEGORY_ACCENT[cat.category] ?? "bg-[#CC5500]"}`}
                          style={{ width: `${(sub.avg / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono italic">
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
