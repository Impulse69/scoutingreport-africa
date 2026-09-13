import { notFound } from "next/navigation";
import { getTeamBySlug, getTeamRefBySlug } from "@/lib/features/teams/mock";
import { TeamSidebar } from "@/components/features/teams/team-sidebar";

export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getTeamBySlug(slug);
  const ref = getTeamRefBySlug(slug);
  if (!data && !ref) notFound();

  const team = data?.team ?? {
    slug: ref!.slug,
    name: ref!.name,
    shortName: ref!.name,
    league: ref!.league,
    leagueSlug: ref!.league.toLowerCase().replace(/\s+/g, "-"),
    crestUrl: "",
    primaryColor: "var(--primary)",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      <TeamSidebar
        team={team}
        season="2025/2026"
        seasons={["2025/2026", "2024/2025", "2023/2024", "2022/2023"]}
      />
      <main className="min-w-0 flex-1 overflow-x-hidden px-6 py-8">{children}</main>
    </div>
  );
}
