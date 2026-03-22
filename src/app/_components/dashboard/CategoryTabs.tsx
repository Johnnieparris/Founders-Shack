"use client";

export type TabCategory = "events" | "applications" | "admin";

interface CategoryTabsProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
}

const TABS: { id: TabCategory; label: string }[] = [
  { id: "events", label: "Events" },
  { id: "applications", label: "Applications" },
  { id: "admin", label: "Admin / Deadlines" },
];

export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`
              rounded-full px-4 py-2 text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? "border border-violet-400/20 bg-violet-500/20 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                  : "border border-white/[0.08] bg-white/[0.04] text-white/40 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
