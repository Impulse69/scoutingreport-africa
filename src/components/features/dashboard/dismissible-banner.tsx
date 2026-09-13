"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";

const STORAGE_KEY = "sr.scout_hub_promo_dismissed";
const DISMISS_EVENT = "sr:scout-hub-promo-dismissed";

function subscribeToDismissal(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(DISMISS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DISMISS_EVENT, callback);
  };
}

function isDismissed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

type Props = {
  pills: string[];
};

export function ScoutHubBanner({ pills }: Props) {
  const hidden = useSyncExternalStore(subscribeToDismissal, isDismissed, () => true);

  if (hidden) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return (
    <section className="relative rounded-lg border border-border bg-card px-6 py-5">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Sparkles className="mr-1 inline h-2.5 w-2.5" />
              New
            </span>
            <p className="text-sm font-semibold">
              Introducing Scout Hub
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Professional scouting command center with AI-powered tools.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {pills.map((p) => (
              <li
                key={p}
                className="rounded border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/players"
          className="self-start whitespace-nowrap rounded-md border border-border bg-muted px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent md:self-auto"
        >
          Browse players <ArrowRight className="ml-1 inline h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
