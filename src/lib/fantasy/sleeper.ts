import { cached } from "./cache";

const BASE = "https://api.sleeper.app/v1";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Sleeper ${path} failed (${res.status})`);
  return (await res.json()) as T;
}

export type NflState = {
  week: number;
  display_week: number;
  season: string;
  season_type: string;
};

export type SleeperLeague = {
  league_id: string;
  name: string;
  season: string;
  avatar: string | null;
  roster_positions: string[];
  scoring_settings: Record<string, number>;
  settings: Record<string, number | null>;
  metadata: {
    latest_league_winner_roster_id?: string;
    copy_from_league_id?: string;
    [key: string]: string | undefined;
  } | null;
};

export type SleeperUser = {
  user_id: string;
  username?: string;
  display_name: string;
  avatar: string | null;
  metadata: {
    team_name?: string;
    avatar?: string;
  } | null;
};

export type SleeperRoster = {
  roster_id: number;
  owner_id: string;
  players: string[] | null;
  starters: string[] | null;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal: number;
    fpts_against: number;
    fpts_against_decimal: number;
    ppts?: number;
    ppts_decimal?: number;
    waiver_position: number;
    total_moves?: number;
    waiver_budget_used?: number;
    division?: number;
  };
};

export type SleeperMatchup = {
  roster_id: number;
  matchup_id: number | null;
  points: number;
  starters: string[] | null;
  players: string[] | null;
  starters_points: number[] | null;
  players_points: Record<string, number> | null;
};

export type SleeperPlayer = {
  player_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  position: string | null;
  team: string | null;
  injury_status: string | null;
  status: string | null;
  search_rank: number | null;
  number: number | null;
  espn_id: number | string | null;
  years_exp: number | null;
};

export type SlimPlayer = {
  id: string;
  first: string | null;
  last: string | null;
  full: string | null;
  pos: string;
  team: string | null;
  injury: string | null;
  status: string | null;
  searchRank: number | null;
  espnId: string | null;
  number: number | null;
  yearsExp: number | null;
};

export type SleeperTransaction = {
  transaction_id: string;
  type: string;
  status: string;
  created: number;
  roster_ids: number[] | null;
  adds: Record<string, number> | null;
  drops: Record<string, number> | null;
  metadata: { notes?: string } | null;
};

export async function getNflState() {
  return cached("nfl-state", 30_000, () => getJson<NflState>("/state/nfl"));
}

export async function getUserByUsername(username: string) {
  const key = username.trim().toLowerCase();
  return cached(`sleeper-user:${key}`, 60_000, async () => {
    const res = await fetch(`${BASE}/user/${encodeURIComponent(key)}`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Sleeper user lookup failed (${res.status})`);
    const data = (await res.json()) as SleeperUser | null;
    if (!data?.user_id) return null;
    return data;
  });
}

export async function getUserLeagues(userId: string, season: string) {
  return cached(`user-leagues:${userId}:${season}`, 30_000, () =>
    getJson<SleeperLeague[]>(`/user/${userId}/leagues/nfl/${season}`),
  );
}

export async function getLeague(leagueId: string) {
  return cached(`league:${leagueId}`, 10 * 60_000, () => getJson<SleeperLeague>(`/league/${leagueId}`));
}

export async function getUsers(leagueId: string) {
  return cached(`users:${leagueId}`, 5 * 60_000, () => getJson<SleeperUser[]>(`/league/${leagueId}/users`));
}

export async function getRosters(leagueId: string) {
  return cached(`rosters:${leagueId}`, 60_000, () => getJson<SleeperRoster[]>(`/league/${leagueId}/rosters`));
}

export async function getMatchups(leagueId: string, week: number) {
  return cached(`matchups:${leagueId}:${week}`, 8_000, () =>
    getJson<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`),
  );
}

export async function getWeekStats(season: string, week: number) {
  return cached(`stats:${season}:${week}`, 8_000, () =>
    getJson<Record<string, Record<string, number>>>(`/stats/nfl/regular/${season}/${week}`),
  );
}

export async function getSeasonStats(season: string) {
  const currentYear = new Date().getFullYear();
  const ttl = Number(season) >= currentYear ? 10 * 60_000 : 12 * 60 * 60_000;
  return cached(`season-stats:${season}`, ttl, () =>
    getJson<Record<string, Record<string, number>>>(`/stats/nfl/regular/${season}`),
  );
}

export async function getWeekProjections(season: string, week: number) {
  return cached(`proj:${season}:${week}`, 5 * 60_000, () =>
    getJson<Record<string, Record<string, number>>>(`/projections/nfl/regular/${season}/${week}`),
  );
}

export async function getTransactions(leagueId: string, week: number) {
  return cached(`tx:${leagueId}:${week}`, 30_000, () =>
    getJson<SleeperTransaction[]>(`/league/${leagueId}/transactions/${week}`),
  );
}

export async function getTrending(type: "add" | "drop") {
  return cached(`trend:${type}`, 5 * 60_000, () =>
    getJson<{ player_id: string; count: number }[]>(`/players/nfl/trending/${type}?lookback_hours=24&limit=20`),
  );
}

let playersPromise: Promise<Record<string, SlimPlayer>> | null = null;

export async function getPlayersMap(): Promise<Record<string, SlimPlayer>> {
  if (playersPromise) return playersPromise;
  playersPromise = cached("players-nfl", 12 * 60 * 60_000, async () => {
    const raw = await getJson<Record<string, SleeperPlayer>>("/players/nfl");
    const out: Record<string, SlimPlayer> = {};
    for (const [id, p] of Object.entries(raw)) {
      if (!p) continue;
      out[id] = {
        id,
        first: p.first_name,
        last: p.last_name,
        full: p.full_name,
        pos: p.position ?? (id.length <= 3 ? "DEF" : "FLX"),
        team: p.team,
        injury: p.injury_status,
        status: p.status,
        searchRank: p.search_rank,
        espnId: p.espn_id != null ? String(p.espn_id) : null,
        number: p.number,
        yearsExp: p.years_exp,
      };
    }
    return out;
  });
  return playersPromise;
}
