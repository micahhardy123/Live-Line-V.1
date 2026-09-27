import { LayoutGrid, Newspaper, Search, Shirt, Swords, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AppTab } from "@/lib/fantasy/types";

const ITEMS: { id: AppTab; label: string; icon: typeof Swords }[] = [
  { id: "matchup", label: "Board", icon: Swords },
  { id: "team", label: "Team", icon: Shirt },
  { id: "players", label: "Players", icon: Search },
  { id: "league", label: "League", icon: Trophy },
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "more", label: "More", icon: LayoutGrid },
];

export function BottomNav({
  tab,
  onTab,
  live,
}: {
  tab: AppTab;
  onTab: (t: AppTab) => void;
  live: boolean;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-nav/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-md grid-cols-6 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active = tab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTab(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2 text-micro font-semibold",
                active ? "text-primary" : "text-subtle",
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
              {item.id === "matchup" && live ? (
                <span className="absolute right-4 top-1.5 size-1.5 rounded-full bg-live" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
