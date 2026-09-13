/**
 * Verified high-resolution player cutout & portrait photos catalog & dynamic multi-API fallback resolver.
 */

const PHOTO_CACHE = new Map<string, string | null>();
const FETCH_TIMEOUT_MS = 8_000;
const ALLOWED_PHOTO_HOSTS = new Set([
  "a.espncdn.com",
  "a1.espncdn.com",
  "a2.espncdn.com",
  "images.unsplash.com",
  "media.api-sports.io",
  "r2.thesportsdb.com",
  "thesportsdb.com",
  "upload.wikimedia.org",
  "www.thesportsdb.com",
]);

export const VERIFIED_PLAYER_PHOTOS: Record<string, string> = {
  "victor-boniface": "https://r2.thesportsdb.com/images/media/player/cutout/7e2phd1763665992.png",
  "mohammed-kudus": "https://r2.thesportsdb.com/images/media/player/cutout/5wk6s81757016366.png",
  "lamine-camara": "https://r2.thesportsdb.com/images/media/player/cutout/1fl2tg1766237973.png",
  "nicolas-jackson": "https://r2.thesportsdb.com/images/media/player/thumb/5bv5ob1770543405.jpg",
  "simon-adingra": "https://r2.thesportsdb.com/images/media/player/cutout/rxw49v1762198657.png",
  "brahim-diaz": "https://r2.thesportsdb.com/images/media/player/cutout/civrzg1733653256.png",
  "victor-osimhen": "https://r2.thesportsdb.com/images/media/player/cutout/lw0qcf1769177786.png",
  "bryan-mbeumo": "https://r2.thesportsdb.com/images/media/player/cutout/op28s81755176679.png",
  "achraf-hakimi": "https://r2.thesportsdb.com/images/media/player/cutout/oqu69c1766335243.png",
  "pape-matar-sarr": "https://r2.thesportsdb.com/images/media/player/cutout/ll7kkd1757016806.png",
  "serhou-guirassy": "https://r2.thesportsdb.com/images/media/player/cutout/ljqkhh1756326306.png",
  "ademola-lookman": "https://r2.thesportsdb.com/images/media/player/cutout/wg0pod1772033492.png",
  "amine-gouiri": "https://r2.thesportsdb.com/images/media/player/cutout/74eam91766152411.png",
  "rayan-cherki": "https://r2.thesportsdb.com/images/media/player/cutout/emcyjy1769182115.png",
};

function normalizePlayerName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function safePlayerPhotoUrl(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_PHOTO_HOSTS.has(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function getPlayerPhoto(slug: string, explicitUrl?: string | null): string | null {
  const safeExplicitUrl = safePlayerPhotoUrl(explicitUrl);
  if (safeExplicitUrl && !safeExplicitUrl.includes("a.espncdn.com/i/headshots")) {
    return safeExplicitUrl;
  }
  const clean = slug.toLowerCase().replace(/^espn-/, "").replace(/[^a-z0-9]/g, "-").trim();
  return safePlayerPhotoUrl(VERIFIED_PLAYER_PHOTOS[clean]) ?? safeExplicitUrl;
}

/**
 * Dynamically resolves a photo for ANY player in the world from TheSportsDB or API-Football.
 */
export async function resolvePlayerPhotoDynamic(
  nameOrSlug: string,
  explicitUrl?: string | null
): Promise<string | null> {
  const cleanName = nameOrSlug
    .replace(/^espn-/, "")
    .replace(/-/g, " ")
    .replace(/[0-9]+/g, "")
    .trim();
  const normalizedName = normalizePlayerName(cleanName);
  const slugKey = nameOrSlug
    .toLowerCase()
    .replace(/^espn-/, "")
    .replace(/[^a-z0-9]/g, "-")
    .trim();

  if (VERIFIED_PLAYER_PHOTOS[slugKey]) {
    return VERIFIED_PLAYER_PHOTOS[slugKey];
  }

  if (PHOTO_CACHE.has(normalizedName)) {
    return PHOTO_CACHE.get(normalizedName) ?? explicitUrl ?? null;
  }

  // 1. Query TheSportsDB for real cutouts / thumbs
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(cleanName)}`,
      {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 86400 },
      }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        player?: Array<{
          strPlayer?: string;
          strCutout?: string | null;
          strThumb?: string | null;
        }> | null;
      };
      const p = data.player?.find(
        (candidate) =>
          candidate.strPlayer &&
          normalizePlayerName(candidate.strPlayer) === normalizedName,
      );
      const photo = safePlayerPhotoUrl(p?.strCutout || p?.strThumb);
      if (photo) {
        PHOTO_CACHE.set(normalizedName, photo);
        return photo;
      }
    }
  } catch {}

  // 2. Query API-Football if API key exists
  const apiFootballKey = process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY;
  if (apiFootballKey) {
    try {
      const res = await fetch(
        `https://v3.football.api-sports.io/players/profiles?search=${encodeURIComponent(cleanName)}`,
        {
          headers: { "x-apisports-key": apiFootballKey },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          next: { revalidate: 86400 },
        }
      );
      if (res.ok) {
        const data = (await res.json()) as {
          response?: Array<{
            player?: { name?: string; photo?: string | null };
          }>;
        };
        const p = data.response
          ?.map((entry) => entry.player)
          .find(
            (candidate) =>
              candidate?.name &&
              normalizePlayerName(candidate.name) === normalizedName,
          );
        const photo = safePlayerPhotoUrl(p?.photo);
        if (photo) {
          PHOTO_CACHE.set(normalizedName, photo);
          return photo;
        }
      }
    } catch {}
  }

  // 3. Fallback to explicitUrl if provided and not generic
  const safeExplicitUrl = safePlayerPhotoUrl(explicitUrl);
  if (safeExplicitUrl && !safeExplicitUrl.includes("a.espncdn.com/i/headshots")) {
    return safeExplicitUrl;
  }

  PHOTO_CACHE.set(normalizedName, null);
  return null;
}
