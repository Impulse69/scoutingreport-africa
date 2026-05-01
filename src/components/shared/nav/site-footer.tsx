import Link from "next/link";

export function SiteFooter() {
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
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/players" className="hover:text-foreground">
            Players
          </Link>
          <Link href="/compare" className="hover:text-foreground">
            Compare
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Scouts sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
