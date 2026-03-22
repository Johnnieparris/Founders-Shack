import { NextResponse } from "next/server";

import { suggestTagsAndDegreeLabel } from "~/lib/gemini-tags";
import { db } from "~/server/db";

export const maxDuration = 300;

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set in .env" },
      { status: 500 }
    );
  }

  const results = { events: { processed: 0, updated: 0 }, opportunities: { processed: 0, updated: 0 } };

  try {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const DELAY_MS = 500;

    const events = await db.event.findMany({
      select: { id: true, name: true, description: true, aiSummary: true, organiser: true },
    });
    for (const event of events) {
      if (results.events.processed > 0) await sleep(DELAY_MS);
      results.events.processed++;
      const text = event.description ?? event.aiSummary ?? "";
      const { tags, degreeLabels } = await suggestTagsAndDegreeLabel(
        apiKey,
        event.name,
        text,
        event.organiser
      );
      await db.event.update({
        where: { id: event.id },
        data: { interestTags: tags, degreeLabels },
      });
      results.events.updated++;
    }

    const opportunities = await db.opportunity.findMany({
      include: { society: { select: { name: true } } },
    });
    for (const opp of opportunities) {
      if (results.opportunities.processed > 0) await sleep(DELAY_MS);
      results.opportunities.processed++;
      const organiser = opp.society?.name ?? "";
      const { tags, degreeLabels } = await suggestTagsAndDegreeLabel(
        apiKey,
        opp.name,
        opp.description ?? "",
        organiser
      );
      await db.opportunity.update({
        where: { id: opp.id },
        data: { interestTags: tags, degreeLabels },
      });
      results.opportunities.updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Tagged ${results.events.updated} events and ${results.opportunities.updated} opportunities.`,
      results,
    });
  } catch (err) {
    console.error("[tag-with-gemini]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Tagging failed" },
      { status: 500 }
    );
  }
}
