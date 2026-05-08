import Link from "next/link";
import { ScrollText, ArrowRight, Award } from "lucide-react";
import type { listPublishedReportsForPlayerSlug } from "@/lib/features/reports/queries";

type Props = {
  slug: string;
  reports: Awaited<ReturnType<typeof listPublishedReportsForPlayerSlug>>;
};

export function PlayerReportsList({ slug, reports }: Props) {
  if (reports.length === 0) return null;

  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-3.5 w-3.5 text-zinc-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
            Scout reports
          </p>
        </div>
        <p className="font-mono text-[10px] text-zinc-500">
          {reports.length} published
        </p>
      </header>

      <ul className="divide-y divide-white/5">
        {reports.map((r) => {
          const stars = r.ratings
            .filter((rt) => rt.sub_area === "overall")
            .map((rt) => rt.rating);
          const avg =
            stars.length > 0
              ? (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1)
              : null;
          return (
            <li key={r.id}>
              <Link
                href={`/players/${slug}/reports/${r.id}`}
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold text-white truncate">
                    {r.match_description ?? "Scouting report"}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-500 truncate">
                    {r.match_date ?? "—"}
                    {r.author?.display_name
                      ? ` · ${r.author.display_name}`
                      : ""}
                    {r.published_at
                      ? ` · ${new Date(r.published_at).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                {avg ? (
                  <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] tabular-nums text-cyan-300">
                    ★ {avg}
                  </span>
                ) : null}
                {r.recruitment_decision ? (
                  <span className="hidden md:inline-flex items-center gap-1 rounded border border-orange-500/40 bg-orange-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-orange-300">
                    <Award className="h-2.5 w-2.5" />
                    {r.recruitment_decision.replace("_", " ")}
                  </span>
                ) : null}
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-400" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
