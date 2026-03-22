import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  MOCK_FEED_ITEMS,
  type FeedItem,
} from "~/lib/mock-opportunities";

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
    .query(({ input }): FeedItem[] => {
      const category = input?.category;
      if (!category) {
        return MOCK_FEED_ITEMS;
      }
      return MOCK_FEED_ITEMS.filter((item) => item.feedCategory === category);
    }),

  getOpportunityById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["event", "opportunity"]),
      }),
    )
    .query(({ input }): FeedItem | null => {
      const item = MOCK_FEED_ITEMS.find(
        (i) => i.id === input.id && i.type === input.type,
      );
      return item ?? null;
    }),
});
