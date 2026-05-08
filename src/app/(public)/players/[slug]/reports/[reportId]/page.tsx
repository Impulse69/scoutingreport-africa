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
} from "lucide-react";
import { getReportById } from "@/lib/features/reports/queries";
import {
  RATING_CATEGORIES,
  RATING_CATEGORY_LABELS,
  RATING_SUB_AREAS_BY_CATEGORY,
  type RatingCategory,
} from "@/lib/shared/constants";

export const dynamic = "force-dynamic";

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
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to {player.full_name}
      </Link>

      {/* Hero */}
      <header className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#1a1208] via-[#0E0A05] to-[#0B0B0B] px-6 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Scout report
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold text-white">
          {player.full_name}
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          {player.primary_position_code ?? "—"}
          {player.nationality_code ? ` · ${player.nationality_code}` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-zinc-500">
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
              <span className="text-zinc-300">{report.author.display_name}</span>
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
      {report.improvements.length > 0 ? (
        <BulletSection
          icon={AlertTriangle}
          title="Improvements & risks"
          tone="warning"
          items={report.improvements}
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
        <section className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Award className="h-4 w-4 text-orange-400" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-400">
              Final recommendation
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {report.recruitment_decision ? (
              <span className="rounded border border-orange-500/40 bg-orange-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-orange-300">
                {report.recruitment_decision.replace("_", " ")}
              </span>
            ) : null}
            {report.recommended_level ? (
              <span className="rounded border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-zinc-300">
                {report.recommended_level.replace("_", " ")}
              </span>
            ) : null}
          </div>
          {report.recommendation_notes ? (
            <p className="mt-4 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-line">
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

  return (
    <article className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          {RATING_CATEGORY_LABELS[category]}
        </p>
        {overall ? (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-3.5 w-3.5 ${
                  n <= overall.rating
                    ? "fill-orange-500 text-orange-500"
                    : "fill-transparent text-zinc-700"
                }`}
              />
            ))}
          </div>
        ) : null}
      </header>
      <ul className="divide-y divide-white/5">
        {subAreas
          .filter((s) => s.key !== "overall")
          .map((sub) => {
            const r = ratings.find((rr) => rr.sub_area === sub.key);
            if (!r || r.rating === 0) return null;
            return (
              <li key={sub.key} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-zinc-200">{sub.label}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3 w-3 ${
                          n <= r.rating
                            ? "fill-cyan-400 text-cyan-400"
                            : "fill-transparent text-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {r.notes ? (
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-zinc-500">
                    {r.notes}
                  </p>
                ) : null}
              </li>
            );
          })}
        {ratings.length === 0 ? (
          <li className="px-5 py-4 font-mono text-[11px] text-zinc-600">
            Not assessed in this report.
          </li>
        ) : null}
      </ul>
    </article>
  );
}

function BulletSection({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { text: string }[];
  tone: "positive" | "warning";
}) {
  const bullet =
    tone === "positive"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : "bg-orange-500/10 text-orange-300 border-orange-500/30";
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
        <Icon className="h-3 w-3" />
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] font-bold ${bullet}`}
            >
              {i + 1}
            </span>
            <p className="font-mono text-xs leading-relaxed text-zinc-200">
              {b.text}
            </p>
          </li>
        ))}
      </ul>
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
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
        <Icon className="h-3 w-3" />
        {title}
      </p>
      <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-line">
        {children}
      </p>
    </section>
  );
}
