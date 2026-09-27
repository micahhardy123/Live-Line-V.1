"use client";

import { useState } from "react";
import { Check, ChevronRight, Radio } from "lucide-react";
import { lookupSleeperAccount } from "@/lib/fantasy/api";
import { sleeperAvatar } from "@/lib/fantasy/format";
import { saveProfile, type FantasyPlatform, type SavedLeague, type SavedProfile } from "@/lib/fantasy/leagues";
import type { AccountLookup } from "@/lib/fantasy/types";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/shared/bits";

const PLATFORMS: { id: FantasyPlatform; name: string; blurb: string; find: string; leagueHint: string }[] = [
  {
    id: "sleeper",
    name: "Sleeper",
    blurb: "Live lookup from your @handle",
    find: "Open Sleeper → tap your avatar. The @handle is your username. Type it here — we never fill it in.",
    leagueHint: "",
  },
  {
    id: "espn",
    name: "ESPN",
    blurb: "Live lookup: manager name + league URL",
    find: "Open ESPN Fantasy → your league. Your manager name sits next to your team. Copy it exactly.",
    leagueHint: "League URL looks like fantasy.espn.com/football/league?leagueId=123456",
  },
  {
    id: "yahoo",
    name: "Yahoo",
    blurb: "Live lookup: manager name + league URL",
    find: "Open Yahoo Fantasy → your team. Your manager name is at the top of the page.",
    leagueHint: "League URL looks like football.fantasysports.yahoo.com/f1/12345",
  },
];

export function SetupPage({ onReady }: { onReady: (profile: SavedProfile) => void }) {
  const [platform, setPlatform] = useState<FantasyPlatform | null>(null);
  const [username, setUsername] = useState("");
  const [leagueRef, setLeagueRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountLookup | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  const meta = PLATFORMS.find((p) => p.id === platform);

  async function lookup() {
    if (!platform) return;
    setError(null);
    setLoading(true);
    try {
      const data = await lookupSleeperAccount({
        data: { platform, username, leagueRef: platform === "sleeper" ? undefined : leagueRef },
      });
      setAccount(data);
      setPicked([]);
    } catch (e) {
      setAccount(null);
      setError(e instanceof Error ? e.message : "Couldn’t find that username");
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function finish() {
    if (!account) return;
    const leagues: SavedLeague[] = account.leagues
      .filter((l) => picked.includes(l.id))
      .map((l) => ({ id: l.id, name: l.name, shortName: l.shortName }));
    if (!leagues.length) {
      setError("Pick at least one league");
      return;
    }
    const live = leagues.find((l) => !l.id.startsWith("espn:") && !l.id.startsWith("yahoo:")) ?? leagues[0]!;
    const profile: SavedProfile = {
      platform: account.platform,
      username: account.username,
      userId: account.userId,
      displayName: account.displayName,
      avatar: account.avatar,
      leagues,
      activeLeagueId: live.id,
    };
    saveProfile(profile);
    onReady(profile);
  }

  return (
    <div className="phone-glow mx-auto min-h-dvh w-full max-w-md px-4 pb-10 pt-10">
      <p className="font-display text-micro font-bold tracking-[0.22em] text-primary">LIVELINE</p>
      <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">Set up your leagues</h1>
      <p className="mt-1 text-sm text-muted">Type your own username. We don’t save a demo account and we don’t fill it in for you.</p>

      <h2 className="mt-8 text-sm font-semibold">Where do you play?</h2>
      <div className="mt-2 space-y-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPlatform(p.id);
              setAccount(null);
              setError(null);
              setUsername("");
              setLeagueRef("");
              setPicked([]);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left",
              platform === p.id ? "bg-primary/15 shadow-[0_0_0_1px_rgb(92_225_197/0.35)]" : "bg-surface",
            )}
          >
            <div>
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-micro text-muted">{p.blurb}</div>
            </div>
            {platform === p.id ? <Check className="size-4 text-primary" /> : <ChevronRight className="size-4 text-subtle" />}
          </button>
        ))}
      </div>

      {meta && !account ? (
        <form
          className="mt-6"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            void lookup();
          }}
        >
          <p className="rounded-2xl bg-surface px-3 py-3 text-2xs leading-relaxed text-muted">{meta.find}</p>

          <label className="mt-4 block text-sm font-semibold" htmlFor="fantasy-user">
            {meta.name} username
          </label>
          <input
            id="fantasy-user"
            name="liveline-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            placeholder="type it yourself"
            className="mt-2 h-12 w-full rounded-2xl bg-surface px-3 text-sm text-fg outline-none placeholder:text-subtle"
          />

          {platform !== "sleeper" ? (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="league-ref">
                League URL or ID
              </label>
              <input
                id="league-ref"
                name="liveline-league"
                value={leagueRef}
                onChange={(e) => setLeagueRef(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                placeholder={platform === "espn" ? "leagueId=123456" : "/f1/12345"}
                className="mt-2 h-12 w-full rounded-2xl bg-surface px-3 text-sm text-fg outline-none placeholder:text-subtle"
              />
              <p className="mt-2 text-2xs text-muted">{meta.leagueHint}</p>
            </>
          ) : null}

          {error ? <p className="mt-2 text-2xs text-live">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || username.trim().length < 2 || (platform !== "sleeper" && leagueRef.trim().length < 3)}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-[0.16em] text-primary-fg disabled:opacity-40"
          >
            {loading ? "Looking up…" : "Find leagues"}
          </button>
        </form>
      ) : null}

      {account ? (
        <div className="mt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3">
            <Avatar src={sleeperAvatar(account.avatar)} name={account.displayName} size="md" />
            <div className="min-w-0">
              <div className="truncate font-semibold">{account.displayName}</div>
              <div className="text-micro text-muted">
                @{account.username} · {account.platform}
              </div>
            </div>
          </div>

          <h2 className="mt-5 text-sm font-semibold">Leagues to follow</h2>
          <p className="mt-1 text-2xs text-muted">Tap the ones you want. Live points work on Sleeper leagues.</p>
          <div className="mt-2 space-y-2">
            {account.leagues.map((lg) => {
              const on = picked.includes(lg.id);
              const live = !lg.id.startsWith("espn:") && !lg.id.startsWith("yahoo:");
              return (
                <button
                  key={lg.id}
                  type="button"
                  onClick={() => toggle(lg.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left",
                    on ? "bg-primary/15" : "bg-surface",
                  )}
                >
                  <Avatar src={lg.avatarUrl} name={lg.shortName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{lg.name}</div>
                    <div className="text-micro text-muted">
                      {lg.season} · {lg.teams} teams{live ? " · live" : " · public listing"}
                    </div>
                  </div>
                  {on ? <Check className="size-4 shrink-0 text-primary" /> : null}
                </button>
              );
            })}
          </div>
          {error ? <p className="mt-2 text-2xs text-live">{error}</p> : null}
          <button
            type="button"
            onClick={finish}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-[0.16em] text-primary-fg"
          >
            Open LiveLine
          </button>
          <button
            type="button"
            onClick={() => {
              setAccount(null);
              setError(null);
              setUsername("");
              setLeagueRef("");
            }}
            className="mt-3 w-full text-center text-2xs font-semibold text-muted"
          >
            Use a different username
          </button>
        </div>
      ) : null}

      {!platform ? (
        <div className="mt-10 flex items-start gap-2 text-2xs text-muted">
          <Radio className="mt-0.5 size-3.5 text-live" />
          Sleeper, ESPN, and Yahoo lookups are live. You have to type the username from the app.
        </div>
      ) : null}
    </div>
  );
}
