import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/supabase/with-role";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const user = await getCurrentUser();

  let displayName: string | null = null;
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single<{ display_name: string | null }>();
    displayName = data?.display_name ?? null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
              SR
            </span>
            <span className="hidden sm:inline">ScoutingReport Africa</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/players"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Players
            </Link>
            <Link
              href="/compare"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Compare
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            {(user?.role === "scout" || user?.role === "admin") && (
              <Link
                href="/scout/dashboard"
                className="font-medium text-orange-600 transition-colors hover:text-orange-500"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <UserMenu
              email={user.email}
              displayName={displayName}
              role={user.role}
            />
          ) : (
            <Link href="/auth/sign-in" className={buttonVariants({ size: "sm" })}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
