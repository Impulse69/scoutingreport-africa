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
    primaryColor: "#10b981",
  };

  return (
    <div className="flex min-h-screen bg-[#080B0E] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <TeamSidebar
        team={team}
        season="2025/2026"
        seasons={["2025/2026", "2024/2025", "2023/2024", "2022/2023"]}
      />
      <main className="flex-1 min-w-0 px-4 py-8 sm:px-8 md:px-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
