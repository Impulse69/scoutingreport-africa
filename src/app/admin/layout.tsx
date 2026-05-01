import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/shared/nav/site-header";
import { SiteFooter } from "@/components/shared/nav/site-footer";
import { AdminSidebar } from "@/components/shared/nav/admin-sidebar";
import { getCurrentUser, hasRole } from "@/lib/core/auth-helpers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!hasRole(user, "admin")) redirect("/auth/sign-in?next=/admin/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 px-4 py-8">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
