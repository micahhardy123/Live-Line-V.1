import {
  getEspnAthleteSeasonBags,
  getEspnGamelog,
  getEspnNews,
  getEspnSummaryPlays,
  getEspnGames,
  gameForTeam,
} from "./espn";
import {
  cell,
  fantasyForPlay,
  formatGameDate,
  formatNewsTime,
  formatPts,
  mentionsPlayer,
  playRole,
  playerHeadshot,
  shortName,
  sleeperStatCells,
  vsLabel,
} from "./format";
import {
  getLeague,
  getNflState,
  getPlayersMap,
  getSeasonStats,
  getWeekStats,
} from "./sleeper";
import { sleeperId } from "./leagues";
import type { GameLogRow, NewsItem, PlayerDetail, ScoringPlay, StatCell } from "./types";

function bagCells(bag: Record<string, string> | undefined, pos: string): StatCell[] {
  if (!bag || !Object.keys(bag).length) return [];
  const pick = (keys: string[], label: string, outKey: string) => {
    for (const k of keys) {
      if (bag[k] != null && bag[k] !== "" && bag[k] !== "—") return cell(outKey, label, bag[k]);
    }
    return null;
  };
  const rows: StatCell[] = [];
  const add = (c: StatCell | null) => {
    if (c) rows.push(c);
  };
  if (pos === "QB") {
    add(pick(["GP", "P_GP"], "GP", "gp"));
    add(pick(["P_CMP%", "CMP%"], "CMP%", "cmp"));
    add(pick(["P_YDS", "YDS"], "YDS", "pyd"));
    add(pick(["P_TD", "TD"], "TD", "ptd"));
    add(pick(["P_INT", "INT"], "INT", "int"));
    add(pick(["R_CAR", "CAR"], "CAR", "car"));
    add(pick(["R_YDS"], "YDS", "ryd"));
    add(pick(["R_TD"], "TD", "rtd"));
  } else if (pos === "K") {
    add(pick(["GP", "K_GP"], "GP", "gp"));
    add(pick(["K_FG", "FG"], "FG", "fg"));
    add(pick(["K_XP", "XP", "PAT"], "XP", "xp"));
    add(pick(["K_PTS", "PTS"], "PTS", "pts"));
  } else if (pos === "DEF") {
    add(pick(["D_GP", "GP"], "GP", "gp"));
    add(pick(["D_SACK", "SACK"], "SACK", "sack"));
    add(pick(["D_INT", "INT"], "INT", "int"));
    add(pick(["D_FF", "FF"], "FF", "ff"));
    add(pick(["D_TD", "TD"], "TD", "td"));
  } else {
    add(pick(["GP", "R_GP", "C_GP"], "GP", "gp"));
    add(pick(["R_CAR", "CAR"], "CAR", "car"));
    add(pick(["R_YDS", "YDS"], "YDS", "ryd"));
    add(pick(["R_TD", "TD"], "TD", "rtd"));
    add(pick(["C_REC", "REC"], "REC", "rec"));
    add(pick(["C_YDS"], "YDS", "cyd"));
    add(pick(["C_TD"], "TD", "ctd"));
  }
  return rows;
}

function gamelogLine(stats: Record<string, string>, pos: string): StatCell[] {
  const pick = (keys: string[], label: string) => {
    for (const k of keys) {
      if (stats[k] != null) return cell(k, label, stats[k]);
    }
    return null;
  };
  const rows: StatCell[] = [];
  const add = (c: StatCell | null) => {
    if (c) rows.push(c);
  };
  if (pos === "QB") {
    add(pick(["completions"], "CMP"));
    add(pick(["passingAttempts"], "ATT"));
    add(pick(["passingYards"], "YDS"));
    add(pick(["passingTouchdowns"], "TD"));
    add(pick(["interceptions"], "INT"));
    add(pick(["rushingAttempts"], "CAR"));
    add(pick(["rushingYards"], "YDS"));
    add(pick(["rushingTouchdowns"], "TD"));
  } else if (pos === "K") {
    add(pick(["fieldGoalsMade", "fieldGoals"], "FG"));
    add(pick(["extraPointsMade", "kickExtraPoints"], "XP"));
  } else if (pos === "DEF") {
    add(pick(["sacks"], "SACK"));
    add(pick(["interceptions"], "INT"));
    add(pick(["totalTackles"], "TKL"));
  } else {
    add(pick(["rushingAttempts"], "CAR"));
    add(pick(["rushingYards"], "YDS"));
    add(pick(["rushingTouchdowns"], "TD"));
    add(pick(["receptions"], "REC"));
    add(pick(["receivingYards"], "YDS"));
    add(pick(["receivingTouchdowns"], "TD"));
  }
  return rows;
}

