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
    primaryColor: "var(--primary)",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      <TeamSidebar
        team={team}
        contextLabel="Published dossiers"
      />
      <main className="min-w-0 flex-1 overflow-x-hidden px-6 py-8">{children}</main>
    </div>
  );
}
