import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { scrapeAll } from "~/server/scraping/scrape-all";

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z
            .enum([
              "INDUSTRY_PROGRAM",
              "NETWORKING",
              "CAREER_FAIR",
              "COMPANY_TALK",
              "SOCIAL",
              "WORKSHOP",
              "HACKATHON",
            ])
            .optional(),
          limit: z.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const events = await ctx.db.event.findMany({
        where: {
          date: { gte: new Date() },
          ...(input?.category ? { category: input.category } : {}),
        },
        orderBy: { date: "asc" },
        take: limit + 1,
        ...(input?.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        include: { society: true },
      });

      let nextCursor: string | undefined;
      if (events.length > limit) {
        const nextItem = events.pop();
        nextCursor = nextItem?.id;
      }

      return { events, nextCursor };
    }),

  scrapeAll: publicProcedure
    .input(
      z
        .object({
          maxRubricEvents: z.number().min(1).max(500).default(50),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await scrapeAll(
        ctx.db,
        input?.maxRubricEvents ?? 50,
      );
      return results;
    }),
});
