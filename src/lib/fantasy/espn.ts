import { cached } from "./cache";
import { clamp } from "./format";
import type { GameState, LiveTicker } from "./types";

const SCOREBOARD_CDN = "https://cdn.espn.com/core/nfl/scoreboard?xhr=1";
const SCOREBOARD_SITE = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const SUMMARY = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary";
const NEWS = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news";
const ATHLETE = "https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes";

const SLEEPER_TO_ESPN: Record<string, string> = {
  WAS: "WSH",
  JAC: "JAX",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function espnAbbr(sleeperTeam: string | null | undefined) {
  if (!sleeperTeam) return null;
  return SLEEPER_TO_ESPN[sleeperTeam] ?? sleeperTeam;
}

export type EspnGame = {
  eventId: string;
  state: GameState;
  start: string | null;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
  clock: string | null;
  period: string | null;
  detail: string | null;
  progress: number;
  downDistance: string | null;
  playText: string | null;
  possession: "home" | "away" | null;
  broadcast: string | null;
};

export type EspnPlay = {
  id: string;
  text: string;
  type: string;
  period: number;
  clock: string;
  downDistance: string | null;
  scoringPlay: boolean;
  yards: number;
  isTd: boolean;
  isInt: boolean;
};

export type EspnNewsArticle = {
  id: string;
  headline: string;
  description: string;
  published: string;
  image: string | null;
  url: string | null;
  byline: string | null;
  teams: string[];
};

export type EspnArticleFull = EspnNewsArticle & {
  paragraphs: string[];
};

export type EspnSeasonBag = {
  year: number;
  values: Record<string, string>;
};

export type EspnGamelogEvent = {
  eventId: string;
  week: number;
  gameDate: string | null;
  atVs: string;
  opponent: string;
  score: string | null;
  result: string | null;
  stats: Record<string, string>;
};

type CacheEntry<T> = { at: number; value: T };
const scoreboardCache = new Map<string, CacheEntry<EspnGame[]>>();
const scoreboardInflight = new Map<string, Promise<EspnGame[]>>();

function gameProgress(period: number, clockSeconds: number, state: GameState) {
  if (state === "post") return 1;
  if (state !== "in") return 0;
  const elapsed = (Math.max(period, 1) - 1) * 15 * 60 + (15 * 60 - Math.max(clockSeconds, 0));
  return clamp(elapsed / 3600, 0.03, 0.97);
}

function mapState(
  name: string | undefined,
  completed?: boolean,
  extra?: { state?: string; shortDetail?: string; detail?: string },
): GameState {
  const blob = `${name ?? ""} ${extra?.state ?? ""} ${extra?.shortDetail ?? ""} ${extra?.detail ?? ""}`.toLowerCase();
  if (completed || extra?.state === "post" || /\bfinal\b/.test(blob)) return "post";
  if (
    name === "STATUS_IN_PROGRESS" ||
    name === "STATUS_HALFTIME" ||
    name === "STATUS_END_PERIOD" ||
    extra?.state === "in"
  ) {
    return "in";
  }
  return "pre";
}

type EspnEvent = {
  id: string;
  date?: string;
  competitions?: Array<{
    competitors?: Array<{
      homeAway: "home" | "away";
      score: string | number;
      team?: { abbreviation?: string; id?: string };
    }>;
    status?: {
      clock?: number;
      displayClock?: string;
      period?: number;
      type?: { name?: string; shortDetail?: string; detail?: string; state?: string; completed?: boolean };
    };
    situation?: {
      downDistanceText?: string;
      possessionText?: string;
      possession?: string;
      down?: number;
      distance?: number;
      yardLine?: number;
      lastPlay?: { text?: string; type?: { text?: string } };
    };
    broadcasts?: Array<{ names?: string[] }>;
    broadcast?: string;
  }>;
};

function parseEvents(events: EspnEvent[] | undefined): EspnGame[] {
  const games: EspnGame[] = [];
  for (const event of events ?? []) {
    const comp = event.competitions?.[0];
    if (!comp) continue;
    const home = comp.competitors?.find((c) => c.homeAway === "home");
    const away = comp.competitors?.find((c) => c.homeAway === "away");
    const status = comp.status;
    const state = mapState(status?.type?.name, status?.type?.completed, status?.type);
    const sit = comp.situation;
    const lastType = sit?.lastPlay?.type?.text ?? "";
    const lastText = sit?.lastPlay?.text ?? null;
    const skipPlay = /timeout|end of/i.test(lastType) || /timeout/i.test(lastText ?? "");
    const homeId = home?.team?.id;
    const possId = sit?.possession;
    let possession: "home" | "away" | null = null;
    if (possId && homeId) possession = possId === homeId ? "home" : "away";
    const broadcast =
      (typeof comp.broadcast === "string" ? comp.broadcast : null) ||
      comp.broadcasts?.flatMap((b) => b.names ?? []).find(Boolean) ||
      null;
    const downDistance =
      sit?.downDistanceText ||
      sit?.possessionText ||
      (sit && sit.down != null && sit.down > 0 && sit.distance != null
        ? `${sit.down === 1 ? "1st" : sit.down === 2 ? "2nd" : sit.down === 3 ? "3rd" : "4th"} & ${sit.distance}`
        : null);
    games.push({
      eventId: event.id,
      state,
      start: event.date ?? null,
      home: home?.team?.abbreviation ?? "HOME",
      away: away?.team?.abbreviation ?? "AWAY",
      homeScore: String(home?.score ?? "0"),
      awayScore: String(away?.score ?? "0"),
      clock: state === "in" ? (status?.type?.shortDetail ?? status?.displayClock ?? null) : null,
      period: state === "in" && status?.period ? `${status.period}` : null,
      detail: status?.type?.detail ?? status?.type?.shortDetail ?? null,
      progress: gameProgress(status?.period ?? 1, status?.clock ?? 900, state),
      downDistance,
      playText: skipPlay ? null : lastText,
      possession,
      broadcast,
    });
  }
  return games;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`ESPN ${url} ${res.status}`);
  return res.json();
}

