import { gameForTeam, getEspnGames, opponentOf, tickerFromGames, espnAbbr } from "./espn";
import {
  formatClockLabel,
  formatStatLine,
  injuryAbbrev,
  playerHeadshot,
  shortName,
  sleeperAvatar,
  summarizeYetToPlay,
  winProbability,
  emptyPlayer,
  leagueAvatar,
  scoringLabel,
  weekdayName,
  recordText,
  mentionsPlayer,
  playRole,
  fantasyForPlay,
} from "./format";
import { shortLeagueName } from "./leagues";
import {
  getLeague,
  getMatchups,
  getNflState,
  getPlayersMap,
  getRosters,
  getUsers,
  getWeekProjections,
  getWeekStats,
  getTransactions,
  getUserByUsername,
  getUserLeagues,
  type SlimPlayer,
  type SleeperMatchup,
  type SleeperRoster,
  type SleeperUser,
} from "./sleeper";
import type {
  ActivityItem,
  DivisionGroup,
  GameInfo,
  LeagueInfo,
  LeaguePickerItem,
  LeaguePlayer,
  MatchupPayload,
  OtherMatchup,
  PlayerView,
  SlotPos,
  StandingRow,
  TeamView,
} from "./types";

function fpts(roster: SleeperRoster) {
  return roster.settings.fpts + roster.settings.fpts_decimal / 100;
}

function fptsAgainst(roster: SleeperRoster) {
  return roster.settings.fpts_against + roster.settings.fpts_against_decimal / 100;
}

function maxPf(roster: SleeperRoster) {
  return (roster.settings.ppts ?? 0) + (roster.settings.ppts_decimal ?? 0) / 100;
}

function starterSlots(positions: string[]): SlotPos[] {
  return positions.filter((p) => p !== "BN" && p !== "IR" && p !== "TAXI") as SlotPos[];
}

function teamNameOf(user: SleeperUser | undefined) {
  return user?.metadata?.team_name?.trim() || user?.display_name || "Team";
}

function buildGame(player: SlimPlayer, games: Awaited<ReturnType<typeof getEspnGames>>): GameInfo {
  const g = gameForTeam(games, player.team);
  if (!player.team) {
    return {
      state: "bye",
      start: null,
      startLabel: "BYE",
      opponent: null,
      homeAway: null,
      progress: 0,
      clock: null,
      period: null,
      score: null,
      eventId: null,
    };
  }
  if (!g) {
    return {
      state: "pre",
      start: null,
      startLabel: "TBD",
      opponent: null,
      homeAway: null,
      progress: 0,
      clock: null,
      period: null,
      score: null,
      eventId: null,
    };
  }
  const { opponent, homeAway } = opponentOf(g, player.team);
  return {
    state: g.state,
    start: g.start,
    startLabel: formatClockLabel(g.start, g.state, g.clock),
    opponent,
    homeAway,
    progress: g.progress,
    clock: g.clock,
    period: g.period,
    score: g.state === "in" || g.state === "post" ? `${g.awayScore}–${g.homeScore}` : null,
    eventId: g.eventId,
  };
}

