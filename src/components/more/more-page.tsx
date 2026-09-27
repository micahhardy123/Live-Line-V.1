"use client";

import { ChevronRight, Radio, Share2 } from "lucide-react";
import { formatPts } from "@/lib/fantasy/format";
import type { LeaguePickerItem, MatchupPayload } from "@/lib/fantasy/types";
import { Avatar } from "@/components/shared/bits";

export function MorePage({
  data,
  leagues,
  onOpenLeagues,
  onSelectLeague,
  onChangeAccount,
}: {
  data: MatchupPayload;
  leagues: LeaguePickerItem[];
  onOpenLeagues: () => void;
  onSelectLeague: (slug: string) => void;
  onChangeAccount: () => void;
}) {
  async function share() {
    const text = [
      `LiveLine · ${data.leagueName} · Week ${data.week}`,
      `${data.left.teamName} ${formatPts(data.left.points)} vs ${data.right.teamName} ${formatPts(data.right.points)}`,
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "LiveLine", text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  const rows = [
    ["Season", data.league.season],
    ["Scoring", data.league.scoringLabel],
    ["Pass TD", `${data.league.passTd} pts`],
    ["Rush / Rec TD", `${data.league.rushTd} pts`],
    ["Live games", String(data.liveGames)],
  ];

  return (
    <div className="px-4 pb-6 pt-4">
      <div className="flex items-center gap-3">
        <Avatar src={data.left.avatarUrl} name={data.left.displayName} size="lg" />
        <div className="min-w-0">
          <div className="font-display text-lg font-semibold">{data.left.displayName}</div>
          <div className="text-2xs text-muted">@{data.left.username} · {leagues.length} leagues</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold">My Leagues</h2>
        <button type="button" onClick={onOpenLeagues} className="text-2xs font-semibold text-primary">
          Switch
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {leagues.length === 0 ? (
          <button
            type="button"
            onClick={onOpenLeagues}
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-3 py-3 text-left"
          >
            <div>
              <div className="text-sm font-semibold">{data.leagueName}</div>
              <div className="text-micro text-muted">Tap to see your other league</div>
            </div>
            <ChevronRight className="size-4 text-subtle" />
          </button>
        ) : (
          leagues.map((lg) => {
            const active = lg.slug === data.leagueSlug;
            return (
              <button
                key={lg.slug}
                type="button"
                onClick={() => onSelectLeague(lg.slug)}
                className="flex w-full items-center gap-3 rounded-2xl bg-surface px-3 py-3 text-left"
              >
                <Avatar src={lg.avatarUrl} name={lg.shortName} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{lg.name}</span>
                    {active ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-micro font-bold tracking-wide text-primary">
                        ON
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 truncate text-micro text-muted">
                    {lg.myTeamName} · {formatPts(lg.myPoints, 1)} vs {lg.oppName} {formatPts(lg.oppPoints, 1)}
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-subtle" />
              </button>
            );
          })
        )}
      </div>

      <h2 className="mt-6 text-sm font-semibold">This league</h2>
      <div className="mt-2 overflow-hidden rounded-xl bg-surface">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0">
            <span className="text-sm text-muted">{k}</span>
            <span className="max-w-48 truncate text-right text-sm font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-surface px-3 py-3">
        <Radio className="mt-0.5 size-4 text-live" />
        <p className="text-2xs leading-relaxed text-muted">
          LiveLine pulls real Sleeper points for every NFL window — Thursday, Sunday, and Monday. Switch
          leagues anytime from the header or here.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void share()}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]"
      >
        <Share2 className="size-4" />
        SHARE MATCHUP
      </button>
      <button
        type="button"
        onClick={onChangeAccount}
        className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-surface text-sm font-semibold text-muted"
      >
        Change account
      </button>
    </div>
  );
}
