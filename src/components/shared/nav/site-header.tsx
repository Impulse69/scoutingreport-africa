import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { LanguagePicker } from "./language-picker";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const user = await getCurrentUser();
  const displayName = user?.email?.split('@')[0] ?? null; // Fallback or use user.name if available

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
              href="/leagues"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("leagues")}
            </Link>
            <Link
              href="/scouting"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("scouting")}
            </Link>
            <Link
              href="/fpl"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("fpl")}
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="font-medium text-orange-600 transition-colors hover:text-orange-500"
              >
                {t("dashboard")}
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguagePicker />
          <ModeToggle />
          {user ? (
            <UserMenu
              email={user.email}
              displayName={displayName}
              role={user.role}
            />
          ) : (
            <Link href="/auth/sign-in" className={buttonVariants({ size: "sm" })}>
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