function toPlayer(
  id: string,
  slot: SlotPos,
  players: Record<string, SlimPlayer>,
  pointsMap: Record<string, number> | null,
  stats: Record<string, Record<string, number>>,
  projections: Record<string, Record<string, number>>,
  games: Awaited<ReturnType<typeof getEspnGames>>,
  starterPts?: number | null,
): PlayerView {
  const raw = players[id];
  const pos = raw?.pos ?? (id.length <= 3 ? "DEF" : slot === "FLEX" ? "WR" : slot);
  const team = raw?.team ?? (id.length <= 3 ? id : null);
  const player: SlimPlayer = raw ?? {
    id,
    first: null,
    last: null,
    full: id,
    pos,
    team,
    injury: null,
    status: null,
    searchRank: null,
    espnId: null,
    number: null,
    yearsExp: null,
  };
  const game = buildGame(player, games);
  if (game.state === "pre") {
    const st = stats[id];
    if (st && ((st.gp ?? 0) > 0 || (st.gms_active ?? 0) > 0 || (st.pts_ppr ?? 0) !== 0)) {
      game.state = "in";
      game.startLabel = "LIVE";
      game.progress = Math.max(game.progress, 0.08);
    }
  }
  const projection = projections[id]?.pts_ppr ?? 0;
  const hasPoints = pointsMap != null && Object.prototype.hasOwnProperty.call(pointsMap, id);
  const rawPts = hasPoints ? (pointsMap?.[id] ?? 0) : (starterPts ?? null);
  const points = game.state === "pre" || game.state === "bye" ? (rawPts && rawPts !== 0 ? rawPts : null) : (rawPts ?? 0);
  const remaining =
    game.state === "post" || game.state === "bye"
      ? 0
      : game.state === "in"
        ? projection * (1 - game.progress)
        : projection;
  const projectedLive = (points ?? 0) + remaining;
  const statLine = game.state === "pre" ? null : formatStatLine(stats[id], pos);
  return {
    id,
    name: player.full || `${player.first ?? ""} ${player.last ?? ""}`.trim() || id,
    shortName: shortName(player.first, player.last, player.full, pos),
    firstName: player.first ?? "",
    lastName: player.last ?? "",
    pos,
    slot,
    team,
    teamRank:
      projections[id]?.pos_adp_dd_ppr && projections[id]!.pos_adp_dd_ppr < 80
        ? Math.round(projections[id]!.pos_adp_dd_ppr)
        : null,
    injury: injuryAbbrev(player.injury),
    headshot: playerHeadshot(id, pos, team),
    espnId: player.espnId,
    number: player.number,
    points,
    projection,
    remaining,
    projectedLive,
    statLine,
    game,
  };
}

function buildTeam(
  roster: SleeperRoster,
  user: SleeperUser | undefined,
  matchup: SleeperMatchup | undefined,
  positions: string[],
  players: Record<string, SlimPlayer>,
  stats: Record<string, Record<string, number>>,
  projections: Record<string, Record<string, number>>,
  games: Awaited<ReturnType<typeof getEspnGames>>,
  rank: number,
): TeamView {
  const slots = starterSlots(positions);
  const starterIds = matchup?.starters ?? roster.starters ?? [];
  const starters = slots.map((slot, i) => {
    const id = starterIds[i];
    if (!id || id === "0") return emptyPlayer(slot);
    return toPlayer(
      id,
      slot,
      players,
      matchup?.players_points ?? null,
      stats,
      projections,
      games,
      matchup?.starters_points?.[i],
    );
  });
  const starterSet = new Set(starterIds);
  const benchIds = (matchup?.players ?? roster.players ?? []).filter((id) => !starterSet.has(id));
  const bench = benchIds.map((id) =>
    toPlayer(id, "BN", players, matchup?.players_points ?? null, stats, projections, games),
  );
  const yet = summarizeYetToPlay(starters);
  const points = matchup?.points ?? starters.reduce((sum, p) => sum + (p.points ?? 0), 0);
  const remaining = starters.reduce((sum, p) => sum + p.remaining, 0);
  const projected = starters.reduce((sum, p) => sum + p.projectedLive, 0);
  return {
    rosterId: roster.roster_id,
    userId: roster.owner_id,
    teamName: teamNameOf(user),
    displayName: user?.display_name ?? "Manager",
    username: (user?.username || user?.display_name || "manager").toLowerCase(),
    avatarUrl: sleeperAvatar(user?.avatar, user?.metadata?.avatar),
    wins: roster.settings.wins,
    losses: roster.settings.losses,
    ties: roster.settings.ties,
    rank,
    points,
    projected,
    remaining,
    winPct: 0.5,
    pointsAgainst: fptsAgainst(roster),
    maxPf: maxPf(roster),
    waiverPosition: roster.settings.waiver_position,
    totalMoves: roster.settings.total_moves ?? 0,
    starters,
    bench,
    yetToPlay: yet.count,
    yetToPlaySummary: yet.summary,
    playingCount: starters.filter((p) => p.game.state === "in").length,
  };
}