export async function getEspnGames(week?: number): Promise<EspnGame[]> {
  const key = week && week >= 1 ? String(week) : "now";
  const hit = scoreboardCache.get(key);
  if (hit && Date.now() - hit.at < 8_000) return hit.value;
  const pending = scoreboardInflight.get(key);
  if (pending) return pending;
  const p = (async () => {
    let games: EspnGame[] = [];
    const siteUrl =
      week && week >= 1 ? `${SCOREBOARD_SITE}?week=${week}&seasontype=2` : SCOREBOARD_SITE;
    try {
      if (!week) {
        const data = (await fetchJson(SCOREBOARD_CDN)) as {
          content?: { sbData?: { events?: EspnEvent[] } };
          events?: EspnEvent[];
        };
        games = parseEvents(data.content?.sbData?.events ?? data.events);
      }
    } catch {
      games = [];
    }
    if (!games.length) {
      const data = (await fetchJson(siteUrl)) as { events?: EspnEvent[] };
      games = parseEvents(data.events);
    }
    scoreboardCache.set(key, { at: Date.now(), value: games });
    scoreboardInflight.delete(key);
    return games;
  })().catch((err) => {
    scoreboardInflight.delete(key);
    throw err;
  });
  scoreboardInflight.set(key, p);
  return p;
}

export function gameForTeam(games: EspnGame[], sleeperTeam: string | null): EspnGame | null {
  const abbr = espnAbbr(sleeperTeam);
  if (!abbr) return null;
  return games.find((g) => g.home === abbr || g.away === abbr) ?? null;
}

export function tickerFromGames(games: EspnGame[], involvedTeams: Set<string>): LiveTicker | null {
  const live = games.filter((g) => g.state === "in");
  if (!live.length) return null;
  const ranked = [...live].sort((a, b) => {
    const aHit = involvedTeams.has(a.home) || involvedTeams.has(a.away) ? 1 : 0;
    const bHit = involvedTeams.has(b.home) || involvedTeams.has(b.away) ? 1 : 0;
    return bHit - aHit;
  });
  const g = ranked[0]!;
  return {
    eventId: g.eventId,
    detail: g.detail ?? g.clock ?? "LIVE",
    downDistance: g.downDistance,
    playText: g.playText,
    homeAbbr: g.home,
    awayAbbr: g.away,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    possession: g.possession,
    broadcast: g.broadcast,
    playerHeadshot: null,
    playerName: null,
    fantasyDelta: null,
  };
}

