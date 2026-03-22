import { z } from "zod";

import { eventToFeedItem } from "~/lib/feed-mappers";
import { getDegreeRelatedTags, getLabelRelatedTags } from "~/lib/degree-tags";
import {
  MOCK_FEED_ITEMS,
  type FeedItem,
} from "~/lib/mock-opportunities";
import { ONBOARDING_USER_ID_COOKIE } from "~/lib/onboarding-cookie";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createSupabaseAdmin } from "~/server/supabase/admin";

function getEffectiveItemTags(item: {
  interestTags?: string[];
  degreeLabels?: string[];
}): string[] {
  const tags = [...(item.interestTags ?? [])];
  tags.push(...getLabelRelatedTags(item.degreeLabels));
  return [...new Set(tags)];
}

function getMatchingTagCount(
  item: { interestTags?: string[]; degreeLabels?: string[] },
  userTags: string[]
): number {
  if (!userTags.length) return 0;
  const effectiveTags = getEffectiveItemTags(item);
  if (!effectiveTags.length) return 0;
  const userSet = new Set(userTags.map((t) => t.toLowerCase()));
  return effectiveTags.filter((t) => userSet.has(t.toLowerCase())).length;
}

/** Filter to items matching user's degree or interests. Returns only matches; no fallback to all. */
function applyInterestFilter(items: FeedItem[], userTags: string[]): FeedItem[] {
  if (userTags.length === 0) return [];
  const withScores = items.map((item) => ({
    item,
    score: getMatchingTagCount(item, userTags),
  }));
  return withScores
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.dateSortKey.localeCompare(b.item.dateSortKey);
    })
    .map((x) => x.item);
}

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
    .query(async ({ ctx, input }): Promise<{ items: FeedItem[]; userTags: string[] }> => {
      const category = input?.category;

      let items: FeedItem[];

      if (category === "events" || !category) {
        const dbEvents = await ctx.db.event.findMany({
          where: { date: { gte: new Date() } },
          orderBy: { date: "asc" },
          include: { society: true },
        });
        const eventItems = dbEvents.map((e) => eventToFeedItem(e));
        if (category === "events") {
          items = eventItems;
        } else {
          const mockNonEvents = MOCK_FEED_ITEMS.filter((i) => i.feedCategory !== "events");
          items = [...eventItems, ...mockNonEvents];
        }
      } else {
        items = MOCK_FEED_ITEMS.filter((item) => item.feedCategory === category);
      }

      const cookieStore = ctx.cookies
        ? typeof ctx.cookies === "function"
          ? await ctx.cookies()
          : ctx.cookies
        : null;
      const userId = cookieStore?.get(ONBOARDING_USER_ID_COOKIE)?.value;

      let userTags: string[] = [];

      if (userId) {
        try {
          const supabase = createSupabaseAdmin();
          const { data: user, error } = await supabase
            .from("users")
            .select("interests, degree, major")
            .eq("id", userId)
            .maybeSingle();

          if (!error && user) {
            const interests = (user.interests as string[] | null) ?? [];
            const degree = typeof user.degree === "string" ? user.degree : "";
            const major = typeof user.major === "string" ? user.major : undefined;
            const degreeTags = getDegreeRelatedTags(degree, major);
            userTags = [...new Set([...interests, ...degreeTags])];
            items = applyInterestFilter(items, userTags);
          }
        } catch {
          // keep items as-is
        }
      }

      return { items, userTags };
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
          include: { society: true },
        });
        return event ? eventToFeedItem(event) : null;
      }
      const item = MOCK_FEED_ITEMS.find(
        (i) => i.id === input.id && i.type === input.type,
      );
      return item ?? null;
    }),
});
