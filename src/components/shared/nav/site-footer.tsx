import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("nav");

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-foreground">ScoutingReport Africa</p>
          <p className="text-xs mt-1">
            Human-scouted intelligence on African football talent.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/leagues" className="hover:text-foreground">
            {t("leagues")}
          </Link>
          <Link href="/scouting" className="hover:text-foreground">
            {t("scouting")}
          </Link>
          <Link href="/fpl" className="hover:text-foreground">
            {t("fpl")}
          </Link>
          <Link href="/auth/sign-in" className="hover:text-foreground">
            {t("scoutsSignIn")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