export function opponentOf(game: EspnGame, sleeperTeam: string | null) {
  const abbr = espnAbbr(sleeperTeam);
  if (!abbr) return { opponent: null as string | null, homeAway: null as "home" | "away" | null };
  if (game.home === abbr) return { opponent: game.away, homeAway: "home" as const };
  if (game.away === abbr) return { opponent: game.home, homeAway: "away" as const };
  return { opponent: null, homeAway: null };
}

type RawPlay = {
  id?: string;
  text?: string;
  type?: { text?: string; abbreviation?: string };
  period?: { number?: number };
  clock?: { displayValue?: string };
  start?: { downDistanceText?: string; possessionText?: string };
  scoringPlay?: boolean;
  statYardage?: number;
};

export async function getEspnSummaryPlays(eventId: string): Promise<EspnPlay[]> {
  return cached(`espn-plays:${eventId}`, 12_000, async () => {
    const data = (await fetchJson(`${SUMMARY}?event=${eventId}`)) as {
      drives?: { previous?: Array<{ plays?: RawPlay[] }>; current?: { plays?: RawPlay[] } };
    };
    const drives = [...(data.drives?.previous ?? []), ...(data.drives?.current ? [data.drives.current] : [])];
    const plays: EspnPlay[] = [];
    for (const d of drives) {
      for (const p of d.plays ?? []) {
        const type = p.type?.text ?? "";
        if (!p.text || /timeout|end of |two-minute/i.test(p.text)) continue;
        const isTd = /touchdown/i.test(type) || /\bTD\b/.test(type) || /touchdown/i.test(p.text);
        const isInt = /interception/i.test(type);
        plays.push({
          id: p.id ?? `${eventId}-${plays.length}`,
          text: p.text,
          type,
          period: p.period?.number ?? 0,
          clock: p.clock?.displayValue ?? "",
          downDistance: p.start?.downDistanceText ?? p.start?.possessionText ?? null,
          scoringPlay: Boolean(p.scoringPlay) || isTd,
          yards: p.statYardage ?? 0,
          isTd,
          isInt,
        });
      }
    }
    return plays;
  });
}

export async function getEspnNews(): Promise<EspnNewsArticle[]> {
  return cached("espn-news", 90_000, async () => {
    const data = (await fetchJson(`${NEWS}?limit=50`)) as {
      articles?: Array<{
        id?: string | number;
        headline?: string;
        description?: string;
        published?: string;
        byline?: string;
        images?: Array<{ url?: string; href?: string }>;
        links?: { web?: { href?: string } };
        categories?: Array<{ type?: string; description?: string; team?: { abbreviation?: string } }>;
      }>;
    };
    return (data.articles ?? [])
      .filter((a) => a.headline)
      .map((a) => ({
        id: String(a.id ?? a.headline),
        headline: a.headline ?? "",
        description: a.description ?? "",
        published: a.published ?? "",
        image: a.images?.[0]?.url || a.images?.[0]?.href || null,
        url: a.links?.web?.href ?? null,
        byline: a.byline ?? null,
        teams: (a.categories ?? [])
          .filter((c) => c.type === "team")
          .map((c) => c.team?.abbreviation || c.description || "")
          .filter(Boolean)
          .slice(0, 3),
      }));
  });
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;|'/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, " ");
}