function decorateTicker(
  ticker: ReturnType<typeof tickerFromGames>,
  players: PlayerView[],
  scoring: Record<string, number>,
) {
  if (!ticker?.playText) return ticker;
  const hit = players.find((p) => mentionsPlayer(ticker.playText ?? "", p.firstName, p.lastName, p.name));
  if (!hit) return ticker;
  const role = playRole(ticker.playText, "", hit.firstName, hit.lastName);
  const yardsMatch = ticker.playText.match(/(-?\d+)\s*(?:yd|yard)/i);
  const yards = yardsMatch ? Number(yardsMatch[1]) : 0;
  const isTd = /touchdown|\bTD\b/i.test(ticker.playText);
  const isInt = /intercept/i.test(ticker.playText);
  const delta = fantasyForPlay(role, yards, isTd, isInt, scoring);
  return {
    ...ticker,
    playerHeadshot: hit.headshot,
    playerName: hit.shortName,
    fantasyDelta: Math.abs(delta) >= 0.05 ? delta : null,
  };
}

function resolveSides(
  userId: string,
  rosters: SleeperRoster[],
  matchups: SleeperMatchup[],
  viewMatchupId?: number,
) {
  const leftMine = rosters.find((r) => r.owner_id === userId);
  if (!leftMine) throw new Error("Your team isn’t in this league");
  const rosterById = new Map(rosters.map((r) => [r.roster_id, r]));

  if (viewMatchupId != null) {
    const pair = matchups.filter((m) => m.matchup_id === viewMatchupId);
    if (pair.length >= 2) {
      const mine = pair.find((m) => m.roster_id === leftMine.roster_id);
      const a = mine ?? pair[0]!;
      const b = pair.find((m) => m.roster_id !== a.roster_id);
      const left = rosterById.get(a.roster_id);
      const right = b ? rosterById.get(b.roster_id) : undefined;
      if (left && right) return { leftRoster: left, rightRoster: right };
    }
  }

  const myMatch = matchups.find((m) => m.roster_id === leftMine.roster_id);
  const weekOppMatch =
    myMatch?.matchup_id != null
      ? matchups.find((m) => m.matchup_id === myMatch.matchup_id && m.roster_id !== leftMine.roster_id)
      : undefined;
  const weekOppRoster = weekOppMatch ? rosterById.get(weekOppMatch.roster_id) : undefined;
  const rightRoster = weekOppRoster ?? rosters.find((r) => r.roster_id !== leftMine.roster_id);
  if (!rightRoster) throw new Error("Could not find an opponent in this league");
  return { leftRoster: leftMine, rightRoster };
}