export async function assemblePlayerDetail(playerId: string, week?: number, leagueKey?: string): Promise<PlayerDetail> {
  const state = await getNflState();
  const resolvedWeek = week && week >= 1 && week <= 18 ? week : state.week || state.display_week;
  const season = state.season;
  const lastSeason = String(Number(season) - 1);
  const leagueId = sleeperId(String(leagueKey ?? ""));

  const [players, league, weekStats, seasonStats, lastStats, games] = await Promise.all([
    getPlayersMap(),
    getLeague(leagueId),
    getWeekStats(season, resolvedWeek).catch(() => ({}) as Record<string, Record<string, number>>),
    getSeasonStats(season).catch(() => ({}) as Record<string, Record<string, number>>),
    getSeasonStats(lastSeason).catch(() => ({}) as Record<string, Record<string, number>>),
    getEspnGames(resolvedWeek).catch(() => []),
  ]);

  const raw = players[playerId];
  const pos = raw?.pos ?? (playerId.length <= 3 ? "DEF" : "FLX");
  const team = raw?.team ?? (playerId.length <= 3 ? playerId : null);
  const name = raw?.full || `${raw?.first ?? ""} ${raw?.last ?? ""}`.trim() || playerId;
  const short = shortName(raw?.first ?? null, raw?.last ?? null, raw?.full ?? null, pos);
  const espnId = raw?.espnId ?? null;
  const game = gameForTeam(games, team);
  const eventId = game?.eventId ?? null;
  const first = raw?.first ?? "";
  const last = raw?.last ?? "";

  const espnP = espnId
    ? Promise.all([
        getEspnAthleteSeasonBags(espnId).catch(() => null),
        getEspnGamelog(espnId).catch(() => []),
      ])
    : Promise.resolve([null, []] as const);
  const playsP = eventId ? getEspnSummaryPlays(eventId).catch(() => []) : Promise.resolve([]);
  const newsP = getEspnNews().catch(() => []);
  const pastWeeksP = Promise.all(
    Array.from({ length: Math.max(0, resolvedWeek - 1) }, (_, i) =>
      getWeekStats(season, i + 1)
        .then((s) => [i + 1, s[playerId]] as const)
        .catch(() => [i + 1, undefined] as const),
    ),
  );

  const [espnPair, plays, news, pastWeeks] = await Promise.all([espnP, playsP, newsP, pastWeeksP]);
  const espnBags = espnPair[0];
  const gamelog = espnPair[1];

  const scoring = league.scoring_settings;
  const scoringPlays: ScoringPlay[] = [];
  for (const p of plays) {
    if (!mentionsPlayer(p.text, first, last, name)) continue;
    const role = playRole(p.text, p.type, first, last);
    const pts = fantasyForPlay(role, p.yards, p.isTd, p.isInt, scoring);
    if (Math.abs(pts) < 0.05 && !p.scoringPlay) continue;
    const shortText =
      role === "rush"
        ? `${short} ${p.yards} yd rush${p.isTd ? " TD" : ""}`
        : role === "rec"
          ? `${short} ${p.yards} yd rec${p.isTd ? " TD" : ""}`
          : role === "pass"
            ? `${short} ${p.yards} yd pass${p.isTd ? " TD" : ""}`
            : p.text.replace(/\s*\([^)]*\)\s*$/, "");
    scoringPlays.push({
      id: p.id,
      period: p.period ? `Q${p.period}` : "",
      clock: p.clock,
      downDistance: p.downDistance,
      text: shortText,
      points: pts,
      isTd: p.isTd,
    });
  }

  const year = Number(season);
  const seasonBag = espnBags?.byYear.get(year);
  const lastBag = espnBags?.byYear.get(year - 1);
  let seasonStatsCells = bagCells(seasonBag, pos);
  let lastSeasonCells = bagCells(lastBag, pos);
  const careerStats = bagCells(espnBags?.career, pos);
  if (!seasonStatsCells.length) seasonStatsCells = sleeperStatCells(seasonStats[playerId], pos);
  if (!lastSeasonCells.length) lastSeasonCells = sleeperStatCells(lastStats[playerId], pos);

  const gameStats = sleeperStatCells(weekStats[playerId], pos);
  const extraStats = sleeperStatCells(weekStats[playerId], pos, true).filter(
    (c) => !gameStats.some((g) => g.key === c.key),
  );

  const gameLog: GameLogRow[] = [];
  if (gamelog.length) {
    for (const row of gamelog) {
      const sleeperPts =
        row.week === resolvedWeek
          ? (weekStats[playerId]?.pts_ppr ?? null)
          : (pastWeeks.find(([w]) => w === row.week)?.[1]?.pts_ppr ?? null);
      gameLog.push({
        week: row.week,
        dateLabel: formatGameDate(row.gameDate),
        opponent: row.opponent,
        homeAway: row.atVs === "@" ? "@" : "vs",
        result: row.result,
        fantasyPts: sleeperPts,
        line: gamelogLine(row.stats, pos),
      });
    }
  } else {
    for (const [w, st] of [...pastWeeks, [resolvedWeek, weekStats[playerId]] as const]) {
      if (!st) continue;
      gameLog.push({
        week: w,
        dateLabel: `WEEK ${w}`,
        opponent: w === resolvedWeek ? (game ? (game.home === team ? game.away : game.home) : "—") : "—",
        homeAway: "vs",
        result: null,
        fantasyPts: st.pts_ppr ?? null,
        line: sleeperStatCells(st, pos),
      });
    }
    gameLog.reverse();
  }

  const needle = [last, first, name, short].filter((s) => s && s.length > 2).map((s) => s.toLowerCase());
  const newsItems: NewsItem[] = [];
  for (const a of news) {
    const blob = `${a.headline} ${a.description}`.toLowerCase();
    if (!needle.some((n) => n.length > 3 && blob.includes(n))) continue;
    newsItems.push({
      id: a.id,
      headline: a.headline,
      description: a.description,
      published: a.published,
      publishedLabel: formatNewsTime(a.published),
      image: a.image,
    });
  }
  if (!newsItems.length) {
    for (const a of news.slice(0, 4)) {
      newsItems.push({
        id: a.id,
        headline: a.headline,
        description: a.description,
        published: a.published,
        publishedLabel: formatNewsTime(a.published),
        image: a.image,
      });
    }
  }

  let opponent: string | null = null;
  let homeAway: "home" | "away" | null = null;
  if (game && team) {
    const abbr = team === "WAS" ? "WSH" : team === "JAC" ? "JAX" : team;
    if (game.home === abbr) {
      opponent = game.away;
      homeAway = "home";
    } else if (game.away === abbr) {
      opponent = game.home;
      homeAway = "away";
    }
  }

  const gameLabel = game
    ? game.state === "in"
      ? game.clock ?? "LIVE"
      : game.state === "post"
        ? "Final"
        : formatGameDate(game.start)
    : "";

  return {
    playerId,
    espnId,
    name,
    shortName: short,
    pos,
    team,
    number: raw?.number ?? null,
    headshot: playerHeadshot(playerId, pos, team),
    week: resolvedWeek,
    season,
    gameStats,
    extraStats,
    scoringPlays,
    gameLog,
    seasonStats: seasonStatsCells,
    lastSeasonStats: lastSeasonCells,
    careerStats,
    news: newsItems.slice(0, 8),
    opponent,
    homeAway,
    gameLabel,
    fantasyPts: weekStats[playerId]?.pts_ppr ?? null,
    projection: 0,
  };
}

export function formatPlayPts(n: number) {
  return formatPts(n);
}
