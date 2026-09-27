"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "vaul";
import { Share2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { fetchPlayerDetail } from "@/lib/fantasy/api";
import { formatPts, vsLabel } from "@/lib/fantasy/format";
import type { PlayerDetail, PlayerView, StatCell } from "@/lib/fantasy/types";
import { InjuryBadge, TeamMark } from "@/components/shared/bits";
import { PosBadge } from "@/components/matchup/pos-badge";
import type { SlotPos } from "@/lib/fantasy/types";

function asSlot(pos: string): SlotPos {
  if (pos === "QB" || pos === "RB" || pos === "WR" || pos === "TE" || pos === "K" || pos === "DEF") return pos;
  return "FLEX";
}

function StatsGrid({ cells }: { cells: StatCell[] }) {
  if (!cells.length) return <p className="px-1 text-2xs text-muted">No stats yet.</p>;
  const cols = cells.length % 3 === 0 || cells.length > 5 ? "grid-cols-3" : cells.length === 5 ? "grid-cols-5" : "grid-cols-4";
  return (
    <div className={cn("grid gap-y-3", cols)}>
      {cells.map((c) => (
        <div key={c.key} className="text-center">
          <div className="text-micro uppercase tracking-wide text-subtle">{c.label}</div>
          <div className="mt-0.5 font-display text-sm font-semibold tabular-nums">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function TripleTable({
  rows,
}: {
  rows: { label: string; season: string; last: string; career: string }[];
}) {
  if (!rows.length) return null;
  return (
    <div className="overflow-hidden rounded-xl bg-surface">
      <div className="grid grid-cols-4 border-b border-border px-3 py-2 text-micro uppercase tracking-wide text-subtle">
        <span />
        <span className="text-center">Season</span>
        <span className="text-center">Last Season</span>
        <span className="text-center">Career</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-4 border-b border-border px-3 py-2 last:border-b-0">
          <span className="text-2xs font-semibold text-muted">{r.label}</span>
          <span className="text-center font-display text-sm tabular-nums">{r.season}</span>
          <span className="text-center font-display text-sm tabular-nums">{r.last}</span>
          <span className="text-center font-display text-sm tabular-nums">{r.career}</span>
        </div>
      ))}
    </div>
  );
}

function mergeTriple(season: StatCell[], last: StatCell[], career: StatCell[]) {
  const labels = new Map<string, string>();
  for (const c of [...season, ...last, ...career]) labels.set(c.key, c.label);
  const order = [...season.map((c) => c.key)];
  for (const c of last) if (!order.includes(c.key)) order.push(c.key);
  for (const c of career) if (!order.includes(c.key)) order.push(c.key);
  const val = (arr: StatCell[], key: string) => arr.find((c) => c.key === key)?.value ?? "—";
  return order.map((key) => ({
    label: labels.get(key) ?? key,
    season: val(season, key),
    last: val(last, key),
    career: val(career, key),
  }));
}

function ShareCard({
  detail,
  player,
  onClose,
}: {
  detail: PlayerDetail;
  player: PlayerView;
  onClose: () => void;
}) {
  const rows = mergeTriple(detail.seasonStats, detail.lastSeasonStats, detail.careerStats);
  async function share() {
    const text = [
      `${player.name} · ${player.pos} · ${player.team ?? ""}`,
      `${detail.season} Regular Season`,
      ...rows.map((r) => `${r.label}: ${r.season} / ${r.last} / ${r.career}`),
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: player.name, text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="font-display text-base font-semibold">Share Screenshot</div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
          aria-label="Close share"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="overflow-hidden rounded-2xl bg-sheet shadow-phone">
          <div className="flex items-start justify-between px-4 pt-4">
            <div>
              <div className="text-micro uppercase tracking-wide text-subtle">{detail.season} Regular Season</div>
              <div className="mt-1 font-display text-xl font-semibold">{player.name}</div>
              <div className="mt-0.5 text-2xs text-muted">
                {player.pos}
                {player.team ? ` · ${player.team}` : ""}
              </div>
            </div>
            <img src={player.headshot} alt="" className="size-16 rounded-lg object-cover object-top" />
          </div>
          <div className="mt-3 px-2 pb-3">
            <TripleTable rows={rows.slice(0, 8)} />
          </div>
          {detail.gameLog[0] ? (
            <div className="border-t border-border px-4 py-3">
              <div className="text-micro font-semibold uppercase tracking-wide text-subtle">Game Log</div>
              <div className="mt-1 flex items-center justify-between text-2xs">
                <span className="text-muted">
                  {detail.gameLog[0].dateLabel} {detail.gameLog[0].homeAway} {detail.gameLog[0].opponent}
                </span>
                <span className="font-display tabular-nums text-primary">
                  {formatPts(detail.gameLog[0].fantasyPts)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void share()}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]"
        >
          SHARE
        </button>
      </div>
    </div>
  );
}

export function PlayerSheet({
  player,
  week,
  league,
  onClose,
  onBackToMatchup,
}: {
  player: PlayerView | null;
  week: number;
  league?: string;
  onClose: () => void;
  onBackToMatchup: () => void;
}) {
  const [more, setMore] = useState(false);
  const [sharing, setSharing] = useState(false);
  const open = Boolean(player);
  const query = useQuery({
    queryKey: ["player", player?.id, week, league],
    queryFn: () => fetchPlayerDetail({ data: { playerId: player!.id, week, league } }),
    enabled: open && Boolean(player && !player.id.startsWith("empty-")),
    refetchInterval: player?.game.state === "in" ? 8000 : false,
    staleTime: 4000,
  });
  const detail = query.data;

  const triple = useMemo(
    () => (detail ? mergeTriple(detail.seasonStats, detail.lastSeasonStats, detail.careerStats) : []),
    [detail],
  );

  const opp = player ? vsLabel(player.game.opponent, player.game.homeAway) || vsLabel(detail?.opponent ?? null, detail?.homeAway ?? null) : "";

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setMore(false);
          setSharing(false);
          onClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/80" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[94dvh] max-w-md flex-col rounded-t-2xl bg-sheet shadow-sheet outline-none">
          {player ? (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between px-4 pt-3">
                <div>
                  <Drawer.Title className="font-display text-sm font-semibold tracking-wide">MATCHUP</Drawer.Title>
                  <div className="text-2xs font-medium text-muted">{opp || "This week"}</div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                  aria-label="Close player"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
                <div className="mt-3 flex items-start gap-3 rounded-xl bg-surface p-3">
                  <img
                    src={player.headshot}
                    alt=""
                    className="size-16 rounded-lg object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate font-display text-lg font-semibold leading-tight">{player.name}</div>
                      <InjuryBadge tag={player.injury} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-muted">
                      <PosBadge slot={asSlot(player.pos)} className="h-5 min-w-5 px-1 text-micro" />
                      <span>
                        {player.pos}
                        {player.team ? ` · ${player.team}` : ""}
                        {player.teamRank ? ` (${player.teamRank})` : ""}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-2xs text-subtle">
                      <TeamMark abbr={player.team} />
                      <span>
                        {opp}
                        {player.game.startLabel ? ` · ${player.game.startLabel}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-semibold tabular-nums text-primary">
                      {formatPts(player.points)}
                    </div>
                    <div className="text-micro tabular-nums text-subtle">{formatPts(player.projection)}</div>
                  </div>
                </div>

                {detail && detail.scoringPlays.length > 0 ? (
                  <section className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold">Fantasy Scoring Plays</h3>
                    <div className="space-y-2">
                      {detail.scoringPlays.map((p) => (
                        <div key={p.id} className="flex items-start justify-between gap-3 rounded-lg bg-surface px-3 py-2">
                          <div className="min-w-0">
                            <div className="text-micro text-muted">
                              {p.period} {p.clock}
                              {p.downDistance ? `  ${p.downDistance}` : ""}
                            </div>
                            <div className="text-sm leading-snug">{p.text}</div>
                          </div>
                          <div className="shrink-0 font-display text-sm font-semibold tabular-nums text-primary">
                            {formatPts(p.points)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="mt-5">
                  <h3 className="mb-3 text-sm font-semibold">Game Stats</h3>
                  {query.isLoading && !detail ? (
                    <div className="h-16 animate-pulse rounded-xl bg-surface" />
                  ) : (
                    <StatsGrid cells={detail?.gameStats ?? []} />
                  )}
                </section>

                {more && detail?.extraStats.length ? (
                  <section className="mt-4">
                    <h3 className="mb-3 text-sm font-semibold">More Stats</h3>
                    <StatsGrid cells={detail.extraStats} />
                  </section>
                ) : null}

                {detail && detail.gameLog.length > 0 ? (
                  <section className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold">Game Log</h3>
                    <div className="overflow-hidden rounded-xl bg-surface">
                      {(more ? detail.gameLog : detail.gameLog.slice(0, 4)).map((g) => (
                        <div key={`${g.week}-${g.dateLabel}`} className="border-b border-border px-3 py-2.5 last:border-b-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-2xs text-muted">
                              {g.dateLabel} {g.homeAway} {g.opponent}
                            </span>
                            <span className="font-display text-sm font-semibold tabular-nums text-primary">
                              {formatPts(g.fantasyPts)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-micro text-subtle">
                            {g.line.map((c) => (
                              <span key={c.key}>
                                {c.label} {c.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {triple.length > 0 ? (
                  <section className="mt-5">
                    <TripleTable rows={more ? triple : triple.slice(0, 8)} />
                  </section>
                ) : null}

                {detail && detail.news.length > 0 ? (
                  <section className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold">News</h3>
                    <div className="space-y-2">
                      {(more ? detail.news : detail.news.slice(0, 3)).map((n) => (
                        <article key={n.id} className="flex gap-3 rounded-xl bg-surface p-3">
                          {n.image ? (
                            <img src={n.image} alt="" className="h-14 w-20 shrink-0 rounded-md object-cover" />
                          ) : null}
                          <div className="min-w-0">
                            <div className="text-sm font-medium leading-snug">{n.headline}</div>
                            <div className="mt-1 text-micro text-subtle">{n.publishedLabel}</div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                <button
                  type="button"
                  onClick={() => setMore((v) => !v)}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-wide text-primary-fg transition-transform duration-150 active:scale-[0.96]"
                >
                  {more ? "Show Less" : "View More"}
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 bg-sheet/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
                <button
                  type="button"
                  onClick={onBackToMatchup}
                  className="h-11 rounded-full bg-surface-2 text-sm font-semibold transition-transform duration-150 active:scale-[0.96]"
                >
                  Go to Matchup
                </button>
                <button
                  type="button"
                  onClick={() => setSharing(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-surface-2 text-sm font-semibold transition-transform duration-150 active:scale-[0.96]"
                >
                  <Share2 className="size-4" />
                  Share Stats
                </button>
              </div>

              {sharing && detail ? <ShareCard detail={detail} player={player} onClose={() => setSharing(false)} /> : null}
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
