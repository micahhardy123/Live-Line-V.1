import { ChevronLeft, ChevronRight, Swords } from "lucide-react";
import { formatPts, recordText } from "@/lib/fantasy/format";
import type { TeamView } from "@/lib/fantasy/types";
import { Avatar } from "@/components/shared/bits";

export function ScoreHeader({
  left,
  right,
  week,
  onWeek,
  canPrev,
  canNext,
}: {
  left: TeamView;
  right: TeamView;
  week: number;
  onWeek: (week: number) => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2">
        <div className="flex w-20 shrink-0 flex-col items-start gap-1">
          <Avatar src={left.avatarUrl} name={left.teamName} ring="hot" />
          <span className="font-display text-2xs font-bold tracking-wider text-hot">
            {Math.round(left.winPct * 100)}% WIN
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center">
          <div className="flex items-end gap-3">
            <div className="text-right">
              <div className="font-display text-3xl font-semibold leading-none tabular-nums tracking-tight">
                {formatPts(left.points)}
              </div>
              <div className="mt-1 text-micro tabular-nums text-subtle">{formatPts(left.projected)}</div>
            </div>
            <div className="mb-1 flex size-8 items-center justify-center rounded-full bg-surface-2 text-muted shadow-[0_0_0_1px_rgb(255_255_255/0.08)]">
              <Swords className="size-3.5" />
            </div>
            <div className="text-left">
              <div className="font-display text-3xl font-semibold leading-none tabular-nums tracking-tight">
                {formatPts(right.points)}
              </div>
              <div className="mt-1 text-micro tabular-nums text-subtle">{formatPts(right.projected)}</div>
            </div>
          </div>
        </div>

        <div className="flex w-20 shrink-0 flex-col items-end gap-1">
          <Avatar src={right.avatarUrl} name={right.teamName} ring="mint" />
          <span className="font-display text-2xs font-bold tracking-wider text-primary">
            {Math.round(right.winPct * 100)}% WIN
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-semibold">{left.teamName}</div>
          <div className="truncate text-micro text-muted">
            @{left.username} · {recordText(left.wins, left.losses, left.ties)} (#{left.rank})
          </div>
        </div>
        <div className="min-w-0 text-right">
          <div className="truncate font-display text-sm font-semibold">{right.teamName}</div>
          <div className="truncate text-micro text-muted">
            {recordText(right.wins, right.losses, right.ties)} (#{right.rank}) · @{right.username}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Starters</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onWeek(week - 1)}
            className="flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-30"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-16 text-center font-display text-sm font-semibold text-primary">Week {week}</span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onWeek(week + 1)}
            className="flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-30"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
