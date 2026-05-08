// TODO(live): replace with real Supabase queries once team / fixture / standings
// tables exist. The fixture below mirrors the shapes our UI consumes.

export type TeamRef = {
  slug: string;
  name: string;
  shortName: string;
  league: string;
  leagueSlug: string;
  crestUrl: string;
  primaryColor: string;
};

export type SquadPlayer = {
  id: string;
  slug: string;
  shirtNumber: number;
  shortName: string;
  position: string;
  positionGroup: "GK" | "DEF" | "MID" | "FWD";
  photoUrl: string | null;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  rating: number;
  xg: number;
  shots: number;
  keyPasses: number;
};

export type Formation = {
  code: string; // e.g. "4-4-2"
  // Slot positions on a vertical pitch as percentages [x, y]
  slots: { player: SquadPlayer; x: number; y: number }[];
};

export type StandingRow = {
  rank: number;
  teamSlug: string;
  teamName: string;
  crestUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
};

export type TeamStyleAttribute = {
  key: string;
  label: string;
  value: number; // 0-100
};

export type TeamData = {
  team: TeamRef;
  formation: Formation;
  backups: { GK: SquadPlayer[]; DEF: SquadPlayer[]; MID: SquadPlayer[]; FWD: SquadPlayer[] };
  standing: StandingRow[];
  myPosition: number;
  styleAttributes: TeamStyleAttribute[];
  styleTags: string[];
};

const REAL_MADRID_SQUAD: SquadPlayer[] = [
  { id: "1", slug: "courtois", shirtNumber: 1, shortName: "Courtois", position: "GK", positionGroup: "GK", photoUrl: null, appearances: 6, minutes: 540, goals: 0, assists: 0, rating: 7.05, xg: 0, shots: 0, keyPasses: 0 },
  { id: "2", slug: "carvajal", shirtNumber: 2, shortName: "Carvajal", position: "RB", positionGroup: "DEF", photoUrl: null, appearances: 9, minutes: 776, goals: 0, assists: 0, rating: 6.84, xg: 0.4, shots: 5, keyPasses: 9 },
  { id: "3", slug: "militao", shirtNumber: 3, shortName: "Militão", position: "CB", positionGroup: "DEF", photoUrl: null, appearances: 13, minutes: 1142, goals: 2, assists: 0, rating: 7.12, xg: 1.1, shots: 7, keyPasses: 1 },
  { id: "4", slug: "huijsen", shirtNumber: 24, shortName: "Huijsen", position: "CB", positionGroup: "DEF", photoUrl: null, appearances: 13, minutes: 1110, goals: 2, assists: 0, rating: 7.21, xg: 0.8, shots: 6, keyPasses: 0 },
  { id: "5", slug: "carreras", shirtNumber: 18, shortName: "Carreras", position: "LB", positionGroup: "DEF", photoUrl: null, appearances: 14, minutes: 1240, goals: 2, assists: 1, rating: 7.18, xg: 0.6, shots: 8, keyPasses: 12 },
  { id: "6", slug: "tchouameni", shirtNumber: 14, shortName: "Tchouaméni", position: "DM", positionGroup: "MID", photoUrl: null, appearances: 12, minutes: 1080, goals: 1, assists: 1, rating: 7.04, xg: 0.6, shots: 4, keyPasses: 6 },
  { id: "7", slug: "bellingham", shirtNumber: 5, shortName: "Bellingham", position: "AM", positionGroup: "MID", photoUrl: null, appearances: 14, minutes: 1230, goals: 4, assists: 3, rating: 7.62, xg: 4.8, shots: 28, keyPasses: 22 },
  { id: "8", slug: "guler", shirtNumber: 15, shortName: "Güler", position: "CM", positionGroup: "MID", photoUrl: null, appearances: 12, minutes: 980, goals: 4, assists: 2, rating: 7.35, xg: 3.1, shots: 21, keyPasses: 18 },
  { id: "9", slug: "asencio", shirtNumber: 17, shortName: "Asencio", position: "CM", positionGroup: "MID", photoUrl: null, appearances: 10, minutes: 820, goals: 2, assists: 1, rating: 6.92, xg: 1.6, shots: 9, keyPasses: 7 },
  { id: "10", slug: "vinicius", shirtNumber: 7, shortName: "Junior", position: "LW", positionGroup: "FWD", photoUrl: null, appearances: 14, minutes: 1180, goals: 15, assists: 7, rating: 7.81, xg: 11.2, shots: 64, keyPasses: 31 },
  { id: "11", slug: "garcia", shirtNumber: 16, shortName: "García", position: "RW", positionGroup: "FWD", photoUrl: null, appearances: 13, minutes: 1015, goals: 4, assists: 2, rating: 7.18, xg: 4.6, shots: 32, keyPasses: 14 },
];

