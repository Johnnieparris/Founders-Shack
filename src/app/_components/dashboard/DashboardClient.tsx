"use client";

import { useState } from "react";
import type { FeedItem } from "~/lib/mock-opportunities";
import { DashboardSidebar } from "./DashboardSidebar";
import { TimelineFeed } from "./TimelineFeed";

export function DashboardClient() {
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 lg:w-[70%]">
        <TimelineFeed
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      </div>
      <DashboardSidebar
        selectedItem={selectedItem}
        onCloseDetail={() => setSelectedItem(null)}
      />
    </div>
  );
}
