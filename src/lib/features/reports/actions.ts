"use server";

import { getCurrentUser } from "@/lib/core/auth-helpers";
import { scoutReportInputSchema, type ScoutReportInput } from "@/lib/shared/schemas/scout-report";

export type SaveScoutReportResult =
  | { ok: true; id: string }
  | { error: string; details?: unknown };

/**
 * Persist a scout report draft. The full Supabase implementation (insert
 * report + 24 rating rows + revalidate paths) lands in Phase 2. This stub
 * validates the input shape so the consumer form gets accurate field-level
 * errors during Phase 0/1.
 */
export async function saveScoutReport(
  input: ScoutReportInput,
): Promise<SaveScoutReportResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = scoutReportInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  return { error: "Scout report persistence ships in Phase 2" };
}
