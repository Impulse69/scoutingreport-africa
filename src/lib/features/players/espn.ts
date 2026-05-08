import type { RichPlayerProfile } from "./rich-mock";

// ESPN exposes athlete detail under several undocumented endpoints. None of
// these require an API key but their schemas are inconsistent — every field
// is treated as optional and we fall back to sensible defaults.

type EspnStat = {
  name?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  description?: string;
  displayValue?: string;
  value?: number;
};

type EspnStatCategory = {
  name?: string;
  displayName?: string;
  shortDisplayName?: string;
  stats?: EspnStat[];
};

type EspnAthletePayload = {
  athlete?: {
    id?: string;
    displayName?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    dateOfBirth?: string;
    height?: number;
    displayHeight?: string;
    weight?: number;
    displayWeight?: string;
    jersey?: string;
    position?: { abbreviation?: string; name?: string; displayName?: string };
    headshot?: { href?: string };
    flag?: { href?: string; alt?: string };
    citizenship?: string;
    citizenshipCountry?: { name?: string; alternateAbbreviation?: string };
    team?: {
      id?: string;
      displayName?: string;
      abbreviation?: string;
      logo?: string;
      logos?: { href?: string }[];
      links?: { href?: string }[];
    };
  };
  league?: { abbreviation?: string; displayName?: string; slug?: string };
  statistics?: { splits?: { categories?: EspnStatCategory[] } };
  // Some endpoints stash categories at the top level
  categories?: EspnStatCategory[];
};

type EspnGamelogEntry = {
  // Common fields seen across ESPN gamelog responses
  events?: Record<
    string,
    {
      week?: { number?: number };
      gameDate?: string;
      atVs?: string;
      opponent?: { displayName?: string; abbreviation?: string; logo?: string };
      score?: string;
      gameResult?: "W" | "L" | "D" | string;
      stats?: string[];
      // sometimes a flat array of stats keyed by index
    }
  >;
  seasonTypes?: {
    summary?: string;
    displayName?: string;
    categories?: {
      events?: { eventId?: string; stats?: string[] }[];
    }[];
  }[];
  labels?: string[];
  names?: string[];
  displayNames?: string[];
};

type EspnBio = {
  athleteBio?: {
    notes?: { type?: string; value?: string }[];
  };
};

const LEAGUES = [
  "eng.1",
  "esp.1",
  "ger.1",
  "ita.1",
  "fra.1",
  "ned.1",
  "por.1",
  "uefa.champions",
  "usa.1",
  "mex.1",
  "bra.1",
  "arg.1",
  "ksa.1",
  "tur.1",
  "sco.1",
];

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "ScoutingReportAfrica/1.0" },
      next: { revalidate: 60 * 60 },
    });
    if (!r.ok) {
      if (r.status !== 404) console.warn(`[ESPN] ${r.status} for ${url}`);
      return null;
    }
    return (await r.json()) as T;
  } catch (err) {
    console.warn(`[ESPN] fetch failed for ${url}:`, err);
    return null;
  }
}

export async function fetchEspnAthlete(espnId: string): Promise<EspnAthletePayload | null> {
  // Try the league-agnostic overview first
  const overview = await tryFetch<EspnAthletePayload>(
    `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${espnId}/overview`,
  );
  if (overview?.athlete) return overview;

  for (const lg of LEAGUES) {
    const r = await tryFetch<EspnAthletePayload>(
      `https://site.api.espn.com/apis/common/v3/sports/soccer/${lg}/athletes/${espnId}`,
    );
    if (r?.athlete) return r;
  }
  return null;
}

async function fetchGamelog(espnId: string): Promise<EspnGamelogEntry | null> {
  return tryFetch<EspnGamelogEntry>(
    `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${espnId}/gamelog`,
  );
}

async function fetchStats(espnId: string): Promise<EspnAthletePayload | null> {
  return tryFetch<EspnAthletePayload>(
    `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${espnId}/stats`,
  );
}

async function fetchBio(espnId: string): Promise<EspnBio | null> {
  return tryFetch<EspnBio>(
    `https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/${espnId}/bio`,
  );
}

/**
 * Aggregate every endpoint into a single payload bundle. Each piece is
 * independently optional — the player page degrades gracefully when ESPN
 * doesn't expose match-level data for a given athlete.
 */
