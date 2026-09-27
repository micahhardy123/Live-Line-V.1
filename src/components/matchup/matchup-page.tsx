"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { emptyPlayer, formatPts } from "@/lib/fantasy/format";
import type { MatchupPayload, PlayerView } from "@/lib/fantasy/types";
import { Avatar } from "@/components/shared/bits";
import { LiveTickerBar } from "./live-ticker";
import { PlayerRow } from "./player-row";
import { ScoreHeader } from "./score-header";

function YetToPlay({ data }: { data: MatchupPayload }) {
  return (
    <div className="mx-3 mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-surface px-3 py-2">
      <div>
        <div className="text-micro uppercase tracking-wide text-subtle">yet to play ({data.left.yetToPlay})</div>
        <div className="mt-0.5 text-2xs leading-snug text-muted">{data.left.yetToPlaySummary || "—"}</div>
      </div>
      <div className="flex gap-1">
        {data.left.starters.map((p) => (
          <span
            key={p.id}
            className={
              p.game.state === "in"
                ? "size-1.5 rounded-full bg-primary"
                : p.game.state === "post"
                  ? "size-1.5 rounded-full bg-subtle"
                  : "size-1.5 rounded-full bg-white/20"
            }
          />
        ))}
      </div>
      <div className="text-right">
        <div className="text-micro uppercase tracking-wide text-subtle">yet to play ({data.right.yetToPlay})</div>
        <div className="mt-0.5 text-2xs leading-snug text-muted">{data.right.yetToPlaySummary || "—"}</div>
      </div>
    </div>
  );
}