const REAL_MADRID_BACKUPS = {
  GK: [
    { id: "12", slug: "lunin", shirtNumber: 13, shortName: "Andriy Lunin", position: "GK", positionGroup: "GK" as const, photoUrl: null, appearances: 6, minutes: 540, goals: 0, assists: 0, rating: 6.71, xg: 0, shots: 0, keyPasses: 0 },
  ],
  DEF: [
    { id: "13", slug: "rudiger", shirtNumber: 22, shortName: "Antonio Rüdiger", position: "CB", positionGroup: "DEF" as const, photoUrl: null, appearances: 14, minutes: 1311, goals: 1, assists: 0, rating: 7.06, xg: 0.5, shots: 4, keyPasses: 1 },
    { id: "14", slug: "militao-2", shirtNumber: 3, shortName: "Éder Militão", position: "CB", positionGroup: "DEF" as const, photoUrl: null, appearances: 13, minutes: 1142, goals: 2, assists: 0, rating: 7.12, xg: 1.1, shots: 7, keyPasses: 1 },
    { id: "15", slug: "carvajal-2", shirtNumber: 2, shortName: "Daniel Carvajal", position: "RB", positionGroup: "DEF" as const, photoUrl: null, appearances: 9, minutes: 776, goals: 0, assists: 0, rating: 6.84, xg: 0.4, shots: 5, keyPasses: 9 },
  ],
  MID: [
    { id: "16", slug: "camavinga", shirtNumber: 6, shortName: "Eduardo Camavinga", position: "CM", positionGroup: "MID" as const, photoUrl: null, appearances: 16, minutes: 1345, goals: 1, assists: 2, rating: 7.02, xg: 0.9, shots: 6, keyPasses: 11 },
    { id: "17", slug: "ceballos", shirtNumber: 19, shortName: "Dani Ceballos", position: "CM", positionGroup: "MID" as const, photoUrl: null, appearances: 7, minutes: 480, goals: 0, assists: 1, rating: 6.78, xg: 0.2, shots: 3, keyPasses: 5 },
    { id: "18", slug: "pitarch", shirtNumber: 45, shortName: "Thiago Pitarch", position: "CM", positionGroup: "MID" as const, photoUrl: null, appearances: 6, minutes: 417, goals: 0, assists: 0, rating: 6.62, xg: 0.1, shots: 1, keyPasses: 2 },
  ],
  FWD: [
    { id: "19", slug: "mbappe", shirtNumber: 10, shortName: "Kylian Mbappé", position: "ST", positionGroup: "FWD" as const, photoUrl: null, appearances: 27, minutes: 2405, goals: 24, assists: 7, rating: 7.94, xg: 19.4, shots: 102, keyPasses: 28 },
    { id: "20", slug: "diaz", shirtNumber: 21, shortName: "Brahim Díaz", position: "RW", positionGroup: "FWD" as const, photoUrl: null, appearances: 13, minutes: 1004, goals: 0, assists: 1, rating: 6.88, xg: 1.8, shots: 14, keyPasses: 11 },
    { id: "21", slug: "mastantuono", shirtNumber: 30, shortName: "Franco Mastantuono", position: "RW", positionGroup: "FWD" as const, photoUrl: null, appearances: 11, minutes: 854, goals: 1, assists: 1, rating: 6.95, xg: 1.4, shots: 12, keyPasses: 8 },
  ],
};

