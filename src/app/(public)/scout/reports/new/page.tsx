import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/core/supabase/server";
import { ScoutReportForm } from "@/components/features/reports/scout-report-form";
import { PlayerPicker } from "@/components/features/reports/player-picker";

export const metadata = { title: "New report" };

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
      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-6">
        <Link
          href="/scout"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to scout workspace
        </Link>
        <header>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
            Pick a player
          </h1>
          <p className="mt-1.5 font-mono text-xs text-zinc-500">
            Search the published roster to start a new report.
          </p>
        </header>
        <PlayerPicker />
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
          New report
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          {(player.full_name as string)}
        </h1>
      </header>
      <ScoutReportForm
        initial={{ player_id: player.id as string }}
        playerLabel={label}
      />
    </div>
  );
}
