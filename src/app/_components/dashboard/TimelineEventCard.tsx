"use client";

import type React from "react";
import type { FeedItem } from "~/lib/mock-opportunities";

const TAG_STYLES: Record<string, React.CSSProperties> = {
  Research: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    color: "#fcd34d",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  Society: {
    backgroundColor: "rgba(19, 78, 74, 0.15)",
    color: "#5eead4",
    borderColor: "rgba(15, 118, 110, 0.3)",
  },
  Company: {
    backgroundColor: "rgba(12, 74, 110, 0.15)",
    color: "#7dd3fc",
    borderColor: "rgba(3, 105, 161, 0.3)",
  },
};

interface TimelineEventCardProps {
  item: FeedItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TimelineEventCard({
  item,
  isSelected,
  onClick,
}: TimelineEventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full text-left rounded-2xl border border-white/[0.1]
        bg-white/[0.04] p-5 backdrop-blur-xl
        transition-all duration-200 ease-out
        hover:border-white/[0.15] hover:bg-white/[0.06]
        active:scale-[0.995]
        ${isSelected ? "ring-2 ring-violet-500/50 border-violet-400/20 bg-white/[0.06]" : ""}
      `}
    >
      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          {item.time && (
            <p className="mb-1 text-xs text-white/30">{item.time}</p>
          )}
          <div className="mb-2 flex items-baseline gap-2.5">
            <h3 className="text-lg font-bold text-white/90 line-clamp-1 shrink min-w-0">
              {item.title}
            </h3>
            {TAG_STYLES[item.category] && (
              <span
                className="shrink-0 rounded-full border px-3 py-[5px] text-[11px] font-medium inline-flex items-center justify-center"
                style={TAG_STYLES[item.category]}
              >
                {item.category}
              </span>
            )}
          </div>
          {item.organiser && (
            <p className="mb-1 flex items-center gap-2 text-sm text-white/50">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-xs font-medium text-white/60">
                {item.organiser[0]}
              </span>
              By {item.organiser}
            </p>
          )}
          {item.source && (
            <p className="mb-1 text-xs text-white/30">
              via {item.source}
            </p>
          )}
          {item.location && (
            <p className="flex items-center gap-2 text-sm text-white/50">
              <svg
                className="h-4 w-4 shrink-0 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {item.location}
            </p>
          )}
        </div>
        {item.imageUrl && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </button>
  );
}
