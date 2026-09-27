import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { h as playerHeadshot, v as shortName } from "./format-F8w7-jdk.mjs";
import { a as parseLeagueRef, l as sleeperId, t as accountUsername, u as sleeperUsername } from "./leagues-Ad5L4M0D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Bbw6OYID.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupSleeperAccount_createServerFn_handler = createServerRpc({
	id: "c906eaaa6a3f75c5437e3b7040d9e66188c967be9caab93cd38fceb932d852fa",
	name: "lookupSleeperAccount",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => lookupSleeperAccount.__executeServer(opts));
var lookupSleeperAccount = createServerFn({ method: "POST" }).validator((d) => {
	const platform = d?.platform === "espn" || d?.platform === "yahoo" ? d.platform : "sleeper";
	return {
		platform,
		username: platform === "sleeper" ? sleeperUsername(String(d?.username ?? "")) : accountUsername(String(d?.username ?? "")),
		leagueRef: platform === "sleeper" ? "" : parseLeagueRef(platform, String(d?.leagueRef ?? ""))
	};
}).handler(lookupSleeperAccount_createServerFn_handler, async ({ data }) => {
	const { assembleAccount } = await import("./assemble-Dm-7qmTm.mjs");
	return assembleAccount(data.platform, data.username, data.leagueRef);
});
var fetchLiveMatchup_createServerFn_handler = createServerRpc({
	id: "f48a9cab7ae8790256f02c4af87b9e13218348c249a07cf53138cdd69ef8f11f",
	name: "fetchLiveMatchup",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchLiveMatchup.__executeServer(opts));
var fetchLiveMatchup = createServerFn({ method: "POST" }).validator((d) => {
	const userId = sleeperId(String(d?.userId ?? ""));
	const leagueId = sleeperId(String(d?.leagueId ?? ""));
	const week = d?.week;
	const rawId = d?.matchupId;
	const matchupId = rawId != null && Number.isFinite(rawId) && rawId >= 1 ? Math.trunc(rawId) : void 0;
	if (week == null) return {
		userId,
		leagueId,
		matchupId
	};
	if (!Number.isFinite(week) || week < 1 || week > 18) throw new Error("Week must be between 1 and 18");
	return {
		week: Math.trunc(week),
		userId,
		leagueId,
		matchupId
	};
}).handler(fetchLiveMatchup_createServerFn_handler, async ({ data }) => {
	const { assembleMatchup } = await import("./assemble-Dm-7qmTm.mjs");
	return assembleMatchup(data.week, data.leagueId, data.matchupId, data.userId);
});
var fetchLeaguePicker_createServerFn_handler = createServerRpc({
	id: "32ef36d4815b2a0f1ddff60e00ab20102c7a826eea86b38fc58fa15d1ca5ce34",
	name: "fetchLeaguePicker",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchLeaguePicker.__executeServer(opts));
var fetchLeaguePicker = createServerFn({ method: "POST" }).validator((d) => {
	const userId = sleeperId(String(d?.userId ?? ""));
	const leagueIds = (d?.leagueIds ?? []).map((id) => sleeperId(String(id))).slice(0, 24);
	if (!leagueIds.length) throw new Error("Pick at least one league");
	return {
		userId,
		leagueIds
	};
}).handler(fetchLeaguePicker_createServerFn_handler, async ({ data }) => {
	const { assembleLeaguePicker } = await import("./assemble-Dm-7qmTm.mjs");
	return assembleLeaguePicker(data.userId, data.leagueIds);
});
var fetchPlayerDetail_createServerFn_handler = createServerRpc({
	id: "47b2057d0b9c38b73c391f0e3ac146cf2196f7f35a3bbf1e4e31dd9adeec5136",
	name: "fetchPlayerDetail",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchPlayerDetail.__executeServer(opts));
var fetchPlayerDetail = createServerFn({ method: "POST" }).validator((d) => {
	const playerId = String(d?.playerId ?? "").trim();
	if (!playerId) throw new Error("Missing player");
	const week = d?.week;
	const leagueId = sleeperId(String(d?.league ?? d?.leagueId ?? ""));
	if (week == null) return {
		playerId,
		leagueId
	};
	if (!Number.isFinite(week) || week < 1 || week > 18) throw new Error("Week must be between 1 and 18");
	return {
		playerId,
		week: Math.trunc(week),
		leagueId
	};
}).handler(fetchPlayerDetail_createServerFn_handler, async ({ data }) => {
	const { assemblePlayerDetail } = await import("./player-detail-Df_UiqtM.mjs");
	return assemblePlayerDetail(data.playerId, data.week, data.leagueId);
});
var fetchTrending_createServerFn_handler = createServerRpc({
	id: "33d09bc6e9874f9c73ead42450eaeabf8b1892de0ded4f341051f4322dfe5e80",
	name: "fetchTrending",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchTrending.__executeServer(opts));
var fetchTrending = createServerFn({ method: "POST" }).handler(fetchTrending_createServerFn_handler, async () => {
	const { getTrending, getPlayersMap } = await import("./sleeper-CWfhMZK2.mjs");
	const [adds, drops, players] = await Promise.all([
		getTrending("add").catch(() => []),
		getTrending("drop").catch(() => []),
		getPlayersMap()
	]);
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (row, kind) => {
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
			espnId: p?.espnId ?? null
		});
	};
	for (const a of adds.slice(0, 10)) push(a, "add");
	for (const d of drops.slice(0, 6)) push(d, "drop");
	return out;
});
var fetchFreeAgents_createServerFn_handler = createServerRpc({
	id: "656db99a81f2893d88f9b90e75cec71bfd1ab11ff54ac76486e3799ef66a6107",
	name: "fetchFreeAgents",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchFreeAgents.__executeServer(opts));
var fetchFreeAgents = createServerFn({ method: "POST" }).validator((d) => ({
	leagueId: sleeperId(String(d?.league ?? "")),
	q: String(d?.q ?? "").slice(0, 40),
	pos: String(d?.pos ?? "ALL").slice(0, 8)
})).handler(fetchFreeAgents_createServerFn_handler, async ({ data }) => {
	const { assembleFreeAgents } = await import("./assemble-Dm-7qmTm.mjs");
	return assembleFreeAgents(data.leagueId, data.q, data.pos);
});
var fetchEspnFeed_createServerFn_handler = createServerRpc({
	id: "663cdd6d9f926498f4edae131b629f568a9ccf1ad37085d47756f70e68d6795a",
	name: "fetchEspnFeed",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchEspnFeed.__executeServer(opts));
var fetchEspnFeed = createServerFn({ method: "POST" }).handler(fetchEspnFeed_createServerFn_handler, async () => {
	const { getEspnNews } = await import("./espn-DETuPW0H.mjs");
	const { formatNewsTime } = await import("./format-F8w7-jdk.mjs").then((n) => n.u).then((n) => n.u);
	return (await getEspnNews()).slice(0, 40).map((a) => ({
		id: a.id,
		headline: a.headline,
		description: a.description,
		published: a.published,
		publishedLabel: formatNewsTime(a.published),
		image: a.image,
		url: a.url,
		byline: a.byline,
		teams: a.teams
	}));
});
var fetchEspnArticle_createServerFn_handler = createServerRpc({
	id: "d76da8b96e9798519c59471595ea49b41a3822adf4110f885577e8038e48b922",
	name: "fetchEspnArticle",
	filename: "src/lib/fantasy/api.ts"
}, (opts) => fetchEspnArticle.__executeServer(opts));
var fetchEspnArticle = createServerFn({ method: "POST" }).validator((d) => {
	const id = String(d?.id ?? "").replace(/[^\d]/g, "").slice(0, 16);
	if (!id) throw new Error("Missing article");
	return { id };
}).handler(fetchEspnArticle_createServerFn_handler, async ({ data }) => {
	const { getEspnArticle } = await import("./espn-DETuPW0H.mjs");
	const { formatNewsTime } = await import("./format-F8w7-jdk.mjs").then((n) => n.u).then((n) => n.u);
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
		paragraphs: a.paragraphs
	};
});
//#endregion
export { fetchEspnArticle_createServerFn_handler, fetchEspnFeed_createServerFn_handler, fetchFreeAgents_createServerFn_handler, fetchLeaguePicker_createServerFn_handler, fetchLiveMatchup_createServerFn_handler, fetchPlayerDetail_createServerFn_handler, fetchTrending_createServerFn_handler, lookupSleeperAccount_createServerFn_handler };
