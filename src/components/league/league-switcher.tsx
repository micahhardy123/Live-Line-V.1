"use client";

import { Check, ChevronDown, Radio, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { formatPts } from "@/lib/fantasy/format";
import { setActiveLeague } from "@/lib/fantasy/leagues";
import type { LeaguePickerItem } from "@/lib/fantasy/types";
import { Avatar } from "@/components/shared/bits";

export function LeagueHeaderButton({
  name,
  live,
  onOpen,
}: {
  name: string;
  live: boolean;
  onOpen: () => void;
}) {
  return (
    <header className="flex items-center justify-center px-4 pt-3">
      <button type="button" onClick={onOpen} className="min-w-0 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="max-w-56 truncate font-display text-base font-semibold tracking-tight">{name}</span>
          <ChevronDown className="size-4 text-muted" />
        </div>
        <div className="flex items-center justify-center gap-1.5 text-micro text-muted">
          {live ? (
            <>
              <span className="live-dot size-1.5 rounded-full bg-live" />
              Live scoring
            </>
          ) : (
            "Switch league"
          )}
        </div>
      </button>
    </header>
  );
}

export function LeagueSheet({
  open,
  currentSlug,
  leagues,
  loading,
  onClose,
  onSelect,
}: {
  open: boolean;
  currentSlug: string;
  leagues: LeaguePickerItem[];
  loading: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-sheet pb-[env(safe-area-inset-bottom)] shadow-sheet sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-sheet/95 px-4 py-3 backdrop-blur">
          <div>
            <div className="font-display text-base font-semibold">My Leagues</div>
            <div className="text-micro text-muted">Switch to live scores in another league</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 px-4 pb-6 pt-2">
          {loading && leagues.length === 0 ? (
            <div className="space-y-3">
              <div className="h-28 animate-pulse rounded-2xl bg-surface" />
              <div className="h-28 animate-pulse rounded-2xl bg-surface" />
            </div>
          ) : null}
          {!loading && leagues.length === 0 ? (
            <div className="rounded-2xl bg-surface px-4 py-6 text-center">
              <Radio className="mx-auto size-5 text-live" />
              <p className="mt-2 text-sm text-muted">No leagues on this account.</p>
            </div>
          ) : null}
          {leagues.map((lg) => (
            <LeagueCard
              key={lg.slug}
              league={lg}
              active={lg.slug === currentSlug}
              onPick={() => {
                setActiveLeague(lg.id);
                onSelect(lg.slug);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeagueCard({
  league,
  active,
  onPick,
}: {
  league: LeaguePickerItem;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "w-full rounded-2xl bg-surface p-3 text-left transition-transform duration-150 active:scale-[0.98]",
        active && "shadow-[0_0_0_1px_rgb(92_225_197/0.45)]",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar src={league.avatarUrl} name={league.shortName} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 truncate font-display text-sm font-semibold">{league.name}</div>
            {active ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-micro font-bold tracking-wide text-primary">
                <Check className="size-3" />
                ACTIVE
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 text-micro text-muted">
            {league.season} · {league.teams} teams · {league.scoringLabel}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar src={league.myAvatar} name={league.myTeamName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-2xs font-semibold">{league.myTeamName}</div>
            <div className="text-micro text-muted">{league.myRecord}</div>
          </div>
        </div>
        <div className="text-center">
          <div className="font-display text-sm font-semibold tabular-nums">
            {formatPts(league.myPoints, 1)}–{formatPts(league.oppPoints, 1)}
          </div>
          <div className="text-micro text-subtle">Wk {league.week}</div>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <div className="min-w-0 text-right">
            <div className="truncate text-2xs font-semibold">{league.oppName}</div>
            <div className="text-micro text-muted">Opp</div>
          </div>
          <Avatar src={league.oppAvatar} name={league.oppName} size="sm" />
        </div>
      </div>
    </button>
  );
}