export async function assembleMatchup(
  week: number | undefined,
  leagueId: string,
  viewMatchupId: number | undefined,
  userId: string,
): Promise<MatchupPayload> {
  if (leagueId.startsWith("espn:") || leagueId.startsWith("yahoo:")) {
    throw new Error(
      "Live scoring for ESPN/Yahoo public leagues still needs a matching Sleeper username. Pick a Sleeper league from the list, or connect Sleeper.",
    );
  }
  const state = await getNflState();
  const resolvedWeek = week && week >= 1 && week <= 18 ? week : state.week || state.display_week;
  const season = state.season;

  const weekNums = Array.from(new Set([resolvedWeek, Math.max(1, resolvedWeek - 1)]));
  const [league, users, rosters, matchups, stats, projections, games, players] = await Promise.all([
    getLeague(leagueId),
    getUsers(leagueId),
    getRosters(leagueId),
    getMatchups(leagueId, resolvedWeek),
    getWeekStats(season, resolvedWeek).catch(() => ({}) as Record<string, Record<string, number>>),
    getWeekProjections(season, resolvedWeek).catch(() => ({}) as Record<string, Record<string, number>>),
    getEspnGames(resolvedWeek).catch(() => []),
    getPlayersMap(),
  ]);
  const txWeeks = await Promise.all(weekNums.map((w) => getTransactions(leagueId, w).catch(() => [])));

  const userById = new Map(users.map((u) => [u.user_id, u]));
  const matchupByRoster = new Map(matchups.map((m) => [m.roster_id, m]));

  const ranked = [...rosters].sort((a, b) => {
    if (b.settings.wins !== a.settings.wins) return b.settings.wins - a.settings.wins;
    if (b.settings.ties !== a.settings.ties) return b.settings.ties - a.settings.ties;
    return fpts(b) - fpts(a);
  });
  const rankByRoster = new Map(ranked.map((r, i) => [r.roster_id, i + 1]));

  const { leftRoster, rightRoster } = resolveSides(userId, rosters, matchups, viewMatchupId);
  const leftMineId = leftRoster.roster_id;

  const left = buildTeam(
    leftRoster,
    userById.get(leftRoster.owner_id),
    matchupByRoster.get(leftRoster.roster_id),
    league.roster_positions,
    players,
    stats,
    projections,
    games,
    rankByRoster.get(leftRoster.roster_id) ?? 12,
  );
  const right = buildTeam(
    rightRoster,
    userById.get(rightRoster.owner_id),
    matchupByRoster.get(rightRoster.roster_id),
    league.roster_positions,
    players,
    stats,
    projections,
    games,
    rankByRoster.get(rightRoster.roster_id) ?? 5,
  );

  const leftWin = winProbability(left.projected, right.projected, left.remaining, right.remaining);
  left.winPct = leftWin;
  right.winPct = 1 - leftWin;

  const leftMatch = matchupByRoster.get(leftRoster.roster_id);
  const rightMatch = matchupByRoster.get(rightRoster.roster_id);
  const isHeadToHead = leftMatch?.matchup_id != null && leftMatch.matchup_id === rightMatch?.matchup_id;

  const involved = new Set<string>();
  for (const p of [...left.starters, ...right.starters]) {
    const abbr = espnAbbr(p.team);
    if (abbr) involved.add(abbr);
  }

  const rosterById = new Map(rosters.map((r) => [r.roster_id, r]));
  const liveAbbr = new Set(games.filter((g) => g.state === "in").flatMap((g) => [g.home, g.away]));

  const grouped = new Map<number, SleeperMatchup[]>();
  for (const m of matchups) {
    if (m.matchup_id == null) continue;
    const list = grouped.get(m.matchup_id) ?? [];
    list.push(m);
    grouped.set(m.matchup_id, list);
  }
  const otherMatchups: OtherMatchup[] = [];
  for (const [id, pair] of grouped) {
    if (pair.length < 2) continue;
    const a = pair[0]!;
    const b = pair[1]!;
    const ra = rosterById.get(a.roster_id);
    const rb = rosterById.get(b.roster_id);
    const ua = ra ? userById.get(ra.owner_id) : undefined;
    const ub = rb ? userById.get(rb.owner_id) : undefined;
    const aIsMine = a.roster_id === leftMineId;
    const bIsMine = b.roster_id === leftMineId;
    otherMatchups.push({
      matchupId: id,
      leftName: teamNameOf(ua),
      rightName: teamNameOf(ub),
      leftPoints: a.points,
      rightPoints: b.points,
      leftAvatar: sleeperAvatar(ua?.avatar, ua?.metadata?.avatar),
      rightAvatar: sleeperAvatar(ub?.avatar, ub?.metadata?.avatar),
      leftRecord: ra ? recordText(ra.settings.wins, ra.settings.losses, ra.settings.ties) : "",
      rightRecord: rb ? recordText(rb.settings.wins, rb.settings.losses, rb.settings.ties) : "",
      leftRank: ra ? (rankByRoster.get(ra.roster_id) ?? 0) : 0,
      rightRank: rb ? (rankByRoster.get(rb.roster_id) ?? 0) : 0,
      isFeatured: false,
      isMine: aIsMine || bIsMine,
      isLive: liveAbbr.size > 0,
    });
  }
  otherMatchups.sort((a, b) => Number(b.isMine) - Number(a.isMine) || a.matchupId - b.matchupId);

  const standings: StandingRow[] = ranked.map((r, i) => {
    const u = userById.get(r.owner_id);
    return {
      rosterId: r.roster_id,
      rank: i + 1,
      teamName: teamNameOf(u),
      displayName: u?.display_name ?? "",
      avatarUrl: sleeperAvatar(u?.avatar, u?.metadata?.avatar),
      wins: r.settings.wins,
      losses: r.settings.losses,
      ties: r.settings.ties,
      pointsFor: fpts(r),
      pointsAgainst: fptsAgainst(r),
      maxPf: maxPf(r),
      waiverPosition: r.settings.waiver_position,
      isLeft: r.roster_id === left.rosterId,
      isRight: r.roster_id === right.rosterId,
      division: r.settings.division ?? null,
    };
  });

  const divCount = league.settings.divisions ?? 0;
  const divisions: DivisionGroup[] = [];
  if (divCount > 0) {
    for (let n = 1; n <= divCount; n++) {
      const rows = standings
        .filter((s) => s.division === n)
        .sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (b.ties !== a.ties) return b.ties - a.ties;
          return b.pointsFor - a.pointsFor;
        });
      if (!rows.length) continue;
      const custom = league.metadata?.[`division_${n}`]?.trim();
      divisions.push({
        id: n,
        name: custom || `Division ${n}`,
        rows,
      });
    }
  }

  const rosterOwner = new Map<number, SleeperUser | undefined>();
  for (const r of rosters) rosterOwner.set(r.roster_id, userById.get(r.owner_id));

  const nameOf = (pid: string) => {
    const p = players[pid];
    return p ? shortName(p.first, p.last, p.full, p.pos) : pid;
  };

  const activity: ActivityItem[] = [];
  for (const tx of txWeeks.flat()) {
    if (!tx || tx.status === "failed") continue;
    const rid = tx.roster_ids?.[0];
    const owner = rid != null ? rosterOwner.get(rid) : undefined;
    activity.push({
      id: tx.transaction_id,
      type: tx.type,
      status: tx.status,
      created: tx.created,
      teamName: teamNameOf(owner),
      avatarUrl: sleeperAvatar(owner?.avatar, owner?.metadata?.avatar),
      adds: Object.keys(tx.adds ?? {}).map((id) => ({ id, name: nameOf(id) })),
      drops: Object.keys(tx.drops ?? {}).map((id) => ({ id, name: nameOf(id) })),
    });
  }
  activity.sort((a, b) => b.created - a.created);

  const lastWinnerId = league.metadata?.latest_league_winner_roster_id
    ? Number(league.metadata.latest_league_winner_roster_id)
    : null;
  const lastWinnerRoster = lastWinnerId != null ? rosterById.get(lastWinnerId) : undefined;
  const lastWinnerUser = lastWinnerRoster ? userById.get(lastWinnerRoster.owner_id) : undefined;

  const rec = league.scoring_settings.rec ?? 0;
  const leagueInfo: LeagueInfo = {
    name: league.name,
    avatarUrl: leagueAvatar(league.avatar),
    season: league.season,
    teams: league.settings.num_teams ?? rosters.length,
    playoffTeams: league.settings.playoff_teams ?? 6,
    playoffWeekStart: league.settings.playoff_week_start ?? 15,
    scoringLabel: scoringLabel(rec),
    rec,
    passTd: league.scoring_settings.pass_td ?? 4,
    rushTd: league.scoring_settings.rush_td ?? 6,
    keeper: (league.settings.max_keepers ?? 0) > 0,
    tradeDeadline: league.settings.trade_deadline ?? 11,
    waiverDay: weekdayName(league.settings.waiver_day_of_week ?? 2),
    lastWinnerRosterId: lastWinnerId,
    lastWinnerName: lastWinnerUser?.metadata?.team_name?.trim() || lastWinnerUser?.display_name || null,
    divisions,
  };

  const seenPlayers = new Set<string>();
  const leaguePlayers: LeaguePlayer[] = [];
  for (const r of rosters) {
    const u = userById.get(r.owner_id);
    const ownerName = teamNameOf(u);
    for (const id of r.players ?? []) {
      if (seenPlayers.has(id)) continue;
      seenPlayers.add(id);
      const p = players[id];
      const pos = p?.pos ?? (id.length <= 3 ? "DEF" : "FLX");
      const team = p?.team ?? (id.length <= 3 ? id : null);
      leaguePlayers.push({
        id,
        name: p?.full || `${p?.first ?? ""} ${p?.last ?? ""}`.trim() || id,
        shortName: shortName(p?.first ?? null, p?.last ?? null, p?.full ?? null, pos),
        pos,
        team,
        injury: injuryAbbrev(p?.injury ?? null),
        headshot: playerHeadshot(id, pos, team),
        espnId: p?.espnId ?? null,
        rosterId: r.roster_id,
        ownerName,
        projection: projections[id]?.pts_ppr ?? 0,
      });
    }
  }
  leaguePlayers.sort((a, b) => a.name.localeCompare(b.name));

  const ticker = decorateTicker(
    tickerFromGames(games, involved),
    [...left.starters, ...right.starters, ...left.bench, ...right.bench],
    league.scoring_settings,
  );

  return {
    week: resolvedWeek,
    displayWeek: state.week || state.display_week,
    season,
    leagueId: league.league_id,
    leagueSlug: league.league_id,
    leagueName: league.name,
    updatedAt: new Date().toISOString(),
    isHeadToHead,
    myMatchupId: matchups.find((m) => m.roster_id === leftMineId)?.matchup_id ?? null,
    left,
    right,
    ticker,
    liveGames: games.filter((g) => g.state === "in").length,
    otherMatchups,
    standings,
    activity: activity.slice(0, 24),
    league: leagueInfo,
    leaguePlayers,
  };
}

