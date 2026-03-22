"use client";

import type { FeedItem } from "~/lib/mock-opportunities";

interface OpportunityDetailProps {
  item: FeedItem | null;
  onClose?: () => void;
}

export function OpportunityDetail({ item, onClose }: OpportunityDetailProps) {
  if (!item) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#1E1E1E] p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-400">
          Select an opportunity
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Click a card to view details
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxHeight: "calc(100vh - 8rem)" }} className="overflow-y-auto rounded-xl border border-zinc-800 bg-[#1E1E1E] p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {item.category}
          </span>
          <h3 className="mt-1 font-semibold text-lg text-zinc-100">
            {item.title}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {item.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="w-full object-cover"
          />
        </div>
      )}

      {[item.organiser, item.date, item.location, item.source].some(Boolean) && (
        <div className="mb-4 space-y-2 text-sm text-zinc-400">
          {item.organiser && (
            <p>
              <span className="font-medium text-zinc-500">Organiser:</span>{" "}
              <span className="text-zinc-300">{item.organiser}</span>
            </p>
          )}
          <p>
            <span className="font-medium text-zinc-500">When:</span>{" "}
            <span className="text-zinc-300">{item.date}</span>
            {item.time && <span className="text-zinc-400"> · {item.time}</span>}
          </p>
          {item.location && (
            <p>
              <span className="font-medium text-zinc-500">Where:</span>{" "}
              <span className="text-zinc-300">{item.location}</span>
            </p>
          )}
          {item.source && (
            <p>
              <span className="font-medium text-zinc-500">Source:</span>{" "}
              <span className="text-zinc-300">{item.source}</span>
            </p>
          )}
        </div>
      )}

      <p className="mb-6 text-sm leading-relaxed text-zinc-400">
        {item.fullDescription ?? item.description}
      </p>

      <div className="flex flex-wrap gap-3">
        {item.cta.url && (
          <a
            href={item.cta.url}
            className="
              inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium
              bg-indigo-600 text-white shadow-[var(--shadow-dashboard-button)]
              hover:bg-indigo-500 active:scale-[0.98]
              transition-all duration-150
            "
          >
            {item.cta.label}
          </a>
        )}
        <button
          type="button"
            className="
            rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium
            text-zinc-300 shadow-[var(--shadow-dashboard-button)]
            hover:bg-zinc-700 active:scale-[0.98]
            transition-all duration-150
          "
        >
          Save
        </button>
        <button
          type="button"
          className="
            rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium
            text-zinc-300 shadow-[var(--shadow-dashboard-button)]
            hover:bg-zinc-700 active:scale-[0.98]
            transition-all duration-150
          "
        >
          Mark applied
        </button>
      </div>
    </div>
  );
}
