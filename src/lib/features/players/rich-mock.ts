// TODO(live): swap each section for real Supabase queries when match data,
// market values, and career history tables exist. The shapes below are what
// the rich player profile UI consumes.

export type RichPlayerProfile = {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  position: string;
  positionGroup: "GK" | "DEF" | "MID" | "FWD";
  nationality: string;
  club: string;
  league: string;
  age: number;
  heightCm: number;
  preferredFoot: "left" | "right" | "both";
  photoUrl: string | null;
  estimatedProfile: string; // e.g. "Sweeper Keeper"
  appearances: number;
  goals: number;
  assists: number;
  rating: number;

  keyStrengths: { label: string; value: number }[];     // 0-100
  perNinetyStats: { label: string; value: number; max: number; unit?: string }[];

  recentForm: { date: string; opponent: string; result: "W" | "D" | "L"; rating: number }[];
  similarPlayers: { slug: string; name: string; club: string; age: number; similarity: number }[];

  heatmap: { x: number; y: number; intensity: number }[]; // pitch percentages

  marketValue: number;        // EUR
  marketValueHistory: { season: string; value: number }[];

  career: {
    season: string;
    club: string;
    league: string;
    apps: number;
    goals: number;
    assists: number;
    rating: number;
  }[];

  leagueDistribution: { tackles: number; interceptions: number; size: number; player?: boolean; label?: string }[];
  positionalScatter: { saves: number; cleanSheets: number; size: number; player?: boolean; label?: string }[];

  // Optional rich-tab payloads. Populated by the ESPN live mapper; absent
  // for purely mock profiles (those tabs render placeholders).
  detailedStats?: { label: string; rows: { label: string; value: string }[] }[];
  matchLog?: {
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
  }[];
  insights?: string[];

  scoutNotes: string | null;

  about: string;
  exploreMore: { label: string; href: string; tag?: string }[];
};

const ARNAU_TENAS: RichPlayerProfile = {
  id: "p_arnau",
  slug: "arnau-tenas",
  fullName: "Arnau Tenas",
  shortName: "Arnau Tenas",
  position: "GK",
  positionGroup: "GK",
  nationality: "Spain",
  club: "Villarreal",
  league: "La Liga",
  age: 24,
  heightCm: 188,
  preferredFoot: "right",
  photoUrl: null,
  estimatedProfile: "Sweeper Keeper",
  appearances: 6,
  goals: 0,
  assists: 0,
  rating: 6.54,

  keyStrengths: [
    { label: "Shot Stopping", value: 82 },
    { label: "Claiming", value: 68 },
    { label: "Distribution", value: 74 },
    { label: "Command", value: 71 },
  ],

  perNinetyStats: [
    { label: "Saves", value: 0.77, max: 1.0 },
    { label: "Saves attempted", value: 8.66, max: 10 },
    { label: "High claims", value: 6.49, max: 10 },
    { label: "Punches made", value: 6.49, max: 10 },
    { label: "Catches", value: 6.49, max: 10 },
  ],

  recentForm: [
    { date: "2026-04-22", opponent: "Mallorca", result: "W", rating: 6.6 },
    { date: "2026-04-15", opponent: "Real Betis", result: "L", rating: 6.1 },
    { date: "2026-04-08", opponent: "Valencia", result: "W", rating: 6.8 },
    { date: "2026-04-01", opponent: "Sevilla", result: "D", rating: 6.4 },
    { date: "2026-03-25", opponent: "Atlético", result: "L", rating: 6.0 },
    { date: "2026-03-18", opponent: "Cadiz", result: "W", rating: 6.9 },
  ],

  similarPlayers: [
    { slug: "gonzalo-crettaz", name: "Gonzalo Crettaz", club: "RC Strasbourg", age: 24, similarity: 91 },
    { slug: "andre-ferreira", name: "André Ferreira", club: "Maccabi", age: 28, similarity: 89 },
    { slug: "yang", name: "Yang", club: "ADO Genk", age: 27, similarity: 87 },
    { slug: "ronquel-uncalo", name: "Ronquel Uncalo", club: "Bordeaux", age: 22, similarity: 84 },
    { slug: "marko-airterski", name: "Marko Airterski", club: "Eindhoven", age: 22, similarity: 82 },
  ],

  // Defensive heatmap concentrated in own penalty box (y near top of pitch)
  heatmap: [
    { x: 50, y: 8, intensity: 0.95 },
    { x: 42, y: 12, intensity: 0.55 },
    { x: 58, y: 12, intensity: 0.55 },
    { x: 50, y: 18, intensity: 0.42 },
    { x: 50, y: 4, intensity: 0.7 },
  ],

  marketValue: 2_800_000,
  marketValueHistory: [
    { season: "2022/23", value: 600_000 },
    { season: "2023/24", value: 1_200_000 },
    { season: "2024/25", value: 2_000_000 },
    { season: "2025/26", value: 2_800_000 },
  ],

  career: [
    { season: "2025/26", club: "Villarreal", league: "La Liga", apps: 6, goals: 0, assists: 0, rating: 6.54 },
    { season: "2024/25", club: "PSG", league: "Ligue 1", apps: 12, goals: 0, assists: 0, rating: 6.61 },
    { season: "2023/24", club: "PSG", league: "Ligue 1", apps: 8, goals: 0, assists: 0, rating: 6.42 },
    { season: "2022/23", club: "Barcelona B", league: "Segunda", apps: 24, goals: 0, assists: 0, rating: 6.78 },
  ],

  leagueDistribution: Array.from({ length: 60 }, (_, i) => {
    const tackles = Math.random() * 4;
    const interceptions = Math.random() * 6;
    return {
      tackles: parseFloat(tackles.toFixed(2)),
      interceptions: parseFloat(interceptions.toFixed(2)),
      size: 4 + Math.random() * 4,
      player: i === 27,
      label: i === 27 ? "Arnau Tenas" : undefined,
    };
  }),

  positionalScatter: Array.from({ length: 50 }, (_, i) => {
    const saves = 1 + Math.random() * 5;
    const cleanSheets = Math.random() * 16;
    return {
      saves: parseFloat(saves.toFixed(2)),
      cleanSheets: parseFloat(cleanSheets.toFixed(1)),
      size: 4 + Math.random() * 6,
      player: i === 22,
      label: i === 22 ? "Arnau Tenas" : undefined,
    };
  }),

  scoutNotes: null,

  about:
    "Arnau Tenas is a 24-year-old Spanish goalkeeper who plays for Villarreal in La Liga. Standing at 188 cm and weighing 84 kg, Tenas is right-footed. Rated 1 out of 5 stars, Tenas is classified as a Sweeper Keeper.",

  exploreMore: [
    { label: "Villarreal — Squad & Stats", href: "/teams/villarreal" },
    { label: "La Liga — Standings", href: "/leagues/la-liga" },
    { label: "Search All Players", href: "/players" },
    { label: "Nicolas Pépé — Profile", href: "/players/nicolas-pepe" },
    { label: "Iliyan Pampov — Profile", href: "/players/iliyan-pampov" },
    { label: "Pau Navarro — Profile", href: "/players/pau-navarro" },
  ],
};

const RICH: Record<string, RichPlayerProfile> = {
  "arnau-tenas": ARNAU_TENAS,
};

export function getRichPlayerProfile(slug: string): RichPlayerProfile | null {
  return RICH[slug] ?? null;
}
