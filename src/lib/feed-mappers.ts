import type {
  EventCategory,
  EventSource,
  OpportunityType,
} from "../../generated/prisma";
import type { FeedItem, FeedItemCta, OpportunityCategory, Priority } from "./mock-opportunities";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateSortKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(d: Date, refDate: Date = new Date()) {
  const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dDate.getTime() === today.getTime()) return "Today";
  if (dDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}

function computePriority(date: Date, refDate: Date = new Date()): Priority {
  const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "closing_soon";
  if (diffDays <= 7) return "this_week";
  return null;
}

const EVENT_CATEGORY_TO_DISPLAY: Record<EventCategory, OpportunityCategory> = {
  INDUSTRY_PROGRAM: "Event",
  NETWORKING: "Networking",
  CAREER_FAIR: "Networking",
  COMPANY_TALK: "Event",
  SOCIAL: "Event",
  WORKSHOP: "Event",
  HACKATHON: "Event",
};

const OPPORTUNITY_TYPE_TO_DISPLAY: Record<OpportunityType, OpportunityCategory> = {
  SOCIETY_REC: "Society",
  PROJECT_TEAM: "Application",
  RESEARCH: "Research",
  COMPANY: "Company",
};

const EVENT_SOURCE_DISPLAY: Record<string, string> = {
  RUBRIC: "Rubric",
  PWC: "PwC",
  ENGINEERS_AUSTRALIA: "Engineers Australia",
  UNSW_TOR: "UNSW Taste of Research",
};

function formatSourceName(source: EventSource): string {
  return source
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}

type EventWithSociety = {
  id: string;
  name: string;
  organiser: string;
  description: string | null;
  category: EventCategory;
  date: Date;
  endDate: Date | null;
  location: string | null;
  source: EventSource;
  sourceUrl: string | null;
  imageUrl: string | null;
  aiSummary: string | null;
  society: { name: string } | null;
};

export function eventToFeedItem(event: EventWithSociety): FeedItem {
  const refDate = new Date();
  const d = event.date;
  const organiser = event.organiser || (event.society?.name ?? "");
  const ctaUrl = event.sourceUrl ?? "#";

  const cta: FeedItemCta = {
    label: event.sourceUrl ? "Learn More" : "Register",
    action: "learn_more",
    url: ctaUrl,
  };

  let time: string | undefined;
  if (event.endDate) {
    time = `${formatTime(event.date)} – ${formatTime(event.endDate)}`;
  } else {
    time = formatTime(d);
  }

  return {
    id: event.id,
    type: "event",
    feedCategory: "events",
    title: event.name,
    description: event.description ?? event.aiSummary ?? "",
    category: EVENT_CATEGORY_TO_DISPLAY[event.category] ?? "Event",
    date: formatDate(d),
    dateSortKey: formatDateSortKey(d),
    dateLabel: formatDateLabel(d, refDate),
    dayLabel: formatDayLabel(d),
    time,
    priority: computePriority(d, refDate),
    cta,
    organiser: organiser || undefined,
    location: event.location ?? undefined,
    fullDescription: event.description ?? event.aiSummary ?? undefined,
    imageUrl: event.imageUrl ?? undefined,
    source: EVENT_SOURCE_DISPLAY[event.source] ?? formatSourceName(event.source),
  };
}

type OpportunityWithSociety = {
  id: string;
  name: string;
  description: string | null;
  type: OpportunityType;
  applicationDeadline: Date | null;
  url: string | null;
  source: string | null;
  society: { name: string } | null;
};

export function opportunityToFeedItem(opp: OpportunityWithSociety): FeedItem {
  const refDate = new Date();
  const d = opp.applicationDeadline;
  const ctaUrl = opp.url ?? "#";

  const cta: FeedItemCta = {
    label: opp.url ? "Apply" : "Learn More",
    action: opp.url ? "apply" : "learn_more",
    url: ctaUrl,
  };

  return {
    id: opp.id,
    type: "opportunity",
    feedCategory: "applications",
    title: opp.name,
    description: opp.description ?? "",
    category: OPPORTUNITY_TYPE_TO_DISPLAY[opp.type] ?? "Application",
    date: d ? formatDate(d) : "",
    dateSortKey: d ? formatDateSortKey(d) : "",
    dateLabel: d ? formatDateLabel(d, refDate) : "",
    dayLabel: d ? formatDayLabel(d) : "",
    priority: d ? computePriority(d, refDate) : null,
    cta,
    organiser: opp.society?.name ?? undefined,
    fullDescription: opp.description ?? undefined,
    source: opp.source ? (EVENT_SOURCE_DISPLAY[opp.source] ?? opp.source) : undefined,
  };
}