// 4-4-2 slot positions on a portrait pitch (0-100 percentage)
// Y: 5 = top (defending), 95 = bottom (attacking)
const FORMATION_4_4_2: Formation = {
  code: "4-4-2",
  slots: [
    { player: REAL_MADRID_SQUAD[0], x: 50, y: 92 },  // GK at bottom
    { player: REAL_MADRID_SQUAD[1], x: 82, y: 75 },  // RB
    { player: REAL_MADRID_SQUAD[2], x: 60, y: 78 },  // CB
    { player: REAL_MADRID_SQUAD[3], x: 40, y: 78 },  // CB
    { player: REAL_MADRID_SQUAD[4], x: 18, y: 75 },  // LB
    { player: REAL_MADRID_SQUAD[5], x: 65, y: 55 },  // DM (Tchouaméni)
    { player: REAL_MADRID_SQUAD[6], x: 35, y: 50 },  // AM (Bellingham)
    { player: REAL_MADRID_SQUAD[7], x: 75, y: 45 },  // CM (Güler)
    { player: REAL_MADRID_SQUAD[8], x: 25, y: 45 },  // CM (Asencio)
    { player: REAL_MADRID_SQUAD[9], x: 82, y: 22 },  // LW (Junior)
    { player: REAL_MADRID_SQUAD[10], x: 18, y: 22 }, // RW (García)
  ],
};

const LA_LIGA_STANDING: StandingRow[] = [
  { rank: 1, teamSlug: "fc-barcelona", teamName: "FC Barcelona", crestUrl: "", played: 34, won: 29, drawn: 1, lost: 4, gf: 95, ga: 37, gd: 58, points: 85 },
  { rank: 2, teamSlug: "real-madrid", teamName: "Real Madrid", crestUrl: "", played: 34, won: 24, drawn: 5, lost: 5, gf: 70, ga: 31, gd: 39, points: 74 },
  { rank: 3, teamSlug: "villarreal", teamName: "Villarreal", crestUrl: "", played: 34, won: 21, drawn: 5, lost: 8, gf: 64, ga: 39, gd: 25, points: 65 },
  { rank: 4, teamSlug: "atletico-madrid", teamName: "Atlético Madrid", crestUrl: "", played: 34, won: 19, drawn: 6, lost: 9, gf: 58, ga: 37, gd: 21, points: 60 },
  { rank: 5, teamSlug: "real-betis", teamName: "Real Betis", crestUrl: "", played: 34, won: 13, drawn: 14, lost: 7, gf: 51, ga: 40, gd: 11, points: 50 },
  { rank: 6, teamSlug: "celta-de-vigo", teamName: "Celta de Vigo", crestUrl: "", played: 34, won: 12, drawn: 11, lost: 11, gf: 50, ga: 46, gd: 4, points: 44 },
  { rank: 7, teamSlug: "getafe", teamName: "Getafe", crestUrl: "", played: 34, won: 13, drawn: 5, lost: 16, gf: 30, ga: 38, gd: -8, points: 44 },
  { rank: 8, teamSlug: "real-sociedad", teamName: "Real Sociedad", crestUrl: "", played: 34, won: 11, drawn: 10, lost: 13, gf: 38, ga: 39, gd: -1, points: 43 },
];

const STYLE_ATTRIBUTES: TeamStyleAttribute[] = [
  { key: "attacking", label: "Attacking Threat", value: 88 },
  { key: "possession", label: "Possession Play", value: 90 },
  { key: "creative", label: "Creative Play", value: 85 },
  { key: "progressive", label: "Progressive Passing", value: 87 },
  { key: "defensive", label: "Defensive Solidity", value: 78 },
  { key: "clinical", label: "Clinical Finishing", value: 80 },
  { key: "game", label: "Game Dominance", value: 86 },
  { key: "setpiece", label: "Set Piece Threat", value: 70 },
];

const TEAMS: Record<string, TeamData> = {
  "real-madrid": {
    team: {
      slug: "real-madrid",
      name: "Real Madrid",
      shortName: "Real Madrid",
      league: "La Liga",
      leagueSlug: "la-liga",
      crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Real_Madrid_CF.svg/240px-Real_Madrid_CF.svg.png",
      primaryColor: "#FEBE10",
    },
    formation: FORMATION_4_4_2,
    backups: REAL_MADRID_BACKUPS,
    standing: LA_LIGA_STANDING,
    myPosition: 2,
    styleAttributes: STYLE_ATTRIBUTES,
    styleTags: ["Possession Play", "Progressive Passing", "Open Play Attacking"],
  },
};

export function getTeamBySlug(slug: string): TeamData | null {
  return TEAMS[slug] ?? null;
}

export function listAllTeamSlugs(): string[] {
  return Object.keys(TEAMS);
}

