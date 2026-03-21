"use client";

import type { FeedItem } from "~/lib/mock-opportunities";

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
        group w-full text-left rounded-xl border border-zinc-800
        bg-[#1E1E1E] p-5
        transition-all duration-200 ease-out
        hover:border-zinc-700 hover:bg-zinc-800/50
        active:scale-[0.995]
        ${isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#121212]" : ""}
      `}
    >
      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          {item.time && (
            <p className="mb-1 text-xs text-zinc-500">{item.time}</p>
          )}
          <h3 className="mb-2 text-lg font-bold text-white line-clamp-1">
            {item.title}
          </h3>
          {item.organiser && (
            <p className="mb-1 flex items-center gap-2 text-sm text-zinc-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-zinc-300">
                {item.organiser[0]}
              </span>
              By {item.organiser}
            </p>
          )}
          {item.location && (
            <p className="flex items-center gap-2 text-sm text-zinc-400">
              <svg
                className="h-4 w-4 shrink-0 text-zinc-500"
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
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
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