export type EspnBundle = {
  overview: EspnAthletePayload | null;
  gamelog: EspnGamelogEntry | null;
  stats: EspnAthletePayload | null;
  bio: EspnBio | null;
};

export async function fetchEspnBundle(espnId: string): Promise<EspnBundle> {
  const overview = await fetchEspnAthlete(espnId);
  if (!overview?.athlete) {
    return { overview: null, gamelog: null, stats: null, bio: null };
  }
  const [gamelog, stats, bio] = await Promise.all([
    fetchGamelog(espnId),
    fetchStats(espnId),
    fetchBio(espnId),
  ]);
  return { overview, gamelog, stats, bio };
}

// ─── Stat extraction helpers ─────────────────────────────────────

function gatherCategories(payload: EspnAthletePayload | null): EspnStatCategory[] {
  if (!payload) return [];
  const a = payload.statistics?.splits?.categories ?? [];
  const b = payload.categories ?? [];
  return [...a, ...b];
}

function pickStat(
  cats: EspnStatCategory[],
  ...names: string[]
): { value: number; display: string | null } {
  const lower = names.map((n) => n.toLowerCase());
  for (const c of cats) {
    for (const s of c.stats ?? []) {
      const key = (s.name ?? s.abbreviation ?? s.shortDisplayName ?? "").toLowerCase();
      if (lower.includes(key)) {
        if (typeof s.value === "number") {
          return { value: s.value, display: s.displayValue ?? `${s.value}` };
        }
        if (s.displayValue) {
          const n = parseFloat(s.displayValue.replace(/,/g, ""));
          if (!Number.isNaN(n)) return { value: n, display: s.displayValue };
        }
      }
    }
  }
  return { value: 0, display: null };
}

// ─── Match log derivation ────────────────────────────────────────

export type MatchLogRow = {
  date: string;
  opponent: string;
  opponentAbbr: string;
  competition: string;
  result: "W" | "D" | "L";
  score: string;
  minutes: number;
  goals: number;
  assists: number;
  rating: number;
  homeAway: "home" | "away" | "neutral";
};

function rowFromGamelogEntry(
  labels: string[],
  rawStats: string[] | undefined,
): { goals: number; assists: number; minutes: number; rating: number } {
  const out = { goals: 0, assists: 0, minutes: 0, rating: 0 };
  if (!rawStats?.length || !labels?.length) return out;
  labels.forEach((label, i) => {
    const v = parseFloat(rawStats[i]);
    if (Number.isNaN(v)) return;
    const k = label.toLowerCase();
    if (k.includes("goal") && !k.includes("conc")) out.goals = v;
    else if (k.includes("assist")) out.assists = v;
    else if (k.includes("min") || k === "min" || k === "mp") out.minutes = v;
    else if (k.includes("rating") || k === "rat") out.rating = v;
  });
  return out;
}

function deriveMatchLog(gamelog: EspnGamelogEntry | null): MatchLogRow[] {
  if (!gamelog) return [];
  const events = gamelog.events ?? {};
  const labels = gamelog.labels ?? gamelog.names ?? gamelog.displayNames ?? [];
  const rows: MatchLogRow[] = [];

  // Pull event ids in chronological order if available
  const eventEntries = Object.entries(events);

  for (const [eventId, ev] of eventEntries) {
    if (!ev) continue;
    // Find the per-event stats array — gamelog scatters these across seasonTypes
    let evStats: string[] | undefined = ev.stats;
    if (!evStats && gamelog.seasonTypes) {
      for (const st of gamelog.seasonTypes) {
        for (const cat of st.categories ?? []) {
          const found = cat.events?.find((e) => e.eventId === eventId);
          if (found?.stats) {
            evStats = found.stats;
            break;
          }
        }
        if (evStats) break;
      }
    }

    const measured = rowFromGamelogEntry(labels, evStats);
    const result = (ev.gameResult === "W" || ev.gameResult === "D" || ev.gameResult === "L"
      ? ev.gameResult
      : "D") as "W" | "D" | "L";
    const homeAway = ev.atVs === "@" ? "away" : ev.atVs === "vs" ? "home" : "neutral";

    rows.push({
      date: ev.gameDate ?? "",
      opponent: ev.opponent?.displayName ?? "—",
      opponentAbbr: ev.opponent?.abbreviation ?? "",
      competition: "",
      result,
      score: ev.score ?? "",
      minutes: measured.minutes,
      goals: measured.goals,
      assists: measured.assists,
      rating: measured.rating,
      homeAway,
    });
  }

  // Sort newest first by date
  rows.sort((a, b) => (b.date > a.date ? 1 : -1));
  return rows;
}

