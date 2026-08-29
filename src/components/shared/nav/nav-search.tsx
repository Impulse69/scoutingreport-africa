"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, User, Shield, ArrowRight, Sparkles, X } from "lucide-react";
import { globalSearch, type GlobalSearchResult } from "@/lib/features/search/actions";

const EMPTY: GlobalSearchResult = { players: [], teams: [] };

export function NavSearch({ placeholder = "Search African & global talents, teams…" }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult>(EMPTY);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "players" | "teams">("all");
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
    }, 180);
    return () => clearTimeout(t);
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
  const filteredPlayers = tab === "teams" ? [] : results.players;
  const filteredTeams = tab === "players" ? [] : results.teams;
  const hasResults = filteredPlayers.length > 0 || filteredTeams.length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/70 group-focus-within:text-emerald-400 transition-colors" />
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
          className="w-full rounded-xl border border-white/10 bg-[#0c1218]/90 pl-10 pr-16 py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-emerald-500/60 focus:bg-[#111a22] focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults(EMPTY);
            }}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-emerald-300/80">
          ⌘K
        </kbd>
      </div>

      {open && (hasQuery || open) ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[460px] overflow-y-auto rounded-2xl border border-emerald-500/20 bg-[#0c1218]/98 shadow-2xl backdrop-blur-2xl p-2 text-slate-200">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 p-1.5 border-b border-white/5 mb-2">
            <button
              type="button"
              onClick={() => setTab("all")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                tab === "all"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              All Results
            </button>
            <button
              type="button"
              onClick={() => setTab("players")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                tab === "players"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Players {results.players.length > 0 ? `(${results.players.length})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setTab("teams")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                tab === "teams"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Clubs {results.teams.length > 0 ? `(${results.teams.length})` : ""}
            </button>
          </div>

          {!hasQuery ? (
            <div className="p-4 text-center">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-white">Live Talent Intelligence Search</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Type at least 2 characters to scan scouted African talents, domestic clubs, and global database players.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {["Boniface", "Kudus", "Lamine Camara", "Mamelodi Sundowns", "Al Ahly"].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      setOpen(true);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-300 border border-white/5 transition-all text-slate-300"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : pending ? (
            <div className="flex items-center justify-center gap-2.5 py-8 text-xs text-emerald-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Scanning live scouting database…</span>
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              No results found for <span className="text-white font-medium">&ldquo;{query}&rdquo;</span>
              <div className="mt-3">
                <Link
                  href={`/players?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Search full player catalogue <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredPlayers.length > 0 ? (
                <div className="py-1">
                  <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Players
                  </p>
                  <ul className="space-y-0.5">
                    {filteredPlayers.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/players/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#162029] text-xs font-bold text-emerald-300 border border-white/5">
                            {p.photo ? (
                              <Image
                                src={p.photo}
                                alt=""
                                width={32}
                                height={32}
                                className="h-8 w-8 object-cover"
                                unoptimized
                              />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              {p.name}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">
                              {p.position ?? "Player"}
                              {p.team ? ` · ${p.team}` : ""}
                              {p.league ? ` · ${p.league}` : ""}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                            View Profile
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {filteredTeams.length > 0 ? (
                <div className="py-1">
                  <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Clubs & Teams
                  </p>
                  <ul className="space-y-0.5">
                    {filteredTeams.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/teams/${t.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a231b] border border-amber-500/20">
                            <Shield className="h-4 w-4 text-amber-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {t.name}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">
                              {t.league} · {t.country}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                            Club Hub
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-2 border-t border-white/5 pt-2 px-3 pb-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Press <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-slate-300">Esc</kbd> to exit</span>
            <Link
              href="/players"
              onClick={() => setOpen(false)}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Browse All Players →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
