"use client";

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, MatchupSkeleton } from "@/components/shell/app-shell";
import { SetupPage } from "@/components/setup/setup-page";
import { clearProfile, loadProfile, setActiveLeague, type SavedProfile } from "@/lib/fantasy/leagues";

type Search = { week?: number; league?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const out: Search = {};
    const w = Number(search.week);
    if (Number.isFinite(w) && w >= 1 && w <= 18) out.week = Math.trunc(w);
    if (typeof search.league === "string" && search.league.trim()) {
      const t = search.league.trim();
      if (/^(espn|yahoo):\d+$/.test(t) || /^\d{4,24}$/.test(t)) out.league = t;
    }
    return out;
  },
  pendingComponent: MatchupSkeleton,
  component: Home,
});

function Home() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [profile, setProfile] = useState<SavedProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return (
      <SetupPage
        onReady={(next) => {
          setProfile(next);
          void navigate({ search: { league: next.activeLeagueId } });
        }}
      />
    );
  }

  const leagueId =
    search.league && profile.leagues.some((l) => l.id === search.league)
      ? search.league
      : profile.activeLeagueId;

  const active: SavedProfile = { ...profile, activeLeagueId: leagueId };

  return (
    <AppShell
      profile={active}
      requestedWeek={search.week}
      onWeek={(week) => {
        void navigate({
          search: {
            league: leagueId,
            ...(week ? { week } : {}),
          },
        });
      }}
      onLeague={(id) => {
        setActiveLeague(id);
        setProfile({ ...profile, activeLeagueId: id });
        void navigate({ search: { league: id } });
      }}
      onChangeAccount={() => {
        clearProfile();
        setProfile(null);
        void navigate({ search: {} });
      }}
    />
  );
}
