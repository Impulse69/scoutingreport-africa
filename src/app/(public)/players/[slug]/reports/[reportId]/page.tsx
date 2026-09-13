import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ArrowLeft,
  CalendarDays,
  Clock,
  Activity,
  ScrollText,
  Sparkles,
  AlertTriangle,
  Compass,
  Award,
  Trophy,
} from "lucide-react";
import { getReportById } from "@/lib/features/reports/queries";
import {
  RATING_CATEGORIES,
  RATING_CATEGORY_LABELS,
  RATING_SUB_AREAS_BY_CATEGORY,
  type RatingCategory,
} from "@/lib/shared/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; reportId: string }>;
}): Promise<Metadata> {
  const { slug, reportId } = await params;
  const report = await getReportById(reportId);

  if (!report || report.status !== "published" || report.player?.slug !== slug) {
    return { title: "Report", robots: { index: false } };
  }

  const name = report.player.full_name;
  const context = report.match_description ?? "Scouting report";

  return {
    title: `${name} — ${context}`,
    description:
      report.projection?.slice(0, 160) ||
      `Structured scouting report on ${name}${
        report.match_date ? `, ${report.match_date}` : ""
      }.`,
    openGraph: {
      type: "article",
      title: `${name} — ${context}`,
      publishedTime: report.published_at ?? undefined,
    },
  };
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ slug: string; reportId: string }>;
}) {
  const { slug, reportId } = await params;
  const report = await getReportById(reportId);

  if (!report || report.status !== "published" || report.player?.slug !== slug) {
    notFound();
  }

  const player = report.player!;

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10 space-y-8">
      <Link
        href={`/players/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to {player.full_name}
      </Link>

      {/* Hero */}
      <header className="rounded-lg border border-border bg-card px-6 py-6">
        <p className="text-xs font-medium text-muted-foreground">
          Scout report
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {player.full_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {player.primary_position_code ?? "—"}
          {player.nationality_code ? ` · ${player.nationality_code}` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" />
            {report.match_date ?? "—"}
          </span>
          {report.match_description ? (
            <span className="flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              {report.match_description}
            </span>
          ) : null}
          {report.competition?.name ? (
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3 w-3" />
              {report.competition.name}
            </span>
          ) : null}
          {report.minutes_observed != null ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {report.minutes_observed}&apos; observed
            </span>
          ) : null}
          <span className="capitalize">· {report.observation_type}</span>
          {report.author?.display_name ? (
            <span>
              · by{" "}
              <span className="text-muted-foreground">{report.author.display_name}</span>
            </span>
          ) : null}
          {report.published_at ? (
            <span>· published {new Date(report.published_at).toLocaleDateString()}</span>
          ) : null}
        </div>
      </header>

      {/* Ratings grid */}
      <section className="grid gap-4 md:grid-cols-2">
        {RATING_CATEGORIES.map((cat) => (
          <CategoryCard key={cat} category={cat} report={report} />
        ))}
      </section>

      {/* Strengths */}
      {report.strengths.length > 0 ? (
        <BulletSection
          icon={Sparkles}
          title="Key strengths"
          tone="positive"
          items={report.strengths}
        />
      ) : null}

      {/* Improvements */}
      {report.improvements.length > 0 || report.improvements_notes ? (
        <BulletSection
          icon={AlertTriangle}
          title="Improvements & risks"
          tone="warning"
          items={report.improvements}
          note={report.improvements_notes}
        />
      ) : null}

      {/* Projection + Role fit */}
      {report.projection || report.role_fit ? (
        <section className="grid gap-4 md:grid-cols-2">
          {report.projection ? (
            <ProseCard icon={Compass} title="Projection (12–24 months)">
              {report.projection}
            </ProseCard>
          ) : null}
          {report.role_fit ? (
            <ProseCard icon={Compass} title="Role fit">
              {report.role_fit}
            </ProseCard>
          ) : null}
        </section>
      ) : null}

      {/* Final recommendation */}
      {report.recruitment_decision || report.recommended_level ? (
        <section className="rounded-xl border border-border bg-muted px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">
              Final recommendation
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {report.recruitment_decision ? (
              <span className="rounded border border-border bg-muted px-3 py-1 text-sm font-medium text-primary">
                {report.recruitment_decision.replace("_", " ")}
              </span>
            ) : null}
            {report.recommended_level ? (
              <span className="rounded border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                {report.recommended_level.replace("_", " ")}
              </span>
            ) : null}
          </div>
          {report.recommendation_notes ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-foreground">
              {report.recommendation_notes}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Scout notes */}
      {report.scout_notes ? (
        <ProseCard icon={ScrollText} title="Scout notes">
          {report.scout_notes}
        </ProseCard>
      ) : null}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function CategoryCard({
  category,
  report,
}: {
  category: RatingCategory;
  report: NonNullable<Awaited<ReturnType<typeof getReportById>>>;
}) {
  const subAreas = RATING_SUB_AREAS_BY_CATEGORY[category];
  const ratings = report.ratings.filter((r) => r.category === category);
  const overall = ratings.find((r) => r.sub_area === "overall");

  // §3–§6 each carry one section-level Notes box in the report template.
  const sectionNote = {
    technical: report.technical_notes,
    tactical: report.tactical_notes,
    physical: report.physical_notes,
    mentality: report.mentality_notes,
  }[category];

  return (
    <article className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          {RATING_CATEGORY_LABELS[category]}
        </p>
        {overall ? (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-3.5 w-3.5 ${
                  n <= overall.rating
                    ? "fill-primary text-primary"
                    : "fill-transparent text-muted-foreground"
                }`}
              />
            ))}
          </div>
        ) : null}
      </header>
      <ul className="divide-y divide-border">
        {subAreas
          .filter((s) => s.key !== "overall")
          .map((sub) => {
            const r = ratings.find((rr) => rr.sub_area === sub.key);
            if (!r || r.rating === 0) return null;
            return (
              <li key={sub.key} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{sub.label}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3 w-3 ${
                          n <= r.rating
                            ? "fill-primary text-primary"
                            : "fill-transparent text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {r.notes ? (
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {r.notes}
                  </p>
                ) : null}
              </li>
            );
          })}
        {ratings.length === 0 ? (
          <li className="px-5 py-4 text-sm text-muted-foreground">
            Not assessed in this report.
          </li>
        ) : null}
      </ul>
      {sectionNote ? (
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground">Notes</p>
          <p className="mt-1 text-sm leading-6 text-foreground">{sectionNote}</p>
        </div>
      ) : null}
    </article>
  );
}

function BulletSection({
  icon: Icon,
  title,
  items,
  tone,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { text: string }[];
  tone: "positive" | "warning";
  note?: string | null;
}) {
  const bullet =
    tone === "positive"
      ? "bg-muted text-primary border-border"
      : "bg-muted text-primary border-border";
  return (
    <section className="rounded-xl border border-border bg-card px-6 py-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-medium tabular-nums ${bullet}`}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-foreground">{b.text}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {note ? (
        <div className={items.length > 0 ? "mt-4 border-t border-border pt-4" : "mt-3"}>
          <p className="text-xs font-medium text-muted-foreground">Notes</p>
          <p className="mt-1 text-sm leading-6 text-foreground">{note}</p>
        </div>
      ) : null}
    </section>
  );
}

function ProseCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card px-6 py-5">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3 w-3" />
        {title}
      </p>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground">
        {children}
      </p>
    </section>
  );
}
