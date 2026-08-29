"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, User, Trophy, ArrowRight, X, Sparkles, Command } from "lucide-react";
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
  const router = useRouter();
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
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startSearching(async () => {
        const res = await searchGlobalOmni(query);
        setResults(res);
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

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
        className="group flex h-9 w-full items-center justify-between rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] px-3 text-xs text-slate-400 hover:border-[#CC5500]/50 hover:bg-[#171B23] transition-all"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Search className="h-3.5 w-3.5 text-[#CC5500] shrink-0" />
          <span className="truncate">Search scouted talents...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Omni Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md pt-20 px-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[rgba(224,192,178,0.2)] bg-[#12151C] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Search Header */}
            <div className="flex items-center gap-3 border-b border-[rgba(224,192,178,0.12)] px-4 py-3 bg-[#171B23]">
              <Search className="h-4 w-4 text-[#CC5500] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search African talents, clubs, competitions (e.g. Boniface, Kudus, NPFL)..."
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none font-['Inter']"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearching && <Loader2 className="h-4 w-4 animate-spin text-[#CC5500]" />}
              <kbd className="rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                ESC
              </kbd>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[rgba(224,192,178,0.08)] px-4 py-2 bg-[#0C0E12] font-['Public_Sans'] font-bold text-[11px] uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`rounded-[4px] px-2.5 py-1 transition-colors ${
                  filterType === "all"
                    ? "bg-[#CC5500]/20 text-[#FFB693] border border-[#CC5500]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Results
              </button>
              <button
                type="button"
                onClick={() => setFilterType("player")}
                className={`rounded-[4px] px-2.5 py-1 transition-colors ${
                  filterType === "player"
                    ? "bg-[#CC5500]/20 text-[#FFB693] border border-[#CC5500]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Prospects Only
              </button>
              <button
                type="button"
                onClick={() => setFilterType("club")}
                className={`rounded-[4px] px-2.5 py-1 transition-colors ${
                  filterType === "club"
                    ? "bg-[#CC5500]/20 text-[#FFB693] border border-[#CC5500]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Clubs & Teams
              </button>
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
                        className="group flex items-center justify-between rounded-[6px] p-2.5 hover:bg-[#171B23] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] text-[#FFB693]">
                            {r.type === "player" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Trophy className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-['Public_Sans'] font-bold text-xs text-white group-hover:text-[#FFB693] transition-colors">
                                {r.title}
                              </span>
                              {r.flagEmoji && <span>{r.flagEmoji}</span>}
                              {r.badge && (
                                <span className="rounded-[4px] bg-[#CC5500]/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#FFB693]">
                                  {r.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">{r.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm font-['Public_Sans'] font-bold text-white">No dossiers match "{query}"</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try searching by nationality (e.g. Nigeria, Senegal, Morocco) or club.
                    </p>
                  </div>
                ) : null
              ) : (
                /* Popular Suggestions when query is empty */
                <div className="space-y-3 p-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
                    <Sparkles className="h-3 w-3" />
                    <span>Popular Scouting Searches</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {POPULAR_SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setQuery(s.query)}
                        className="flex items-center justify-between rounded-[6px] border border-[rgba(224,192,178,0.1)] bg-[#0C0E12] p-2.5 text-left hover:border-[#CC5500]/40 hover:bg-[#171B23] transition-all group"
                      >
                        <div>
                          <div className="text-xs font-['Public_Sans'] font-bold text-white group-hover:text-[#FFB693] transition-colors">
                            {s.label}
                          </div>
                          <div className="text-[10px] text-slate-400">{s.hint}</div>
                        </div>
                        <Search className="h-3 w-3 text-slate-500 group-hover:text-[#CC5500]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Shortcut Bar */}
            <div className="flex items-center justify-between border-t border-[rgba(224,192,178,0.1)] bg-[#0C0E12] px-4 py-2 text-[10px] font-mono text-slate-400">
              <span>Navigate with arrow keys</span>
              <span>Press <kbd className="text-white font-bold">↵</kbd> to select</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
