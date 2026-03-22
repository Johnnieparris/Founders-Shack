import * as cheerio from "cheerio";
import type { EventCategory, EventSource } from "../../../../generated/prisma";
import type { ScrapedEvent } from "../types";

const BASE_URL = "https://www.engineersaustralia.org.au";
const EVENTS_PATH = "/learning-and-events/events-webinars-and-courses";
const NSW_FILTER = "event[0]=events_location:1401";
const MAX_PAGES = 3;

function mapEaCategory(
  type: string | null,
  title: string,
): EventCategory {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes("networking") ||
    lowerTitle.includes("ignite") ||
    lowerTitle.includes("social")
  )
    return "NETWORKING";
  if (lowerTitle.includes("award") || lowerTitle.includes("launch"))
    return "NETWORKING";
  if (lowerTitle.includes("site visit")) return "WORKSHOP";

  if (!type) return "WORKSHOP";
  const lower = type.toLowerCase();
  if (lower.includes("networking")) return "NETWORKING";
  if (lower.includes("conference")) return "NETWORKING";
  return "WORKSHOP";
}

function parseEventDate(text: string): Date | null {
  // Date formats seen: "24 Mar 2026", "25 Mar 2026"
  const dateMatch = text.match(/(\d{1,2}\s+\w{3,}\s+\d{4})/);
  if (!dateMatch?.[1]) return null;
  const parsed = new Date(dateMatch[1]);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export async function scrapeEngineersAustraliaEvents(): Promise<{
  events: ScrapedEvent[];
}> {
  const events: ScrapedEvent[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `${BASE_URL}${EVENTS_PATH}?${NSW_FILTER}&page=${page}`;

    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FounderShack/1.0)",
        },
      });

      if (!resp.ok) {
        console.warn(
          `EA: Page ${page} returned ${resp.status}, stopping pagination`,
        );
        break;
      }

      const html = await resp.text();
      const $ = cheerio.load(html);

      let foundOnPage = 0;

      // Event cards are links to individual event pages
      $('a[href*="/event/"]').each((_, el) => {
        const $el = $(el);
        const href = $el.attr("href") ?? "";

        // Skip non-event links (e.g. breadcrumbs, nav)
        const title = $el.find("h4").first().text().trim();
        if (!title) return;

        const fullUrl = href.startsWith("http")
          ? href
          : `${BASE_URL}${href}`;

        // Extract image
        const imgSrc = $el.find("img").first().attr("src") ?? null;
        const imageUrl =
          imgSrc && imgSrc.startsWith("/")
            ? `${BASE_URL}${imgSrc}`
            : imgSrc;

        // Gather all text content from the card
        const cardText = $el.text();

        // Parse date from card text
        const date = parseEventDate(cardText);
        if (!date) return;

        // Extract type badge text
        const badges = $el
          .find("span, div")
          .filter((_, span) => {
            const t = $(span).text().trim().toLowerCase();
            return (
              t === "event" ||
              t === "webinar" ||
              t === "course" ||
              t === "online" ||
              t === "in-person"
            );
          })
          .first()
          .text()
          .trim();

        // Location is typically in a span/p after the date/time info
        // Look for text containing a state abbreviation and postcode
        let location: string | null = null;
        $el.find("p, span, div").each((_, child) => {
          const text = $(child).text().trim();
          // Match: "Venue, City, NSW 2000" or "Sydney, NSW 2000"
          if (/\b(?:NSW|VIC|QLD|WA|SA|TAS|NT|ACT)\s*\d{4}\b/.test(text)) {
            location = text;
            return false; // break
          }
        });

        events.push({
          name: title,
          organiser: "Engineers Australia",
          description: null,
          category: mapEaCategory(badges || null, title),
          date,
          endDate: null,
          location,
          source: "ENGINEERS_AUSTRALIA" as EventSource,
          sourceUrl: fullUrl,
          imageUrl: imageUrl ?? null,
        });

        foundOnPage++;
      });

      if (foundOnPage === 0) break;
    } catch (err) {
      console.error(`EA: Failed to scrape page ${page}:`, err);
    }
  }

  return { events };
}
