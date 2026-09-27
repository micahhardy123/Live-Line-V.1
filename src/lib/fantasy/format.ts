import type { GameState, PlayerView, SlotPos, StatCell } from "./types";

export const ET = "America/New_York";

export function sleeperAvatar(avatar: string | null | undefined, custom?: string | null) {
  if (custom) return custom;
  if (avatar) return `https://sleepercdn.com/avatars/thumbs/${avatar}`;
  return "";
}

export function leagueAvatar(avatar: string | null | undefined) {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `https://sleepercdn.com/avatars/${avatar}`;
}

export function playerHeadshot(id: string, pos: string, team: string | null) {
  if (pos === "DEF" && team) {
    return `https://sleepercdn.com/images/team_logos/nfl/${team.toLowerCase()}.png`;
  }
  return `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;
}

export function teamLogo(team: string | null | undefined) {
  if (!team) return "";
  return `https://sleepercdn.com/images/team_logos/nfl/${team.toLowerCase()}.png`;
}

export function shortName(first: string | null, last: string | null, full: string | null, pos: string) {
  if (pos === "DEF") return last || first || full || "DST";
  if (first && last) return `${first[0]}. ${last}`;
  if (full) {
    const parts = full.split(" ");
    if (parts.length >= 2) return `${parts[0]![0]}. ${parts.slice(1).join(" ")}`;
    return full;
  }
  return last || first || "Player";
}

export function recordText(wins: number, losses: number, ties: number) {
  return ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}

export function formatPts(n: number | null, digits = 2) {
  if (n == null) return "—";
  return n.toFixed(digits);
}

export function formatClockLabel(iso: string | null, state: GameState, clock: string | null) {
  if (state === "bye") return "BYE";
  if (state === "in") return clock ?? "LIVE";
  if (state === "post") return "Final";
  if (!iso) return "TBD";
  const d = new Date(iso);
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: ET,
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: ET,
  }).format(d);
  return `${weekday} ${time}`;
}

export function vsLabel(opponent: string | null, homeAway: "home" | "away" | null) {
  if (!opponent) return "";
  return homeAway === "away" ? `@ ${opponent}` : `vs ${opponent}`;
}

export function injuryAbbrev(status: string | null) {
  if (!status) return null;
  const map: Record<string, string> = {
    Questionable: "QUES",
    Doubtful: "D",
    Out: "OUT",
    IR: "IR",
    PUP: "PUP",
    Suspended: "SUS",
    NA: "NA",
    "COVID-19": "COV",
  };
  return map[status] ?? status.slice(0, 4).toUpperCase();
}

export function formatStatLine(stats: Record<string, number> | undefined, pos: string) {
  if (!stats) return null;
  const n = (k: string) => stats[k] ?? 0;
  const parts: string[] = [];
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

export function summarizeYetToPlay(players: { pos: string; game: { state: GameState } }[]) {
  const waiting = players.filter((p) => p.game.state === "pre" || p.game.state === "bye");
  const counts: Record<string, number> = {};
  for (const p of waiting) {
    const key = p.pos === "DEF" ? "DEF" : p.pos;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const order = ["QB", "RB", "WR", "TE", "K", "DEF"];
  const bits = order
    .filter((k) => counts[k])
    .map((k) => ((counts[k] ?? 0) > 1 ? `${counts[k]} ${k}` : k));
  return { count: waiting.length, summary: bits.join(", ") };
}

export function slotLabel(slot: SlotPos) {
  if (slot === "FLEX") return "WRT";
  return slot;
}

const erf = (x: number) => {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
};

export function winProbability(leftProj: number, rightProj: number, leftRem: number, rightRem: number) {
  const rem = leftRem + rightRem;
  if (rem < 0.4) {
    if (leftProj === rightProj) return 0.5;
    return leftProj > rightProj ? 0.99 : 0.01;
  }
  const sigma = Math.max(4, Math.sqrt(Math.max(rem, 1)) * 2.15);
  const z = (leftProj - rightProj) / sigma;
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function emptyPlayer(slot: SlotPos): PlayerView {
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
      eventId: null,
    },
  };
}

export function scoringLabel(rec: number) {
  if (rec >= 0.9) return "PPR";
  if (rec >= 0.4) return "Half PPR";
  return "Standard";
}

export function weekdayName(n: number) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n] ?? "Wednesday";
}

export function formatNewsTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: ET,
  }).format(d);
}

export function formatGameDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: ET }).format(d).toUpperCase();
  const md = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", timeZone: ET }).format(d);
  return `${weekday} ${md}`;
}

export function fmtNum(n: number | null | undefined, digits = 0) {
  if (n == null || Number.isNaN(n)) return "—";
  if (digits === 0) return Math.round(n).toLocaleString("en-US");
  return n.toFixed(digits);
}

export function cell(key: string, label: string, value: string | number | null | undefined): StatCell {
  const v = value == null || value === "" ? "—" : String(value);
  return { key, label, value: v };
}

export function mentionsPlayer(text: string, first: string, last: string, full: string) {
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

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function playRole(text: string, type: string, first: string, last: string): "rush" | "pass" | "rec" | "kick" | "other" {
  const t = `${type} ${text}`.toLowerCase();
  if (/field goal|extra point|xp\b|fg\b/.test(t)) return "kick";
  const isReceiver = new RegExp(`pass(?:ed)? to\\s+[A-Z]?\\.?\\s*${escapeRe(last)}`, "i").test(text);
  if (isReceiver || (/reception|receiving/.test(t) && mentionsPlayer(text, first, last, last))) return "rec";
  if (/pass|sack|interception/.test(t) && !isReceiver) return "pass";
  if (/rush|run /.test(t)) return "rush";
  return "other";
}

export function fantasyForPlay(
  role: "rush" | "pass" | "rec" | "kick" | "other",
  yards: number,
  isTd: boolean,
  isInt: boolean,
  scoring: Record<string, number>,
) {
  const s = (k: string, d = 0) => scoring[k] ?? d;
  if (role === "rush") return yards * s("rush_yd", 0.1) + (isTd ? s("rush_td", 6) : 0);
  if (role === "pass") return yards * s("pass_yd", 0.04) + (isTd ? s("pass_td", 4) : 0) + (isInt ? s("pass_int", -1) : 0);
  if (role === "rec") return s("rec", 1) + yards * s("rec_yd", 0.1) + (isTd ? s("rec_td", 6) : 0);
  if (role === "kick") {
    if (isTd) return 0;
    if (/xp|extra point/i.test("")) return s("xpm", 1);
    return s("fgm_30_39", 3);
  }
  return 0;
}

export function sleeperStatCells(stats: Record<string, number> | undefined, pos: string, extra = false): StatCell[] {
  if (!stats) return [];
  const n = (k: string) => stats[k];
  const rows: StatCell[] = [];
  const add = (key: string, label: string, val: number | undefined, digits = 0) => {
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
