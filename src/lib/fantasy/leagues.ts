export type FantasyPlatform = "sleeper" | "espn" | "yahoo";

export type SavedLeague = {
  id: string;
  name: string;
  shortName: string;
};

export type SavedProfile = {
  platform: FantasyPlatform;
  username: string;
  userId: string;
  displayName: string;
  avatar: string | null;
  leagues: SavedLeague[];
  activeLeagueId: string;
};

export const PROFILE_KEY = "liveline-profile-v2";
export const STORAGE_KEY = "liveline-league";

export function accountUsername(raw: string) {
  const t = raw.trim().slice(0, 40);
  if (t.length < 2) throw new Error("Type your username — we don’t fill it in");
  return t;
}

export function sleeperUsername(raw: string) {
  const t = accountUsername(raw).toLowerCase();
  if (!/^[a-z0-9._-]{2,40}$/.test(t)) throw new Error("Sleeper usernames are letters, numbers, dots, _ or -");
  return t;
}

export function sleeperId(raw: string) {
  const t = raw.trim();
  if (/^(espn|yahoo):\d+$/.test(t)) return t;
  if (/^\d{4,24}$/.test(t)) return t;
  if (/^\{?[0-9a-f-]{8,}\}$/i.test(t)) return t;
  if (/^\d{3}\.l\.\d+/.test(t)) return t;
  throw new Error("Invalid id");
}

export function parseLeagueRef(platform: FantasyPlatform, raw: string) {
  const t = raw.trim();
  if (!t) return "";
  if (platform === "espn") {
    const m = /leagueId=(\d+)/i.exec(t) || /\/leagues\/(\d+)/.exec(t);
    if (m) return m[1]!;
    if (/^\d{4,12}$/.test(t)) return t;
    throw new Error("Paste your ESPN league URL or the leagueId number");
  }
  if (platform === "yahoo") {
    const m = /fantasysports\.yahoo\.com\/(?:f1|nfl)\/(\d+)/i.exec(t) || /\/f1\/(\d+)/.exec(t);
    if (m) return m[1]!;
    if (/^\d{3,10}$/.test(t)) return t;
    throw new Error("Paste your Yahoo league URL or the number in /f1/…");
  }
  return t;
}

export function shortLeagueName(name: string) {
  const cleaned = name.replace(/\s*20\d{2}(?:-\d{2})?\s*/g, " ").trim();
  const first = cleaned.split(/\s+/)[0] || name;
  return first.slice(0, 12);
}

export function loadProfile(): SavedProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as SavedProfile;
    if (!p?.userId || !p?.leagues?.length || !p.activeLeagueId) return null;
    if (p.platform !== "sleeper" && p.platform !== "espn" && p.platform !== "yahoo") return null;
    return p;
  } catch {
    return null;
  }
}

export function saveProfile(profile: SavedProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEY, profile.activeLeagueId);
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("liveline-profile");
}

export function setActiveLeague(leagueId: string) {
  localStorage.setItem(STORAGE_KEY, leagueId);
  const p = loadProfile();
  if (!p) return;
  p.activeLeagueId = leagueId;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
