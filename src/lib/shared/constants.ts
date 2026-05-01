export const PROFILE_ROLES = ["user", "scout", "admin"] as const;
export type ProfileRole = (typeof PROFILE_ROLES)[number];

export const PLAYER_STATUSES = ["draft", "published"] as const;
export type PlayerStatus = (typeof PLAYER_STATUSES)[number];

export const REPORT_STATUSES = [
  "draft",
  "pending_review",
  "published",
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const PREFERRED_FEET = ["left", "right", "both", "unknown"] as const;
export type PreferredFoot = (typeof PREFERRED_FEET)[number];

export const OBSERVATION_TYPES = ["live", "video", "mixed"] as const;
export type ObservationType = (typeof OBSERVATION_TYPES)[number];

export const RECRUITMENT_DECISIONS = [
  "sign_now",
  "monitor",
  "pass",
  "revisit",
] as const;
export type RecruitmentDecision = (typeof RECRUITMENT_DECISIONS)[number];

export const RECOMMENDED_LEVELS = [
  "academy",
  "reserves",
  "senior_domestic",
  "senior_continental",
  "senior_european",
  "international",
] as const;
export type RecommendedLevel = (typeof RECOMMENDED_LEVELS)[number];

export const COMPETITION_TYPES = [
  "continental_club",
  "national_team",
  "domestic",
  "youth",
  "academy",
  "friendly",
] as const;
export type CompetitionType = (typeof COMPETITION_TYPES)[number];

export const RATING_CATEGORIES = [
  "technical",
  "tactical",
  "physical",
  "mentality",
] as const;
export type RatingCategory = (typeof RATING_CATEGORIES)[number];

export const RATING_CATEGORY_LABELS: Record<RatingCategory, string> = {
  technical: "Technical",
  tactical: "Tactical",
  physical: "Physical",
  mentality: "Mentality & Character",
};

export const POSITION_GROUPS = ["GK", "DEF", "MID", "FWD"] as const;
export type PositionGroup = (typeof POSITION_GROUPS)[number];

export type PositionSpec = {
  code: string;
  name: string;
  group: PositionGroup;
};

export const POSITIONS: readonly PositionSpec[] = [
  { code: "GK", name: "Goalkeeper", group: "GK" },
  { code: "CB", name: "Centre-back", group: "DEF" },
  { code: "LB", name: "Left-back", group: "DEF" },
  { code: "RB", name: "Right-back", group: "DEF" },
  { code: "LWB", name: "Left wing-back", group: "DEF" },
  { code: "RWB", name: "Right wing-back", group: "DEF" },
  { code: "DM", name: "Defensive midfielder", group: "MID" },
  { code: "CM", name: "Central midfielder", group: "MID" },
  { code: "AM", name: "Attacking midfielder", group: "MID" },
  { code: "LM", name: "Left midfielder", group: "MID" },
  { code: "RM", name: "Right midfielder", group: "MID" },
  { code: "LW", name: "Left winger", group: "FWD" },
  { code: "RW", name: "Right winger", group: "FWD" },
  { code: "SS", name: "Second striker", group: "FWD" },
  { code: "ST", name: "Striker", group: "FWD" },
] as const;

export const POSITION_CODES = POSITIONS.map((p) => p.code);
export type PositionCode = (typeof POSITIONS)[number]["code"];

export type RatingSubArea = {
  key: string;
  label: string;
};

export const TECHNICAL_SUB_AREAS: readonly RatingSubArea[] = [
  { key: "first_touch_control", label: "First touch & control" },
  { key: "passing_short_long", label: "Passing (short & long)" },
  { key: "dribbling_1v1", label: "Dribbling / 1v1" },
  { key: "shooting_finishing", label: "Shooting / finishing" },
  { key: "crossing_final_ball", label: "Crossing / final ball" },
  { key: "overall", label: "Overall" },
] as const;

export const TACTICAL_SUB_AREAS: readonly RatingSubArea[] = [
  { key: "positioning", label: "Positioning (off / def)" },
  { key: "decision_making", label: "Decision making" },
  { key: "off_ball_movement", label: "Off-the-ball movement" },
  { key: "pressing_defensive_work", label: "Pressing / defensive work" },
  { key: "team_structure_understanding", label: "Team structure understanding" },
  { key: "overall", label: "Overall" },
] as const;

export const PHYSICAL_SUB_AREAS: readonly RatingSubArea[] = [
  { key: "acceleration_pace", label: "Acceleration / pace" },
  { key: "strength_duels", label: "Strength / duels" },
  { key: "agility_balance", label: "Agility / balance" },
  { key: "stamina_work_rate", label: "Stamina / work rate" },
  { key: "overall", label: "Overall" },
] as const;

export const MENTALITY_SUB_AREAS: readonly RatingSubArea[] = [
  { key: "concentration", label: "Concentration" },
  { key: "competitiveness", label: "Competitiveness" },
  { key: "confidence", label: "Confidence" },
  { key: "coachability_learning", label: "Coachability / learning" },
  { key: "leadership_communication", label: "Leadership / communication" },
  { key: "overall", label: "Overall" },
] as const;

export const RATING_SUB_AREAS_BY_CATEGORY: Record<
  RatingCategory,
  readonly RatingSubArea[]
> = {
  technical: TECHNICAL_SUB_AREAS,
  tactical: TACTICAL_SUB_AREAS,
  physical: PHYSICAL_SUB_AREAS,
  mentality: MENTALITY_SUB_AREAS,
};

export type CAFCountry = {
  code: string;
  name: string;
  flagEmoji: string;
};

export const CAF_COUNTRIES: readonly CAFCountry[] = [
  { code: "DZ", name: "Algeria", flagEmoji: "🇩🇿" },
  { code: "AO", name: "Angola", flagEmoji: "🇦🇴" },
  { code: "BJ", name: "Benin", flagEmoji: "🇧🇯" },
  { code: "BW", name: "Botswana", flagEmoji: "🇧🇼" },
  { code: "BF", name: "Burkina Faso", flagEmoji: "🇧🇫" },
  { code: "BI", name: "Burundi", flagEmoji: "🇧🇮" },
  { code: "CM", name: "Cameroon", flagEmoji: "🇨🇲" },
  { code: "CV", name: "Cape Verde", flagEmoji: "🇨🇻" },
  { code: "CF", name: "Central African Republic", flagEmoji: "🇨🇫" },
  { code: "TD", name: "Chad", flagEmoji: "🇹🇩" },
  { code: "KM", name: "Comoros", flagEmoji: "🇰🇲" },
  { code: "CG", name: "Congo", flagEmoji: "🇨🇬" },
  { code: "CD", name: "DR Congo", flagEmoji: "🇨🇩" },
  { code: "DJ", name: "Djibouti", flagEmoji: "🇩🇯" },
  { code: "EG", name: "Egypt", flagEmoji: "🇪🇬" },
  { code: "GQ", name: "Equatorial Guinea", flagEmoji: "🇬🇶" },
  { code: "ER", name: "Eritrea", flagEmoji: "🇪🇷" },
  { code: "SZ", name: "Eswatini", flagEmoji: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flagEmoji: "🇪🇹" },
  { code: "GA", name: "Gabon", flagEmoji: "🇬🇦" },
  { code: "GM", name: "Gambia", flagEmoji: "🇬🇲" },
  { code: "GH", name: "Ghana", flagEmoji: "🇬🇭" },
  { code: "GN", name: "Guinea", flagEmoji: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flagEmoji: "🇬🇼" },
  { code: "CI", name: "Côte d'Ivoire", flagEmoji: "🇨🇮" },
  { code: "KE", name: "Kenya", flagEmoji: "🇰🇪" },
  { code: "LS", name: "Lesotho", flagEmoji: "🇱🇸" },
  { code: "LR", name: "Liberia", flagEmoji: "🇱🇷" },
  { code: "LY", name: "Libya", flagEmoji: "🇱🇾" },
  { code: "MG", name: "Madagascar", flagEmoji: "🇲🇬" },
  { code: "MW", name: "Malawi", flagEmoji: "🇲🇼" },
  { code: "ML", name: "Mali", flagEmoji: "🇲🇱" },
  { code: "MR", name: "Mauritania", flagEmoji: "🇲🇷" },
  { code: "MU", name: "Mauritius", flagEmoji: "🇲🇺" },
  { code: "MA", name: "Morocco", flagEmoji: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flagEmoji: "🇲🇿" },
  { code: "NA", name: "Namibia", flagEmoji: "🇳🇦" },
  { code: "NE", name: "Niger", flagEmoji: "🇳🇪" },
  { code: "NG", name: "Nigeria", flagEmoji: "🇳🇬" },
  { code: "RW", name: "Rwanda", flagEmoji: "🇷🇼" },
  { code: "ST", name: "São Tomé & Príncipe", flagEmoji: "🇸🇹" },
  { code: "SN", name: "Senegal", flagEmoji: "🇸🇳" },
  { code: "SC", name: "Seychelles", flagEmoji: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flagEmoji: "🇸🇱" },
  { code: "SO", name: "Somalia", flagEmoji: "🇸🇴" },
  { code: "ZA", name: "South Africa", flagEmoji: "🇿🇦" },
  { code: "SS", name: "South Sudan", flagEmoji: "🇸🇸" },
  { code: "SD", name: "Sudan", flagEmoji: "🇸🇩" },
  { code: "TZ", name: "Tanzania", flagEmoji: "🇹🇿" },
  { code: "TG", name: "Togo", flagEmoji: "🇹🇬" },
  { code: "TN", name: "Tunisia", flagEmoji: "🇹🇳" },
  { code: "UG", name: "Uganda", flagEmoji: "🇺🇬" },
  { code: "ZM", name: "Zambia", flagEmoji: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flagEmoji: "🇿🇼" },
] as const;
