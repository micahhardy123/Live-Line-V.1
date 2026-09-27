import { n as clamp } from "./format-F8w7-jdk.mjs";
import { t as cached } from "./cache-BqkOvyUe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/espn-DETuPW0H.js
var SCOREBOARD_CDN = "https://cdn.espn.com/core/nfl/scoreboard?xhr=1";
var SCOREBOARD_SITE = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
var SUMMARY = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary";
var NEWS = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news";
var ATHLETE = "https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes";
var SLEEPER_TO_ESPN = {
	WAS: "WSH",
	JAC: "JAX"
};
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function espnAbbr(sleeperTeam) {
	if (!sleeperTeam) return null;
	return SLEEPER_TO_ESPN[sleeperTeam] ?? sleeperTeam;
}
var scoreboardCache = /* @__PURE__ */ new Map();
var scoreboardInflight = /* @__PURE__ */ new Map();
function gameProgress(period, clockSeconds, state) {
	if (state === "post") return 1;
	if (state !== "in") return 0;
	const elapsed = (Math.max(period, 1) - 1) * 15 * 60 + (900 - Math.max(clockSeconds, 0));
	return clamp(elapsed / 3600, .03, .97);
}
function mapState(name, completed, extra) {
	const blob = `${name ?? ""} ${extra?.state ?? ""} ${extra?.shortDetail ?? ""} ${extra?.detail ?? ""}`.toLowerCase();
	if (completed || extra?.state === "post" || /\bfinal\b/.test(blob)) return "post";
	if (name === "STATUS_IN_PROGRESS" || name === "STATUS_HALFTIME" || name === "STATUS_END_PERIOD" || extra?.state === "in") return "in";
	return "pre";
}
function parseEvents(events) {
	const games = [];
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
		let possession = null;
		if (possId && homeId) possession = possId === homeId ? "home" : "away";
		const broadcast = (typeof comp.broadcast === "string" ? comp.broadcast : null) || comp.broadcasts?.flatMap((b) => b.names ?? []).find(Boolean) || null;
		const downDistance = sit?.downDistanceText || sit?.possessionText || (sit && sit.down != null && sit.down > 0 && sit.distance != null ? `${sit.down === 1 ? "1st" : sit.down === 2 ? "2nd" : sit.down === 3 ? "3rd" : "4th"} & ${sit.distance}` : null);
		games.push({
			eventId: event.id,
			state,
			start: event.date ?? null,
			home: home?.team?.abbreviation ?? "HOME",
			away: away?.team?.abbreviation ?? "AWAY",
			homeScore: String(home?.score ?? "0"),
			awayScore: String(away?.score ?? "0"),
			clock: state === "in" ? status?.type?.shortDetail ?? status?.displayClock ?? null : null,
			period: state === "in" && status?.period ? `${status.period}` : null,
			detail: status?.type?.detail ?? status?.type?.shortDetail ?? null,
			progress: gameProgress(status?.period ?? 1, status?.clock ?? 900, state),
			downDistance,
			playText: skipPlay ? null : lastText,
			possession,
			broadcast
		});
	}
	return games;
}
async function fetchJson(url) {
	const res = await fetch(url, { headers: {
		Accept: "application/json",
		"User-Agent": UA
	} });
	if (!res.ok) throw new Error(`ESPN ${url} ${res.status}`);
	return res.json();
}
async function getEspnGames(week) {
	const key = week && week >= 1 ? String(week) : "now";
	const hit = scoreboardCache.get(key);
	if (hit && Date.now() - hit.at < 8e3) return hit.value;
	const pending = scoreboardInflight.get(key);
	if (pending) return pending;
	const p = (async () => {
		let games = [];
		const siteUrl = week && week >= 1 ? `${SCOREBOARD_SITE}?week=${week}&seasontype=2` : SCOREBOARD_SITE;
		try {
			if (!week) {
				const data = await fetchJson(SCOREBOARD_CDN);
				games = parseEvents(data.content?.sbData?.events ?? data.events);
			}
		} catch {
			games = [];
		}
		if (!games.length) games = parseEvents((await fetchJson(siteUrl)).events);
		scoreboardCache.set(key, {
			at: Date.now(),
			value: games
		});
		scoreboardInflight.delete(key);
		return games;
	})().catch((err) => {
		scoreboardInflight.delete(key);
		throw err;
	});
	scoreboardInflight.set(key, p);
	return p;
}
function gameForTeam(games, sleeperTeam) {
	const abbr = espnAbbr(sleeperTeam);
	if (!abbr) return null;
	return games.find((g) => g.home === abbr || g.away === abbr) ?? null;
}
function tickerFromGames(games, involvedTeams) {
	const live = games.filter((g) => g.state === "in");
	if (!live.length) return null;
	const g = [...live].sort((a, b) => {
		const aHit = involvedTeams.has(a.home) || involvedTeams.has(a.away) ? 1 : 0;
		return (involvedTeams.has(b.home) || involvedTeams.has(b.away) ? 1 : 0) - aHit;
	})[0];
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
		fantasyDelta: null
	};
}
function opponentOf(game, sleeperTeam) {
	const abbr = espnAbbr(sleeperTeam);
	if (!abbr) return {
		opponent: null,
		homeAway: null
	};
	if (game.home === abbr) return {
		opponent: game.away,
		homeAway: "home"
	};
	if (game.away === abbr) return {
		opponent: game.home,
		homeAway: "away"
	};
	return {
		opponent: null,
		homeAway: null
	};
}
async function getEspnSummaryPlays(eventId) {
	return cached(`espn-plays:${eventId}`, 12e3, async () => {
		const data = await fetchJson(`${SUMMARY}?event=${eventId}`);
		const drives = [...data.drives?.previous ?? [], ...data.drives?.current ? [data.drives.current] : []];
		const plays = [];
		for (const d of drives) for (const p of d.plays ?? []) {
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
				isInt
			});
		}
		return plays;
	});
}
async function getEspnNews() {
	return cached("espn-news", 9e4, async () => {
		return ((await fetchJson(`${NEWS}?limit=50`)).articles ?? []).filter((a) => a.headline).map((a) => ({
			id: String(a.id ?? a.headline),
			headline: a.headline ?? "",
			description: a.description ?? "",
			published: a.published ?? "",
			image: a.images?.[0]?.url || a.images?.[0]?.href || null,
			url: a.links?.web?.href ?? null,
			byline: a.byline ?? null,
			teams: (a.categories ?? []).filter((c) => c.type === "team").map((c) => c.team?.abbreviation || c.description || "").filter(Boolean).slice(0, 3)
		}));
	});
}
function decodeEntities(s) {
	return s.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/"/gi, "\"").replace(/&#39;|'/gi, "'").replace(/&rsquo;|&lsquo;/gi, "'").replace(/&rdquo;|&ldquo;/gi, "\"").replace(/&mdash;|&#8212;/gi, "—").replace(/&ndash;|&#8211;/gi, "–").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&[a-z]+;/gi, " ");
}
function htmlToParagraphs(html) {
	return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/h[1-6]>/gi, "\n").split(/<\/p>/i).map((chunk) => decodeEntities(chunk.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()).filter((p) => p.length > 1);
}
async function getEspnArticle(id) {
	const safe = id.replace(/[^\d]/g, "");
	if (!safe) throw new Error("Missing article");
	return cached(`espn-article:${safe}`, 3e5, async () => {
		const h = (await fetchJson(`https://content.core.api.espn.com/v1/sports/news/${safe}`)).headlines?.[0];
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
			teams: (h.categories ?? []).filter((c) => c.type === "team").map((c) => c.team?.abbreviation || c.description || "").filter(Boolean).slice(0, 3),
			paragraphs: paragraphs.length ? paragraphs : h.description ? [h.description] : []
		};
	});
}
function zipBag(labels, values, prefix) {
	const bag = {};
	if (!labels || !values) return bag;
	for (let i = 0; i < labels.length; i++) {
		const label = labels[i];
		const key = prefix ? `${prefix}${label}` : label;
		bag[key] = values[i] ?? "—";
		if (bag[label] == null) bag[label] = values[i] ?? "—";
	}
	return bag;
}
async function getEspnAthleteSeasonBags(espnId) {
	return cached(`espn-stats:${espnId}`, 18e5, async () => {
		const data = await fetchJson(`${ATHLETE}/${espnId}/stats`);
		const byYear = /* @__PURE__ */ new Map();
		const career = {};
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
		return {
			byYear,
			career
		};
	});
}
async function getEspnGamelog(espnId) {
	return cached(`espn-gamelog:${espnId}`, 6e4, async () => {
		const data = await fetchJson(`${ATHLETE}/${espnId}/gamelog`);
		const names = data.names ?? [];
		const eventsMeta = data.events ?? {};
		const out = [];
		for (const st of data.seasonTypes ?? []) for (const cat of st.categories ?? []) for (const ev of cat.events ?? []) {
			const id = ev.eventId ?? "";
			const meta = eventsMeta[id];
			const stats = {};
			(ev.stats ?? []).forEach((v, i) => {
				if (names[i]) stats[names[i]] = v;
			});
			out.push({
				eventId: id,
				week: meta?.week ?? 0,
				gameDate: meta?.gameDate ?? null,
				atVs: meta?.atVs ?? "vs",
				opponent: meta?.opponent?.abbreviation ?? "—",
				score: meta?.score ?? null,
				result: meta?.gameResult ?? null,
				stats
			});
		}
		out.sort((a, b) => b.week - a.week);
		return out;
	});
}
//#endregion
export { espnAbbr, gameForTeam, getEspnArticle, getEspnAthleteSeasonBags, getEspnGamelog, getEspnGames, getEspnNews, getEspnSummaryPlays, opponentOf, tickerFromGames };
