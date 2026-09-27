import { createServerFn } from "@tanstack/react-start";
import type { AccountLookup, FeedArticle, FeedStory, LeaguePickerItem, LeaguePlayer, MatchupPayload, PlayerDetail, TrendingPlayer } from "./types";
import { playerHeadshot, shortName } from "./format";
import { accountUsername, parseLeagueRef, sleeperId, sleeperUsername, type FantasyPlatform } from "./leagues";

export const lookupSleeperAccount = createServerFn({ method: "POST" })
  .validator((d: { platform?: string; username?: string; leagueRef?: string } | undefined) => {
    const platform = (d?.platform === "espn" || d?.platform === "yahoo" ? d.platform : "sleeper") as FantasyPlatform;
    const username = platform === "sleeper" ? sleeperUsername(String(d?.username ?? "")) : accountUsername(String(d?.username ?? ""));
    const leagueRef = platform === "sleeper" ? "" : parseLeagueRef(platform, String(d?.leagueRef ?? ""));
    return { platform, username, leagueRef };
  })
  .handler(async ({ data }): Promise<AccountLookup> => {
    const { assembleAccount } = await import("./assemble");
    return assembleAccount(data.platform, data.username, data.leagueRef);
  });

export const fetchLiveMatchup = createServerFn({ method: "POST" })
  .validator((d: { week?: number; leagueId?: string; userId?: string; matchupId?: number } | undefined) => {
    const userId = sleeperId(String(d?.userId ?? ""));
    const leagueId = sleeperId(String(d?.leagueId ?? ""));
    const week = d?.week;
    const rawId = d?.matchupId;
    const matchupId =
      rawId != null && Number.isFinite(rawId) && rawId >= 1 ? Math.trunc(rawId) : undefined;
    if (week == null) return { userId, leagueId, matchupId };
    if (!Number.isFinite(week) || week < 1 || week > 18) {
      throw new Error("Week must be between 1 and 18");
    }
    return { week: Math.trunc(week), userId, leagueId, matchupId };
  })
  .handler(async ({ data }): Promise<MatchupPayload> => {
    const { assembleMatchup } = await import("./assemble");
    return assembleMatchup(data.week, data.leagueId, data.matchupId, data.userId);
  });

export const fetchLeaguePicker = createServerFn({ method: "POST" })
  .validator((d: { userId?: string; leagueIds?: string[] } | undefined) => {
    const userId = sleeperId(String(d?.userId ?? ""));
    const leagueIds = (d?.leagueIds ?? []).map((id) => sleeperId(String(id))).slice(0, 24);
    if (!leagueIds.length) throw new Error("Pick at least one league");
    return { userId, leagueIds };
  })
  .handler(async ({ data }): Promise<LeaguePickerItem[]> => {
    const { assembleLeaguePicker } = await import("./assemble");
    return assembleLeaguePicker(data.userId, data.leagueIds);
  });

export const fetchPlayerDetail = createServerFn({ method: "POST" })
  .validator((d: { playerId?: string; week?: number; league?: string; leagueId?: string } | undefined) => {
    const playerId = String(d?.playerId ?? "").trim();
    if (!playerId) throw new Error("Missing player");
    const week = d?.week;
    const leagueId = sleeperId(String(d?.league ?? d?.leagueId ?? ""));
    if (week == null) return { playerId, leagueId };
    if (!Number.isFinite(week) || week < 1 || week > 18) {
      throw new Error("Week must be between 1 and 18");
    }
    return { playerId, week: Math.trunc(week), leagueId };
  })
  .handler(async ({ data }): Promise<PlayerDetail> => {
    const { assemblePlayerDetail } = await import("./player-detail");
    return assemblePlayerDetail(data.playerId, data.week, data.leagueId);
  });

export const fetchTrending = createServerFn({ method: "POST" }).handler(async (): Promise<TrendingPlayer[]> => {
  const { getTrending, getPlayersMap } = await import("./sleeper");
  const [adds, drops, players] = await Promise.all([
    getTrending("add").catch(() => []),
    getTrending("drop").catch(() => []),
    getPlayersMap(),
  ]);
  const out: TrendingPlayer[] = [];
  const seen = new Set<string>();
  const push = (row: { player_id: string; count: number }, kind: "add" | "drop") => {
    if (seen.has(row.player_id)) return;
    seen.add(row.player_id);
    const p = players[row.player_id];
    const pos = p?.pos ?? "FLX";
    const team = p?.team ?? null;
    out.push({
      id: row.player_id,
      name: p?.full || `${p?.first ?? ""} ${p?.last ?? ""}`.trim() || row.player_id,
      shortName: shortName(p?.first ?? null, p?.last ?? null, p?.full ?? null, pos),
      pos,
      team,
      headshot: playerHeadshot(row.player_id, pos, team),
      count: row.count,
      kind,
      espnId: p?.espnId ?? null,
    });
  };
  for (const a of adds.slice(0, 10)) push(a, "add");
  for (const d of drops.slice(0, 6)) push(d, "drop");
  return out;
});

export const fetchFreeAgents = createServerFn({ method: "POST" })
  .validator((d: { league?: string; q?: string; pos?: string } | undefined) => ({
    leagueId: sleeperId(String(d?.league ?? "")),
    q: String(d?.q ?? "").slice(0, 40),
    pos: String(d?.pos ?? "ALL").slice(0, 8),
  }))
  .handler(async ({ data }): Promise<LeaguePlayer[]> => {
    const { assembleFreeAgents } = await import("./assemble");
    return assembleFreeAgents(data.leagueId, data.q, data.pos);
  });

export const fetchEspnFeed = createServerFn({ method: "POST" }).handler(async (): Promise<FeedStory[]> => {
  const { getEspnNews } = await import("./espn");
  const { formatNewsTime } = await import("./format");
  const articles = await getEspnNews();
  return articles.slice(0, 40).map((a) => ({
    id: a.id,
    headline: a.headline,
    description: a.description,
    published: a.published,
    publishedLabel: formatNewsTime(a.published),
    image: a.image,
    url: a.url,
    byline: a.byline,
    teams: a.teams,
  }));
});

export const fetchEspnArticle = createServerFn({ method: "POST" })
  .validator((d: { id?: string } | undefined) => {
    const id = String(d?.id ?? "").replace(/[^\d]/g, "").slice(0, 16);
    if (!id) throw new Error("Missing article");
    return { id };
  })
  .handler(async ({ data }): Promise<FeedArticle> => {
    const { getEspnArticle } = await import("./espn");
    const { formatNewsTime } = await import("./format");
    const a = await getEspnArticle(data.id);
    return {
      id: a.id,
      headline: a.headline,
      description: a.description,
      published: a.published,
      publishedLabel: formatNewsTime(a.published),
      image: a.image,
      url: a.url,
      byline: a.byline,
      teams: a.teams,
      paragraphs: a.paragraphs,
    };
  });

