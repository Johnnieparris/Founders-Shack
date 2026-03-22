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
                  ? "bg-indigo-600 text-white shadow-[var(--shadow-dashboard-button)]"
                  : "bg-[#1E1E1E] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
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