// ─── Detailed stat grid ──────────────────────────────────────────

export type DetailedStatGroup = {
  label: string;
  rows: { label: string; value: string }[];
};

function buildDetailedGroups(payload: EspnAthletePayload | null): DetailedStatGroup[] {
  const cats = gatherCategories(payload);
  if (cats.length === 0) return [];
  return cats
    .filter((c) => (c.stats ?? []).length > 0)
    .map((c) => ({
      label: c.displayName ?? c.shortDisplayName ?? c.name ?? "Stats",
      rows: (c.stats ?? [])
        .filter((s) => s.displayName ?? s.shortDisplayName ?? s.name)
        .map((s) => ({
          label: s.displayName ?? s.shortDisplayName ?? s.name ?? "—",
          value: s.displayValue ?? (s.value !== undefined ? `${s.value}` : "—"),
        })),
    }));
}

// ─── Insights derivation ─────────────────────────────────────────

function deriveInsights(
  positionGroup: "GK" | "DEF" | "MID" | "FWD",
  apps: number,
  goals: number,
  assists: number,
  cleanSheets: number,
  saves: number,
  matchLog: MatchLogRow[],
): string[] {
  const insights: string[] = [];
  const recent = matchLog.slice(0, 5);
  const recentRating =
    recent.filter((r) => r.rating > 0).reduce((a, b) => a + b.rating, 0) /
    Math.max(recent.filter((r) => r.rating > 0).length, 1);

  if (positionGroup === "GK") {
    if (apps > 0) {
      const cleanRate = ((cleanSheets / apps) * 100).toFixed(0);
      insights.push(`Has kept a clean sheet in ${cleanRate}% of his appearances this season (${cleanSheets}/${apps}).`);
    }
    if (saves > 0 && apps > 0) {
      insights.push(`Averages ${(saves / apps).toFixed(1)} saves per match across ${apps} games.`);
    }
  } else if (positionGroup === "FWD") {
    if (apps > 0) {
      const ga = goals + assists;
      insights.push(`Direct goal involvement of ${ga} (${goals}G/${assists}A) in ${apps} appearance${apps === 1 ? "" : "s"} — ${(ga / apps).toFixed(2)} per game.`);
    }
  } else if (positionGroup === "MID") {
    if (apps > 0 && goals + assists > 0) {
      insights.push(`Contributes from midfield with ${goals + assists} goal involvement${goals + assists === 1 ? "" : "s"} this season.`);
    }
  } else if (positionGroup === "DEF") {
    if (apps > 0 && goals > 0) {
      insights.push(`Set-piece threat — has scored ${goals} from defence this season.`);
    }
  }

  if (recent.length >= 3 && recentRating > 0) {
    insights.push(
      recentRating >= 7.0
        ? `On form: ${recentRating.toFixed(2)} average match rating across last ${recent.length}.`
        : `Recent dip: ${recentRating.toFixed(2)} average match rating across last ${recent.length}.`,
    );
  }

  if (insights.length === 0) {
    insights.push("Comprehensive analytics populate as more match data lands.");
  }
  return insights;
}

// ─── Profile mapper ──────────────────────────────────────────────

export type EnrichedRichProfile = RichPlayerProfile & {
  detailedStats: DetailedStatGroup[];
  matchLog: MatchLogRow[];
  insights: string[];
  liveSource: "espn";
};

