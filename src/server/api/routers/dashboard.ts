import { z } from "zod";

import { eventToFeedItem, opportunityToFeedItem } from "~/lib/feed-mappers";
import { getDegreeRelatedTags } from "~/lib/degree-tags";
import type { FeedItem } from "~/lib/mock-opportunities";
import { ONBOARDING_USER_ID_COOKIE } from "~/lib/onboarding-cookie";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createSupabaseAdmin } from "~/server/supabase/admin";

/** Tags used for matching: only explicit interestTags. Degree-derived tags cause false positives. */
function getEffectiveItemTags(item: { interestTags?: string[] }): string[] {
  return item.interestTags ?? [];
}

function hasDegreeOverlap(
  item: { degreeLabels?: string[] },
  userDegree: string,
  userMajor?: string
): boolean {
  const labels = item.degreeLabels ?? [];
  if (!labels.length) return false;
  const toMatch = [userDegree, userMajor].filter(Boolean).map((s) => s.trim().toLowerCase());
  if (!toMatch.length) return false;
  const labelSet = new Set(labels.map((l) => l.trim().toLowerCase()));
  return toMatch.some((m) => labelSet.has(m));
}

function getMatchingScore(
  item: { interestTags?: string[]; degreeLabels?: string[] },
  userTags: string[],
  userDegree: string,
  userMajor?: string
): number {
  const effectiveTags = getEffectiveItemTags(item);
  const userSet = new Set(userTags.map((t) => t.toLowerCase()));
  const tagMatches = effectiveTags.filter((t) => userSet.has(t.toLowerCase())).length;
  const degreeMatch = hasDegreeOverlap(item, userDegree, userMajor) ? 1 : 0;
  return tagMatches + (degreeMatch * 10);
}

/** Filter to items matching user's degree (overlap with degreeLabels) or interests. */
function applyInterestFilter(
  items: FeedItem[],
  userTags: string[],
  userDegree: string,
  userMajor?: string
): FeedItem[] {
  const hasUserPrefs = userTags.length > 0 || userDegree || userMajor;
  if (!hasUserPrefs) return [];
  const withScores = items.map((item) => ({
    item,
    score: getMatchingScore(item, userTags, userDegree, userMajor),
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

      if (category === "events") {
        const dbEvents = await ctx.db.event.findMany({
          where: { date: { gte: new Date() } },
          orderBy: { date: "asc" },
          include: { society: true },
        });
        items = dbEvents.map((e) => eventToFeedItem(e));
      } else if (category === "applications") {
        const dbOpportunities = await ctx.db.opportunity.findMany({
          orderBy: [
            { applicationDeadline: "asc" },
            { createdAt: "desc" },
          ],
          include: { society: true },
        });
        items = dbOpportunities.map((o) => opportunityToFeedItem(o));
      } else if (category === "admin") {
        items = [];
      } else {
        const [dbEvents, dbOpportunities] = await Promise.all([
          ctx.db.event.findMany({
            where: { date: { gte: new Date() } },
            orderBy: { date: "asc" },
            include: { society: true },
          }),
          ctx.db.opportunity.findMany({
            orderBy: [
              { applicationDeadline: "asc" },
              { createdAt: "desc" },
            ],
            include: { society: true },
          }),
        ]);
        const eventItems = dbEvents.map((e) => eventToFeedItem(e));
        const opportunityItems = dbOpportunities.map((o) => opportunityToFeedItem(o));
        items = [...eventItems, ...opportunityItems];
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
            items = applyInterestFilter(items, userTags, degree, major);
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
      const opportunity = await ctx.db.opportunity.findUnique({
        where: { id: input.id },
        include: { society: true },
      });
      return opportunity ? opportunityToFeedItem(opportunity) : null;
    }),
});
