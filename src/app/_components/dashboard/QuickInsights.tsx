"use client";

const INSIGHTS = [
  { label: "Upcoming", value: "3", sub: "this week" },
  { label: "Saved", value: "5", sub: "opportunities" },
  { label: "Applied", value: "12", sub: "this term" },
];

export function QuickInsights() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1E1E1E] p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Quick insights
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {INSIGHTS.map((insight) => (
          <div key={insight.label} className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{insight.value}</p>
            <p className="text-xs font-medium text-zinc-400">{insight.label}</p>
            <p className="text-xs text-zinc-500">{insight.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
