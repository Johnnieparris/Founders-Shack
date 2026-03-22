"use client";

import type React from "react";
import type { FeedItem } from "~/lib/mock-opportunities";

interface OpportunityCardProps {
  item: FeedItem;
  userTags?: string[];
  isSelected?: boolean;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Event: "border-l-indigo-400/60",
  Application: "border-l-emerald-400/60",
  Research: "border-l-violet-400/60",
  Society: "border-l-teal-400/60",
  Company: "border-l-sky-400/60",
  Networking: "border-l-amber-400/60",
  Admin: "border-l-white/20",
};

const CATEGORY_BADGE_STYLES: Record<string, React.CSSProperties> = {
  Event: { backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", borderColor: "rgba(99, 102, 241, 0.3)" },
  Application: { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7", borderColor: "rgba(16, 185, 129, 0.3)" },
  Research: { backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#c4b5fd", borderColor: "rgba(139, 92, 246, 0.3)" },
  Society: { backgroundColor: "rgba(20, 184, 166, 0.15)", color: "#5eead4", borderColor: "rgba(20, 184, 166, 0.3)" },
  Company: { backgroundColor: "rgba(14, 165, 233, 0.15)", color: "#7dd3fc", borderColor: "rgba(14, 165, 233, 0.3)" },
  Networking: { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fcd34d", borderColor: "rgba(245, 158, 11, 0.3)" },
  Admin: { backgroundColor: "rgba(255, 255, 255, 0.06)", color: "rgba(255, 255, 255, 0.5)", borderColor: "rgba(255, 255, 255, 0.1)" },
};

const PRIORITY_STYLES: Record<string, string> = {
  today: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  this_week: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  closing_soon: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
};

const PRIORITY_LABELS: Record<string, string> = {
  today: "Today",
  this_week: "This Week",
  closing_soon: "Closing Soon",
};

export function OpportunityCard({ item, userTags = [], isSelected, onClick }: OpportunityCardProps) {
  const isProminent = item.priority === "today" || item.priority === "closing_soon";
  const tags = item.interestTags ?? [];
  const userTagSet = new Set(userTags.map((t) => t.toLowerCase()));
  const sortedTags = [...tags].sort((a, b) => {
    const aMatch = userTagSet.has(a.toLowerCase());
    const bMatch = userTagSet.has(b.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
  const borderColor = CATEGORY_COLORS[item.category] ?? "border-l-white/20";
  const badgeStyle = CATEGORY_BADGE_STYLES[item.category] ?? CATEGORY_BADGE_STYLES.Admin!;
  const priorityStyle = item.priority ? PRIORITY_STYLES[item.priority] : "";
  const priorityLabel = item.priority ? PRIORITY_LABELS[item.priority] : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full text-left rounded-2xl border border-white/[0.1]
        bg-white/[0.04] backdrop-blur-xl
        transition-all duration-200 ease-out
        hover:border-white/[0.15] hover:bg-white/[0.06]
        active:scale-[0.995]
        ${isSelected ? "ring-2 ring-violet-500/50 border-violet-400/20 bg-white/[0.06]" : ""}
        ${isProminent ? "p-5 border-l-4" : "p-4 border-l-4"}
        ${borderColor}
      `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base text-white/90 line-clamp-1 flex-1 min-w-0">
            {item.title}
          </h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border"
            style={badgeStyle}
          >
            {item.category}
          </span>
          {item.source && (
            <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-white/40">
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
        <p className="text-sm text-white/50 leading-snug line-clamp-2">
          {item.description}
        </p>
        {sortedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sortedTags.map((tag) => {
              const isMatch = userTagSet.has(tag.toLowerCase());
              return (
                <span
                  key={tag}
                  className={`
                    rounded-full px-3 py-1 text-xs font-medium transition-colors
                    ${
                      isMatch
                        ? "border border-violet-500/70 bg-violet-500/20 text-violet-400"
                        : "border border-zinc-600/60 bg-zinc-800/60 text-zinc-400"
                    }
                  `}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <span className="text-sm font-medium text-white/60">
            {item.date}
            {item.time && (
              <span className="text-white/30 font-normal"> · {item.time}</span>
            )}
          </span>
          <span
            className="
              rounded-lg px-3 py-1.5 text-sm font-medium
              border border-white/[0.08] bg-white/[0.04]
              text-violet-300
              group-hover:bg-violet-500/15 group-hover:border-violet-400/20
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
