import puppeteer from "puppeteer";
import type { ScrapedOpportunity } from "../types";

const UNSW_TOR_URL =
  "https://www.unsw.edu.au/engineering/student-life/undergraduate-research-opportunities/advertised-taste-research-areas";
const SOURCE_ID = "UNSW_TOR";

export async function scrapeUnswTorOpportunities(): Promise<{
  opportunities: ScrapedOpportunity[];
}> {
  const opportunities: ScrapedOpportunity[] = [];

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (compatible; FounderShack/1.0)",
    );

    await page.goto(UNSW_TOR_URL, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for dynamic content to load
    // The search component renders results after JS execution
    await page.waitForSelector(
      '[data-component-id], .search-results, .card, article, .result-item',
      { timeout: 10000 },
    ).catch(() => {
      // Component might not exist if no results
      console.log("UNSW TOR: No search results container found");
    });

    // Give extra time for any AJAX-loaded content
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Extract research project listings from the rendered page
    const items = await page.evaluate(() => {
      const results: Array<{
        title: string;
        description: string | null;
        url: string | null;
      }> = [];

      // Try multiple selectors since the exact structure may vary
      const selectors = [
        ".search-results a",
        ".result-item",
        "article",
        ".card",
        '[class*="result"] a',
        '[class*="item"] a',
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) continue;

        elements.forEach((el) => {
          const titleEl =
            el.querySelector("h3, h4, h2, .title") ??
            el.querySelector("a");
          const title = titleEl?.textContent?.trim() ?? "";
          if (!title || title.length < 5) return;

          const descEl = el.querySelector("p, .description, .summary");
          const description = descEl?.textContent?.trim() ?? null;

          const linkEl =
            el instanceof HTMLAnchorElement
              ? el
              : el.querySelector("a");
          const url = linkEl?.href ?? null;

          // Avoid duplicates
          if (results.some((r) => r.title === title)) return;

          results.push({ title, description, url });
        });

        if (results.length > 0) break;
      }

      return results;
    });

    for (const item of items) {
      const url =
        item.url ??
        UNSW_TOR_URL;

      opportunities.push({
        name: item.title,
        description: item.description,
        type: "RESEARCH",
        applicationDeadline: null,
        url,
        sourceUrl: url,
        source: SOURCE_ID,
      });
    }
  } catch (err) {
    console.error("UNSW TOR scrape failed:", err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return { opportunities };
}
