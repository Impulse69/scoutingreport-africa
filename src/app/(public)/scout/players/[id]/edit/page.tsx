import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { createClient } from "@/lib/core/supabase/server";
import {
  PlayerForm,
  type PlayerFormValues,
} from "@/components/features/reports/player-form";
import type { PlayerStatus, PreferredFoot } from "@/lib/shared/constants";

export const metadata = { title: "Edit player" };

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = (await getCurrentUser())!; // /scout layout already gates this

  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select(
      `id, slug, status, full_name, common_name, date_of_birth, nationality_code,
       primary_position_code, preferred_foot, height_cm, weight_kg,
       current_club, bio, created_by`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  if (data.created_by !== me.id && me.role !== "admin") notFound();

  const initial: PlayerFormValues = {
    id: data.id as string,
    slug: data.slug as string,
    status: data.status as PlayerStatus,
    full_name: data.full_name as string,
    common_name: (data.common_name as string) ?? null,
    date_of_birth: data.date_of_birth as string,
    nationality_code: data.nationality_code as string,
    primary_position_code: data.primary_position_code as string,
    preferred_foot: data.preferred_foot as PreferredFoot,
    height_cm: (data.height_cm as number) ?? null,
    weight_kg: (data.weight_kg as number) ?? null,
    current_club: (data.current_club as string) ?? null,
    bio: (data.bio as string) ?? null,
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-6 py-10">
      <Link
        href="/scout"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to scout workspace
      </Link>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Edit player
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          {initial.full_name}
        </h1>
        <p className="mt-1.5 font-mono text-xs text-zinc-500">
          {initial.status === "published"
            ? "Live on the public roster."
            : "Draft — publish to put this player on the public roster."}
        </p>
      </header>
      <PlayerForm mode="edit" initial={initial} />
    </div>
  );
}
