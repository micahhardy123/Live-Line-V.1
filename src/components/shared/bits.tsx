import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { teamLogo } from "@/lib/fantasy/format";

export function Avatar({
  src,
  name,
  size = "md",
  ring,
}: {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: "hot" | "mint" | "none";
}) {
  const dim = size === "sm" ? "size-8" : size === "lg" ? "size-14" : size === "xl" ? "size-16" : "size-11";
  const ringCls =
    ring === "hot"
      ? "shadow-[0_0_0_2px_var(--color-hot)]"
      : ring === "mint"
        ? "shadow-[0_0_0_2px_var(--color-primary)]"
        : "";
  return (
    <div className={cn("overflow-hidden rounded-full bg-surface-2", dim, ringCls)}>
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center font-display text-xs font-semibold">{name[0]}</div>
      )}
    </div>
  );
}

export function InjuryBadge({ tag }: { tag: string | null }) {
  if (!tag) return null;
  const bad = tag === "OUT" || tag === "IR" || tag === "NA" || tag === "D" || tag === "SUS";
  return (
    <span
      className={cn(
        "inline-flex h-4 items-center rounded-xs px-1 font-display text-micro font-bold tracking-wide",
        bad ? "bg-live text-fg" : "bg-ques text-ques-fg",
      )}
    >
      {tag}
    </span>
  );
}

export function TeamMark({ abbr, className }: { abbr: string | null; className?: string }) {
  if (!abbr) return null;
  return (
    <img
      src={teamLogo(abbr)}
      alt=""
      className={cn("size-4 object-contain", className)}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export function Football({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden>
      <ellipse cx="9" cy="6" rx="8" ry="5" fill="currentColor" />
      <path d="M5 6h8M7.2 4.2 9 8.2M10.8 4.2 9 8.2" stroke="#1b1b1b" strokeWidth="0.85" strokeLinecap="round" />
    </svg>
  );
}

export function DriveBar({ progress }: { progress: number }) {
  const pct = Math.round(Math.min(0.9, Math.max(0.08, progress)) * 100);
  return (
    <div className="relative mt-1.5 h-3">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border-strong">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-fg"
        style={{ left: `${pct}%` }}
      >
        <Football className="size-3" />
      </span>
    </div>
  );
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {right}
    </div>
  );
}
