"use client";

import type { FeedItem } from "~/lib/mock-opportunities";
import { OpportunityDetail } from "./OpportunityDetail";

interface DashboardSidebarProps {
  selectedItem: FeedItem | null;
  onCloseDetail: () => void;
}

export function DashboardSidebar({
  selectedItem,
  onCloseDetail,
}: DashboardSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:w-[30%] lg:min-w-[280px]">
      <OpportunityDetail item={selectedItem} onClose={onCloseDetail} />
    </aside>
  );
}
