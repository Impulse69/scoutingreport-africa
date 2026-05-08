"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

// Map a team display name to a /teams/[slug] route. Aligned with TEAM_INDEX
// in src/lib/features/teams/mock.ts so familiar names hit a real page.
const NAME_TO_SLUG: Record<string, string> = {
  "Real Madrid": "real-madrid",
  "FC Barcelona": "fc-barcelona",
  "Barcelona": "fc-barcelona",
  "Atlético Madrid": "atletico-madrid",
  "Villarreal": "villarreal",
  "Real Betis": "real-betis",
  "Real Sociedad": "real-sociedad",
  "Manchester City": "manchester-city",
  "Manchester United": "manchester-united",
  "Liverpool": "liverpool",
  "Arsenal": "arsenal",
  "Chelsea": "chelsea",
  "Tottenham Hotspur": "tottenham",
  "Bayern Munich": "bayern-munich",
  "Borussia Dortmund": "borussia-dortmund",
  "RB Leipzig": "rb-leipzig",
  "Paris Saint-Germain": "psg",
  "Olympique de Marseille": "marseille",
  "Inter Milan": "inter-milan",
  "AC Milan": "ac-milan",
  "Juventus": "juventus",
  "Napoli": "napoli",
  "AS Roma": "roma",
  "Lazio": "lazio",
  "Ajax": "ajax",
  "PSV": "psv",
  "FC Porto": "porto",
  "Benfica": "benfica",
  "Celtic": "celtic",
  "Rangers": "rangers",
};

function slugFor(name: string): string {
  if (NAME_TO_SLUG[name]) return NAME_TO_SLUG[name];
  return name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

type Team = {
  id: string;
  name: string;
  league: string;
  leagueSlug?: string | null;
  logo: string | null;
  url?: string | null;
};

type TeamSearchResponse = {
  teams?: Team[];
};

const seededTeams: Team[] = [
  {
    id: "s:600~t:124",
    name: "Borussia Dortmund",
    league: "Bundesliga",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/124.png",
  },
  {
    id: "s:600~t:132",
    name: "Bayern Munich",
    league: "Bundesliga",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/132.png",
  },
  {
    id: "s:600~t:86",
    name: "Real Madrid",
    league: "LaLiga",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
  },
  {
    id: "s:600~t:382",
    name: "Manchester City",
    league: "Premier League",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png",
  },
  {
    id: "s:600~t:359",
    name: "Arsenal",
    league: "Premier League",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
  },
  {
    id: "s:600~t:83",
    name: "Barcelona",
    league: "LaLiga",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  },
  {
    id: "s:600~t:364",
    name: "Liverpool",
    league: "Premier League",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",
  },
  {
    id: "s:600~t:160",
    name: "Paris Saint-Germain",
    league: "Ligue 1",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/160.png",
  },
  {
    id: "s:600~t:363",
    name: "Chelsea",
    league: "Premier League",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
  },
  {
    id: "s:600~t:103",
    name: "AC Milan",
    league: "Serie A",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/103.png",
  },
  {
    id: "s:600~t:110",
    name: "Inter Milan",
    league: "Serie A",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/110.png",
  },
  {
    id: "s:600~t:139",
    name: "Ajax",
    league: "Eredivisie",
    logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/139.png&h=64&w=64&scale=crop&location=origin",
  },
];

export function PlatformDashboard() {
  const t = useTranslations("platform");
  const [query, setQuery] = useState("");
  const [searchTeams, setSearchTeams] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [brokenLogos, setBrokenLogos] = useState<Set<string>>(() => new Set());

  const normalizedQuery = query.trim();

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setSearchTeams([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(false);

      try {
        const response = await fetch(
          `/api/football-team-search?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Team search failed");
        }

        const data = (await response.json()) as TeamSearchResponse;
        setSearchTeams(data.teams ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchTeams([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalizedQuery]);

  const visibleTeams = useMemo(() => {
    if (normalizedQuery.length < 2) {
      return seededTeams.slice(0, 6);
    }

    return searchTeams;
  }, [normalizedQuery.length, searchTeams]);

  const resultLabel =
    normalizedQuery.length < 2 ? t("topTeams") : t("searchResults");
  const resultCounter =
    normalizedQuery.length < 2
      ? t("curatedCount", { shown: visibleTeams.length })
      : t("resultCount", { count: visibleTeams.length });

  return (
    <div className="max-w-5xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="bg-[#0B0B0B] rounded-xl border border-white/5 min-h-[500px] p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              onInput={(event) => setQuery(event.currentTarget.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500/50 text-white placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {resultLabel}
              </div>
              <div className="text-[11px] font-medium text-orange-500 tabular-nums">
                {resultCounter}
              </div>
            </div>

            <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
              {visibleTeams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${slugFor(team.name)}`}
                  className="group w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-colors text-left"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white">
                    {team.logo && !brokenLogos.has(team.id) ? (
                      <Image
                        src={team.logo}
                        alt={`${team.name} logo`}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                        onError={() =>
                          setBrokenLogos((current) => {
                            const next = new Set(current);
                            next.add(team.id);
                            return next;
                          })
                        }
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-zinc-950">
                        {team.name.slice(0, 2)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-300 group-hover:text-white">
                      {team.name}
                    </span>
                    <span className="block truncate text-[11px] text-zinc-600">
                      {team.league}
                    </span>
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                </Link>
              ))}

              {isSearching ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-500">
                  {t("searching")}
                </div>
              ) : null}

              {!isSearching && normalizedQuery.length === 1 ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-500">
                  {t("minCharacters")}
                </div>
              ) : null}

              {!isSearching && searchError ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-200">
                  {t("searchError")}
                </div>
              ) : null}

              {!isSearching && !searchError && normalizedQuery.length >= 2 && visibleTeams.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-500">
                  {t("noResults", { query: normalizedQuery })}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: t("stats.matchesTracked"), val: "12,345", trend: "+12%" },
              { label: t("stats.playersInDb"), val: "50,000+", trend: "+5%" },
              { label: t("stats.dataAccuracy"), val: "99.9%", trend: t("stats.stable") },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-zinc-500 mb-2">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.val}</div>
                <div className="text-xs text-orange-500 mt-2 font-medium">{stat.trend}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 h-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/10 to-transparent mix-blend-screen" />
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 100 Q 20 80, 40 90 T 80 40 T 100 20 L 100 100 Z" fill="url(#gradient)" className="text-orange-500/10" />
              <path d="M0 100 Q 20 80, 40 90 T 80 40 T 100 20" fill="none" stroke="#F97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