export async function assembleLeaguePicker(userId: string, leagueIds: string[]): Promise<LeaguePickerItem[]> {
  const state = await getNflState();
  const week = state.week || state.display_week;
  const ids = [...new Set(leagueIds)].slice(0, 24);

  const rows = await Promise.all(
    ids.map(async (id) => {
      if (id.startsWith("espn:") || id.startsWith("yahoo:")) {
        const [kind, num] = id.split(":");
        return {
          id,
          slug: id,
          name: kind === "espn" ? `ESPN league ${num}` : `Yahoo league ${num}`,
          shortName: kind === "espn" ? "ESPN" : "Yahoo",
          avatarUrl: leagueAvatar(null),
          season: state.season,
          teams: 0,
          scoringLabel: "Public",
          myTeamName: "Connected",
          myAvatar: "",
          myPoints: 0,
          myRecord: "",
          oppName: "Open in Sleeper for live pts",
          oppAvatar: "",
          oppPoints: 0,
          week,
        } satisfies LeaguePickerItem;
      }
      const [league, users, rosters, matchups] = await Promise.all([
        getLeague(id),
        getUsers(id),
        getRosters(id),
        getMatchups(id, week),
      ]);
      const userById = new Map(users.map((u) => [u.user_id, u]));
      const { leftRoster, rightRoster } = resolveSides(userId, rosters, matchups);
      const leftUser = userById.get(leftRoster.owner_id);
      const rightUser = userById.get(rightRoster.owner_id);
      const leftMatch = matchups.find((m) => m.roster_id === leftRoster.roster_id);
      const rightMatch = matchups.find((m) => m.roster_id === rightRoster.roster_id);
      return {
        id: league.league_id,
        slug: league.league_id,
        name: league.name,
        shortName: shortLeagueName(league.name),
        avatarUrl: leagueAvatar(league.avatar),
        season: league.season,
        teams: league.settings.num_teams ?? rosters.length,
        scoringLabel: scoringLabel(league.scoring_settings.rec ?? 0),
        myTeamName: teamNameOf(leftUser),
        myAvatar: sleeperAvatar(leftUser?.avatar, leftUser?.metadata?.avatar),
        myPoints: leftMatch?.points ?? 0,
        myRecord: recordText(leftRoster.settings.wins, leftRoster.settings.losses, leftRoster.settings.ties),
        oppName: teamNameOf(rightUser),
        oppAvatar: sleeperAvatar(rightUser?.avatar, rightUser?.metadata?.avatar),
        oppPoints: rightMatch?.points ?? 0,
        week,
      } satisfies LeaguePickerItem;
    }),
  );
  return rows;
}

