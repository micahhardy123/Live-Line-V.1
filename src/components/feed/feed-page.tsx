"use client";

import { useQuery } from "@tanstack/react-query";
import { Newspaper, Radio, X } from "lucide-react";
import { useState } from "react";
import { Drawer } from "vaul";
import { fetchEspnArticle, fetchEspnFeed } from "@/lib/fantasy/api";
import type { FeedStory } from "@/lib/fantasy/types";

export function FeedPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["espn-feed"],
    queryFn: () => fetchEspnFeed(),
    staleTime: 60_000,
    refetchInterval: 90_000,
  });

  const stories = query.data ?? [];
  const teaser = stories.find((s) => s.id === openId) ?? null;

  return (
    <div className="pb-6">
      <header className="px-4 pt-4">
        <h1 className="font-display text-lg font-semibold">Feed</h1>
        <p className="mt-0.5 text-2xs text-muted">Live NFL headlines from ESPN</p>
      </header>

      {query.isLoading ? (
        <div className="mt-4 space-y-3 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : null}

      {query.isError ? (
        <div className="mx-4 mt-8 rounded-2xl bg-surface px-4 py-8 text-center">
          <Radio className="mx-auto size-6 text-live" />
          <p className="mt-2 text-sm text-muted">Couldn’t load ESPN headlines.</p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-3 rounded-full bg-primary px-4 py-2 text-2xs font-semibold text-primary-fg"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!query.isLoading && !query.isError && stories.length === 0 ? (
        <div className="mx-4 mt-8 rounded-2xl bg-surface px-4 py-8 text-center">
          <Newspaper className="mx-auto size-6 text-muted" />
          <p className="mt-2 text-sm text-muted">No stories yet. Check back in a bit.</p>
        </div>
      ) : null}

      <div className="mt-4 space-y-3 px-4">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onOpen={() => setOpenId(story.id)} />
        ))}
      </div>

      <ArticleSheet story={teaser} onClose={() => setOpenId(null)} />
    </div>
  );
}

function StoryCard({ story, onOpen }: { story: FeedStory; onOpen: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-surface">
      <button type="button" onClick={onOpen} className="w-full text-left">
        {story.image ? <img src={story.image} alt="" className="h-36 w-full object-cover" /> : null}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 text-micro text-subtle">
            {story.teams[0] ? (
              <span className="font-semibold text-primary">{story.teams.join(" · ")}</span>
            ) : (
              <span>NFL</span>
            )}
            {story.publishedLabel ? <span>· {story.publishedLabel}</span> : null}
          </div>
          <h2 className="mt-1 font-display text-sm font-semibold leading-snug">{story.headline}</h2>
          {story.description ? (
            <p className="mt-1 line-clamp-2 text-2xs leading-relaxed text-muted">{story.description}</p>
          ) : null}
        </div>
      </button>
    </article>
  );
}

function ArticleSheet({ story, onClose }: { story: FeedStory | null; onClose: () => void }) {
  const open = Boolean(story);
  const article = useQuery({
    queryKey: ["espn-article", story?.id],
    queryFn: () => fetchEspnArticle({ data: { id: story!.id } }),
    enabled: open && Boolean(story?.id),
    staleTime: 5 * 60_000,
  });
  const body = article.data;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-bg/80" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[94dvh] max-w-md flex-col rounded-t-2xl bg-sheet shadow-sheet outline-none">
          <div className="flex items-center justify-between px-4 pt-3">
            <Drawer.Title className="font-display text-sm font-semibold tracking-wide">STORY</Drawer.Title>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              aria-label="Close story"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            {(body?.image || story?.image) ? (
              <img src={body?.image || story?.image || ""} alt="" className="h-44 w-full object-cover" />
            ) : null}
            <div className="px-4 pt-3">
              <div className="flex items-center gap-2 text-micro text-subtle">
                {(body?.teams ?? story?.teams)?.[0] ? (
                  <span className="font-semibold text-primary">
                    {(body?.teams ?? story?.teams ?? []).join(" · ")}
                  </span>
                ) : (
                  <span>NFL</span>
                )}
                {body?.publishedLabel || story?.publishedLabel ? (
                  <span>· {body?.publishedLabel || story?.publishedLabel}</span>
                ) : null}
              </div>
              <h2 className="mt-1 font-display text-lg font-semibold leading-snug">
                {body?.headline || story?.headline}
              </h2>
              {body?.byline || story?.byline ? (
                <p className="mt-1 text-micro text-muted">{body?.byline || story?.byline}</p>
              ) : null}
            </div>
            <div className="space-y-3 px-4 pt-4">
              {article.isLoading ? (
                <p className="text-2xs text-muted">Loading full story…</p>
              ) : null}
              {article.isError ? (
                <p className="text-2xs leading-relaxed text-muted">
                  {story?.description || "Couldn’t load the full story."}
                </p>
              ) : null}
              {(body?.paragraphs ?? []).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted">
                  {p}
                </p>
              ))}
              {!article.isLoading && body && body.paragraphs.length === 0 && body.description ? (
                <p className="text-sm leading-relaxed text-muted">{body.description}</p>
              ) : null}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
