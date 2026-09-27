"use client";

import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { fetchLeaguePicker, fetchLiveMatchup } from "@/lib/fantasy/api";
import { formatPts } from "@/lib/fantasy/format";
import type { SavedProfile } from "@/lib/fantasy/leagues";
import { setActiveLeague } from "@/lib/fantasy/leagues";
import type { AppTab, PlayerView } from "@/lib/fantasy/types";
import { LeaguePage } from "@/components/league/league-page";
import { LeagueHeaderButton, LeagueSheet } from "@/components/league/league-switcher";
import { MatchupBoard, MatchupSkeleton } from "@/components/matchup/matchup-page";
import { MorePage } from "@/components/more/more-page";
import { FeedPage } from "@/components/feed/feed-page";
import { PlayerSheet } from "@/components/player/player-sheet";
import { PlayersPage } from "@/components/players/players-page";
import { TeamPage } from "@/components/team/team-page";
import { BottomNav } from "./bottom-nav";

function ShellInner({
  profile,
  requestedWeek,
  onWeek,
  onLeague,
  onChangeAccount,
}: {
  profile: SavedProfile;
  requestedWeek?: number;
  onWeek: (week: number) => void;
  onLeague: (slug: string) => void;
  onChangeAccount: () => void;
}) {
  const leagueId = profile.activeLeagueId;
  const leagueIds = profile.leagues.map((l) => l.id);
  const [tab, setTab] = useState<AppTab>("matchup");
  const [teamSide, setTeamSide] = useState<"left" | "right">("left");
  const [player, setPlayer] = useState<PlayerView | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [viewMatchupId, setViewMatchupId] = useState<number | undefined>(undefined);

  const query = useQuery({
    queryKey: ["matchup", profile.userId, leagueId, requestedWeek ?? "now", viewMatchupId ?? "mine"],
    queryFn: () =>
      fetchLiveMatchup({
        data: {
          week: requestedWeek,
          leagueId,
          userId: profile.userId,
          matchupId: viewMatchupId,
        },
      }),
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
    staleTime: 4000,
    placeholderData: (prev) => prev,
  });

  const leagues = useQuery({
    queryKey: ["league-picker", profile.userId, leagueIds.join(",")],
    queryFn: () =>
      fetchLeaguePicker({
        data: { userId: profile.userId, leagueIds },
      }),
    staleTime: 20_000,
    refetchInterval: 20_000,
  });

  const data = query.data;

  useEffect(() => {
    if (!data) return;
    document.title = `${formatPts(data.left.points)}–${formatPts(data.right.points)} · ${data.leagueName}`;
  }, [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab, leagueId]);

  useEffect(() => {
    setViewMatchupId(undefined);
  }, [leagueId, requestedWeek]);

  function selectLeague(slug: string) {
    setPickerOpen(false);
    setPlayer(null);
    setTeamSide("left");
    setViewMatchupId(undefined);
    setTab("matchup");
    setActiveLeague(slug);
    onLeague(slug);
  }

  function openMatchup(id: number | null) {
    setViewMatchupId(id ?? undefined);
    setTab("matchup");
  }

  if (query.isLoading && !data) {
    return <MatchupSkeleton />;
  }

  if ((query.isError && !data) || !data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <Radio className="size-8 text-live" />
        <h1 className="font-display text-lg font-semibold">Couldn’t load live scores</h1>
        <p className="max-w-sm text-sm text-muted">
          {query.error instanceof Error ? query.error.message : "Try again in a moment."}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          Retry
        </button>
        <button type="button" onClick={onChangeAccount} className="text-2xs font-semibold text-muted">
          Change account
        </button>
      </div>
    );
  }

  return (
    <div className="phone-glow min-h-dvh overflow-x-hidden">
      <div className="mx-auto min-h-dvh w-full max-w-md overflow-x-hidden pb-24">
        <LeagueHeaderButton name={data.leagueName} live={data.liveGames > 0} onOpen={() => setPickerOpen(true)} />

        {tab === "matchup" ? (
          <MatchupBoard
            data={data}
            onWeek={onWeek}
            onPlayer={setPlayer}
            viewingOther={Boolean(viewMatchupId && viewMatchupId !== data.myMatchupId)}
            onOpenMatchup={openMatchup}
          />
        ) : null}
        {tab === "team" ? (
          <TeamPage data={data} side={teamSide} onSide={setTeamSide} onPlayer={setPlayer} />
        ) : null}
        {tab === "players" ? <PlayersPage data={data} onPlayer={setPlayer} /> : null}
        {tab === "league" ? <LeaguePage data={data} onOpenMatchup={openMatchup} /> : null}
        {tab === "feed" ? <FeedPage /> : null}
        {tab === "more" ? (
          <MorePage
            data={data}
            leagues={leagues.data ?? []}
            onOpenLeagues={() => setPickerOpen(true)}
            onSelectLeague={selectLeague}
            onChangeAccount={onChangeAccount}
          />
        ) : null}
      </div>

      <BottomNav tab={tab} onTab={setTab} live={data.liveGames > 0} />
      <PlayerSheet
        player={player}
        week={data.week}
        league={data.leagueSlug}
        onClose={() => setPlayer(null)}
        onBackToMatchup={() => {
          setPlayer(null);
          setTab("matchup");
        }}
      />
      <LeagueSheet
        open={pickerOpen}
        currentSlug={data.leagueSlug}
        leagues={leagues.data ?? []}
        loading={leagues.isLoading}
        onClose={() => setPickerOpen(false)}
        onSelect={selectLeague}
      />
    </div>
  );
}

export function AppShell({
  profile,
  requestedWeek,
  onWeek,
  onLeague,
  onChangeAccount,
}: {
  profile: SavedProfile;
  requestedWeek?: number;
  onWeek: (week: number) => void;
  onLeague: (slug: string) => void;
  onChangeAccount: () => void;
}) {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnReconnect: true },
        },
      }),
    [],
  );
  return (
    <QueryClientProvider client={client}>
      <ShellInner
        profile={profile}
        requestedWeek={requestedWeek}
        onWeek={onWeek}
        onLeague={onLeague}
        onChangeAccount={onChangeAccount}
      />
    </QueryClientProvider>
  );
}

export { MatchupSkeleton };
