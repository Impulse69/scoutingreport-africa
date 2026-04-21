import Link from "next/link";
import {
  FileText,
  LayoutDashboard,
  ListChecks,
  Trophy,
  Users,
  Globe,
} from "lucide-react";

export function AdminSidebar() {
  const items = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/reports", label: "Reports (moderate)", icon: ListChecks },
    { href: "/admin/players", label: "Players", icon: FileText },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/competitions", label: "Competitions", icon: Trophy },
    { href: "/admin/countries", label: "Countries", icon: Globe },
  ];
  return (
    <aside className="hidden w-56 shrink-0 border-r md:block">
      <nav className="sticky top-14 p-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Admin
        </p>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
