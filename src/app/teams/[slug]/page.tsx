import Link from "next/link";
import { notFound } from "next/navigation";
import { Database, ShieldCheck, Users } from "lucide-react";
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

export default async function TeamOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamRefBySlug(slug);
  if (!team) notFound();

  const squad = await listPublishedTeamPlayers(team.name);
  const counts = squad.players.reduce<Record<PositionGroup, number>>(
    (result, player) => {
      result[positionGroup(player.primaryPositionCode)] += 1;
      return result;
    },
    { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-white/5 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
          Club dossier
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          {team.name}
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">
          {team.league} · {team.country}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Published dossiers" value={squad.players.length} accent />
        {(Object.keys(GROUP_LABELS) as PositionGroup[]).map((group) => (
          <Metric key={group} label={GROUP_LABELS[group]} value={counts[group]} />
        ))}
      </div>

      {squad.unavailable ? (
        <StatusPanel
          icon={Database}
          title="Dossier data is temporarily unavailable"
          detail="The club registry is available, but the published Supabase roster could not be loaded. No fallback players are shown."
        />
      ) : squad.players.length === 0 ? (
        <StatusPanel
          icon={Users}
          title="No published dossiers linked to this club"
          detail={`Scouts can add a player with “${team.name}” as the current club. Draft players stay private until published.`}
        />
      ) : (
        <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <h2 className="font-mono text-sm font-bold text-white">
                Recently catalogued
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Published scouting profiles currently representing {team.name}
              </p>
            </div>
            <Link
              href={`/teams/${slug}/squad`}
              className="font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              View squad →
            </Link>
          </div>
          <div className="grid gap-px bg-white/5 sm:grid-cols-2 xl:grid-cols-3">
            {squad.players.slice(0, 6).map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}`}
                className="bg-[#0E0E0E] p-5 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Published dossier
                </div>
                <p className="mt-3 font-bold text-white">
                  {player.commonName ?? player.fullName}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {player.primaryPositionCode} · {player.nationalityCode}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0E0E0E] p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-2 font-mono text-2xl font-bold ${
          accent ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPanel({
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
