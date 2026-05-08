"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";

const STORAGE_KEY = "sr.scout_hub_promo_dismissed";

type Props = {
  pills: string[];
};

export function ScoutHubBanner({ pills }: Props) {
  const [hidden, setHidden] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setHidden(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!hydrated || hidden) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setHidden(true);
  };

  return (
    <section className="relative rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan-300">
              <Sparkles className="mr-1 inline h-2.5 w-2.5" />
              New
            </span>
            <p className="font-mono text-sm font-semibold text-white">
              Introducing Scout Hub
            </p>
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Professional scouting command center with AI-powered tools.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {pills.map((p) => (
              <li
                key={p}
                className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-300"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/players"
          className="self-start whitespace-nowrap rounded-md border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white transition-colors hover:bg-white/10 md:self-auto"
        >
          Browse players <ArrowRight className="ml-1 inline h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
