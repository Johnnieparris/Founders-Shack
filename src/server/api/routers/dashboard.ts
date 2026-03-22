import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eventToFeedItem, opportunityToFeedItem } from "~/lib/feed-mappers";
import type { FeedItem } from "~/lib/mock-opportunities";

export const dashboardRouter = createTRPCRouter({
  getFeed: publicProcedure
    .input(
      z
        .object({
          category: z
            .enum(["events", "applications", "admin"])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }): Promise<FeedItem[]> => {
      const category = input?.category;
      const now = new Date();

      if (category === "events") {
        const events = await ctx.db.event.findMany({
          where: { date: { gte: now } },
          orderBy: { date: "asc" },
          include: { society: { select: { name: true } } },
        });
        return events.map(eventToFeedItem);
      }

      if (category === "applications") {
        const opportunities = await ctx.db.opportunity.findMany({
          where: {
            OR: [
              { applicationDeadline: { gte: now } },
              { applicationDeadline: null },
            ],
          },
          orderBy: { applicationDeadline: "asc" },
          include: { society: { select: { name: true } } },
        });
        return opportunities.map(opportunityToFeedItem);
      }

      // Admin: no Prisma model yet, return empty
      if (category === "admin") {
        return [];
      }

      // No category: return all (events + applications)
      const [events, opportunities] = await Promise.all([
        ctx.db.event.findMany({
          where: { date: { gte: now } },
          orderBy: { date: "asc" },
          include: { society: { select: { name: true } } },
        }),
        ctx.db.opportunity.findMany({
          where: {
            OR: [
              { applicationDeadline: { gte: now } },
              { applicationDeadline: null },
            ],
          },
          orderBy: { applicationDeadline: "asc" },
          include: { society: { select: { name: true } } },
        }),
      ]);

      const eventItems = events.map(eventToFeedItem);
      const oppItems = opportunities.map(opportunityToFeedItem);
      const all = [...eventItems, ...oppItems].sort(
        (a, b) => a.dateSortKey.localeCompare(b.dateSortKey)
      );
      return all;
    }),

  getOpportunityById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["event", "opportunity"]),
      }),
    )
    .query(async ({ ctx, input }): Promise<FeedItem | null> => {
      if (input.type === "event") {
        const event = await ctx.db.event.findUnique({
          where: { id: input.id },
          include: { society: { select: { name: true } } },
        });
        return event ? eventToFeedItem(event) : null;
      }

      const opportunity = await ctx.db.opportunity.findUnique({
        where: { id: input.id },
        include: { society: { select: { name: true } } },
      });
      return opportunity ? opportunityToFeedItem(opportunity) : null;
    }),
});
