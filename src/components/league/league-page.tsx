"use client";

import { useState } from "react";
import { Crown, History, MessageSquare, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPts, recordText } from "@/lib/fantasy/format";
import type { MatchupPayload, StandingRow } from "@/lib/fantasy/types";
import { Avatar } from "@/components/shared/bits";

type Panel = "home" | "chat" | "trophy" | "history" | "tools";

function Tile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Trophy;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl bg-surface px-2 py-3 text-center transition-transform duration-150 active:scale-[0.96]"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="text-micro font-semibold leading-tight text-muted">{label}</span>
    </button>
  );
}

function MatchupCard({
  m,
}: {
  m: MatchupPayload["otherMatchups"][number];
}) {
  return (
    <div className={cn("rounded-xl bg-surface px-3 py-3", m.isFeatured && "shadow-[0_0_0_1px_rgb(92_225_197/0.25)]")}>
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar src={m.leftAvatar} name={m.leftName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{m.leftName}</div>
            <div className="text-micro text-muted">
              {m.leftRecord} (#{m.leftRank})
            </div>
          </div>
        </div>
        <div className="font-display text-sm font-semibold tabular-nums">{formatPts(m.leftPoints, 1)}</div>
      </div>
      <div className="my-2 flex items-center justify-end">
        {m.isLive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 font-display text-micro font-bold tracking-wider text-live">
            <span className="live-dot size-1.5 rounded-full bg-live" />
            LIVE
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar src={m.rightAvatar} name={m.rightName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{m.rightName}</div>
            <div className="text-micro text-muted">
              {m.rightRecord} (#{m.rightRank})
            </div>
          </div>
        </div>
        <div className="font-display text-sm font-semibold tabular-nums">{formatPts(m.rightPoints, 1)}</div>
      </div>
    </div>
  );
}

function StandingLine({ row }: { row: StandingRow }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0",
        (row.isLeft || row.isRight) && "bg-surface-live",
      )}
    >
      <span className="w-5 text-center font-display text-2xs text-subtle">{row.rank}</span>
      <Avatar src={row.avatarUrl} name={row.teamName} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{row.teamName}</div>
        <div className="truncate text-micro text-muted">{row.displayName}</div>
      </div>
      <div className="text-right">
        <div className="font-display text-sm tabular-nums">{recordText(row.wins, row.losses, row.ties)}</div>
        <div className="text-micro tabular-nums text-muted">{formatPts(row.pointsFor, 1)} PF</div>
      </div>
    </div>
  );
}

export function LeaguePage({
  data,
  onOpenMatchup,
}: {
  data: MatchupPayload;
  onOpenMatchup: (id: number) => void;
}) {
  const [panel, setPanel] = useState<Panel>("home");
  const info = data.league;

  return (
    <div className="pb-4">
      <header className="flex items-center gap-3 px-4 pt-4">
        <Avatar src={info.avatarUrl} name={info.name} size="lg" />
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-semibold">{info.name}</div>
          <div className="text-2xs text-muted">
            {info.season} · {info.teams} teams · {info.scoringLabel}
          </div>
        </div>
      </header>

      {panel !== "home" ? (
        <div className="px-4 pt-3">
          <button type="button" onClick={() => setPanel("home")} className="text-2xs font-semibold text-primary">
            ← League home
          </button>
        </div>
      ) : null}

      {panel === "home" ? (
        <>
          <div className="mt-4 grid grid-cols-4 gap-2 px-4">
            <Tile icon={MessageSquare} label="League Chat" onClick={() => setPanel("chat")} />
            <Tile icon={Trophy} label="Trophy Room" onClick={() => setPanel("trophy")} />
            <Tile icon={History} label="League History" onClick={() => setPanel("history")} />
            <Tile icon={Settings} label="LM Tools" onClick={() => setPanel("tools")} />
          </div>

          {info.divisions.length > 0 ? (
            <>
              <h2 className="mt-6 px-4 text-sm font-semibold">Divisions</h2>
              <div className="mt-2 space-y-3 px-4">
                {info.divisions.map((div) => (
                  <div key={div.id} className="overflow-hidden rounded-2xl bg-surface">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-2xs font-semibold tracking-wide text-primary">{div.name}</span>
                      <span className="text-micro text-subtle">{div.rows.length} teams</span>
                    </div>
                    {div.rows.map((row) => (
                      <StandingLine key={row.rosterId} row={row} />
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <h2 className="mt-6 px-4 text-sm font-semibold">Matchups</h2>
          <div className="mt-2 space-y-2 px-4">
            {data.otherMatchups.map((m) => (
              <button
                key={m.matchupId}
                type="button"
                onClick={() => onOpenMatchup(m.matchupId)}
                className="block w-full text-left"
              >
                <MatchupCard m={m} />
              </button>
            ))}
          </div>

          <h2 className="mt-6 px-4 text-sm font-semibold">Recent Activity</h2>
          <div className="mt-2 divide-y divide-border overflow-hidden rounded-xl bg-surface mx-4">
            {data.activity.length === 0 ? (
              <p className="px-3 py-4 text-center text-2xs text-muted">No moves this week.</p>
            ) : (
              data.activity.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-3 py-2.5">
                  <Avatar src={a.avatarUrl} name={a.teamName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{a.teamName}</div>
                    <div className="text-2xs text-muted">
                      {a.type === "waiver" ? "Waiver" : a.type === "free_agent" ? "Free agent" : a.type}
                      {a.adds.length ? ` · add ${a.adds.map((x) => x.name).join(", ")}` : ""}
                      {a.drops.length ? ` · drop ${a.drops.map((x) => x.name).join(", ")}` : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : null}

      {panel === "chat" ? (
        <div className="mx-4 mt-3 overflow-hidden rounded-xl bg-surface">
          <div className="px-3 py-2 text-2xs text-muted">Recent roster moves</div>
          {data.activity.map((a) => (
            <div key={a.id} className="flex gap-3 border-t border-border px-3 py-3">
              <Avatar src={a.avatarUrl} name={a.teamName} size="sm" />
              <div>
                <div className="text-sm font-semibold">{a.teamName}</div>
                <p className="text-2xs text-muted">
                  {a.adds.length ? `Added ${a.adds.map((x) => x.name).join(", ")}. ` : ""}
                  {a.drops.length ? `Dropped ${a.drops.map((x) => x.name).join(", ")}.` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {panel === "trophy" ? (
        <div className="mx-4 mt-3 space-y-3">
          {info.lastWinnerName ? (
            <div className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3">
              <Crown className="size-5 text-primary" />
              <div>
                <div className="text-micro uppercase tracking-wide text-subtle">Reigning champion</div>
                <div className="font-display text-sm font-semibold">{info.lastWinnerName}</div>
              </div>
            </div>
          ) : null}
          {info.divisions.length > 0 ? (
            info.divisions.map((div) => (
              <div key={div.id} className="overflow-hidden rounded-2xl bg-surface">
                <div className="px-3 py-2 text-2xs font-semibold tracking-wide text-primary">{div.name}</div>
                {div.rows.map((row) => (
                  <StandingLine key={row.rosterId} row={row} />
                ))}
              </div>
            ))
          ) : (
            <div className="overflow-hidden rounded-2xl bg-surface">
              {data.standings.map((row) => (
                <StandingLine key={row.rosterId} row={row} />
              ))}
            </div>
          )}
          {info.divisions.length > 0 ? (
            <>
              <h3 className="px-1 pt-1 text-sm font-semibold">Overall</h3>
              <div className="overflow-hidden rounded-2xl bg-surface">
                {data.standings.map((row) => (
                  <StandingLine key={`all-${row.rosterId}`} row={row} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {panel === "history" ? (
        <div className="mx-4 mt-3 space-y-2">
          <div className="rounded-xl bg-surface px-3 py-3">
            <div className="text-sm font-semibold">Season {info.season}</div>
            <p className="mt-1 text-2xs text-muted">
              {info.teams}-team {info.keeper ? "keeper" : "redraft"} · {info.scoringLabel} · playoffs week{" "}
              {info.playoffWeekStart} ({info.playoffTeams} teams)
            </p>
          </div>
          {data.standings.slice(0, 3).map((row) => (
            <div key={row.rosterId} className="flex items-center justify-between rounded-xl bg-surface px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xs text-subtle">#{row.rank}</span>
                <span className="text-sm font-semibold">{row.teamName}</span>
              </div>
              <span className="font-display text-sm tabular-nums">{recordText(row.wins, row.losses, row.ties)}</span>
            </div>
          ))}
        </div>
      ) : null}

      {panel === "tools" ? (
        <div className="mx-4 mt-3 overflow-hidden rounded-xl bg-surface">
          {[
            ["Scoring", info.scoringLabel],
            ["Pass TD", `${info.passTd} pts`],
            ["Rush / Rec TD", `${info.rushTd} pts`],
            ["Reception", `${info.rec}`],
            ["Teams", String(info.teams)],
            ["Playoff teams", String(info.playoffTeams)],
            ["Playoff start", `Week ${info.playoffWeekStart}`],
            ["Trade deadline", `Week ${info.tradeDeadline}`],
            ["Waivers process", info.waiverDay],
            ["Format", info.keeper ? "Keeper" : "Redraft"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0">
              <span className="text-sm text-muted">{k}</span>
              <span className="text-sm font-semibold">{v}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
