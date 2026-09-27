"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPts, recordText, vsLabel } from "@/lib/fantasy/format";
import type { MatchupPayload, PlayerView, TeamView } from "@/lib/fantasy/types";
import { Avatar, InjuryBadge, TeamMark } from "@/components/shared/bits";

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg bg-surface px-2 py-2 text-center">
      <div className="text-micro uppercase tracking-wide text-subtle">{label}</div>
      <div className="mt-0.5 truncate font-display text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function LineRow({ player, onOpen }: { player: PlayerView; onOpen: (p: PlayerView) => void }) {
  if (player.id.startsWith("empty-")) return null;
  const pts = player.game.state === "pre" || player.game.state === "bye" ? player.projection : (player.points ?? player.projection);
  const live = player.game.state === "in";
  return (
    <button
      type="button"
      onClick={() => onOpen(player)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-display text-sm font-semibold">{player.shortName}</span>
          <InjuryBadge tag={player.injury} />
        </div>
        <div className="mt-0.5 text-micro text-muted">
          {player.pos}
          {player.team ? ` · ${player.team}` : ""}
          {player.teamRank ? ` (${player.teamRank})` : ""}
        </div>
      </div>
      <TeamMark abbr={player.team} className="size-5" />
      <div className="w-28 text-right">
        <div className={cn("text-2xs", live ? "text-primary" : "text-muted")}>
          {live ? player.game.clock ?? "LIVE" : player.game.startLabel}
        </div>
        <div className="truncate text-micro text-subtle">{vsLabel(player.game.opponent, player.game.homeAway)}</div>
      </div>
      <div className={cn("w-12 text-right font-display text-sm tabular-nums", live && "text-primary")}>
        {formatPts(pts)}
      </div>
      <ChevronRight className="size-4 text-subtle" />
    </button>
  );
}

export function TeamPage({
  data,
  side,
  onSide,
  onPlayer,
}: {
  data: MatchupPayload;
  side: "left" | "right";
  onSide: (s: "left" | "right") => void;
  onPlayer: (p: PlayerView) => void;
}) {
  const team: TeamView = side === "left" ? data.left : data.right;
  const [tab, setTab] = useState<"starters" | "bench">("starters");
  const list = tab === "starters" ? team.starters : team.bench;

  return (
    <div className="pb-4">
      <header className="flex items-center gap-3 px-4 pt-4">
        <Avatar src={team.avatarUrl} name={team.teamName} size="lg" ring={side === "left" ? "hot" : "mint"} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-lg font-semibold">{team.teamName}</div>
          <div className="text-2xs text-muted">
            @{team.username} · {recordText(team.wins, team.losses, team.ties)} (#{team.rank})
          </div>
        </div>
      </header>

      <div className="mt-3 flex gap-1 px-4">
        {(["left", "right"] as const).map((s) => {
          const t = s === "left" ? data.left : data.right;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSide(s)}
              className={cn(
                "flex-1 rounded-full px-3 py-1.5 text-2xs font-semibold transition-colors",
                side === s ? "bg-primary text-primary-fg" : "bg-surface text-muted",
              )}
            >
              {t.teamName}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 px-4">
        <StatChip label="PF" value={formatPts(team.points, 1)} />
        <StatChip label="PA" value={formatPts(team.pointsAgainst, 1)} />
        <StatChip label="Max PF" value={formatPts(team.maxPf, 1)} />
        <StatChip label="Rank" value={`#${team.rank}`} />
        <StatChip label="Waiver" value={`#${team.waiverPosition}`} />
      </div>

      <div className="mx-4 mt-4 flex rounded-full bg-surface p-1">
        {(["starters", "bench"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-1.5 text-sm font-semibold capitalize",
              tab === t ? "bg-surface-2 text-fg" : "text-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-1 divide-y divide-border">
        {list.map((p) => (
          <LineRow key={p.id} player={p} onOpen={onPlayer} />
        ))}
      </div>
    </div>
  );
}
