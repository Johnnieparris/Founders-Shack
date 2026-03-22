import type { EventCategory, EventSource } from "../../../../generated/prisma";
import type { ScrapedEvent } from "../types";
import { stripHtml } from "../utils";

const PWC_EVENTS_URL = "https://jobs-au.pwc.com/au/en/events";

interface PwcEventRaw {
  eventScheduleId?: string;
  title: string;
  description?: string;
  eStartDate: string;
  eEndDate?: string;
  eLocation?: Array<{
    city?: string;
    state?: string;
    address1?: string;
  }>;
  eImageUrl?: string;
  ecategoryKey?: string;
  eventId?: string;
}

function mapPwcCategory(
  _categoryKey: string | undefined,
): EventCategory {
  return "INDUSTRY_PROGRAM";
}

function formatLocation(
  locations: PwcEventRaw["eLocation"],
): string | null {
  const loc = locations?.[0];
  if (!loc) return null;
  const parts = [loc.address1, loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export async function scrapePwcEvents(): Promise<{
  events: ScrapedEvent[];
}> {
  const events: ScrapedEvent[] = [];

  const resp = await fetch(PWC_EVENTS_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; FounderShack/1.0)",
    },
  });
  const html = await resp.text();

  // phApp.ddo is one big object. Extract it by finding the assignment and
  // using bracket-counting to grab the full JSON object.
  const ddoStart = html.indexOf("phApp.ddo");
  if (ddoStart === -1) {
    console.warn("PwC: Could not find phApp.ddo in page HTML");
    return { events };
  }

  const jsonStart = html.indexOf("{", ddoStart);
  if (jsonStart === -1) {
    console.warn("PwC: Could not find JSON start after phApp.ddo");
    return { events };
  }

  // Find matching closing brace via bracket counting
  let depth = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }

  if (jsonEnd === -1) {
    console.warn("PwC: Could not find matching closing brace for phApp.ddo");
    return { events };
  }

  let rawEvents: PwcEventRaw[];
  try {
    const ddo = JSON.parse(html.slice(jsonStart, jsonEnd)) as {
      eagerLoadEventList?: {
        events?: PwcEventRaw[];
        data?: { events?: PwcEventRaw[] };
      };
    };
    rawEvents =
      ddo.eagerLoadEventList?.data?.events ??
      ddo.eagerLoadEventList?.events ??
      [];
  } catch (e) {
    console.error("PwC: Failed to parse ddo JSON:", e);
    return { events };
  }

  if (rawEvents.length === 0) {
    console.warn("PwC: No events found in eagerLoadEventList");
    return { events };
  }

  for (const raw of rawEvents) {
    const startDate = new Date(raw.eStartDate);
    if (isNaN(startDate.getTime())) continue;

    const endDate = raw.eEndDate ? new Date(raw.eEndDate) : null;
    const eventId =
      raw.eventScheduleId ?? raw.eventId ?? "";
    const sourceUrl = `${PWC_EVENTS_URL}#${eventId}`;

    events.push({
      name: raw.title?.trim() ?? "PwC Event",
      organiser: "PwC Australia",
      description: raw.description ? stripHtml(raw.description) : null,
      category: mapPwcCategory(raw.ecategoryKey),
      date: startDate,
      endDate:
        endDate && !isNaN(endDate.getTime()) ? endDate : null,
      location: formatLocation(raw.eLocation),
      source: "PWC" as EventSource,
      sourceUrl,
      imageUrl: raw.eImageUrl ?? null,
    });
  }

  return { events };
}