// ─── Searchable teams index ──────────────────────────────────────
// Curated registry used by the global search bar. Slugs link to
// /teams/[slug]; not all of these have full TeamData yet — when
// the user clicks a team that isn't seeded, the route 404s with
// a clean message. Add to TEAMS map above to give a club a real page.
export type TeamSearchHit = {
  slug: string;
  name: string;
  league: string;
  country: string;
  hasPage: boolean;
};

const TEAM_INDEX: TeamSearchHit[] = [
  { slug: "real-madrid", name: "Real Madrid", league: "La Liga", country: "Spain", hasPage: true },
  { slug: "fc-barcelona", name: "FC Barcelona", league: "La Liga", country: "Spain", hasPage: false },
  { slug: "atletico-madrid", name: "Atlético Madrid", league: "La Liga", country: "Spain", hasPage: false },
  { slug: "villarreal", name: "Villarreal", league: "La Liga", country: "Spain", hasPage: false },
  { slug: "real-betis", name: "Real Betis", league: "La Liga", country: "Spain", hasPage: false },
  { slug: "real-sociedad", name: "Real Sociedad", league: "La Liga", country: "Spain", hasPage: false },
  { slug: "manchester-city", name: "Manchester City", league: "Premier League", country: "England", hasPage: false },
  { slug: "manchester-united", name: "Manchester United", league: "Premier League", country: "England", hasPage: false },
  { slug: "liverpool", name: "Liverpool", league: "Premier League", country: "England", hasPage: false },
  { slug: "arsenal", name: "Arsenal", league: "Premier League", country: "England", hasPage: false },
  { slug: "chelsea", name: "Chelsea", league: "Premier League", country: "England", hasPage: false },
  { slug: "tottenham", name: "Tottenham Hotspur", league: "Premier League", country: "England", hasPage: false },
  { slug: "bayern-munich", name: "Bayern Munich", league: "Bundesliga", country: "Germany", hasPage: false },
  { slug: "borussia-dortmund", name: "Borussia Dortmund", league: "Bundesliga", country: "Germany", hasPage: false },
  { slug: "rb-leipzig", name: "RB Leipzig", league: "Bundesliga", country: "Germany", hasPage: false },
  { slug: "psg", name: "Paris Saint-Germain", league: "Ligue 1", country: "France", hasPage: false },
  { slug: "marseille", name: "Olympique de Marseille", league: "Ligue 1", country: "France", hasPage: false },
  { slug: "inter-milan", name: "Inter Milan", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "ac-milan", name: "AC Milan", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "juventus", name: "Juventus", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "napoli", name: "Napoli", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "roma", name: "AS Roma", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "lazio", name: "Lazio", league: "Serie A", country: "Italy", hasPage: false },
  { slug: "ajax", name: "Ajax", league: "Eredivisie", country: "Netherlands", hasPage: false },
  { slug: "psv", name: "PSV", league: "Eredivisie", country: "Netherlands", hasPage: false },
  { slug: "porto", name: "FC Porto", league: "Liga Portugal", country: "Portugal", hasPage: false },
  { slug: "benfica", name: "Benfica", league: "Liga Portugal", country: "Portugal", hasPage: false },
  { slug: "celtic", name: "Celtic", league: "Premiership", country: "Scotland", hasPage: false },
  { slug: "rangers", name: "Rangers", league: "Premiership", country: "Scotland", hasPage: false },
  { slug: "al-hilal", name: "Al Hilal", league: "Saudi Pro League", country: "Saudi Arabia", hasPage: false },
  { slug: "al-nassr", name: "Al Nassr", league: "Saudi Pro League", country: "Saudi Arabia", hasPage: false },
  { slug: "flamengo", name: "Flamengo", league: "Brasileirão", country: "Brazil", hasPage: false },
  { slug: "boca-juniors", name: "Boca Juniors", league: "Liga Profesional", country: "Argentina", hasPage: false },
  { slug: "river-plate", name: "River Plate", league: "Liga Profesional", country: "Argentina", hasPage: false },
];

export function getTeamRefBySlug(slug: string): TeamSearchHit | null {
  return TEAM_INDEX.find((t) => t.slug === slug) ?? null;
}

export function searchTeams(query: string, limit = 8): TeamSearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return TEAM_INDEX.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.league.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q),
  ).slice(0, limit);
}

export function listTopTeams(limit = 6): TeamSearchHit[] {
  return TEAM_INDEX.slice(0, limit);
}
