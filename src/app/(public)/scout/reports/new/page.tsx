import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/core/supabase/server";
import { ScoutReportForm } from "@/components/features/reports/scout-report-form";
import { PlayerPicker } from "@/components/features/reports/player-picker";

export const metadata = { title: "New Scout Report · ScoutingReport Africa" };

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ player?: string }>;
}) {
  const sp = await searchParams;
  const playerId = sp.player;

  // No player chosen yet — show the picker so the scout can find the subject.
  if (!playerId) {
    return (
      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-6 font-['Inter']">
        <Link
          href="/scout"
          className="inline-flex items-center gap-1.5 font-['Public_Sans'] font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Scout Department
        </Link>
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
            <span>Phase 01 · Subject Identification</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl font-black uppercase text-white tracking-tight">
            Pick a Scouted Prospect
          </h1>
          <p className="text-xs text-slate-400">
            Select a registered player from the continental database to launch a standardized evaluation dossier.
          </p>
        </header>
        <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 shadow-xl">
          <PlayerPicker />
        </div>
      </div>
    );
  }

  // Validate the player exists.
  const supabase = await createClient();
  const { data: player } = await supabase
    .from("players")
    .select("id, full_name, common_name, primary_position_code, current_club, slug")
    .eq("id", playerId)
    .maybeSingle();

  if (!player) redirect("/scout/reports/new");

  const label = `${(player.common_name as string) || (player.full_name as string)} · ${
    (player.primary_position_code as string) ?? "—"
  } · ${(player.current_club as string) ?? "Free agent"}`;

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10 space-y-8 font-['Inter']">
      <Link
        href="/scout"
        className="inline-flex items-center gap-1.5 font-['Public_Sans'] font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Scout Department
      </Link>

      {/* Stitch Step Progress Indicator */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-[#1E232D] relative overflow-hidden rounded-none">
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#9C3F00] to-[#CC5500]" />
        </div>
        <div className="flex justify-between text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-tight text-slate-500">
          <span className="text-slate-400">01 Basic Info</span>
          <span className="text-[#FFB693] font-black">02 Match Context</span>
          <span>03 Technical Analysis</span>
          <span>04 Final Grade</span>
        </div>
      </div>

      <header className="flex items-center justify-between border-b border-[rgba(224,192,178,0.12)] pb-4">
        <div>
          <span className="font-['Public_Sans'] text-[10px] font-extrabold uppercase tracking-widest text-[#FFB693]">
            New Evaluation Dossier
          </span>
          <h1 className="font-['Public_Sans'] text-2xl sm:text-3xl font-black text-white uppercase mt-1">
            {(player.full_name as string)}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {label}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] px-3 py-1.5 text-xs text-slate-300">
          <Shield className="h-4 w-4 text-[#CC5500]" />
          <span className="font-mono text-[11px] font-bold">Standardized CAF Form</span>
        </div>
      </header>

      <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 sm:p-8 shadow-2xl">
        <ScoutReportForm
          initial={{ player_id: player.id as string }}
          playerLabel={label}
        />
      </div>
    </div>
  );
}
