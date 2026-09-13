"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Loader2, User, Trophy, ArrowRight, X } from "lucide-react";
import { searchGlobalOmni, type OmniSearchResult } from "@/lib/features/search/actions";

const POPULAR_SUGGESTIONS = [
  { label: "Victor Boniface", query: "Boniface", type: "player", hint: "Leverkusen · FW" },
  { label: "Mohammed Kudus", query: "Kudus", type: "player", hint: "West Ham · AM" },
  { label: "Lamine Camara", query: "Lamine Camara", type: "player", hint: "Monaco · CM" },
  { label: "Nicolas Jackson", query: "Jackson", type: "player", hint: "Chelsea · ST" },
  { label: "Al Ahly SC", query: "Al Ahly", type: "club", hint: "Egyptian PL" },
  { label: "Mamelodi Sundowns", query: "Sundowns", type: "club", hint: "South African PSL" },
];

export function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "player" | "club">("all");
  const [results, setResults] = useState<OmniSearchResult[]>([]);
  const [isSearching, startSearching] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      startSearching(async () => {
        const res = await searchGlobalOmni(query);
        if (!cancelled) setResults(res);
      });
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const updateQuery = (value: string) => {
    setQuery(value);
    if (!value.trim()) setResults([]);
  };

  const displayedResults = results.filter((r) => {
    if (filterType === "player") return r.type === "player";
    if (filterType === "club") return r.type === "club";
    return true;
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button / Input Preview */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="group flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:bg-muted"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">Search players and clubs</span>
        </div>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      {/* Search overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/20 px-4 pt-20">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search players and clubs"
            className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-popover shadow-sm"
          >
            {/* Search header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                aria-label="Search players and clubs"
                placeholder="Search players, clubs or competitions"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => updateQuery("")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2 text-xs font-medium">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "player", label: "Players" },
                  { key: "club", label: "Clubs" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterType(tab.key)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    filterType === tab.key
                      ? "bg-background text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {query.trim() ? (
                displayedResults.length > 0 ? (
                  <div className="space-y-1">
                    {displayedResults.map((r) => (
                      <Link
                        key={`${r.type}-${r.id}`}
                        href={r.url}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between rounded-md p-2.5 transition-colors hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                            {r.type === "player" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Trophy className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {r.title}
                              </span>
                              {r.flagEmoji && <span>{r.flagEmoji}</span>}
                              {r.badge && (
                                <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                  {r.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a nationality or a club name.
                    </p>
                  </div>
                ) : null
              ) : (
                /* Suggestions shown when the query is empty */
                <div className="space-y-3 p-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Suggested searches
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {POPULAR_SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => updateQuery(s.query)}
                        className="group flex items-center justify-between rounded-md border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted"
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {s.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{s.hint}</div>
                        </div>
                        <Search className="h-3 w-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer shortcut bar */}
            <div className="flex items-center justify-between border-t border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
              <span>Navigate with arrow keys</span>
              <span>
                Press <kbd className="font-medium text-foreground">↵</kbd> to select
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
