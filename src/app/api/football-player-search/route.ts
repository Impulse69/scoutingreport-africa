import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type EspnSearchResponse = {
  results?: Array<{
    type?: string;
    contents?: EspnPlayerContent[];
  }>;
};

type EspnPlayerContent = {
  id?: string;
  uid?: string;
  sport?: string;
  displayName?: string;
  subtitle?: string;
  description?: string;
  defaultLeagueSlug?: string;
  link?: { web?: string };
  image?: { default?: string };
  // ESPN sometimes embeds team info on the athlete card
  defaultTeamSlug?: string;
};

export type PlayerSearchResult = {
  id: string;        // ESPN numeric id when available, else uid/name
  espnId: string | null;
  slug: string;      // route-safe: "espn-{id}" so /players/[slug] can fetch detail
  name: string;
  positionLabel: string | null;
  team: string | null;
  league: string | null;
  leagueSlug: string | null;
  photo: string | null;
  url: string | null;
};

function extractEspnId(uidOrId: string | undefined): string | null {
  if (!uidOrId) return null;
  // uid: "s:600~a:12345" → "12345"
  const match = uidOrId.match(/a:(\d+)/);
  if (match) return match[1];
  // id: "12345" itself
  if (/^\d+$/.test(uidOrId)) return uidOrId;
  return null;
}

function splitSubtitle(subtitle: string | undefined): {
  team: string | null;
  positionLabel: string | null;
  league: string | null;
} {
  if (!subtitle) return { team: null, positionLabel: null, league: null };
  // Common formats from ESPN: "Real Madrid · F" or "PSG · GK · Ligue 1"
  // Also "Forward" / "Goalkeeper" in description sometimes.
  const parts = subtitle.split("·").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { team: null, positionLabel: null, league: null };
  if (parts.length === 1) return { team: parts[0], positionLabel: null, league: null };
  if (parts.length === 2) return { team: parts[0], positionLabel: parts[1], league: null };
  return { team: parts[0], positionLabel: parts[1], league: parts[2] };
}

function normalizePlayer(content: EspnPlayerContent): PlayerSearchResult | null {
  if (content.sport !== "soccer" || !content.displayName) return null;

  const espnId = extractEspnId(content.uid) ?? extractEspnId(content.id);
  const id = content.uid ?? content.id ?? content.displayName;
  const slug = espnId
    ? `espn-${espnId}`
    : content.displayName.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const meta = splitSubtitle(content.subtitle);

  return {
    id,
    espnId,
    slug,
    name: content.displayName,
    positionLabel: meta.positionLabel ?? content.description ?? null,
    team: meta.team,
    league: meta.league,
    leagueSlug: content.defaultLeagueSlug ?? null,
    photo: content.image?.default ?? null,
    url: content.link?.web ?? null,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json({ players: [] satisfies PlayerSearchResult[] });
  }

  const upstreamUrl = new URL("https://site.web.api.espn.com/apis/search/v2");
  upstreamUrl.searchParams.set("query", query);
  upstreamUrl.searchParams.set("section", "soccer");
  upstreamUrl.searchParams.set("limit", "25");
  upstreamUrl.searchParams.set("type", "player");

  const response = await fetch(upstreamUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "ScoutingReportAfrica/1.0",
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return Response.json(
      { players: [] satisfies PlayerSearchResult[] },
      { status: 502 },
    );
  }

  const data = (await response.json()) as EspnSearchResponse;
  // ESPN returns multiple result groups (player, team, league…). Pick player.
  const playerGroup =
    data.results?.find((r) => r.type === "player") ??
    data.results?.find((r) => r.contents?.some((c) => c.sport === "soccer"));

  const players =
    playerGroup?.contents
      ?.map(normalizePlayer)
      .filter((p): p is PlayerSearchResult => p !== null) ?? [];

  return Response.json({ players });
}
