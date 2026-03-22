import type { PrismaClient } from "../../../generated/prisma";
import { scrapeRubricEvents } from "./sources/rubric";

export async function scrapeAll(db: PrismaClient, maxRubricEvents = 50) {
  const results = {
    events: 0,
    societies: 0,
    skippedDuplicates: 0,
  };

  try {
    const rubric = await scrapeRubricEvents(maxRubricEvents);

    // Upsert societies
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

    // Insert events (skip duplicates by sourceUrl)
    for (const event of rubric.events) {
      const existing = await db.event.findFirst({
        where: { sourceUrl: event.sourceUrl },
      });
      if (existing) {
        results.skippedDuplicates++;
        continue;
      }

      // Link to society if it exists
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
  } catch (error) {
    console.error("Rubric scrape failed:", error);
  }

  return results;
}
