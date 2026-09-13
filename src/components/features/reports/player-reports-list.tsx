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
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs  tracking-wide text-primary">
            Scout reports
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {reports.length} published
        </p>
      </header>

      <ul className="divide-y divide-border">
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
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {r.match_description ?? "Scouting report"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
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
                  <span className="rounded border border-border bg-muted px-2 py-1 text-xs tabular-nums text-primary">
                    ★ {avg}
                  </span>
                ) : null}
                {r.recruitment_decision ? (
                  <span className="hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-xs  tracking-normal text-primary">
                    <Award className="h-2.5 w-2.5" />
                    {r.recruitment_decision.replace("_", " ")}
                  </span>
                ) : null}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
