import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ScoutSidebar } from "@/components/nav/scout-sidebar";
import { getCurrentUser, hasRole } from "@/lib/supabase/with-role";

export default async function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) redirect("/auth/sign-in?next=/scout/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <ScoutSidebar />
        <main className="flex-1 px-4 py-8">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
