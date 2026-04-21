"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

export type ReportStatus = Database["public"]["Enums"]["report_status"];
export type RecruitmentDecision = Database["public"]["Enums"]["recruitment_decision"];
export type RecommendedLevel = Database["public"]["Enums"]["recommended_level"];
export type RatingCategory = Database["public"]["Enums"]["rating_category"];

export async function saveScoutReport(data: any) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // 1. Insert the main report
  const { data: report, error: reportError } = await supabase
    .from("scout_reports")
    .insert({
      player_id: data.player_id,
      author_id: user.id,
      status: data.status || "draft",
      match_description: data.fixture,
      match_date: data.date,
      competition_id: data.competition_id,
      role_observed_code: data.position,
      minutes_observed: data.minutes,
      observation_type: data.setting === "Live at ground" ? "live" : "video",
      strengths: data.strengthTags.map((tag: string) => ({ text: tag })),
      improvements: data.riskTags.map((tag: string) => ({ text: tag })),
      projection: data.summary,
      role_fit: data.role_fit,
      recruitment_decision: data.verdict as RecruitmentDecision,
      recommended_level: data.recommended_level as RecommendedLevel,
      recommendation_notes: data.summary,
      scout_notes: data.technical_note || data.tactical_note || data.physical_note || data.mental_note,
    })
    .select()
    .single();

  if (reportError) return { error: reportError.message };

  // 2. Prepare ratings
  const ratingsToInsert: any[] = [];
  
  const categories: RatingCategory[] = ["technical", "tactical", "physical", "mentality"];
  
  categories.forEach((cat) => {
    const rawCat = cat === "mentality" ? "mental" : cat;
    const catRatings = data[rawCat] || {};
    
    Object.entries(catRatings).forEach(([subArea, rating]) => {
      ratingsToInsert.push({
        report_id: report.id,
        category: cat,
        sub_area: subArea,
        rating: Number(rating),
      });
    });
    
    // Add overall for the category
    const values = Object.values(catRatings).map(Number);
    if (values.length > 0) {
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      ratingsToInsert.push({
        report_id: report.id,
        category: cat,
        sub_area: "overall",
        rating: avg,
        notes: data[`${rawCat}_note`],
      });
    }
  });

  if (ratingsToInsert.length > 0) {
    const { error: ratingsError } = await supabase
      .from("scout_report_ratings")
      .insert(ratingsToInsert);
      
    if (ratingsError) return { error: ratingsError.message };
  }

  return { success: true, reportId: report.id };
}
