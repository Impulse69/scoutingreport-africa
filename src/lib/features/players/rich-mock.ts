export type RichPlayerProfile = {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  position: string;
  positionGroup: "GK" | "DEF" | "MID" | "FWD";
  nationality: string;
  nationalityCode?: string;
  club: string;
  league: string;
  age: number;
  heightCm: number;
  preferredFoot: "left" | "right" | "both";
  photoUrl: string | null;
  estimatedProfile: string;
  appearances: number;
  goals: number;
  assists: number;
  rating: number;

  keyStrengths: { label: string; value: number }[];
  perNinetyStats: { label: string; value: number; max: number; unit?: string }[];

  recentForm: { date: string; opponent: string; result: "W" | "D" | "L"; rating: number }[];
  similarPlayers: { slug: string; name: string; club: string; age: number; similarity: number }[];

  heatmap: { x: number; y: number; intensity: number }[];

  marketValue: number;
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
  nationalityCode: "ES",
  club: "Villarreal",
  league: "La Liga",
  age: 24,
  heightCm: 188,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/civrzg1733653256.png",
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
  ],
  similarPlayers: [
    { slug: "gonzalo-crettaz", name: "Gonzalo Crettaz", club: "RC Strasbourg", age: 24, similarity: 91 },
  ],
  heatmap: [
    { x: 50, y: 8, intensity: 0.95 },
    { x: 42, y: 12, intensity: 0.55 },
    { x: 58, y: 12, intensity: 0.55 },
  ],
  marketValue: 2_800_000,
  marketValueHistory: [
    { season: "2023/24", value: 1_200_000 },
    { season: "2024/25", value: 2_000_000 },
    { season: "2025/26", value: 2_800_000 },
  ],
  career: [
    { season: "2025/26", club: "Villarreal", league: "La Liga", apps: 6, goals: 0, assists: 0, rating: 6.54 },
    { season: "2024/25", club: "PSG", league: "Ligue 1", apps: 12, goals: 0, assists: 0, rating: 6.61 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "Modern sweeper-keeper with proactive box distribution.",
  about: "Arnau Tenas is a 24-year-old goalkeeper playing for Villarreal in La Liga.",
  exploreMore: [
    { label: "Search All Players", href: "/players" },
  ],
};

const VICTOR_BONIFACE: RichPlayerProfile = {
  id: "p_boniface",
  slug: "victor-boniface",
  fullName: "Victor Boniface",
  shortName: "Boniface",
  position: "ST",
  positionGroup: "FWD",
  nationality: "Nigeria",
  nationalityCode: "NG",
  club: "Bayer Leverkusen",
  league: "Bundesliga",
  age: 24,
  heightCm: 190,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/7e2phd1763665992.png",
  estimatedProfile: "Complete Forward / Power Striker",
  appearances: 22,
  goals: 16,
  assists: 7,
  rating: 8.62,
  keyStrengths: [
    { label: "Hold-Up & Physicality", value: 94 },
    { label: "Ball Striking & Power", value: 91 },
    { label: "Box Dominance", value: 89 },
    { label: "Direct Dribbling", value: 87 },
  ],
  perNinetyStats: [
    { label: "Non-Penalty xG", value: 0.72, max: 1.0 },
    { label: "Shots per 90", value: 4.12, max: 5.0 },
    { label: "Progressive Carries", value: 3.45, max: 5.0 },
    { label: "Box Touches", value: 8.1, max: 10.0 },
  ],
  recentForm: [
    { date: "2026-04-18", opponent: "Bayern Munich", result: "W", rating: 8.8 },
    { date: "2026-04-11", opponent: "Dortmund", result: "W", rating: 8.4 },
    { date: "2026-04-04", opponent: "Frankfurt", result: "W", rating: 8.6 },
  ],
  similarPlayers: [
    { slug: "nicolas-jackson", name: "Nicolas Jackson", club: "Chelsea", age: 23, similarity: 89 },
    { slug: "victor-osimhen", name: "Victor Osimhen", club: "Galatasaray", age: 26, similarity: 92 },
  ],
  heatmap: [
    { x: 50, y: 82, intensity: 0.95 },
    { x: 45, y: 70, intensity: 0.75 },
    { x: 55, y: 70, intensity: 0.75 },
  ],
  marketValue: 45_000_000,
  marketValueHistory: [
    { season: "2022/23", value: 6_000_000 },
    { season: "2023/24", value: 25_000_000 },
    { season: "2024/25", value: 40_000_000 },
    { season: "2025/26", value: 45_000_000 },
  ],
  career: [
    { season: "2025/26", club: "Bayer Leverkusen", league: "Bundesliga", apps: 22, goals: 16, assists: 7, rating: 8.62 },
    { season: "2024/25", club: "Bayer Leverkusen", league: "Bundesliga", apps: 28, goals: 18, assists: 9, rating: 8.45 },
    { season: "2023/24", club: "Bayer Leverkusen", league: "Bundesliga", apps: 23, goals: 14, assists: 8, rating: 8.35 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "Dominant target man with exceptional close-control dribbling. Unplayable in transition and high-pressing counter attacks.",
  about: "Victor Boniface is a 24-year-old Nigerian striker playing for Bayer Leverkusen in the German Bundesliga.",
  exploreMore: [
    { label: "Search All Players", href: "/players" },
  ],
};

const MOHAMMED_KUDUS: RichPlayerProfile = {
  id: "p_kudus",
  slug: "mohammed-kudus",
  fullName: "Mohammed Kudus",
  shortName: "Kudus",
  position: "RW",
  positionGroup: "FWD",
  nationality: "Ghana",
  nationalityCode: "GH",
  club: "West Ham United",
  league: "Premier League",
  age: 24,
  heightCm: 177,
  preferredFoot: "left",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/5wk6s81757016366.png",
  estimatedProfile: "Inside Forward / Dynamic Dribbler",
  appearances: 24,
  goals: 11,
  assists: 8,
  rating: 8.71,
  keyStrengths: [
    { label: "1v1 Take-Ons", value: 97 },
    { label: "Ball Carrying", value: 95 },
    { label: "Press Resistance", value: 92 },
    { label: "Powerful Striking", value: 88 },
  ],
  perNinetyStats: [
    { label: "Successful Take-Ons", value: 4.82, max: 5.0 },
    { label: "Progressive Carries", value: 5.12, max: 6.0 },
    { label: "Key Passes", value: 2.15, max: 3.0 },
    { label: "Duels Won %", value: 68, max: 100, unit: "%" },
  ],
  recentForm: [
    { date: "2026-04-20", opponent: "Tottenham", result: "W", rating: 9.1 },
    { date: "2026-04-12", opponent: "Arsenal", result: "D", rating: 8.5 },
  ],
  similarPlayers: [],
  heatmap: [
    { x: 75, y: 65, intensity: 0.9 },
    { x: 60, y: 75, intensity: 0.8 },
  ],
  marketValue: 50_000_000,
  marketValueHistory: [
    { season: "2023/24", value: 35_000_000 },
    { season: "2024/25", value: 45_000_000 },
    { season: "2025/26", value: 50_000_000 },
  ],
  career: [
    { season: "2025/26", club: "West Ham United", league: "Premier League", apps: 24, goals: 11, assists: 8, rating: 8.71 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "One of the most destructive dribblers in European football with elite balance and low centre of gravity.",
  about: "Mohammed Kudus is a 24-year-old Ghanaian international winger for West Ham United.",
  exploreMore: [
    { label: "Search All Players", href: "/players" },
  ],
};

const LAMINE_CAMARA: RichPlayerProfile = {
  id: "p_camara",
  slug: "lamine-camara",
  fullName: "Lamine Camara",
  shortName: "Camara",
  position: "CM",
  positionGroup: "MID",
  nationality: "Senegal",
  nationalityCode: "SN",
  club: "AS Monaco",
  league: "Ligue 1",
  age: 21,
  heightCm: 177,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/1fl2tg1766237973.png",
  estimatedProfile: "Box-to-Box Midfielder / Set-Piece Specialist",
  appearances: 25,
  goals: 5,
  assists: 9,
  rating: 8.35,
  keyStrengths: [
    { label: "Set Pieces & Crossing", value: 92 },
    { label: "High-Energy Pressing", value: 89 },
    { label: "Forward Passing", value: 86 },
    { label: "Defensive Coverage", value: 84 },
  ],
  perNinetyStats: [
    { label: "Progressive Passes", value: 6.4, max: 8.0 },
    { label: "Interceptions", value: 2.1, max: 3.0 },
    { label: "Tackles Won", value: 3.2, max: 4.0 },
    { label: "Key Passes", value: 2.3, max: 3.0 },
  ],
  recentForm: [
    { date: "2026-04-19", opponent: "PSG", result: "W", rating: 8.7 },
    { date: "2026-04-10", opponent: "Lyon", result: "W", rating: 8.3 },
  ],
  similarPlayers: [],
  heatmap: [
    { x: 50, y: 50, intensity: 0.88 },
    { x: 55, y: 65, intensity: 0.72 },
  ],
  marketValue: 18_000_000,
  marketValueHistory: [
    { season: "2023/24", value: 4_000_000 },
    { season: "2024/25", value: 12_000_000 },
    { season: "2025/26", value: 18_000_000 },
  ],
  career: [
    { season: "2025/26", club: "AS Monaco", league: "Ligue 1", apps: 25, goals: 5, assists: 9, rating: 8.35 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "AFCON Young Player of the Tournament. Supreme set-piece delivery and boundless midfield running.",
  about: "Lamine Camara is a 21-year-old Senegalese international midfielder starring for AS Monaco.",
  exploreMore: [
    { label: "Search All Players", href: "/players" },
  ],
};

const NICOLAS_JACKSON: RichPlayerProfile = {
  id: "p_jackson",
  slug: "nicolas-jackson",
  fullName: "Nicolas Jackson",
  shortName: "Jackson",
  position: "ST",
  positionGroup: "FWD",
  nationality: "Senegal",
  nationalityCode: "SN",
  club: "Chelsea",
  league: "Premier League",
  age: 23,
  heightCm: 187,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/thumb/5bv5ob1770543405.jpg",
  estimatedProfile: "Channel Runner / Link-Up Striker",
  appearances: 26,
  goals: 14,
  assists: 6,
  rating: 8.24,
  keyStrengths: [
    { label: "Channel Runs", value: 92 },
    { label: "Carrying Under Pressure", value: 88 },
    { label: "Box Entries", value: 86 },
    { label: "Link-Up Combinations", value: 84 },
  ],
  perNinetyStats: [
    { label: "Non-Penalty Goals", value: 0.58, max: 1.0 },
    { label: "Touches in Penalty Box", value: 7.2, max: 10.0 },
    { label: "Progressive Carries", value: 3.1, max: 5.0 },
  ],
  recentForm: [],
  similarPlayers: [],
  heatmap: [{ x: 50, y: 78, intensity: 0.9 }],
  marketValue: 40_000_000,
  marketValueHistory: [
    { season: "2024/25", value: 35_000_000 },
    { season: "2025/26", value: 40_000_000 },
  ],
  career: [
    { season: "2025/26", club: "Chelsea", league: "Premier League", apps: 26, goals: 14, assists: 6, rating: 8.24 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "Exceptional athlete with dynamic channel movements and relentless pressing energy.",
  about: "Nicolas Jackson is a 23-year-old Senegalese forward playing for Chelsea in the English Premier League.",
  exploreMore: [{ label: "Search All Players", href: "/players" }],
};

const BRAHIM_DIAZ: RichPlayerProfile = {
  id: "p_diaz",
  slug: "brahim-diaz",
  fullName: "Brahim Díaz",
  shortName: "Brahim",
  position: "AM",
  positionGroup: "MID",
  nationality: "Morocco",
  nationalityCode: "MA",
  club: "Real Madrid",
  league: "La Liga",
  age: 25,
  heightCm: 171,
  preferredFoot: "both",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/civrzg1733653256.png",
  estimatedProfile: "Ambidextrous Playmaker / Inside Winger",
  appearances: 23,
  goals: 9,
  assists: 8,
  rating: 8.81,
  keyStrengths: [
    { label: "Tight Space Dribbling", value: 96 },
    { label: "Both-Footed Striking", value: 94 },
    { label: "Final Third Vision", value: 90 },
    { label: "Agility & Turn Speed", value: 92 },
  ],
  perNinetyStats: [
    { label: "Key Passes", value: 2.8, max: 4.0 },
    { label: "Successful Dribbles", value: 4.1, max: 5.0 },
  ],
  recentForm: [],
  similarPlayers: [],
  heatmap: [{ x: 50, y: 70, intensity: 0.9 }],
  marketValue: 40_000_000,
  marketValueHistory: [{ season: "2025/26", value: 40_000_000 }],
  career: [
    { season: "2025/26", club: "Real Madrid", league: "La Liga", apps: 23, goals: 9, assists: 8, rating: 8.81 },
  ],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "Master of tight half-spaces with equal precision on left and right feet.",
  about: "Brahim Díaz is a 25-year-old Moroccan international playmaker representing Real Madrid in La Liga.",
  exploreMore: [{ label: "Search All Players", href: "/players" }],
};

const VICTOR_OSIMHEN: RichPlayerProfile = {
  id: "p_osimhen",
  slug: "victor-osimhen",
  fullName: "Victor Osimhen",
  shortName: "Osimhen",
  position: "ST",
  positionGroup: "FWD",
  nationality: "Nigeria",
  nationalityCode: "NG",
  club: "Galatasaray",
  league: "Süper Lig",
  age: 26,
  heightCm: 186,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/lw0qcf1769177786.png",
  estimatedProfile: "Elite Poacher / High-Press Striker",
  appearances: 20,
  goals: 18,
  assists: 4,
  rating: 8.95,
  keyStrengths: [
    { label: "Aerial Dominance & Leaping", value: 98 },
    { label: "Channel Sprinting", value: 96 },
    { label: "Relentless Pressing", value: 94 },
    { label: "First-Time Finishing", value: 95 },
  ],
  perNinetyStats: [
    { label: "Non-Penalty xG", value: 0.85, max: 1.0 },
    { label: "Aerial Duels Won", value: 4.8, max: 6.0 },
  ],
  recentForm: [],
  similarPlayers: [],
  heatmap: [{ x: 50, y: 85, intensity: 0.95 }],
  marketValue: 75_000_000,
  marketValueHistory: [{ season: "2025/26", value: 75_000_000 }],
  career: [{ season: "2025/26", club: "Galatasaray", league: "Süper Lig", apps: 20, goals: 18, assists: 4, rating: 8.95 }],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "World-class central striker with unmatched physical intensity, aerial leaps, and killer instinct in the 18-yard box.",
  about: "Victor Osimhen is a 26-year-old Nigerian striker playing for Galatasaray, CAF African Footballer of the Year.",
  exploreMore: [{ label: "Search All Players", href: "/players" }],
};

const ADEMOLA_LOOKMAN: RichPlayerProfile = {
  id: "p_lookman",
  slug: "ademola-lookman",
  fullName: "Ademola Lookman",
  shortName: "Lookman",
  position: "LW",
  positionGroup: "FWD",
  nationality: "Nigeria",
  nationalityCode: "NG",
  club: "Atalanta",
  league: "Serie A",
  age: 27,
  heightCm: 174,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/wg0pod1772033492.png",
  estimatedProfile: "Dynamic Inside Forward / Ball-Striker",
  appearances: 25,
  goals: 15,
  assists: 7,
  rating: 8.78,
  keyStrengths: [
    { label: "Decisive 1v1 Acceleration", value: 95 },
    { label: "Ball Striking & Finishing", value: 94 },
    { label: "Half-Space Infiltration", value: 92 },
  ],
  perNinetyStats: [],
  recentForm: [],
  similarPlayers: [],
  heatmap: [{ x: 35, y: 75, intensity: 0.9 }],
  marketValue: 40_000_000,
  marketValueHistory: [{ season: "2025/26", value: 40_000_000 }],
  career: [{ season: "2025/26", club: "Atalanta", league: "Serie A", apps: 25, goals: 15, assists: 7, rating: 8.78 }],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "Europa League final hat-trick hero. Electric change of direction and lethal shooting technique from both wings.",
  about: "Ademola Lookman is a 27-year-old Nigerian winger starring for Atalanta in Serie A.",
  exploreMore: [{ label: "Search All Players", href: "/players" }],
};

const ACHRAF_HAKIMI: RichPlayerProfile = {
  id: "p_hakimi",
  slug: "achraf-hakimi",
  fullName: "Achraf Hakimi",
  shortName: "Hakimi",
  position: "RB",
  positionGroup: "DEF",
  nationality: "Morocco",
  nationalityCode: "MA",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  age: 26,
  heightCm: 181,
  preferredFoot: "right",
  photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/oqu69c1766335243.png",
  estimatedProfile: "World-Class Attacking Full-Back",
  appearances: 24,
  goals: 6,
  assists: 8,
  rating: 8.85,
  keyStrengths: [
    { label: "Top-End Sprint Speed", value: 99 },
    { label: "Overlapping & Crossing", value: 94 },
    { label: "Recovery Tackling", value: 89 },
  ],
  perNinetyStats: [],
  recentForm: [],
  similarPlayers: [],
  heatmap: [{ x: 85, y: 55, intensity: 0.95 }],
  marketValue: 60_000_000,
  marketValueHistory: [{ season: "2025/26", value: 60_000_000 }],
  career: [{ season: "2025/26", club: "Paris Saint-Germain", league: "Ligue 1", apps: 24, goals: 6, assists: 8, rating: 8.85 }],
  leagueDistribution: [],
  positionalScatter: [],
  scoutNotes: "The global benchmark for modern attacking fullbacks with unstoppable recovery speed and crossing consistency.",
  about: "Achraf Hakimi is a 26-year-old Moroccan international right-back starring for Paris Saint-Germain.",
  exploreMore: [{ label: "Search All Players", href: "/players" }],
};

const RICH: Record<string, RichPlayerProfile> = {
  "arnau-tenas": ARNAU_TENAS,
  "victor-boniface": VICTOR_BONIFACE,
  "mohammed-kudus": MOHAMMED_KUDUS,
  "lamine-camara": LAMINE_CAMARA,
  "nicolas-jackson": NICOLAS_JACKSON,
  "brahim-diaz": BRAHIM_DIAZ,
  "victor-osimhen": VICTOR_OSIMHEN,
  "ademola-lookman": ADEMOLA_LOOKMAN,
  "achraf-hakimi": ACHRAF_HAKIMI,
};

export function getRichPlayerProfile(slug: string): RichPlayerProfile | null {
  return RICH[slug] ?? null;
}

export function listFeaturedRichProfiles(): RichPlayerProfile[] {
  return Object.values(RICH);
}
