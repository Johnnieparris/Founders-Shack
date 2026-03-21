"use client";

import type { FeedItem } from "~/lib/mock-opportunities";
import { OpportunityDetail } from "./OpportunityDetail";
import { ProfileCard } from "./ProfileCard";

interface DashboardSidebarProps {
  session: {
    user?: {
      name?: string | null;
      image?: string | null;
    };
  } | null;
  selectedItem: FeedItem | null;
  onCloseDetail: () => void;
}

export function DashboardSidebar({
  session,
  selectedItem,
  onCloseDetail,
}: DashboardSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:w-[30%] lg:min-w-[280px]">
      <ProfileCard
        name={session?.user?.name}
        image={session?.user?.image}
        degree="Computer Science"
        year={2}
      />
      <OpportunityDetail item={selectedItem} onClose={onCloseDetail} />
    </aside>
  );
}
