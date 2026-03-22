import type { EventCategory, EventSource } from "../../../../generated/prisma";

const RUBRIC_API = "https://api.hellorubric.com/";
const RUBRIC_EVENT_DETAILS_ENDPOINT =
  "https://appserver.getqpay.com:9090/AppServerSwapnil/event/details";
const UNSW_UNIVERSITY_ID = 5;

// Allowed society IDs from Rubric categories:
// Academic, Academic & Professional, Faculty & Constituent,
// Professional & Networking, Technology & Projects
const ALLOWED_SOCIETY_IDS = new Set([
  4716, 4865, 4990, 6279, 6363, 6613, 6942, 8221, 8430, 8677, 8983, 9331,
  10043, 10963, 11135, 12027, 12416, 12417, 12418, 12421, 12422, 12425, 12430,
  12437, 12438, 12442, 12444, 12445, 12446, 12455, 12456, 12457, 12459, 12461,
  12468, 12475, 12481, 12490, 12496, 12497, 12498, 12500, 12502, 12521, 12538,
  12540, 12549, 12654, 13388, 13450, 13583, 13593, 13887, 14001, 14036, 14042,
  14061, 14244, 14585, 14834,
]);

interface RubricEvent {
  sortindex: number;
  image: string;
  month: string;
  societyAvgRating: number;
  subtitle: string;
  societyid: number;
  destination: string;
  societyname: string;
  societylogo: string;
  title: string;
  day: string;
  info: string;
}

interface RubricSearchResponse {
  success: boolean;
  totalItemCount: number;
  results: RubricEvent[];
}

interface RubricEventDetails {
  eventName: string;
  eventTime: string;
  eventEndTime: string;
  eventAddress: string;
  eventDescription: string;
  eventOrganizer: string;
  bannerImageURL: string;
  hasBannerImage: boolean;
  eventId: number;
}

interface RubricEventDetailsResponse {
  success: boolean;
  eventDetails?: RubricEventDetails;
}

export interface ScrapedEvent {
  name: string;
  organiser: string;
  description: string | null;
  category: EventCategory;
  date: Date;
  endDate: Date | null;
  location: string | null;
  source: EventSource;
  sourceUrl: string;
  imageUrl: string | null;
}

export interface ScrapedSociety {
  name: string;
  imageUrl: string | null;
  rubricId: number;
}

function mapRubricCategory(subtitle: string): EventCategory {
  const map: Record<string, EventCategory> = {
    "Industry/Career": "CAREER_FAIR",
    "Class/Workshop": "WORKSHOP",
    "Sport/Competition": "HACKATHON",
    "Party/BBQ/Social": "SOCIAL",
    "Ball/Dinner/Gala": "SOCIAL",
    "Quiz/Trivia": "SOCIAL",
    "Cruise": "SOCIAL",
    "Show/Performance": "SOCIAL",
    "Trip/Camp": "SOCIAL",
    "Other": "NETWORKING",
  };
  return map[subtitle] ?? "NETWORKING";
}

function rubricEventToDate(event: RubricEvent): Date {
  // sortindex is a unix timestamp in seconds
  return new Date(event.sortindex * 1000);
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseRubricDateTime(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Format: "Sat, 21 Mar 2026 9:00 AM"
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

async function fetchEventDetails(
  eventId: string,
): Promise<RubricEventDetails | null> {
  try {
    const details = JSON.stringify({
      eventId,
      currentUrl: `https://campus.hellorubric.com/?eid=${eventId}`,
      device: "web_portal",
      version: 4,
      timestamp: Date.now(),
    });

    const resp = await fetch(RUBRIC_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `details=${encodeURIComponent(details)}&endpoint=${encodeURIComponent(RUBRIC_EVENT_DETAILS_ENDPOINT)}`,
    });

    const data = (await resp.json()) as RubricEventDetailsResponse;
    return data.success ? (data.eventDetails ?? null) : null;
  } catch {
    return null;
  }
}

async function fetchRubricEvents(
  limit: number,
  offset: number,
): Promise<RubricSearchResponse> {
  const details = JSON.stringify({
    firstCall: offset === 0,
    sortType: "date",
    desiredType: "events",
    limit,
    offset,
    sortDirection: "asc",
    searchQuery: "",
    eventsPeriodFilter: "All",
    universityId: UNSW_UNIVERSITY_ID,
    currentUrl: "https://campus.hellorubric.com/search?type=events",
    device: "web_portal",
    version: 4,
    timestamp: Date.now(),
  });

  const resp = await fetch(RUBRIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `details=${encodeURIComponent(details)}&endpoint=getUnifiedSearch`,
  });

  return (await resp.json()) as RubricSearchResponse;
}

export async function scrapeRubricEvents(
  maxEvents = 50,
): Promise<{ events: ScrapedEvent[]; societies: ScrapedSociety[] }> {
  const events: ScrapedEvent[] = [];
  const societyMap = new Map<number, ScrapedSociety>();
  let offset = 0;
  const batchSize = 50;

  while (events.length < maxEvents) {
    const limit = Math.min(batchSize, maxEvents - events.length);
    const response = await fetchRubricEvents(limit, offset);

    if (!response.results || response.results.length === 0) break;

    for (const event of response.results) {
      // Skip events from societies not in our allowed categories
      if (!ALLOWED_SOCIETY_IDS.has(event.societyid)) continue;

      const eventId = /eid=(\d+)/.exec(event.destination)?.[1];

      // Fetch detailed info for this event
      const details = eventId ? await fetchEventDetails(eventId) : null;

      const description = details?.eventDescription
        ? stripHtml(details.eventDescription)
        : null;
      const location = details?.eventAddress ?? null;
      const endDate = details?.eventEndTime
        ? parseRubricDateTime(details.eventEndTime)
        : null;
      const bannerImage =
        details?.hasBannerImage && details.bannerImageURL
          ? details.bannerImageURL
          : null;

      events.push({
        name: event.title.trim(),
        organiser: event.societyname,
        description,
        category: mapRubricCategory(event.subtitle),
        date: rubricEventToDate(event),
        endDate,
        location,
        source: "RUBRIC" as EventSource,
        sourceUrl: `https://campus.hellorubric.com/?eid=${eventId ?? ""}`,
        imageUrl:
          bannerImage ??
          (event.image.includes("pattern") ? null : event.image),
      });

      if (!societyMap.has(event.societyid)) {
        societyMap.set(event.societyid, {
          name: event.societyname,
          imageUrl: event.societylogo,
          rubricId: event.societyid,
        });
      }
    }

    offset += response.results.length;
    if (offset >= response.totalItemCount) break;
  }

  return {
    events,
    societies: Array.from(societyMap.values()),
  };
}