function htmlToParagraphs(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .split(/<\/p>/i)
    .map((chunk) => decodeEntities(chunk.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 1);
}

export async function getEspnArticle(id: string): Promise<EspnArticleFull> {
  const safe = id.replace(/[^\d]/g, "");
  if (!safe) throw new Error("Missing article");
  return cached(`espn-article:${safe}`, 5 * 60_000, async () => {
    const data = (await fetchJson(`https://content.core.api.espn.com/v1/sports/news/${safe}`)) as {
      headlines?: Array<{
        id?: string | number;
        headline?: string;
        description?: string;
        published?: string;
        byline?: string;
        story?: string;
        images?: Array<{ url?: string }>;
        links?: { web?: { href?: string } };
        categories?: Array<{ type?: string; description?: string; team?: { abbreviation?: string } }>;
      }>;
    };
    const h = data.headlines?.[0];
    if (!h) throw new Error("Article not found");
    const paragraphs = htmlToParagraphs(h.story ?? "");
    return {
      id: String(h.id ?? safe),
      headline: h.headline ?? "",
      description: h.description ?? "",
      published: h.published ?? "",
      image: h.images?.[0]?.url ?? null,
      url: h.links?.web?.href ?? null,
      byline: h.byline ?? null,
      teams: (h.categories ?? [])
        .filter((c) => c.type === "team")
        .map((c) => c.team?.abbreviation || c.description || "")
        .filter(Boolean)
        .slice(0, 3),
      paragraphs: paragraphs.length ? paragraphs : h.description ? [h.description] : [],
    };
  });
}

function zipBag(labels: string[] | undefined, values: string[] | undefined, prefix: string) {
  const bag: Record<string, string> = {};
  if (!labels || !values) return bag;
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]!;
    const key = prefix ? `${prefix}${label}` : label;
    bag[key] = values[i] ?? "—";
    if (bag[label] == null) bag[label] = values[i] ?? "—";
  }
  return bag;
}

export async function getEspnAthleteSeasonBags(espnId: string): Promise<{
  byYear: Map<number, Record<string, string>>;
  career: Record<string, string>;
}> {
  return cached(`espn-stats:${espnId}`, 30 * 60_000, async () => {
    const data = (await fetchJson(`${ATHLETE}/${espnId}/stats`)) as {
      categories?: Array<{
        name?: string;
        labels?: string[];
        totals?: string[];
        statistics?: Array<{ season?: { year?: number }; stats?: string[] }>;
      }>;
    };
    const byYear = new Map<number, Record<string, string>>();
    const career: Record<string, string> = {};
    for (const cat of data.categories ?? []) {
      const prefix = cat.name === "passing" ? "P_" : cat.name === "rushing" ? "R_" : cat.name === "receiving" ? "C_" : cat.name === "kicking" ? "K_" : cat.name === "defensive" ? "D_" : "";
      Object.assign(career, zipBag(cat.labels, cat.totals, prefix));
      for (const row of cat.statistics ?? []) {
        const year = row.season?.year;
        if (!year) continue;
        const prev = byYear.get(year) ?? {};
        Object.assign(prev, zipBag(cat.labels, row.stats, prefix));
        byYear.set(year, prev);
      }
    }
    return { byYear, career };
  });
}

export async function getEspnGamelog(espnId: string): Promise<EspnGamelogEvent[]> {
  return cached(`espn-gamelog:${espnId}`, 60_000, async () => {
    const data = (await fetchJson(`${ATHLETE}/${espnId}/gamelog`)) as {
      names?: string[];
      seasonTypes?: Array<{
        categories?: Array<{
          events?: Array<{ eventId?: string; stats?: string[] }>;
        }>;
      }>;
      events?: Record<
        string,
        {
          id?: string;
          week?: number;
          gameDate?: string;
          atVs?: string;
          score?: string;
          gameResult?: string;
          opponent?: { abbreviation?: string };
        }
      >;
    };
    const names = data.names ?? [];
    const eventsMeta = data.events ?? {};
    const out: EspnGamelogEvent[] = [];
    for (const st of data.seasonTypes ?? []) {
      for (const cat of st.categories ?? []) {
        for (const ev of cat.events ?? []) {
          const id = ev.eventId ?? "";
          const meta = eventsMeta[id];
          const stats: Record<string, string> = {};
          (ev.stats ?? []).forEach((v, i) => {
            if (names[i]) stats[names[i]!] = v;
          });
          out.push({
            eventId: id,
            week: meta?.week ?? 0,
            gameDate: meta?.gameDate ?? null,
            atVs: meta?.atVs ?? "vs",
            opponent: meta?.opponent?.abbreviation ?? "—",
            score: meta?.score ?? null,
            result: meta?.gameResult ?? null,
            stats,
          });
        }
      }
    }
    out.sort((a, b) => b.week - a.week);
    return out;
  });
}
