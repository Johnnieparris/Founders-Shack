import type { PrismaClient } from "../../../generated/prisma";
import { scrapeRubricEvents } from "./sources/rubric";
import { scrapePwcEvents } from "./sources/pwc";
import { scrapeEngineersAustraliaEvents } from "./sources/engineers-australia";
import { scrapeUnswTorOpportunities } from "./sources/unsw-tor";
import type { ScrapedEvent, ScrapedOpportunity } from "./types";

export interface ScrapeOptions {
  maxRubricEvents?: number;
  scrapeRubric?: boolean;
  scrapePwc?: boolean;
  scrapeEngineersAustralia?: boolean;
  scrapeUnsw?: boolean;
}

interface ScrapeResults {
  events: number;
  opportunities: number;
  societies: number;
  skippedDuplicates: number;
  errors: string[];
}

async function upsertEvents(
  db: PrismaClient,
  events: ScrapedEvent[],
  results: ScrapeResults,
) {
  for (const event of events) {
    const existing = await db.event.findFirst({
      where: { sourceUrl: event.sourceUrl },
    });
    if (existing) {
      results.skippedDuplicates++;
      continue;
    }

    const society = await db.society.findUnique({
      where: { name: event.organiser },
    });

    await db.event.create({
      data: {
        name: event.name,
        organiser: event.organiser,
        description: event.description,
        category: event.category,
        date: event.date,
        endDate: event.endDate,
        location: event.location,
        source: event.source,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        societyId: society?.id ?? null,
      },
    });
    results.events++;
  }
}

async function upsertOpportunities(
  db: PrismaClient,
  opportunities: ScrapedOpportunity[],
  results: ScrapeResults,
) {
  for (const opp of opportunities) {
    const existing = await db.opportunity.findFirst({
      where: { sourceUrl: opp.sourceUrl },
    });
    if (existing) {
      results.skippedDuplicates++;
      continue;
    }

    await db.opportunity.create({
      data: {
        name: opp.name,
        description: opp.description,
        type: opp.type,
        applicationDeadline: opp.applicationDeadline,
        url: opp.url,
        sourceUrl: opp.sourceUrl,
        source: opp.source,
      },
    });
    results.opportunities++;
  }
}

export async function scrapeAll(
  db: PrismaClient,
  options: ScrapeOptions = {},
): Promise<ScrapeResults> {
  const {
    maxRubricEvents = 50,
    scrapeRubric = true,
    scrapePwc = true,
    scrapeEngineersAustralia = true,
    scrapeUnsw = true,
  } = options;

  const results: ScrapeResults = {
    events: 0,
    opportunities: 0,
    societies: 0,
    skippedDuplicates: 0,
    errors: [],
  };

  // 1. Rubric
  if (scrapeRubric) {
    try {
      const rubric = await scrapeRubricEvents(maxRubricEvents);

      for (const society of rubric.societies) {
        await db.society.upsert({
          where: { name: society.name },
          update: { imageUrl: society.imageUrl },
          create: {
            name: society.name,
            imageUrl: society.imageUrl,
            category: "general",
          },
        });
        results.societies++;
      }

      await upsertEvents(db, rubric.events, results);
    } catch (error) {
      const msg = `Rubric scrape failed: ${error}`;
      console.error(msg);
      results.errors.push(msg);
    }
  }

  // 2. PwC
  if (scrapePwc) {
    try {
      const pwc = await scrapePwcEvents();
      await upsertEvents(db, pwc.events, results);
    } catch (error) {
      const msg = `PwC scrape failed: ${error}`;
      console.error(msg);
      results.errors.push(msg);
    }
  }

  // 3. Engineers Australia
  if (scrapeEngineersAustralia) {
    try {
      const ea = await scrapeEngineersAustraliaEvents();
      await upsertEvents(db, ea.events, results);
    } catch (error) {
      const msg = `Engineers Australia scrape failed: ${error}`;
      console.error(msg);
      results.errors.push(msg);
    }
  }

  // 4. UNSW Taste of Research
  if (scrapeUnsw) {
    try {
      const unsw = await scrapeUnswTorOpportunities();
      await upsertOpportunities(db, unsw.opportunities, results);
    } catch (error) {
      const msg = `UNSW TOR scrape failed: ${error}`;
      console.error(msg);
      results.errors.push(msg);
    }
  }

  return results;
}
