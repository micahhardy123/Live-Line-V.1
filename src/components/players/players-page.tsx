"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { fetchFreeAgents, fetchTrending } from "@/lib/fantasy/api";
import { emptyPlayer, formatPts } from "@/lib/fantasy/format";
import type { LeaguePlayer, MatchupPayload, PlayerView, TrendingPlayer } from "@/lib/fantasy/types";
import { InjuryBadge, TeamMark } from "@/components/shared/bits";

const FILTERS = ["ALL", "QB", "RB", "WR", "TE", "K", "DEF"] as const;

function toView(p: LeaguePlayer | TrendingPlayer): PlayerView {
  const base = emptyPlayer("BN");
  return {
    ...base,
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    pos: p.pos,
    team: p.team,
    headshot: p.headshot,
    espnId: p.espnId,
    injury: "injury" in p ? p.injury : null,
    projection: "projection" in p ? p.projection : 0,
  };
}

function Row({
  name,
  meta,
  right,
  injury,
  team,
  onClick,
}: {
  name: string;
  meta: string;
  right: string;
  injury: string | null;
  team: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2/60"
    >
      <TeamMark abbr={team} className="size-6" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold">{name}</span>
          <InjuryBadge tag={injury} />
        </div>
        <div className="truncate text-micro text-muted">{meta}</div>
      </div>
      <span className="font-display text-sm tabular-nums text-muted">{right}</span>
    </button>
  );
}

export function PlayersPage({
  data,
  onPlayer,
}: {
  data: MatchupPayload;
  onPlayer: (p: PlayerView) => void;
}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pos, setPos] = useState<(typeof FILTERS)[number]>("ALL");
  const [scope, setScope] = useState<"available" | "rostered">("available");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 220);
    return () => window.clearTimeout(t);
  }, [q]);

  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrending(),
    staleTime: 60_000,
    enabled: scope === "available" && !debounced,
  });

  const freeAgents = useQuery({
    queryKey: ["fa", data.leagueSlug, pos, debounced],
    queryFn: () => fetchFreeAgents({ data: { league: data.leagueSlug, q: debounced, pos } }),
    enabled: scope === "available",
    staleTime: 20_000,
  });

  const rostered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.leaguePlayers.filter((p) => {
      if (pos !== "ALL" && p.pos !== pos) return false;
      if (!needle) return true;
      return `${p.name} ${p.team ?? ""} ${p.ownerName}`.toLowerCase().includes(needle);
    });
  }, [data.leaguePlayers, pos, q]);

  return (
    <div className="pb-4">
      <header className="px-4 pt-4">
        <h1 className="font-display text-lg font-semibold">Players</h1>
        <div className="mt-3 grid grid-cols-2 rounded-full bg-surface p-1">
          <button
            type="button"
            onClick={() => setScope("available")}
            className={cn(
              "rounded-full py-2 text-center text-2xs font-semibold",
              scope === "available" ? "bg-surface-2 text-fg" : "text-muted",
            )}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => setScope("rostered")}
            className={cn(
              "rounded-full py-2 text-center text-2xs font-semibold",
              scope === "rostered" ? "bg-surface-2 text-fg" : "text-muted",
            )}
          >
            On rosters
          </button>
        </div>
        <label className="mt-3 flex h-11 items-center gap-2 rounded-full bg-surface px-3">
          <Search className="size-4 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={scope === "available" ? "Search free agents" : "Search league players"}
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-subtle"
          />
        </label>
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setPos(f)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-2xs font-semibold",
                pos === f ? "bg-primary text-primary-fg" : "bg-surface text-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {scope === "available" ? (
        <>
          {!debounced && trending.data && trending.data.length > 0 ? (
            <section className="mt-5">
              <h2 className="px-4 text-sm font-semibold">Trending waivers</h2>
              <div className="mt-1">
                {trending.data.slice(0, 8).map((p) => (
                  <Row
                    key={`${p.kind}-${p.id}`}
                    name={p.shortName}
                    meta={`${p.pos}${p.team ? ` · ${p.team}` : ""} · ${p.kind === "add" ? "Adds" : "Drops"}`}
                    right={p.count > 1000 ? `${Math.round(p.count / 1000)}k` : String(p.count)}
                    injury={null}
                    team={p.team}
                    onClick={() => onPlayer(toView(p))}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-5">
            <h2 className="px-4 text-sm font-semibold">
              {debounced ? "Search results" : "Free agents"}
            </h2>
            {freeAgents.isLoading ? (
              <p className="px-4 py-6 text-center text-2xs text-muted">Loading available players…</p>
            ) : null}
            {freeAgents.isError ? (
              <p className="px-4 py-6 text-center text-2xs text-muted">Couldn’t load free agents.</p>
            ) : null}
            <div className="mt-1">
              {(freeAgents.data ?? []).map((p) => (
                <Row
                  key={p.id}
                  name={p.shortName}
                  meta={`${p.pos}${p.team ? ` · ${p.team}` : ""} · FA`}
                  right={formatPts(p.projection)}
                  injury={p.injury}
                  team={p.team}
                  onClick={() => onPlayer(toView(p))}
                />
              ))}
            </div>
            {freeAgents.data && freeAgents.data.length === 0 && !freeAgents.isLoading ? (
              <p className="px-4 py-6 text-center text-2xs text-muted">No available players match.</p>
            ) : null}
          </section>
        </>
      ) : (
        <section className="mt-5">
          <h2 className="px-4 text-sm font-semibold">In this league</h2>
          <div className="mt-1">
            {rostered.slice(0, 80).map((p) => (
              <Row
                key={p.id}
                name={p.shortName}
                meta={`${p.pos}${p.team ? ` · ${p.team}` : ""} · ${p.ownerName}`}
                right={formatPts(p.projection)}
                injury={p.injury}
                team={p.team}
                onClick={() => onPlayer(toView(p))}
              />
            ))}
          </div>
          {rostered.length === 0 ? (
            <p className="px-4 py-6 text-center text-2xs text-muted">No rostered players match.</p>
          ) : null}
        </section>
      )}
    </div>
  );
}
