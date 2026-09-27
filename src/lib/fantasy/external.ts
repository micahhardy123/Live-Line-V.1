import { leagueAvatar, sleeperAvatar } from "./format";
import { shortLeagueName } from "./leagues";
import type { AccountLookup } from "./types";

const ESPN_UA = "Mozilla/5.0 (compatible; LiveLine/1.0)";

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nameHit(username: string, ...parts: Array<string | null | undefined>) {
  const n = norm(username);
  if (n.length < 2) return false;
  const blob = norm(parts.filter(Boolean).join(" "));
  if (!blob) return false;
  return blob === n || blob.includes(n) || n.includes(blob);
}

export async function lookupEspnLeague(username: string, leagueId: string, season: string): Promise<AccountLookup> {
  const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mTeam&view=mSettings`;
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": ESPN_UA } });
  if (res.status === 401 || res.status === 403) {
    throw new Error("That ESPN league is private. In ESPN, League settings → make it public, or copy a public league URL.");
  }
  if (res.status === 404) throw new Error("No ESPN league with that ID for this season");
  if (!res.ok) throw new Error(`ESPN lookup failed (${res.status})`);
  const data = (await res.json()) as {
    id?: number;
    name?: string;
    seasonId?: number;
    status?: { currentMatchupPeriod?: number };
    members?: Array<{ id: string; displayName?: string; firstName?: string; lastName?: string }>;
    teams?: Array<{
      id: number;
      location?: string;
      nickname?: string;
      abbrev?: string;
      primaryOwner?: string;
      logo?: string;
    }>;
    settings?: { name?: string; size?: number };
  };
  const members = data.members ?? [];
  const member =
    members.find((m) => nameHit(username, m.displayName, m.firstName, m.lastName, `${m.firstName ?? ""} ${m.lastName ?? ""}`)) ??
    null;
  if (!member) {
    throw new Error("That username isn’t in this ESPN league. Check the manager name next to your team.");
  }
  const team = (data.teams ?? []).find((t) => t.primaryOwner === member.id);
  const name = data.settings?.name || data.name || `ESPN ${leagueId}`;
  return {
    platform: "espn",
    userId: member.id,
    username,
    displayName: member.displayName || username,
    avatar: team?.logo ?? null,
    leagues: [
      {
        id: `espn:${leagueId}`,
        name,
        shortName: shortLeagueName(name),
        season: String(data.seasonId ?? season),
        teams: data.settings?.size ?? data.teams?.length ?? 0,
        avatarUrl: team?.logo || leagueAvatar(null),
      },
    ],
  };
}

type YahooNode = Record<string, unknown> | unknown[];

function yahooPick<T = unknown>(node: unknown, key: string): T | undefined {
  if (!node) return undefined;
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = yahooPick<T>(item, key);
      if (hit !== undefined) return hit;
    }
    return undefined;
  }
  if (typeof node === "object") {
    const rec = node as Record<string, unknown>;
    if (key in rec) return rec[key] as T;
    for (const v of Object.values(rec)) {
      const hit = yahooPick<T>(v, key);
      if (hit !== undefined) return hit;
    }
  }
  return undefined;
}

function yahooTeams(node: unknown): Array<{ name: string; manager: string; teamKey: string; logo: string | null }> {
  const out: Array<{ name: string; manager: string; teamKey: string; logo: string | null }> = [];
  const walk = (n: unknown) => {
    if (!n) return;
    if (Array.isArray(n)) {
      for (const x of n) walk(x);
      return;
    }
    if (typeof n !== "object") return;
    const rec = n as Record<string, unknown>;
    if (Array.isArray(rec.team)) {
      let name = "";
      let manager = "";
      let teamKey = "";
      let logo: string | null = null;
      const flatten = (x: unknown): void => {
        if (!x) return;
        if (Array.isArray(x)) {
          x.forEach(flatten);
          return;
        }
        if (typeof x !== "object") return;
        const o = x as Record<string, unknown>;
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
      if (teamKey || name) out.push({ name, manager, teamKey, logo });
      return;
    }
    Object.values(rec).forEach(walk);
  };
  walk(node);
  return out;
}

export async function lookupYahooLeague(username: string, leagueId: string, gameKey: string): Promise<AccountLookup> {
  const url = `https://pub-api-ro.fantasysports.yahoo.com/fantasy/v2/league/${gameKey}.l.${leagueId}/standings?format=json`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (res.status === 401 || res.status === 403) {
    throw new Error("That Yahoo league is private. In Yahoo, make the league public or paste a public league URL.");
  }
  if (!res.ok) throw new Error(`Yahoo lookup failed (${res.status})`);
  const json = (await res.json()) as YahooNode;
  const leagueName = String(yahooPick<string>(json, "name") ?? `Yahoo ${leagueId}`);
  const season = String(yahooPick<string>(json, "season") ?? "");
  const numTeams = Number(yahooPick<string>(json, "num_teams") ?? 0);
  const teams = yahooTeams(json);
  const mine =
    teams.find((t) => nameHit(username, t.manager, t.name)) ??
    null;
  if (!mine) {
    throw new Error("That username isn’t in this Yahoo league. Use your manager name from the Yahoo app.");
  }
  return {
    platform: "yahoo",
    userId: mine.teamKey || username,
    username,
    displayName: mine.manager || mine.name || username,
    avatar: mine.logo,
    leagues: [
      {
        id: `yahoo:${leagueId}`,
        name: leagueName,
        shortName: shortLeagueName(leagueName),
        season: season || String(new Date().getFullYear()),
        teams: numTeams || teams.length,
        avatarUrl: mine.logo || sleeperAvatar(null),
      },
    ],
  };
}

