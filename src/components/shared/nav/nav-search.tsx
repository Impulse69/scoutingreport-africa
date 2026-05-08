"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, User, Shield } from "lucide-react";
import { globalSearch, type GlobalSearchResult } from "@/lib/features/search/actions";

const EMPTY: GlobalSearchResult = { players: [], teams: [] };

export function NavSearch({ placeholder = "Search players, teams…" }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult>(EMPTY);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(EMPTY);
      return;
    }
    const t = setTimeout(() => {
      start(async () => {
        const r = await globalSearch(query);
        setResults(r);
      });
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Cmd-K / Ctrl-K to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const hasQuery = query.trim().length >= 2;
  const hasResults = results.players.length > 0 || results.teams.length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-9 py-2 font-mono text-xs text-white placeholder:text-zinc-500 focus:border-cyan-500/40 focus:bg-white/10 focus:outline-none transition-colors"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
          ⌘K
        </kbd>
      </div>

      {open && hasQuery ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[420px] overflow-y-auto rounded-xl border border-white/10 bg-[#111]/97 shadow-2xl backdrop-blur-md">
          {pending ? (
            <div className="flex items-center gap-2 px-4 py-6 font-mono text-xs text-zinc-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching real-time…
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-8 text-center font-mono text-xs text-zinc-500">
              No results for <span className="text-zinc-300">&ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {results.players.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500">
                    Players
                  </p>
                  <ul>
                    {results.players.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/players/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 font-mono text-[9px] font-bold text-zinc-400">
                            {p.photo ? (
                              <Image
                                src={p.photo}
                                alt=""
                                width={28}
                                height={28}
                                className="h-7 w-7 object-cover"
                                unoptimized
                              />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-xs font-semibold text-white">
                              {p.name}
                            </p>
                            <p className="truncate font-mono text-[10px] text-zinc-500">
                              {p.position ?? "—"}
                              {p.team ? ` · ${p.team}` : ""}
                              {p.league ? ` · ${p.league}` : ""}
                            </p>
                          </div>
                          <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                            Player
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {results.teams.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500">
                    Teams
                  </p>
                  <ul>
                    {results.teams.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/teams/${t.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-800">
                            <Shield className="h-3 w-3 text-zinc-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-xs font-semibold text-white">
                              {t.name}
                            </p>
                            <p className="truncate font-mono text-[10px] text-zinc-500">
                              {t.league} · {t.country}
                            </p>
                          </div>
                          <span
                            className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                              t.hasPage
                                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                                : "border-white/10 text-zinc-500"
                            }`}
                          >
                            {t.hasPage ? "Live" : "Soon"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          <div className="border-t border-white/5 px-4 py-2.5 font-mono text-[10px] text-zinc-600">
            Tip: press <kbd className="rounded border border-white/10 bg-white/5 px-1">↵</kbd> on
            any result to open. Press{" "}
            <kbd className="rounded border border-white/10 bg-white/5 px-1">Esc</kbd> to close.
          </div>
        </div>
      ) : null}
    </div>
  );
}