const FA_POS = new Set(["QB", "RB", "WR", "TE", "K", "DEF"]);

export async function assembleFreeAgents(leagueId: string, q: string, pos: string): Promise<LeaguePlayer[]> {
  const needle = q.trim().toLowerCase();
  const posFilter = pos && pos !== "ALL" ? pos : null;
  const state = await getNflState();
  const [players, rosters, projections] = await Promise.all([
    getPlayersMap(),
    getRosters(leagueId),
    getWeekProjections(state.season, state.week || state.display_week).catch(
      () => ({}) as Record<string, Record<string, number>>,
    ),
  ]);
  const rostered = new Set<string>();
  for (const r of rosters) {
    for (const id of r.players ?? []) rostered.add(id);
  }

  const out: LeaguePlayer[] = [];
  for (const p of Object.values(players)) {
    if (!p) continue;
    const position = p.pos || (p.id.length <= 3 ? "DEF" : "");
    if (!FA_POS.has(position)) continue;
    if (rostered.has(p.id)) continue;
    if (posFilter && position !== posFilter) continue;
    const name = p.full || `${p.first ?? ""} ${p.last ?? ""}`.trim();
    if (!name) continue;
    if (needle && !`${name} ${p.team ?? ""} ${position}`.toLowerCase().includes(needle)) continue;
    const proj = projections[p.id]?.pts_ppr ?? 0;
    const rank = p.searchRank ?? 9999;
    if (!needle && rank > 500 && proj < 4) continue;
    if (position !== "DEF" && !p.team && p.status !== "Active") continue;
    out.push({
      id: p.id,
      name,
      shortName: shortName(p.first, p.last, p.full, position),
      pos: position,
      team: p.team ?? (p.id.length <= 3 ? p.id : null),
      injury: injuryAbbrev(p.injury),
      headshot: playerHeadshot(p.id, position, p.team),
      espnId: p.espnId,
      rosterId: null,
      ownerName: "Free Agent",
      projection: proj,
    });
  }
  out.sort((a, b) => {
    if (b.projection !== a.projection) return b.projection - a.projection;
    return a.name.localeCompare(b.name);
  });
  return out.slice(0, needle ? 80 : 60);
}

