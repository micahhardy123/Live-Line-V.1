import { n as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/format-F8w7-jdk.js
var format_F8w7_jdk_exports = /* @__PURE__ */ __exportAll$1({
	C: () => teamLogo,
	E: () => winProbability,
	S: () => summarizeYetToPlay,
	T: () => weekdayName,
	_: () => scoringLabel,
	a: () => formatClockLabel,
	b: () => sleeperStatCells,
	c: () => formatPts,
	d: () => injuryAbbrev,
	f: () => leagueAvatar,
	g: () => recordText,
	h: () => playerHeadshot,
	i: () => fantasyForPlay,
	l: () => formatStatLine,
	m: () => playRole,
	n: () => clamp,
	o: () => formatGameDate,
	p: () => mentionsPlayer,
	r: () => emptyPlayer,
	s: () => formatNewsTime,
	t: () => cell,
	u: () => format_exports,
	v: () => shortName,
	w: () => vsLabel,
	x: () => slotLabel,
	y: () => sleeperAvatar
});
var format_exports = /* @__PURE__ */ __exportAll({
	ET: () => ET,
	cell: () => cell,
	clamp: () => clamp,
	emptyPlayer: () => emptyPlayer,
	fantasyForPlay: () => fantasyForPlay,
	fmtNum: () => fmtNum,
	formatClockLabel: () => formatClockLabel,
	formatGameDate: () => formatGameDate,
	formatNewsTime: () => formatNewsTime,
	formatPts: () => formatPts,
	formatStatLine: () => formatStatLine,
	injuryAbbrev: () => injuryAbbrev,
	leagueAvatar: () => leagueAvatar,
	mentionsPlayer: () => mentionsPlayer,
	playRole: () => playRole,
	playerHeadshot: () => playerHeadshot,
	recordText: () => recordText,
	scoringLabel: () => scoringLabel,
	shortName: () => shortName,
	sleeperAvatar: () => sleeperAvatar,
	sleeperStatCells: () => sleeperStatCells,
	slotLabel: () => slotLabel,
	summarizeYetToPlay: () => summarizeYetToPlay,
	teamLogo: () => teamLogo,
	vsLabel: () => vsLabel,
	weekdayName: () => weekdayName,
	winProbability: () => winProbability
});
var ET = "America/New_York";
function sleeperAvatar(avatar, custom) {
	if (custom) return custom;
	if (avatar) return `https://sleepercdn.com/avatars/thumbs/${avatar}`;
	return "";
}
function leagueAvatar(avatar) {
	if (!avatar) return "";
	if (avatar.startsWith("http")) return avatar;
	return `https://sleepercdn.com/avatars/${avatar}`;
}
function playerHeadshot(id, pos, team) {
	if (pos === "DEF" && team) return `https://sleepercdn.com/images/team_logos/nfl/${team.toLowerCase()}.png`;
	return `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;
}
function teamLogo(team) {
	if (!team) return "";
	return `https://sleepercdn.com/images/team_logos/nfl/${team.toLowerCase()}.png`;
}
function shortName(first, last, full, pos) {
	if (pos === "DEF") return last || first || full || "DST";
	if (first && last) return `${first[0]}. ${last}`;
	if (full) {
		const parts = full.split(" ");
		if (parts.length >= 2) return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
		return full;
	}
	return last || first || "Player";
}
function recordText(wins, losses, ties) {
	return ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}
function formatPts(n, digits = 2) {
	if (n == null) return "—";
	return n.toFixed(digits);
}
function formatClockLabel(iso, state, clock) {
	if (state === "bye") return "BYE";
	if (state === "in") return clock ?? "LIVE";
	if (state === "post") return "Final";
	if (!iso) return "TBD";
	const d = new Date(iso);
	return `${new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		timeZone: ET
	}).format(d)} ${new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: ET
	}).format(d)}`;
}
function vsLabel(opponent, homeAway) {
	if (!opponent) return "";
	return homeAway === "away" ? `@ ${opponent}` : `vs ${opponent}`;
}
function injuryAbbrev(status) {
	if (!status) return null;
	return {
		Questionable: "QUES",
		Doubtful: "D",
		Out: "OUT",
		IR: "IR",
		PUP: "PUP",
		Suspended: "SUS",
		NA: "NA",
		"COVID-19": "COV"
	}[status] ?? status.slice(0, 4).toUpperCase();
}
function formatStatLine(stats, pos) {
	if (!stats) return null;
	const n = (k) => stats[k] ?? 0;
	const parts = [];
	if (pos === "QB") {
		if (n("pass_yd")) parts.push(`${Math.round(n("pass_yd"))} YD`);
		if (n("pass_td")) parts.push(`${n("pass_td")} TD`);
		if (n("pass_int")) parts.push(`${n("pass_int")} INT`);
		if (n("rush_yd")) parts.push(`${Math.round(n("rush_yd"))} RUSH`);
	} else if (pos === "K") {
		const fgm = n("fgm");
		const fga = n("fga") || fgm;
		if (fgm || fga) parts.push(`${fgm}/${fga} FG`);
		if (n("xpm")) parts.push(`${n("xpm")} XP`);
	} else if (pos === "DEF") {
		if (n("sack")) parts.push(`${n("sack")} SACK`);
		if (n("int")) parts.push(`${n("int")} INT`);
		if (stats.pts_allow != null) parts.push(`${stats.pts_allow} PA`);
		if (n("def_td")) parts.push(`${n("def_td")} TD`);
	} else {
		if (n("rush_att")) parts.push(`${n("rush_att")} CAR`);
		if (n("rush_yd")) parts.push(`${Math.round(n("rush_yd"))} YD`);
		if (n("rec")) parts.push(`${n("rec")} REC`);
		if (n("rec_yd") && n("rush_att")) parts.push(`${Math.round(n("rec_yd"))} REC YD`);
		else if (n("rec_yd")) parts.push(`${Math.round(n("rec_yd"))} YD`);
		const tds = n("rec_td") + n("rush_td");
		if (tds) parts.push(`${tds} TD`);
	}
	return parts.length ? parts.join(", ") : null;
}
function summarizeYetToPlay(players) {
	const waiting = players.filter((p) => p.game.state === "pre" || p.game.state === "bye");
	const counts = {};
	for (const p of waiting) {
		const key = p.pos === "DEF" ? "DEF" : p.pos;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	const bits = [
		"QB",
		"RB",
		"WR",
		"TE",
		"K",
		"DEF"
	].filter((k) => counts[k]).map((k) => (counts[k] ?? 0) > 1 ? `${counts[k]} ${k}` : k);
	return {
		count: waiting.length,
		summary: bits.join(", ")
	};
}
function slotLabel(slot) {
	if (slot === "FLEX") return "WRT";
	return slot;
}
var erf = (x) => {
	const sign = x < 0 ? -1 : 1;
	const ax = Math.abs(x);
	const a1 = .254829592;
	const a2 = -.284496736;
	const a3 = 1.421413741;
	const a4 = -1.453152027;
	const a5 = 1.061405429;
	const t = 1 / (1 + .3275911 * ax);
	return sign * (1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax));
};
function winProbability(leftProj, rightProj, leftRem, rightRem) {
	const rem = leftRem + rightRem;
	if (rem < .4) {
		if (leftProj === rightProj) return .5;
		return leftProj > rightProj ? .99 : .01;
	}
	const sigma = Math.max(4, Math.sqrt(Math.max(rem, 1)) * 2.15);
	return .5 * (1 + erf((leftProj - rightProj) / sigma / Math.SQRT2));
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function emptyPlayer(slot) {
	return {
		id: `empty-${slot}`,
		name: "Empty",
		shortName: "Empty",
		firstName: "",
		lastName: "",
		pos: slot,
		slot,
		team: null,
		teamRank: null,
		injury: null,
		headshot: "",
		espnId: null,
		number: null,
		points: null,
		projection: 0,
		remaining: 0,
		projectedLive: 0,
		statLine: null,
		game: {
			state: "pre",
			start: null,
			startLabel: "",
			opponent: null,
			homeAway: null,
			progress: 0,
			clock: null,
			period: null,
			score: null,
			eventId: null
		}
	};
}
function scoringLabel(rec) {
	if (rec >= .9) return "PPR";
	if (rec >= .4) return "Half PPR";
	return "Standard";
}
function weekdayName(n) {
	return [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	][n] ?? "Wednesday";
}
function formatNewsTime(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		hour: "numeric",
		minute: "2-digit",
		timeZone: ET
	}).format(d);
}
function formatGameDate(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return `${new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		timeZone: ET
	}).format(d).toUpperCase()} ${new Intl.DateTimeFormat("en-US", {
		month: "2-digit",
		day: "2-digit",
		timeZone: ET
	}).format(d)}`;
}
function fmtNum(n, digits = 0) {
	if (n == null || Number.isNaN(n)) return "—";
	if (digits === 0) return Math.round(n).toLocaleString("en-US");
	return n.toFixed(digits);
}
function cell(key, label, value) {
	return {
		key,
		label,
		value: value == null || value === "" ? "—" : String(value)
	};
}
function mentionsPlayer(text, first, last, full) {
	if (!text) return false;
	const hay = text.replace(/\./g, ". ").replace(/\s+/g, " ");
	const lastRe = last && last.length >= 3 ? new RegExp(`\\b${escapeRe(last)}\\b`, "i") : null;
	if (lastRe && lastRe.test(hay)) return true;
	if (first && last) {
		const compact = `${first[0]}.?\\s*${escapeRe(last)}`;
		if (new RegExp(compact, "i").test(hay)) return true;
	}
	if (full && full.length > 4 && hay.toLowerCase().includes(full.toLowerCase())) return true;
	return false;
}
function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function playRole(text, type, first, last) {
	const t = `${type} ${text}`.toLowerCase();
	if (/field goal|extra point|xp\b|fg\b/.test(t)) return "kick";
	const isReceiver = new RegExp(`pass(?:ed)? to\\s+[A-Z]?\\.?\\s*${escapeRe(last)}`, "i").test(text);
	if (isReceiver || /reception|receiving/.test(t) && mentionsPlayer(text, first, last, last)) return "rec";
	if (/pass|sack|interception/.test(t) && !isReceiver) return "pass";
	if (/rush|run /.test(t)) return "rush";
	return "other";
}
function fantasyForPlay(role, yards, isTd, isInt, scoring) {
	const s = (k, d = 0) => scoring[k] ?? d;
	if (role === "rush") return yards * s("rush_yd", .1) + (isTd ? s("rush_td", 6) : 0);
	if (role === "pass") return yards * s("pass_yd", .04) + (isTd ? s("pass_td", 4) : 0) + (isInt ? s("pass_int", -1) : 0);
	if (role === "rec") return s("rec", 1) + yards * s("rec_yd", .1) + (isTd ? s("rec_td", 6) : 0);
	if (role === "kick") {
		if (isTd) return 0;
		if (/xp|extra point/i.test("")) return s("xpm", 1);
		return s("fgm_30_39", 3);
	}
	return 0;
}
function sleeperStatCells(stats, pos, extra = false) {
	if (!stats) return [];
	const n = (k) => stats[k];
	const rows = [];
	const add = (key, label, val, digits = 0) => {
		if (val == null) return;
		rows.push(cell(key, label, digits ? val.toFixed(digits) : fmtNum(val)));
	};
	if (pos === "QB") {
		add("pass_cmp", "CMP", n("pass_cmp"));
		add("pass_att", "ATT", n("pass_att"));
		add("pass_yd", "YDS", n("pass_yd"));
		add("pass_td", "TD", n("pass_td"));
		add("pass_int", "INT", n("pass_int"));
		add("rush_att", "CAR", n("rush_att"));
		add("rush_yd", "YDS", n("rush_yd"));
		add("rush_td", "TD", n("rush_td"));
		if (extra) {
			add("cmp_pct", "CMP%", n("cmp_pct"), 1);
			add("pass_rtg", "RTG", n("pass_rtg"), 1);
			add("pass_sack", "SACK", n("pass_sack"));
			add("rush_lng", "LNG", n("rush_lng"));
		}
	} else if (pos === "K") {
		add("fgm", "FG", n("fgm"));
		add("fga", "FGA", n("fga"));
		add("xpm", "XP", n("xpm"));
		add("fgm_lng", "LNG", n("fgm_lng") ?? n("fg_lng"));
	} else if (pos === "DEF") {
		add("sack", "SACK", n("sack"));
		add("int", "INT", n("int"));
		add("fum_rec", "FR", n("fum_rec"));
		add("ff", "FF", n("ff"));
		add("def_td", "TD", n("def_td"));
		add("pts_allow", "PA", n("pts_allow"));
	} else {
		add("rush_att", "CAR", n("rush_att"));
		add("rush_yd", "YDS", n("rush_yd"));
		add("rush_td", "TD", n("rush_td"));
		add("rec", "REC", n("rec"));
		add("rec_yd", "YDS", n("rec_yd"));
		add("rec_td", "TD", n("rec_td"));
		if (extra) {
			add("rec_tgt", "TGT", n("rec_tgt"));
			add("rush_lng", "LNG", n("rush_lng"));
			add("rec_lng", "REC LNG", n("rec_lng"));
			add("fum_lost", "FUM", n("fum_lost"));
		}
	}
	return rows;
}
//#endregion
export { teamLogo as C, __exportAll as D, winProbability as E, summarizeYetToPlay as S, weekdayName as T, scoringLabel as _, formatClockLabel as a, sleeperStatCells as b, formatPts as c, injuryAbbrev as d, leagueAvatar as f, recordText as g, playerHeadshot as h, fantasyForPlay as i, formatStatLine as l, playRole as m, clamp as n, formatGameDate as o, mentionsPlayer as p, emptyPlayer as r, formatNewsTime as s, cell as t, format_F8w7_jdk_exports as u, shortName as v, vsLabel as w, slotLabel as x, sleeperAvatar as y };
