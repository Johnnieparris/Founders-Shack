import { GoogleGenAI } from "@google/genai";

import {
  getAllowedTagsForLabels,
  INTERESTS_BY_MAJOR,
  UNSW_DEGREE_MAJORS,
  UNSW_DEGREES,
} from "~/lib/onboarding-options";

const VALID_DEGREE_LABELS = new Set<string>([
  ...UNSW_DEGREES,
  ...([] as string[]).concat(...Object.values(UNSW_DEGREE_MAJORS)),
]);

export interface TaggingResult {
  tags: string[];
  degreeLabels: string[];
}

/**
 * Calls Gemini to suggest career interest tags AND degree/major labels for an event/opportunity.
 * Returns tags and degreeLabels (can be multiple) in a single API call.
 */
export async function suggestTagsAndDegreeLabel(
  apiKey: string,
  title: string,
  description: string,
  organiser = ""
): Promise<TaggingResult> {
  const ai = new GoogleGenAI({ apiKey });

  const degreeLabelsList = Array.from(VALID_DEGREE_LABELS).join(", ");

  const majorTagMappings = Object.entries(INTERESTS_BY_MAJOR)
    .filter(([, tags]) => tags.length > 0)
    .map(([major, tags]) => `- "${major}": ${tags.join(", ")}`)
    .join("\n");

  const prompt = `You are a career matching assistant for university events and opportunities.

IMPORTANT: Work in this order:
1. First determine DEGREE_LABELS from title, organiser, AND especially the description
2. Then determine TAGS using ONLY the allowed tags for those labels (union if multiple)

DEGREE_LABELS RULES:
- USE THE DESCRIPTION: The description is critical. E.g. "fusion energy device, designed and built by students" → Engineering majors (Mechanical, Electrical, Chemical). "Student-led fusion device" → clearly engineering.
- Assign MULTIPLE labels when relevant: e.g. robotics event → "Robotics and Mechatronics Engineering", "Mechanical Engineering", "Electrical Engineering". Fusion/energy → "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering".
- Use SPECIFIC majors when the content matches (Mechatronics, Software Engineering, Finance, etc.). Use overarching degree (e.g. "Bachelor of Engineering (Honours)") when the event is broad.
- TRY TO LABEL MOST EVENTS: Give 1–3 degree labels unless the event is clearly unrelated (pub crawl, sport, board games, generic social with no career/study content). Workshops, talks, projects, career panels → almost always have a degree match.
- Return "none" ONLY for purely social/sport events with no academic or career link (pub crawl, trivia night, casual hangout).

TAG SELECTION: Pick 1–5 tags ONLY from the lists below. If the degree label has NO configured tag list, return "none" for TAGS (leave blank).
${majorTagMappings || "(No degree-specific tag lists configured.)"}

TAG RULES:
- ORGANISER + DESCRIPTION: Use both to infer focus
- DO NOT TAG purely casual social events — return "none" for tags and labels

Valid degree/major labels (pick 1–3): ${degreeLabelsList}

Organiser/Society: ${organiser || "(unknown)"}
Title: ${title}
Description: ${description || "(no description)"}

Respond in this exact format:
DEGREE_LABELS: comma-separated labels from list, or "none"
TAGS: comma-separated tags or "none"`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  const text = response.text?.trim();
  let tags: string[] = [];
  let degreeLabels: string[] = [];

  if (text) {
    const labelsRegex = /DEGREE_LABELS?:\s*(.+?)(?:\n|$)/i;
    const tagsRegex = /TAGS:\s*(.+?)(?:\n|$)/is;
    const labelsMatch = labelsRegex.exec(text);
    const tagsMatch = tagsRegex.exec(text);

    if (labelsMatch) {
      const labelStr = labelsMatch[1]?.trim() ?? "";
      const lower = labelStr.toLowerCase();
      if (lower !== "none" && !lower.startsWith("n/a")) {
        degreeLabels = labelStr
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l && VALID_DEGREE_LABELS.has(l));
        degreeLabels = [...new Set(degreeLabels)].slice(0, 5);
      }
    }

    const allowedTags = new Set(getAllowedTagsForLabels(degreeLabels));

    if (tagsMatch) {
      const tagStr = tagsMatch[1]?.trim() ?? "";
      const lower = tagStr.toLowerCase();
      if (lower !== "none" && !lower.startsWith("n/a")) {
        const suggested = tagStr
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t && allowedTags.has(t));
        tags = [...new Set(suggested)].slice(0, 5);
      }
    }
  }

  return { tags, degreeLabels };
}

/** Legacy: returns only tags. Use suggestTagsAndDegreeLabel for both. */
export async function suggestInterestTags(
  apiKey: string,
  title: string,
  description: string,
  organiser = ""
): Promise<string[]> {
  const result = await suggestTagsAndDegreeLabel(apiKey, title, description, organiser);
  return result.tags;
}
