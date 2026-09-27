import { cn } from "@/lib/cn";
import { formatPts, vsLabel } from "@/lib/fantasy/format";
import type { PlayerView } from "@/lib/fantasy/types";
import { DriveBar, InjuryBadge, TeamMark } from "@/components/shared/bits";
import { PosBadge } from "./pos-badge";

function GameLine({ player, align }: { player: PlayerView; align: "left" | "right" }) {
  const g = player.game;
  const opp = vsLabel(g.opponent, g.homeAway);
  const live = g.state === "in";
  const label = live
    ? [g.clock && !/final/i.test(g.clock) ? g.clock : "LIVE", g.score?.replace("–", "-"), opp].filter(Boolean).join(" ")
    : [g.startLabel, opp].filter(Boolean).join(" ");
  return (
    <div
      className={cn(
        "mt-0.5 flex items-center gap-1 text-micro",
        live ? "text-muted" : "text-subtle",
        align === "right" && "flex-row-reverse",
      )}
    >
      {live ? <span className="live-dot size-1.5 shrink-0 rounded-full bg-live" /> : null}
      <span className="min-w-0 truncate">{label}</span>
      <TeamMark abbr={player.team} />
    </div>
  );
}

function PlayerCell({
  player,
  align,
  onOpen,
}: {
  player: PlayerView;
  align: "left" | "right";
  onOpen?: (p: PlayerView) => void;
}) {
  const empty = player.id.startsWith("empty-");
  const live = !empty && player.game.state === "in" && !/final/i.test(player.game.clock ?? "");
  const done = !empty && player.game.state === "post";
  const pts = player.points == null ? "—" : formatPts(player.points);
  const clickable = Boolean(onOpen) && !empty;

  const inner = (
    <>
      <div className={cn("flex items-start gap-2", align === "right" && "flex-row-reverse")}>
        <div className={cn("min-w-0 flex-1", align === "right" && "text-right")}>
          <div className={cn("flex items-center gap-1.5", align === "right" && "flex-row-reverse")}>
            <span className="truncate font-display text-sm font-semibold leading-tight">{player.shortName}</span>
            <InjuryBadge tag={player.injury} />
          </div>
          <div className="mt-0.5 truncate text-micro text-muted">
            {player.pos}
            {player.team ? ` · ${player.team}` : ""}
            {player.teamRank ? ` (${player.teamRank})` : ""}
          </div>
          <GameLine player={player} align={align} />
        </div>
        <div className={cn("shrink-0 pt-0.5", align === "right" ? "text-left" : "text-right")}>
          <div
            className={cn(
              "font-display text-sm font-semibold tabular-nums leading-none",
              live ? "text-primary" : done ? "text-fg" : "text-subtle",
            )}
          >
            {pts}
          </div>
          <div className="mt-1 text-micro tabular-nums text-subtle">{formatPts(player.projection)}</div>
        </div>
      </div>
      {player.statLine && live ? (
        <div className={cn("mt-1 text-micro font-medium text-fg/80", align === "right" && "text-right")}>
          {player.statLine}
        </div>
      ) : null}
      {live ? <DriveBar progress={player.game.progress} /> : null}
    </>
  );

  if (empty) return <div className="min-w-0 px-2.5 py-2" />;

  const cls = cn(
    "min-w-0 px-2.5 py-2 text-left transition-colors duration-200",
    align === "right" && "text-right",
    clickable && "hover:bg-surface-2/60",
  );

  if (clickable) {
    return (
      <button type="button" onClick={() => onOpen?.(player)} className={cls}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

export function PlayerRow({
  left,
  right,
  onOpen,
}: {
  left: PlayerView;
  right: PlayerView;
  onOpen?: (p: PlayerView) => void;
}) {
  const leftLive = left.game.state === "in" && !left.id.startsWith("empty-") && !/final/i.test(left.game.clock ?? "");
  const rightLive = right.game.state === "in" && !right.id.startsWith("empty-") && !/final/i.test(right.game.clock ?? "");
  return (
    <div className="overflow-hidden px-2">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-stretch">
        <div className={cn("min-w-0", leftLive && "rounded-l-xl bg-surface-live")}>
          <PlayerCell player={left} align="left" onOpen={onOpen} />
        </div>
        <div
          className={cn(
            "flex items-center justify-center",
            (leftLive || rightLive) && "bg-surface-live",
            leftLive && !rightLive && "rounded-r-xl",
            rightLive && !leftLive && "rounded-l-xl",
          )}
        >
          <PosBadge slot={left.slot === "BN" ? "BN" : left.slot} />
        </div>
        <div className={cn("min-w-0", rightLive && "rounded-r-xl bg-surface-live")}>
          <PlayerCell player={right} align="right" onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}
