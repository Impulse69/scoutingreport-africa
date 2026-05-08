import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { getReportById } from "@/lib/features/reports/queries";
import { ScoutReportForm } from "@/components/features/reports/scout-report-form";
import type {
  ObservationType,
  RatingCategory,
  RecruitmentDecision,
  RecommendedLevel,
} from "@/lib/shared/constants";

export const metadata = { title: "Edit report" };

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = (await getCurrentUser())!; // layout already gates
  const report = await getReportById(id);

  if (!report) notFound();
  if (report.author_id !== me.id && me.role !== "admin") notFound();

  const label = `${report.player?.full_name ?? "Unknown"} · ${
    report.role_observed_code ?? report.player?.primary_position_code ?? "—"
  }`;

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10 space-y-6">
      <Link
        href="/scout"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to scout workspace
      </Link>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Editing — {report.status.replace("_", " ")}
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          {report.player?.full_name ?? "Unknown player"}
        </h1>
      </header>
      <ScoutReportForm
        playerLabel={label}
        initial={{
          reportId: report.id,
          player_id: report.player_id,
          match_description: report.match_description,
          match_date: report.match_date,
          role_observed_code: report.role_observed_code,
          minutes_observed: report.minutes_observed,
          observation_type: report.observation_type as ObservationType,
          ratings: report.ratings.map((r) => ({
            category: r.category as RatingCategory,
            sub_area: r.sub_area,
            rating: r.rating,
            notes: r.notes ?? "",
          })),
          strengths: report.strengths,
          improvements: report.improvements,
          projection: report.projection,
          role_fit: report.role_fit,
          recruitment_decision: report.recruitment_decision as RecruitmentDecision | null,
          recommended_level: report.recommended_level as RecommendedLevel | null,
          recommendation_notes: report.recommendation_notes,
          scout_notes: report.scout_notes,
        }}
      />
    </div>
  );
}
