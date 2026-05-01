import { SiteHeader } from "@/components/shared/nav/site-header";
import { SiteFooter } from "@/components/shared/nav/site-footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
