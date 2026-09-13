"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser, hasRole } from "@/lib/core/auth-helpers";
import { scoutReportSchema } from "@/lib/shared/schemas/scout-report";
import type { z } from "zod";

export type ScoutReportInput = z.infer<typeof scoutReportSchema>;

type ActionResult<T> =
  | ({ ok: true } & T)
  | { error: string; details?: unknown };

/**
 * Upsert a scout report + its normalised ratings.
 * - reportId omitted → INSERT (new report).
 * - reportId provided → UPDATE (must own the row, enforced by RLS).
 * Replaces the full ratings array through a transactional database function.
 */
export async function saveScoutReport(
  input: ScoutReportInput,
  reportId?: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) return { error: "Not authorized" };

  const parsed = scoutReportSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const reportRow = {
    player_id: data.player_id,
    status: data.status,
    match_description: data.match_description ?? null,
    match_date: data.match_date ?? null,
    competition_id: data.competition_id ?? null,
    role_observed_code: data.role_observed_code ?? null,
    minutes_observed: data.minutes_observed ?? null,
    observation_type: data.observation_type,
    strengths: data.strengths,
    improvements: data.improvements,
    // §3–§6 and §8 section Notes boxes from the report template.
    technical_notes: data.technical_notes ?? null,
    tactical_notes: data.tactical_notes ?? null,
    physical_notes: data.physical_notes ?? null,
    mentality_notes: data.mentality_notes ?? null,
    improvements_notes: data.improvements_notes ?? null,
    projection: data.projection ?? null,
    role_fit: data.role_fit ?? null,
    recruitment_decision: data.recruitment_decision ?? null,
    recommended_level: data.recommended_level ?? null,
    recommendation_notes: data.recommendation_notes ?? null,
    scout_notes: data.scout_notes ?? null,
  };

  let id = reportId ?? null;

  if (!id) {
    const { data: inserted, error } = await supabase
      .from("scout_reports")
      .insert({ ...reportRow, author_id: user!.id })
      .select("id")
      .single();
    if (error || !inserted) {
      return { error: error?.message ?? "Insert failed" };
    }
    id = inserted.id as string;
  } else {
    const { error } = await supabase
      .from("scout_reports")
      .update(reportRow)
      .eq("id", id);
    if (error) return { error: error.message };
  }

  const { error: ratingsError } = await supabase.rpc(
    "replace_scout_report_ratings",
    {
      p_report_id: id,
      p_ratings: data.ratings,
    },
  );
  if (ratingsError) {
    return { error: `Ratings save failed: ${ratingsError.message}` };
  }

  revalidatePath("/players");
  revalidatePath(`/scout`);

  // Look up the slug so we can revalidate the public URLs this report feeds.
  const { data: row } = await supabase
    .from("players")
    .select("slug")
    .eq("id", data.player_id)
    .maybeSingle<{ slug: string }>();

  if (row) {
    revalidatePath(`/players/${row.slug}`);
    revalidatePath(`/players/${row.slug}/reports/${id}`);
  }

  if (data.status === "published") {
    // Keep the aggregate view in step with the reports feeding it. The profile
    // page aggregates from the raw ratings table, so a failure here is not
    // user-visible — don't fail the save over it.
    const { error: refreshError } = await supabase.rpc(
      "refresh_player_category_ratings",
    );
    if (refreshError) {
      console.error(
        "[reports] player_category_ratings refresh failed:",
        refreshError.message,
      );
    }
  }

  return { ok: true, id };
}

/**
 * Hard-delete a report (and its ratings, via FK cascade). Authoring scout
 * or admin only — RLS enforces the row-level check.
 */
export async function deleteScoutReport(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) return { error: "Not authorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("scout_reports").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/scout");
  revalidatePath("/players");
  return { ok: true };
}
