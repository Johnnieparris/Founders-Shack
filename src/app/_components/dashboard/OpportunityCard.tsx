"use client";

import type { FeedItem } from "~/lib/mock-opportunities";

interface OpportunityCardProps {
  item: FeedItem;
  isSelected?: boolean;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Event: "border-l-indigo-500 bg-indigo-950/50",
  Application: "border-l-emerald-500 bg-emerald-950/50",
  Research: "border-l-violet-500 bg-violet-950/50",
  Networking: "border-l-amber-500 bg-amber-950/50",
  Admin: "border-l-zinc-500 bg-zinc-900/80",
};

const PRIORITY_STYLES: Record<string, string> = {
  today: "bg-red-900/60 text-red-300 ring-1 ring-red-700/50",
  this_week: "bg-amber-900/60 text-amber-300 ring-1 ring-amber-700/50",
  closing_soon: "bg-blue-900/60 text-blue-300 ring-1 ring-blue-700/50",
};

const PRIORITY_LABELS: Record<string, string> = {
  today: "Today",
  this_week: "This Week",
  closing_soon: "Closing Soon",
};

export function OpportunityCard({ item, isSelected, onClick }: OpportunityCardProps) {
  const isProminent = item.priority === "today" || item.priority === "closing_soon";
  const borderColor = CATEGORY_COLORS[item.category] ?? "border-l-zinc-500 bg-zinc-900/50";
  const priorityStyle = item.priority ? PRIORITY_STYLES[item.priority] : "";
  const priorityLabel = item.priority ? PRIORITY_LABELS[item.priority] : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full text-left rounded-[var(--radius-dashboard-card)] border border-zinc-800
        bg-gradient-to-b from-zinc-900 to-zinc-900/80
        shadow-[var(--shadow-dashboard-card-dark)]
        transition-all duration-200 ease-out
        hover:border-zinc-700 hover:shadow-[var(--shadow-dashboard-card-hover-dark)]
        active:scale-[0.995]
        ${isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 shadow-[var(--shadow-dashboard-card-hover-dark)]" : ""}
        ${isProminent ? "p-5 border-l-4" : "p-4 border-l-4"}
        ${borderColor}
      `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {item.category}
          </span>
          {item.priority && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityStyle}`}
            >
              {priorityLabel}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-base text-zinc-100 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-zinc-400 leading-snug line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <span className="text-sm font-medium text-zinc-300">
            {item.date}
            {item.time && (
              <span className="text-zinc-500 font-normal"> · {item.time}</span>
            )}
          </span>
          <span
            className="
              rounded-lg px-3 py-1.5 text-sm font-medium
              bg-zinc-800 shadow-[var(--shadow-dashboard-button)]
              border border-zinc-700
              text-indigo-400
              group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50
              active:scale-[0.98]
              transition-all duration-150
            "
          >
            {item.cta.label}
          </span>
        </div>
      </div>
    </button>
  );
}
