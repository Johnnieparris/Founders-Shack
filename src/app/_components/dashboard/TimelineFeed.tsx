"use client";

import { useState, useMemo } from "react";
import type { FeedItem } from "~/lib/mock-opportunities";
import { api } from "~/trpc/react";
import type { TabCategory } from "./CategoryTabs";
import { CategoryTabs } from "./CategoryTabs";
import { TimelineEventCard } from "./TimelineEventCard";

interface TimelineFeedProps {
  selectedItem: FeedItem | null;
  onSelectItem: (item: FeedItem | null) => void;
}

export function TimelineFeed({
  selectedItem,
  onSelectItem,
}: TimelineFeedProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>("events");

  const { data, isLoading } = api.dashboard.getFeed.useQuery({
    category: activeTab,
  });
  const items = data?.items ?? [];
  const userTags = data?.userTags ?? [];

  const groupedByDate = useMemo(() => {
    const groups = new Map<
      string,
      { dateLabel: string; dayLabel: string; items: FeedItem[] }
    >();
    const sorted = [...items].sort(
      (a, b) => a.dateSortKey.localeCompare(b.dateSortKey)
    );
    for (const item of sorted) {
      const existing = groups.get(item.dateSortKey);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.set(item.dateSortKey, {
          dateLabel: item.dateLabel,
          dayLabel: item.dayLabel,
          items: [item],
        });
      }
    }
    return Array.from(groups.entries());
  }, [items]);

  const tabLabels: Record<TabCategory, string> = {
    events: "Events",
    applications: "Applications",
    admin: "Admin / Deadlines",
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-white/90">
            {tabLabels[activeTab]}
          </h1>
          <p className="text-sm text-white/35">
            Track opportunities and never miss a deadline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/70"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative pl-6">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-8">
                <div className="mb-4 h-6 w-6 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="space-y-4">
                  <div className="h-32 animate-pulse rounded-xl bg-white/[0.04]" />
                  <div className="h-32 animate-pulse rounded-xl bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ) : groupedByDate.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-12 text-center backdrop-blur-xl">
            <p className="text-white/40">
              No opportunities in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedByDate.map(([dateKey, { dateLabel, dayLabel, items: dateItems }]) => (
              <div key={dateKey} className="relative pl-8">
                {/* Vertical dotted line connecting all nodes — extends through space-y-10 gap to next group */}
                <div
                  className="absolute left-0 top-2 -bottom-[2.75rem] w-px -translate-x-1/2 border-l border-dashed border-white/[0.1]"
                  aria-hidden
                />
                <div
                  className="absolute left-0 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-violet-400/50"
                  aria-hidden
                />
                <div className="mb-4">
                  <span className="font-bold text-white/90">{dateLabel}</span>
                  <span className="ml-2 text-white/35">{dayLabel}</span>
                </div>
                <div className="space-y-4">
                  {dateItems.map((item) => (
                    <TimelineEventCard
                      key={item.id}
                      item={item}
                      userTags={userTags}
                      isSelected={selectedItem?.id === item.id}
                      onClick={() =>
                        onSelectItem(selectedItem?.id === item.id ? null : item)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
