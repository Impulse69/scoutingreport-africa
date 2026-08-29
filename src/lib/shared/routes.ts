/**
 * Which parts of the product are actually built.
 *
 * The navigation and dashboard used to advertise around forty routes that had
 * no page behind them — predictions, FPL sub-tools, per-league pages, compare,
 * fixtures — so a large share of every menu 404'd. Rather than fake those pages,
 * link targets are checked against this list and anything unbuilt renders as a
 * visibly disabled "Soon" item.
 *
 * When you ship one of the planned surfaces, delete its entry from `PLANNED`
 * and add the path to `LIVE_ROUTES`. Nothing else needs to change.
 */

/** Static paths that have a page today. */
export const LIVE_ROUTES = [
  "/",
  "/about",
  "/cookies",
  "/dashboard",
  "/fpl",
  "/leagues",
  "/players",
  "/privacy",
  "/scout",
  "/scout/players/new",
  "/scout/reports/new",
  "/scouting",
  "/settings",
  "/terms",
  "/watchlists",
  "/auth/sign-in",
  "/auth/sign-up",
] as const;

/** Dynamic segments that resolve at request time. */
const LIVE_PREFIXES = ["/players/", "/teams/", "/watchlists/", "/scout/"];

const LIVE = new Set<string>(LIVE_ROUTES);

/**
 * True when `href` points at a page that exists. Hash and query fragments are
 * ignored, so "/#pricing" resolves against "/".
 */
export function isLiveRoute(href: string): boolean {
  if (!href.startsWith("/")) return true; // external / mailto — not ours to check
  const path = href.split(/[?#]/)[0] || "/";
  if (LIVE.has(path)) return true;
  return LIVE_PREFIXES.some((p) => path.startsWith(p) && path.length > p.length);
}

/**
 * Short labels for the planned surfaces, shown on the disabled dashboard cards
 * so the roadmap stays legible instead of just missing.
 */
export const PLANNED_LABEL = "Soon";
