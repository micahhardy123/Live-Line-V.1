import { f as leagueAvatar, y as sleeperAvatar } from "./format-F8w7-jdk.mjs";
import { c as shortLeagueName } from "./leagues-Ad5L4M0D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/external-s18_Bjzc.js
var ESPN_UA = "Mozilla/5.0 (compatible; LiveLine/1.0)";
function norm(s) {
	return s.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}
function nameHit(username, ...parts) {
	const n = norm(username);
	if (n.length < 2) return false;
	const blob = norm(parts.filter(Boolean).join(" "));
	if (!blob) return false;
	return blob === n || blob.includes(n) || n.includes(blob);
}
async function lookupEspnLeague(username, leagueId, season) {
	const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mTeam&view=mSettings`;
	const res = await fetch(url, { headers: {
		Accept: "application/json",
		"User-Agent": ESPN_UA
	} });
	if (res.status === 401 || res.status === 403) throw new Error("That ESPN league is private. In ESPN, League settings → make it public, or copy a public league URL.");
	if (res.status === 404) throw new Error("No ESPN league with that ID for this season");
	if (!res.ok) throw new Error(`ESPN lookup failed (${res.status})`);
	const data = await res.json();
	const member = (data.members ?? []).find((m) => nameHit(username, m.displayName, m.firstName, m.lastName, `${m.firstName ?? ""} ${m.lastName ?? ""}`)) ?? null;
	if (!member) throw new Error("That username isn’t in this ESPN league. Check the manager name next to your team.");
	const team = (data.teams ?? []).find((t) => t.primaryOwner === member.id);
	const name = data.settings?.name || data.name || `ESPN ${leagueId}`;
	return {
		platform: "espn",
		userId: member.id,
		username,
		displayName: member.displayName || username,
		avatar: team?.logo ?? null,
		leagues: [{
			id: `espn:${leagueId}`,
			name,
			shortName: shortLeagueName(name),
			season: String(data.seasonId ?? season),
			teams: data.settings?.size ?? data.teams?.length ?? 0,
			avatarUrl: team?.logo || leagueAvatar(null)
		}]
	};
}
function yahooPick(node, key) {
	if (!node) return void 0;
	if (Array.isArray(node)) {
		for (const item of node) {
			const hit = yahooPick(item, key);
			if (hit !== void 0) return hit;
		}
		return;
	}
	if (typeof node === "object") {
		const rec = node;
		if (key in rec) return rec[key];
		for (const v of Object.values(rec)) {
			const hit = yahooPick(v, key);
			if (hit !== void 0) return hit;
		}
	}
}
function yahooTeams(node) {
	const out = [];
	const walk = (n) => {
		if (!n) return;
		if (Array.isArray(n)) {
			for (const x of n) walk(x);
			return;
		}
		if (typeof n !== "object") return;
		const rec = n;
		if (Array.isArray(rec.team)) {
			let name = "";
			let manager = "";
			let teamKey = "";
			let logo = null;
			const flatten = (x) => {
				if (!x) return;
				if (Array.isArray(x)) {
					x.forEach(flatten);
					return;
				}
				if (typeof x !== "object") return;
				const o = x;
				if (typeof o.name === "string") name = o.name;
				if (typeof o.team_key === "string") teamKey = o.team_key;
				if (o.managers) flatten(o.managers);
				if (typeof o.nickname === "string" && !manager) manager = o.nickname;
				if (o.manager) flatten(o.manager);
				if (o.team_logos) flatten(o.team_logos);
				if (typeof o.url === "string" && /yimg|yahoo/.test(o.url)) logo = o.url;
				Object.values(o).forEach(flatten);
			};
			flatten(rec.team);
			if (teamKey || name) out.push({
				name,
				manager,
				teamKey,
				logo
			});
			return;
		}
		Object.values(rec).forEach(walk);
	};
	walk(node);
	return out;
}
async function lookupYahooLeague(username, leagueId, gameKey) {
	const url = `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/league/${gameKey}.l.${leagueId}/standings?format=json`;
	const res = await fetch(url, { headers: { Accept: "application/json" } });
	if (res.status === 401 || res.status === 403) throw new Error("That Yahoo league is private. In Yahoo, make the league public or paste a public league URL.");
	if (!res.ok) throw new Error(`Yahoo lookup failed (${res.status})`);
	const json = await res.json();
	const leagueName = String(yahooPick(json, "name") ?? `Yahoo ${leagueId}`);
	const season = String(yahooPick(json, "season") ?? "");
	const numTeams = Number(yahooPick(json, "num_teams") ?? 0);
	const teams = yahooTeams(json);
	const mine = teams.find((t) => nameHit(username, t.manager, t.name)) ?? null;
	if (!mine) throw new Error("That username isn’t in this Yahoo league. Use your manager name from the Yahoo app.");
	return {
		platform: "yahoo",
		userId: mine.teamKey || username,
		username,
		displayName: mine.manager || mine.name || username,
		avatar: mine.logo,
		leagues: [{
			id: `yahoo:${leagueId}`,
			name: leagueName,
			shortName: shortLeagueName(leagueName),
			season: season || String((/* @__PURE__ */ new Date()).getFullYear()),
			teams: numTeams || teams.length,
			avatarUrl: mine.logo || sleeperAvatar(null)
		}]
	};
}
//#endregion
export { lookupEspnLeague, lookupYahooLeague };
