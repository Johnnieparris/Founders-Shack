"use client";

import { useState } from "react";
import type { FeedItem } from "~/lib/mock-opportunities";
import { api } from "~/trpc/react";
import type { TabCategory } from "./CategoryTabs";
import { CategoryTabs } from "./CategoryTabs";
import { OpportunityCard } from "./OpportunityCard";

interface OpportunityFeedProps {
  selectedItem: FeedItem | null;
  onSelectItem: (item: FeedItem | null) => void;
}

export function OpportunityFeed({
  selectedItem,
  onSelectItem,
}: OpportunityFeedProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>("events");

  const { data: items = [], isLoading } = api.dashboard.getFeed.useQuery({
    category: activeTab,
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-100">
          Opportunity feed
        </h1>
        <p className="text-sm text-zinc-400">
          Track events, applications, and deadlines in one place
        </p>
      </div>

      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-zinc-800"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[var(--radius-dashboard-card)] border border-zinc-800 bg-zinc-900/80 p-12 text-center shadow-[var(--shadow-dashboard-card-dark)]">
            <p className="text-zinc-400">No opportunities in this category yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onClick={() =>
                onSelectItem(selectedItem?.id === item.id ? null : item)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
