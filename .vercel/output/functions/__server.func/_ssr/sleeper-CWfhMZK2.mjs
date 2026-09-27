import { t as cached } from "./cache-BqkOvyUe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sleeper-CWfhMZK2.js
var BASE = "https://api.sleeper.app/v1";
async function getJson(path) {
	const res = await fetch(`${BASE}${path}`, { headers: { Accept: "application/json" } });
	if (!res.ok) throw new Error(`Sleeper ${path} failed (${res.status})`);
	return await res.json();
}
async function getNflState() {
	return cached("nfl-state", 3e4, () => getJson("/state/nfl"));
}
async function getUserByUsername(username) {
	const key = username.trim().toLowerCase();
	return cached(`sleeper-user:${key}`, 6e4, async () => {
		const res = await fetch(`${BASE}/user/${encodeURIComponent(key)}`, { headers: { Accept: "application/json" } });
		if (res.status === 404) return null;
		if (!res.ok) throw new Error(`Sleeper user lookup failed (${res.status})`);
		const data = await res.json();
		if (!data?.user_id) return null;
		return data;
	});
}
async function getUserLeagues(userId, season) {
	return cached(`user-leagues:${userId}:${season}`, 3e4, () => getJson(`/user/${userId}/leagues/nfl/${season}`));
}
async function getLeague(leagueId) {
	return cached(`league:${leagueId}`, 6e5, () => getJson(`/league/${leagueId}`));
}
async function getUsers(leagueId) {
	return cached(`users:${leagueId}`, 3e5, () => getJson(`/league/${leagueId}/users`));
}
async function getRosters(leagueId) {
	return cached(`rosters:${leagueId}`, 6e4, () => getJson(`/league/${leagueId}/rosters`));
}
async function getMatchups(leagueId, week) {
	return cached(`matchups:${leagueId}:${week}`, 8e3, () => getJson(`/league/${leagueId}/matchups/${week}`));
}
async function getWeekStats(season, week) {
	return cached(`stats:${season}:${week}`, 8e3, () => getJson(`/stats/nfl/regular/${season}/${week}`));
}
async function getSeasonStats(season) {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const ttl = Number(season) >= currentYear ? 6e5 : 432e5;
	return cached(`season-stats:${season}`, ttl, () => getJson(`/stats/nfl/regular/${season}`));
}
async function getWeekProjections(season, week) {
	return cached(`proj:${season}:${week}`, 3e5, () => getJson(`/projections/nfl/regular/${season}/${week}`));
}
async function getTransactions(leagueId, week) {
	return cached(`tx:${leagueId}:${week}`, 3e4, () => getJson(`/league/${leagueId}/transactions/${week}`));
}
async function getTrending(type) {
	return cached(`trend:${type}`, 3e5, () => getJson(`/players/nfl/trending/${type}?lookback_hours=24&limit=20`));
}
var playersPromise = null;
async function getPlayersMap() {
	if (playersPromise) return playersPromise;
	playersPromise = cached("players-nfl", 432e5, async () => {
		const raw = await getJson("/players/nfl");
		const out = {};
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
				yearsExp: p.years_exp
			};
		}
		return out;
	});
	return playersPromise;
}
//#endregion
export { getLeague, getMatchups, getNflState, getPlayersMap, getRosters, getSeasonStats, getTransactions, getTrending, getUserByUsername, getUserLeagues, getUsers, getWeekProjections, getWeekStats };
