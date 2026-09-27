import { cn } from "@/lib/cn";
import { slotLabel } from "@/lib/fantasy/format";
import type { SlotPos } from "@/lib/fantasy/types";

const tones: Record<string, string> = {
  QB: "bg-pos-qb text-primary-fg",
  RB: "bg-pos-rb text-fg",
  WR: "bg-pos-wr text-fg",
  TE: "bg-pos-te text-primary-fg",
  FLEX: "bg-pos-flex text-primary-fg",
  K: "bg-pos-k text-fg",
  DEF: "bg-pos-def text-primary-fg",
  BN: "bg-pos-bn text-fg",
};

export function PosBadge({ slot, className }: { slot: SlotPos; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5",
        "font-display text-micro font-bold tracking-wide",
        tones[slot] ?? tones.BN,
        className,
      )}
    >
      {slotLabel(slot)}
    </span>
  );
}