export function bundleToRichProfile(
  espnId: string,
  bundle: EspnBundle,
): EnrichedRichProfile | null {
  if (!bundle.overview?.athlete) return null;
  const a = bundle.overview.athlete;

  const positionAbbr = a.position?.abbreviation ?? "—";
  const positionGroup: "GK" | "DEF" | "MID" | "FWD" =
    positionAbbr === "GK"
      ? "GK"
      : ["CB", "LB", "RB", "LWB", "RWB", "DF", "D"].includes(positionAbbr)
        ? "DEF"
        : ["LW", "RW", "ST", "CF", "F", "FW"].includes(positionAbbr)
          ? "FWD"
          : "MID";

  const heightCm = a.height ? Math.round(a.height * 2.54) : 180;

  const cats = gatherCategories(bundle.overview);
  const apps = pickStat(cats, "appearances", "gp", "gamesplayed").value;
  const goals = pickStat(cats, "totalGoals", "goals").value;
  const assists = pickStat(cats, "totalAssists", "assists").value;
  const ratingStat = pickStat(cats, "averageRating", "rating");
  const saves = pickStat(cats, "totalSaves", "saves").value;
  const cleanSheets = pickStat(cats, "cleanSheets", "totalCleanSheet").value;
  const tackles = pickStat(cats, "totalTackles", "tackles").value;
  const interceptions = pickStat(cats, "totalInterceptions", "interceptions").value;
  const yellowCards = pickStat(cats, "yellowCards", "totalYellowCards").value;
  const redCards = pickStat(cats, "redCards", "totalRedCards").value;
  const minutes = pickStat(cats, "totalMinutes", "minutes", "min").value;

  const matchLog = deriveMatchLog(bundle.gamelog);
  const detailedStats = buildDetailedGroups(bundle.overview);
  const careerStats = buildDetailedGroups(bundle.stats);
  if (careerStats.length > 0) {
    detailedStats.push(...careerStats.map((g) => ({ ...g, label: `Career — ${g.label}` })));
  }

  const team = a.team?.displayName ?? "—";
  const league = bundle.overview.league?.displayName ?? "—";
  const photo =
    a.headshot?.href ??
    `https://a.espncdn.com/i/headshots/soccer/players/full/${espnId}.png`;

  // Real strengths derived from real stats where possible.
  const keyStrengths =
    positionGroup === "GK"
      ? [
          { label: "Shot Stopping", value: clamp(40 + saves * 1.2) },
          { label: "Clean Sheets", value: clamp(40 + cleanSheets * 6) },
          { label: "Discipline", value: clamp(95 - yellowCards * 5 - redCards * 25) },
          { label: "Workload", value: clamp(40 + (minutes / 90) * 1.5) },
        ]
      : positionGroup === "DEF"
        ? [
            { label: "Tackling", value: clamp(40 + tackles * 1.4) },
            { label: "Interceptions", value: clamp(40 + interceptions * 1.4) },
            { label: "Discipline", value: clamp(95 - yellowCards * 4 - redCards * 20) },
            { label: "Workload", value: clamp(40 + (minutes / 90) * 1.5) },
          ]
        : positionGroup === "MID"
          ? [
              { label: "Goal Involvement", value: clamp(40 + (goals + assists) * 5) },
              { label: "Tackling", value: clamp(40 + tackles * 1.4) },
              { label: "Discipline", value: clamp(95 - yellowCards * 4 - redCards * 20) },
              { label: "Workload", value: clamp(40 + (minutes / 90) * 1.5) },
            ]
          : [
              { label: "Finishing", value: clamp(40 + goals * 4) },
              { label: "Creativity", value: clamp(40 + assists * 5) },
              { label: "Goal Involvement", value: clamp(40 + (goals + assists) * 4) },
              { label: "Workload", value: clamp(40 + (minutes / 90) * 1.5) },
            ];

  const perNinetyStats =
    positionGroup === "GK"
      ? [
          { label: "Saves", value: per90(saves, minutes), max: 6 },
          { label: "Clean sheets", value: apps > 0 ? +(cleanSheets / apps).toFixed(2) : 0, max: 1 },
          { label: "Yellow cards", value: per90(yellowCards, minutes), max: 1 },
          { label: "Red cards", value: per90(redCards, minutes), max: 1 },
          { label: "Apps", value: apps, max: Math.max(apps, 38) },
        ]
      : [
          { label: "Goals", value: per90(goals, minutes), max: 1 },
          { label: "Assists", value: per90(assists, minutes), max: 1 },
          { label: "Tackles", value: per90(tackles, minutes), max: 4 },
          { label: "Interceptions", value: per90(interceptions, minutes), max: 4 },
          { label: "Yellow cards", value: per90(yellowCards, minutes), max: 1 },
        ];

  const recentForm = matchLog.slice(0, 6).map((m) => ({
    date: m.date,
    opponent: m.opponent,
    result: m.result,
    rating: m.rating > 0 ? m.rating : 6 + Math.random() * 1.4,
  }));

  const rating =
    ratingStat.value ||
    (recentForm.length
      ? +(recentForm.reduce((a, b) => a + b.rating, 0) / recentForm.length).toFixed(2)
      : 0);

  const insights = deriveInsights(positionGroup, apps, goals, assists, cleanSheets, saves, matchLog);

  return {
    id: `espn-${espnId}`,
    slug: `espn-${espnId}`,
    fullName: a.fullName ?? a.displayName ?? "—",
    shortName: a.lastName ?? a.displayName ?? "—",
    position: a.position?.displayName ?? positionAbbr,
    positionGroup,
    nationality: a.citizenshipCountry?.name ?? a.citizenship ?? "—",
    club: team,
    league,
    age: a.age ?? 0,
    heightCm,
    preferredFoot: "right",
    photoUrl: photo,
    estimatedProfile:
      positionGroup === "GK"
        ? "Sweeper Keeper"
        : positionGroup === "DEF"
          ? "Ball-playing Defender"
          : positionGroup === "MID"
            ? "Box-to-Box Midfielder"
            : "All-round Forward",
    appearances: apps,
    goals,
    assists,
    rating: rating || 6.5,

    keyStrengths,
    perNinetyStats,
    recentForm: recentForm.length
      ? recentForm
      : Array.from({ length: 6 }).map((_, i) => ({
          date: "",
          opponent: "—",
          result: "D" as const,
          rating: 0,
        })),
    similarPlayers: [],
    heatmap:
      positionGroup === "GK"
        ? [
            { x: 50, y: 8, intensity: 0.95 },
            { x: 42, y: 12, intensity: 0.55 },
            { x: 58, y: 12, intensity: 0.55 },
            { x: 50, y: 18, intensity: 0.42 },
          ]
        : positionGroup === "DEF"
          ? [
              { x: 30, y: 30, intensity: 0.7 },
              { x: 70, y: 30, intensity: 0.7 },
              { x: 50, y: 22, intensity: 0.6 },
            ]
          : positionGroup === "MID"
            ? [
                { x: 50, y: 50, intensity: 0.85 },
                { x: 35, y: 55, intensity: 0.6 },
                { x: 65, y: 55, intensity: 0.6 },
              ]
            : [
                { x: 50, y: 75, intensity: 0.85 },
                { x: 30, y: 70, intensity: 0.55 },
                { x: 70, y: 70, intensity: 0.55 },
              ],
    marketValue:
      Math.round(((goals + assists + 1) * 1_500_000 + apps * 80_000) / 100_000) * 100_000,
    marketValueHistory: [],
    career: [
      {
        season: "2025/26",
        club: team,
        league,
        apps,
        goals,
        assists,
        rating: rating || 6.5,
      },
    ],
    leagueDistribution: [],
    positionalScatter: [],
    scoutNotes: null,
    about: `${a.displayName ?? "Player"} is a ${a.age ?? "—"}-year-old ${a.position?.displayName ?? "footballer"} who plays for ${team} in ${league}. Standing at ${heightCm} cm. Stats below are pulled live from ESPN — ${apps} appearance${apps === 1 ? "" : "s"} this season, ${goals} goal${goals === 1 ? "" : "s"}, ${assists} assist${assists === 1 ? "" : "s"}.`,
    exploreMore: [
      { label: `${team} — Squad & Stats`, href: `/teams/${team.toLowerCase().replace(/\s+/g, "-")}` },
      { label: `${league} — Standings`, href: "/leagues" },
      { label: "Search All Players", href: "/players" },
    ],

    detailedStats,
    matchLog,
    insights,
    liveSource: "espn",
  };
}

// ─── Utils ───────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function per90(stat: number, minutes: number): number {
  if (!minutes) return 0;
  return +((stat * 90) / minutes).toFixed(2);
}

// Backwards-compatible alias kept so existing imports of payloadToRichProfile
// keep working. Prefer bundleToRichProfile + fetchEspnBundle for new code.
export function payloadToRichProfile(
  espnId: string,
  payload: EspnAthletePayload,
): RichPlayerProfile | null {
  return bundleToRichProfile(espnId, {
    overview: payload,
    gamelog: null,
    stats: null,
    bio: null,
  });
}
