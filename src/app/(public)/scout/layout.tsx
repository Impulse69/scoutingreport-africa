import { redirect } from "next/navigation";
import { getCurrentUser, hasRole } from "@/lib/core/auth-helpers";

export default async function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/auth/sign-in?next=/scout");
  if (!hasRole(me, "scout")) {
    // Signed in but no scout role — bounce to dashboard.
    redirect("/dashboard?upgrade=scout");
  }
  return <>{children}</>;
}
