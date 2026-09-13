"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchPlayers, type PlayerSearchResult } from "@/lib/features/players/actions";

// Stable identity so the derived list below doesn't allocate on every render.
const EMPTY_RESULTS: PlayerSearchResult[] = [];

/**
 * Search the local Supabase players table to pick a subject for a new report.
 * Falls back to a "Create new player" CTA when the typed name doesn't match.
 */
export function PlayerPicker() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  const tooShort = query.trim().length < 2;

  useEffect(() => {
    if (tooShort) return;
    const t = setTimeout(() => {
      start(async () => {
        const r = await searchPlayers(query);
        setResults(r);
      });
    }, 220);
    return () => clearTimeout(t);
  }, [query, tooShort]);

  // Derived rather than cleared from inside the effect — clearing state
  // synchronously in an effect body triggers a second render pass.
  const visibleResults = tooShort ? EMPTY_RESULTS : results;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const pick = (id: string) => {
    setOpen(false);
    router.push(`/scout/reports/new?player=${id}`);
  };

  const showEmpty = query.trim().length >= 2 && !pending && visibleResults.length === 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type a player's name to start a report…"
          className="pl-9"
        />
      </div>

      {open && (query.trim().length >= 2 || visibleResults.length > 0) ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[360px] overflow-y-auto rounded-lg border border-border bg-popover shadow-sm">
          {pending ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching…
            </div>
          ) : visibleResults.length > 0 ? (
            <ul className="py-1.5">
              {visibleResults.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pick(r.id)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {r.fullName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {r.fullName}
                        </span>
                        {r.status === "draft" ? (
                          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Draft
                          </span>
                        ) : null}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {r.primaryPositionCode ?? "—"}
                        {r.nationalityCode ? ` · ${r.nationalityCode}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {showEmpty ? (
            <div className="border-t border-border px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">
                No player matches{" "}
                <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
              </p>
              <Link
                href={`/scout/players/new?name=${encodeURIComponent(query)}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-primary transition-colors hover:bg-accent"
              >
                <UserPlus className="h-3 w-3" />
                Create &ldquo;{query}&rdquo;
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
