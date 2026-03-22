"use client";

import type React from "react";
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
  Society: "border-l-teal-500 bg-teal-950/50",
  Company: "border-l-sky-500 bg-sky-950/50",
  Networking: "border-l-amber-500 bg-amber-950/50",
  Admin: "border-l-zinc-500 bg-zinc-900/80",
};

const CATEGORY_BADGE_STYLES: Record<string, React.CSSProperties> = {
  Event: { backgroundColor: "rgba(49, 46, 129, 0.6)", color: "#a5b4fc", borderColor: "rgba(67, 56, 202, 0.5)" },
  Application: { backgroundColor: "rgba(6, 78, 59, 0.6)", color: "#6ee7b7", borderColor: "rgba(4, 120, 87, 0.5)" },
  Research: { backgroundColor: "rgba(76, 29, 149, 0.6)", color: "#c4b5fd", borderColor: "rgba(109, 40, 217, 0.5)" },
  Society: { backgroundColor: "rgba(19, 78, 74, 0.6)", color: "#5eead4", borderColor: "rgba(15, 118, 110, 0.5)" },
  Company: { backgroundColor: "rgba(12, 74, 110, 0.6)", color: "#7dd3fc", borderColor: "rgba(3, 105, 161, 0.5)" },
  Networking: { backgroundColor: "rgba(120, 53, 15, 0.6)", color: "#fcd34d", borderColor: "rgba(146, 64, 14, 0.5)" },
  Admin: { backgroundColor: "rgba(39, 39, 42, 1)", color: "#a1a1aa", borderColor: "rgba(63, 63, 70, 0.5)" },
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
  const badgeStyle = CATEGORY_BADGE_STYLES[item.category] ?? CATEGORY_BADGE_STYLES.Admin!;
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
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base text-zinc-100 line-clamp-1 flex-1 min-w-0">
            {item.title}
          </h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border"
            style={badgeStyle}
          >
            {item.category}
          </span>
          {item.source && (
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {item.source}
            </span>
          )}
          {item.priority && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${priorityStyle}`}
            >
              {priorityLabel}
            </span>
          )}
        </div>
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
