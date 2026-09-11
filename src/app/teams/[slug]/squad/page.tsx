import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Database, Users } from "lucide-react";
import { getTeamRefBySlug } from "@/lib/features/teams/mock";
import {
  listPublishedTeamPlayers,
  positionGroup,
  type PositionGroup,
} from "@/lib/features/teams/queries";

const GROUP_LABELS: Record<PositionGroup, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

export default async function SquadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamRefBySlug(slug);
  if (!team) notFound();

  const squad = await listPublishedTeamPlayers(team.name);
  const groups = squad.players.reduce<Record<PositionGroup, typeof squad.players>>(
    (result, player) => {
      result[positionGroup(player.primaryPositionCode)].push(player);
      return result;
    },
    { GK: [], DEF: [], MID: [], FWD: [] },
  );

  return (
    <div className="space-y-6">
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
          Published squad
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">
          {team.name} · {squad.players.length} scouting dossier
          {squad.players.length === 1 ? "" : "s"}
        </p>
      </header>

      {squad.unavailable ? (
        <EmptyState
          icon={Database}
          title="Squad data is temporarily unavailable"
          detail="Supabase could not return the published roster. No mock players are substituted."
        />
      ) : squad.players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No published players yet"
          detail={`Players linked to “${team.name}” appear here after a scout publishes their dossier.`}
        />
      ) : (
        <div className="space-y-5">
          {(Object.keys(GROUP_LABELS) as PositionGroup[]).map((group) => {
            const players = groups[group];
            if (players.length === 0) return null;

            return (
              <section
                key={group}
                className="overflow-hidden rounded-xl border border-white/5 bg-[#0E0E0E]"
              >
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {GROUP_LABELS[group]}
                  </h2>
                  <span className="font-mono text-[10px] text-zinc-500">
                    {players.length}
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {players.map((player) => (
                    <Link
                      key={player.id}
                      href={`/players/${player.slug}`}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-emerald-500/10">
                        {player.photoUrl ? (
                          <Image
                            src={player.photoUrl}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-mono text-xs font-bold text-emerald-300">
                            {(player.commonName ?? player.fullName)
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          {player.commonName ?? player.fullName}
                        </p>
                        {player.commonName ? (
                          <p className="truncate text-xs text-zinc-500">
                            {player.fullName}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-xs font-bold text-emerald-300">
                          {player.primaryPositionCode}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          {player.nationalityCode}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="text-[11px] leading-5 text-zinc-500">
        <Users className="mr-1 inline h-3 w-3" />
        This roster contains published ScoutingReport dossiers only. Match
        appearances and performance statistics will appear after a verified
        fixture data source is connected.
      </p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Database;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-[#0E0E0E] px-6 py-16 text-center">
      <Icon className="mx-auto h-6 w-6 text-zinc-500" />
      <p className="mt-3 font-mono text-sm text-zinc-300">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-zinc-500">
        {detail}
      </p>
    </div>
  );
}
