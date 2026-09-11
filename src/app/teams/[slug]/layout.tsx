import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeamRefBySlug } from "@/lib/features/teams/mock";
import { TeamSidebar } from "@/components/features/teams/team-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamRefBySlug(slug);

  return team
    ? {
        title: `${team.name} scouting dossiers`,
        description: `Published player dossiers linked to ${team.name} on ScoutingReport Africa.`,
      }
    : {};
}

export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ref = getTeamRefBySlug(slug);
  if (!ref) notFound();

  const team = {
    slug: ref.slug,
    name: ref.name,
    shortName: ref.name,
    league: ref.league,
    leagueSlug: ref.league.toLowerCase().replace(/\s+/g, "-"),
    crestUrl: "",
    primaryColor: "#10b981",
  };

  return (
    <div className="flex min-h-screen bg-[#080B0E] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <TeamSidebar
        team={team}
        contextLabel="Published dossiers"
      />
      <main className="flex-1 min-w-0 px-4 py-8 sm:px-8 md:px-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
