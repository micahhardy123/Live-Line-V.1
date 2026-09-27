import { ChevronRight } from "lucide-react";
import { formatPts } from "@/lib/fantasy/format";
import type { LiveTicker } from "@/lib/fantasy/types";
import { TeamMark } from "@/components/shared/bits";

export function LiveTickerBar({ ticker }: { ticker: LiveTicker | null }) {
  if (!ticker) return null;
  const situation = [ticker.detail, ticker.downDistance].filter(Boolean).join(" · ");
  return (
    <div className="mx-3 mt-2 overflow-hidden rounded-xl bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_rgb(255_255_255/0.06)]">
      <div className="flex items-center gap-2">
        {ticker.playerHeadshot ? (
          <img src={ticker.playerHeadshot} alt="" className="size-8 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="size-8 shrink-0 rounded-full bg-surface" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-2xs text-muted">{situation}</div>
          <div className="truncate text-sm font-medium leading-tight">{ticker.playText ?? "Live play"}</div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <TeamMark abbr={ticker.awayAbbr} />
            <TeamMark abbr={ticker.homeAbbr} />
            <span className="inline-flex items-center gap-1 rounded-full bg-live/15 px-1.5 py-0.5 font-display text-micro font-bold tracking-wider text-live">
              LIVE
            </span>
            <ChevronRight className="size-4 text-subtle" />
          </div>
          {ticker.fantasyDelta != null ? (
            <span className="font-display text-2xs font-semibold tabular-nums text-primary">
              {ticker.fantasyDelta >= 0 ? "+" : ""}
              {formatPts(ticker.fantasyDelta, 1)}
            </span>
          ) : (
            <span className="text-micro tabular-nums text-muted">
              {ticker.awayScore}–{ticker.homeScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
