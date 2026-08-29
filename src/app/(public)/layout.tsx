import { MarketingNav } from "@/components/shared/nav/marketing-nav";
import { DarkFooter } from "@/components/shared/nav/dark-footer";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { listTopTeams } from "@/lib/features/teams/mock";
import { POSITIONS } from "@/lib/shared/constants";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [me, players] = await Promise.all([
    getCurrentUser(),
    listPublishedPlayers(6).catch(() => []),
  ]);

  const initialAuth = me
    ? {
        email: me.email ?? null,
        displayName: me.email?.split("@")[0] ?? null,
        role: me.role,
      }
    : null;

  const featured = {
    players: players.map((p) => ({
      slug: p.slug,
      name: p.fullName,
      tail:
        POSITIONS.find((pos) => pos.code === p.primaryPositionCode)?.code ??
        undefined,
    })),
    teams: listTopTeams(6).map((t) => ({
      slug: t.slug,
      name: t.name,
      tail: t.country,
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0C0E12] text-slate-100 selection:bg-[#CC5500] selection:text-white">
      <MarketingNav initialAuth={initialAuth} featured={featured} />
      <main className="flex-1">{children}</main>
      <DarkFooter />
    </div>
  );
}