export async function assembleAccount(
  platform: "sleeper" | "espn" | "yahoo",
  username: string,
  leagueRef: string,
) {
  const state = await getNflState();
  const season = state.season;

  if (platform === "espn") {
    const { parseLeagueRef } = await import("./leagues");
    const { lookupEspnLeague } = await import("./external");
    const id = parseLeagueRef("espn", leagueRef);
    const espn = await lookupEspnLeague(username, id, season);
    const sleeper = await sleeperLookup(username).catch(() => null);
    if (sleeper) {
      return {
        ...espn,
        userId: sleeper.userId,
        displayName: sleeper.displayName,
        avatar: sleeper.avatar,
        leagues: [...sleeper.leagues, ...espn.leagues],
      };
    }
    return espn;
  }

  if (platform === "yahoo") {
    const { parseLeagueRef } = await import("./leagues");
    const { lookupYahooLeague } = await import("./external");
    const id = parseLeagueRef("yahoo", leagueRef);
    const yahoo = await lookupYahooLeague(username, id, "470");
    const sleeper = await sleeperLookup(username).catch(() => null);
    if (sleeper) {
      return {
        ...yahoo,
        userId: sleeper.userId,
        displayName: sleeper.displayName,
        avatar: sleeper.avatar,
        leagues: [...sleeper.leagues, ...yahoo.leagues],
      };
    }
    return yahoo;
  }

  return sleeperLookup(username);
}

async function sleeperLookup(username: string) {
  const handle = username.trim().toLowerCase();
  const user = await getUserByUsername(handle);
  if (!user) throw new Error("No Sleeper user with that username");
  const state = await getNflState();
  let leagues = await getUserLeagues(user.user_id, state.season).catch(() => []);
  if (!leagues.length) {
    const prev = String(Number(state.season) - 1);
    if (prev !== state.season) {
      leagues = await getUserLeagues(user.user_id, prev).catch(() => []);
    }
  }
  if (!leagues.length) throw new Error("No NFL leagues found for that username");
  return {
    platform: "sleeper" as const,
    userId: user.user_id,
    username: (user.username || handle).toLowerCase(),
    displayName: user.display_name,
    avatar: user.avatar,
    leagues: leagues.map((l) => ({
      id: l.league_id,
      name: l.name,
      shortName: shortLeagueName(l.name),
      season: l.season,
      teams: l.settings.num_teams ?? 0,
      avatarUrl: leagueAvatar(l.avatar),
    })),
  };
}

