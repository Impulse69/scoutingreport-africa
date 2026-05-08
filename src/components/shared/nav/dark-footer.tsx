import Link from "next/link";

export function DarkFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#070707] py-8 text-zinc-500">
      <div className="container mx-auto flex flex-col gap-4 px-6 text-xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-600 font-bold text-[10px] text-white">
            SR
          </div>
          <span className="font-mono text-zinc-300">ScoutingReport Africa</span>
          <span className="hidden md:inline text-zinc-700">·</span>
          <span className="hidden md:inline text-zinc-600">
            Human-scouted intelligence on African football talent.
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-5 font-mono text-[11px]">
          <Link href="/players" className="hover:text-white transition-colors">
            Players
          </Link>
          <Link href="/compare" className="hover:text-white transition-colors">
            Compare
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
