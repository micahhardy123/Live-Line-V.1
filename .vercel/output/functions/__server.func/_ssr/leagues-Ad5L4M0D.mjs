import { n as __exportAll } from "../_runtime.mjs";
import { D as __exportAll$1 } from "./format-F8w7-jdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leagues-Ad5L4M0D.js
var leagues_Ad5L4M0D_exports = /* @__PURE__ */ __exportAll({
	a: () => parseLeagueRef,
	c: () => shortLeagueName,
	i: () => loadProfile,
	l: () => sleeperId,
	n: () => clearProfile,
	o: () => saveProfile,
	r: () => leagues_exports,
	s: () => setActiveLeague,
	t: () => accountUsername,
	u: () => sleeperUsername
});
var leagues_exports = /* @__PURE__ */ __exportAll$1({
	PROFILE_KEY: () => PROFILE_KEY,
	STORAGE_KEY: () => STORAGE_KEY,
	accountUsername: () => accountUsername,
	clearProfile: () => clearProfile,
	loadProfile: () => loadProfile,
	parseLeagueRef: () => parseLeagueRef,
	saveProfile: () => saveProfile,
	setActiveLeague: () => setActiveLeague,
	shortLeagueName: () => shortLeagueName,
	sleeperId: () => sleeperId,
	sleeperUsername: () => sleeperUsername
});
var PROFILE_KEY = "liveline-profile-v2";
var STORAGE_KEY = "liveline-league";
function accountUsername(raw) {
	const t = raw.trim().slice(0, 40);
	if (t.length < 2) throw new Error("Type your username — we don’t fill it in");
	return t;
}
function sleeperUsername(raw) {
	const t = accountUsername(raw).toLowerCase();
	if (!/^[a-z0-9._-]{2,40}$/.test(t)) throw new Error("Sleeper usernames are letters, numbers, dots, _ or -");
	return t;
}
function sleeperId(raw) {
	const t = raw.trim();
	if (/^(espn|yahoo):\d+$/.test(t)) return t;
	if (/^\d{4,24}$/.test(t)) return t;
	if (/^\{?[0-9a-f-]{8,}\}$/i.test(t)) return t;
	if (/^\d{3}\.l\.\d+/.test(t)) return t;
	throw new Error("Invalid id");
}
function parseLeagueRef(platform, raw) {
	const t = raw.trim();
	if (!t) return "";
	if (platform === "espn") {
		const m = /leagueId=(\d+)/i.exec(t) || /\/leagues\/(\d+)/.exec(t);
		if (m) return m[1];
		if (/^\d{4,12}$/.test(t)) return t;
		throw new Error("Paste your ESPN league URL or the leagueId number");
	}
	if (platform === "yahoo") {
		const m = /fantasysports\.yahoo\.com\/(?:f1|nfl)\/(\d+)/i.exec(t) || /\/f1\/(\d+)/.exec(t);
		if (m) return m[1];
		if (/^\d{3,10}$/.test(t)) return t;
		throw new Error("Paste your Yahoo league URL or the number in /f1/…");
	}
	return t;
}
function shortLeagueName(name) {
	return (name.replace(/\s*20\d{2}(?:-\d{2})?\s*/g, " ").trim().split(/\s+/)[0] || name).slice(0, 12);
}
function loadProfile() {
	try {
		const raw = localStorage.getItem(PROFILE_KEY);
		if (!raw) return null;
		const p = JSON.parse(raw);
		if (!p?.userId || !p?.leagues?.length || !p.activeLeagueId) return null;
		if (p.platform !== "sleeper" && p.platform !== "espn" && p.platform !== "yahoo") return null;
		return p;
	} catch {
		return null;
	}
}
function saveProfile(profile) {
	localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
	localStorage.setItem(STORAGE_KEY, profile.activeLeagueId);
}
function clearProfile() {
	localStorage.removeItem(PROFILE_KEY);
	localStorage.removeItem(STORAGE_KEY);
	localStorage.removeItem("liveline-profile");
}
function setActiveLeague(leagueId) {
	localStorage.setItem(STORAGE_KEY, leagueId);
	const p = loadProfile();
	if (!p) return;
	p.activeLeagueId = leagueId;
	localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
//#endregion
export { parseLeagueRef as a, shortLeagueName as c, loadProfile as i, sleeperId as l, clearProfile as n, saveProfile as o, leagues_Ad5L4M0D_exports as r, setActiveLeague as s, accountUsername as t, sleeperUsername as u };