export function MatchupSkeleton() {
  return (
    <div className="phone-glow flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md animate-pulse rounded-3xl bg-surface p-6">
        <p className="mb-4 text-center font-display text-sm font-semibold tracking-[0.2em] text-primary">LIVELINE</p>
        <div className="h-16 rounded-2xl bg-surface-2" />
        <div className="mt-4 h-10 rounded-xl bg-surface-2" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-surface-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreboardCard({
  m,
}: {
  m: MatchupPayload["otherMatchups"][number];
}) {
  return (
    <div className={cn("rounded-2xl bg-surface px-3 py-3", m.isMine && "shadow-[0_0_0_1px_rgb(92_225_197/0.28)]")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar src={m.leftAvatar} name={m.leftName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{m.leftName}</div>
            <div className="text-micro text-muted">
              {m.leftRecord} (#{m.leftRank})
            </div>
          </div>
        </div>
        <div className="font-display text-base font-semibold tabular-nums">{formatPts(m.leftPoints, 1)}</div>
      </div>
      <div className="my-1.5 flex justify-end">
        {m.isLive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 font-display text-micro font-bold tracking-wider text-live">
            <span className="live-dot size-1.5 rounded-full bg-live" />
            LIVE
          </span>
        ) : m.isMine ? (
          <span className="text-micro font-semibold text-primary">Your matchup</span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar src={m.rightAvatar} name={m.rightName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{m.rightName}</div>
            <div className="text-micro text-muted">
              {m.rightRecord} (#{m.rightRank})
            </div>
          </div>
        </div>
        <div className="font-display text-base font-semibold tabular-nums">{formatPts(m.rightPoints, 1)}</div>
      </div>
    </div>
  );
}

export function MatchupBoard({
  data,
  onWeek,
  onPlayer,
  viewingOther,
  onOpenMatchup,
}: {
  data: MatchupPayload;
  onWeek: (week: number) => void;
  onPlayer: (p: PlayerView) => void;
  viewingOther: boolean;
  onOpenMatchup: (id: number | null) => void;
}) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [board, setBoard] = useState<"all" | "mine">("mine");
  const starterRows = Math.max(data.left.starters.length, data.right.starters.length);
  const benchRows = Math.max(data.left.bench.length, data.right.bench.length);

  async function share() {
    const text = [
      `LiveLine · ${data.leagueName} · Week ${data.week}`,
      `${data.left.teamName} ${formatPts(data.left.points)}  vs  ${data.right.teamName} ${formatPts(data.right.points)}`,
      `Projected ${formatPts(data.left.projected)} – ${formatPts(data.right.projected)}`,
      `Win ${Math.round(data.left.winPct * 100)}% / ${Math.round(data.right.winPct * 100)}%`,
    ].join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "LiveLine", text });
        setShareMsg("Shared");
      } else {
        await navigator.clipboard.writeText(text);
        setShareMsg("Copied recap");
      }
    } catch {
      setShareMsg(null);
    }
    window.setTimeout(() => setShareMsg(null), 1800);
  }

  return (
    <div className="pb-6">
      <div className="mx-4 mt-3 grid grid-cols-2 rounded-full bg-surface p-1">
        <button
          type="button"
          onClick={() => {
            onOpenMatchup(null);
            setBoard("all");
          }}
          className={cn(
            "rounded-full py-2 text-center text-2xs font-semibold",
            board === "all" ? "bg-surface-2 text-fg" : "text-muted",
          )}
        >
          All Matchups
        </button>
        <button
          type="button"
          onClick={() => {
            onOpenMatchup(null);
            setBoard("mine");
          }}
          className={cn(
            "rounded-full py-2 text-center text-2xs font-semibold",
            board === "mine" ? "bg-surface-2 text-fg" : "text-muted",
          )}
        >
          My Matchup
        </button>
      </div>

      {board === "all" ? (
        <div className="mt-3 space-y-2 px-4">
          {data.otherMatchups.map((m) => (
            <button
              key={m.matchupId}
              type="button"
              onClick={() => {
                onOpenMatchup(m.matchupId);
                setBoard("mine");
              }}
              className="block w-full text-left"
            >
              <ScoreboardCard m={m} />
            </button>
          ))}
        </div>
      ) : (
        <>
          {viewingOther ? (
            <div className="mx-3 mt-3 flex items-center justify-between rounded-lg bg-surface px-3 py-2">
              <span className="text-2xs text-muted">Viewing this matchup</span>
              <button
                type="button"
                onClick={() => onOpenMatchup(null)}
                className="text-2xs font-semibold text-primary"
              >
                Your matchup
              </button>
            </div>
          ) : !data.isHeadToHead ? (
            <div className="mx-3 mt-3 rounded-lg bg-surface px-3 py-2 text-center text-2xs text-muted">
              Not facing each other this week — comparing both lineups
            </div>
          ) : null}

          <ScoreHeader
            left={data.left}
            right={data.right}
            week={data.week}
            onWeek={onWeek}
            canPrev={data.week > 1}
            canNext={data.week < 18}
          />

          <LiveTickerBar ticker={data.ticker} />
          <YetToPlay data={data} />

          <div className="mt-3 space-y-1">
            {Array.from({ length: starterRows }).map((_, i) => {
              const left = data.left.starters[i];
              const right = data.right.starters[i];
              if (!left || !right) return null;
              return <PlayerRow key={`${left.id}-${right.id}-${i}`} left={left} right={right} onOpen={onPlayer} />;
            })}
          </div>

          <h2 className="mt-5 px-4 text-sm font-semibold tracking-tight">Bench</h2>
          <div className="mt-2 space-y-1">
            {Array.from({ length: benchRows }).map((_, i) => {
              const left = data.left.bench[i];
              const right = data.right.bench[i];
              if (!left && !right) return null;
              return (
                <PlayerRow
                  key={`bn-${left?.id ?? i}-${right?.id ?? i}`}
                  left={left ?? emptyPlayer("BN")}
                  right={right ?? emptyPlayer("BN")}
                  onOpen={onPlayer}
                />
              );
            })}
          </div>

          <p className="mt-4 px-4 text-center text-micro text-subtle">
            Updates every few seconds · Sleeper scoring · {data.season} {data.league.scoringLabel}
          </p>

          <div className="px-4">
            <button
              type="button"
              onClick={() => void share()}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]"
            >
              <Share2 className="size-4" />
              {shareMsg ?? "SHARE"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
