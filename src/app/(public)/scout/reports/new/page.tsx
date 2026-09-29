import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/core/supabase/server";
import { ScoutReportForm } from "@/components/features/reports/scout-report-form";
import { listCompetitions } from "@/lib/features/reports/queries";
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
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
        <Link
          href="/scout"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to scout workspace
        </Link>
        <header className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Pick a player
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Choose the player this report is about. If they aren&apos;t listed
            yet, create their profile first.
          </p>
        </header>
        <div className="rounded-lg border border-border bg-card p-6">
          <PlayerPicker />
        </div>
      </div>
    );
  }

  // Validate the player exists.
  const supabase = await createClient();
  const { data: player } = await supabase
    .from("players")
    .select(
      `id, full_name, common_name, primary_position_code, current_club, slug,
       current_club_record:clubs!players_current_club_id_fkey(name)`,
    )
    .eq("id", playerId)
    .maybeSingle();

  if (!player) redirect("/scout/reports/new");

  const competitions = await listCompetitions();

  const currentClub = (
    player.current_club_record as { name: string } | null
  )?.name ?? (player.current_club as string | null);
  const label = `${(player.common_name as string) || (player.full_name as string)} · ${
    (player.primary_position_code as string) ?? "—"
  } · ${currentClub ?? "Free agent"}`;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <Link
        href="/scout"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to scout workspace
      </Link>

      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {player.full_name as string}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </header>

      <div className="rounded-lg border border-border bg-card p-6">
        <ScoutReportForm
          initial={{ player_id: player.id as string }}
          playerLabel={label}
          competitions={competitions}
        />
      </div>
    </div>
  );
}
