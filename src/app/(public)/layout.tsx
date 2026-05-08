import { MarketingNav } from "@/components/shared/nav/marketing-nav";
import { DarkFooter } from "@/components/shared/nav/dark-footer";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  const initialAuth = me
    ? {
        email: me.email ?? null,
        displayName: me.email?.split("@")[0] ?? null,
        role: me.role,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-zinc-100">
      <MarketingNav initialAuth={initialAuth} />
      <main className="flex-1">{children}</main>
      <DarkFooter />
    </div>
  );
}
