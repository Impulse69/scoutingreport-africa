import { z } from "zod";
import {
  OBSERVATION_TYPES,
  POSITION_CODES,
  RATING_CATEGORIES,
  RATING_SUB_AREAS_BY_CATEGORY,
  RECOMMENDED_LEVELS,
  RECRUITMENT_DECISIONS,
  REPORT_STATUSES,
} from "@/lib/constants";

const positionCodes = POSITION_CODES as [string, ...string[]];

const ratingSchema = z.object({
  category: z.enum(RATING_CATEGORIES),
  sub_area: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  notes: z.string().max(1000).optional().nullable(),
});

export const bulletSchema = z.object({
  text: z.string().min(1).max(500),
});

export const scoutReportSchema = z
  .object({
    player_id: z.uuid(),
    status: z.enum(REPORT_STATUSES).default("draft"),

    // §2 Match Context
    match_description: z.string().max(300).optional().nullable(),
    match_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .optional()
      .nullable(),
    competition_id: z.uuid().optional().nullable(),
    role_observed_code: z.enum(positionCodes).optional().nullable(),
    minutes_observed: z.number().int().min(0).max(150).optional().nullable(),
    observation_type: z.enum(OBSERVATION_TYPES).default("live"),

    // §3–§6 Ratings (array of { category, sub_area, rating, notes })
    ratings: z.array(ratingSchema),

    // §7 Strengths — 2-4 bullets
    strengths: z.array(bulletSchema).min(0).max(6).default([]),

    // §8 Improvements & Risks
    improvements: z.array(bulletSchema).min(0).max(6).default([]),
    projection: z.string().max(2000).optional().nullable(),
    role_fit: z.string().max(500).optional().nullable(),

    // §9 Final Recommendation
    recruitment_decision: z
      .enum(RECRUITMENT_DECISIONS)
      .optional()
      .nullable(),
    recommended_level: z
      .enum(RECOMMENDED_LEVELS)
      .optional()
      .nullable(),
    recommendation_notes: z.string().max(2000).optional().nullable(),

    // §10 Scout Notes
    scout_notes: z.string().max(10000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" || data.status === "pending_review") {
      // Require minimum content before submitting for review or publishing
      for (const category of RATING_CATEGORIES) {
        const overall = data.ratings.find(
          (r) => r.category === category && r.sub_area === "overall",
        );
        if (!overall) {
          ctx.addIssue({
            code: "custom",
            path: ["ratings"],
            message: `Overall ${category} rating is required before submitting`,
          });
        }
      }
    }
  });

export type ScoutReportInput = z.infer<typeof scoutReportSchema>;

/**
 * Build the canonical list of (category, sub_area) keys from the PDF template,
 * used to seed an empty-report draft form state.
 */
export function emptyRatings(): ScoutReportInput["ratings"] {
  return RATING_CATEGORIES.flatMap((category) =>
    RATING_SUB_AREAS_BY_CATEGORY[category].map((sub) => ({
      category,
      sub_area: sub.key,
      rating: 3,
      notes: null,
    })),
  );
}
