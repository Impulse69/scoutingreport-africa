"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchPlayers, type PlayerSearchResult } from "@/lib/features/players/actions";

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

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      start(async () => {
        const r = await searchPlayers(query);
        setResults(r);
      });
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

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

  const showEmpty = query.trim().length >= 2 && !pending && results.length === 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
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

      {open && (query.trim().length >= 2 || results.length > 0) ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[360px] overflow-y-auto rounded-xl border border-white/10 bg-[#111]/97 shadow-2xl backdrop-blur-md">
          {pending ? (
            <div className="flex items-center gap-2 px-4 py-6 font-mono text-xs text-zinc-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching…
            </div>
          ) : results.length > 0 ? (
            <ul className="py-1.5">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pick(r.id)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-mono text-[10px] font-bold text-zinc-400">
                      {r.fullName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="flex-1">
                      <span className="block font-mono text-xs font-semibold text-white">
                        {r.fullName}
                      </span>
                      <span className="block font-mono text-[10px] text-zinc-500">
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
            <div className="border-t border-white/5 px-4 py-3 text-center">
              <p className="font-mono text-xs text-zinc-400">
                No published player matches{" "}
                <span className="text-white">&ldquo;{query}&rdquo;</span>
              </p>
              <Link
                href={`/scout/players/new?name=${encodeURIComponent(query)}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-[11px] text-cyan-300 transition-colors hover:bg-cyan-500/20"
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
