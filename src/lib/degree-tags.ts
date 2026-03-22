/**
 * Maps degree and major to career interest tags for feed filtering.
 * Used to match events/opportunities that are relevant to a user's field of study.
 */

import { UNSW_DEGREE_MAJORS } from "~/lib/onboarding-options";

const DEGREE_TAG_MAP: Record<string, string[]> = {
  "Bachelor of Commerce": ["Finance", "Consulting", "Marketing", "Management", "Business"],
  "Bachelor of Economics": ["Finance", "Consulting", "Data Science", "Management"],
  "Bachelor of Actuarial Studies": ["Finance", "Data Science", "Consulting"],
  "Bachelor of Information Systems": ["Tech", "Data Science", "Management", "Cybersecurity"],
  "Bachelor of Engineering (Honours)": ["Engineering", "Tech", "Research"],
  "Bachelor of Science (Computer Science)": ["Tech", "Data Science", "Artificial Intelligence", "Cybersecurity"],
  "Bachelor of Data Science and Decisions": ["Data Science", "Tech", "Finance"],
  "Bachelor of Science": ["Research", "Data Science", "Healthcare", "Sustainability"],
  "Bachelor of Advanced Science (Honours)": ["Research", "Data Science", "Healthcare"],
  "Bachelor of Science (Advanced Mathematics) (Honours)": ["Data Science", "Finance", "Research"],
  "Bachelor of Environmental Management": ["Sustainability", "Research", "Government"],
  "Bachelor of Medical Science": ["Healthcare", "Research"],
  "Bachelor of Psychological Science": ["Healthcare", "Research", "Human Resources"],
  "Bachelor of Arts": ["Design", "Media", "Creative Arts", "Government", "Education"],
  "Bachelor of Social Sciences": ["Government", "Marketing", "Management", "Sustainability"],
  "Bachelor of Media": ["Media", "Creative Arts", "Marketing", "Design"],
  "Bachelor of Design": ["Design", "Creative Arts"],
  "Bachelor of Fine Arts": ["Creative Arts", "Design", "Media"],
  "Bachelor of Cyber Security": ["Cybersecurity", "Tech"],
  "Bachelor of Psychology (Honours)": ["Healthcare", "Research"],
  "Bachelor of Biotechnology (Honours)": ["Research", "Healthcare", "Sustainability"],
  "Bachelor of Medicinal Chemistry (Honours)": ["Healthcare", "Research"],
  "Bachelor of Architectural Studies": ["Design", "Real Estate"],
  "Bachelor of City Planning (Honours)": ["Government", "Real Estate", "Sustainability"],
  "Bachelor of Construction Management and Property (Honours)": ["Real Estate", "Management"],
  "Bachelor of Interior Architecture (Honours)": ["Design", "Creative Arts"],
  "Bachelor of Criminology and Criminal Justice": ["Law", "Government"],
  "Bachelor of Social Work (Honours)": ["Healthcare", "Non-profit", "Government"],
  "Bachelor of Aviation (Flying)": ["Management", "Operations"],
  "Bachelor of Aviation (Management)": ["Management", "Operations"],
  "Bachelor of Vision Science": ["Healthcare"],
  "Bachelor of Education (Primary) (Honours)": ["Education"],
  "Bachelor of Education (Secondary) (Honours)": ["Education"],
};

/**
 * Derives career interest tags from a user's degree and optionally their major.
 * Returns tags that can be used to match events and opportunities.
 */
export function getDegreeRelatedTags(degree: string, major?: string): string[] {
  const tags = new Set<string>();

  const degreeTags = DEGREE_TAG_MAP[degree];
  if (degreeTags) {
    degreeTags.forEach((t) => tags.add(t));
  }

  if (major && major !== "N/A") {
    const majorLower = major.toLowerCase();
    if (majorLower.includes("finance") || majorLower.includes("accounting")) {
      tags.add("Finance");
      tags.add("Investment Banking");
    }
    if (majorLower.includes("marketing")) tags.add("Marketing");
    if (majorLower.includes("computer") || majorLower.includes("software")) {
      tags.add("Tech");
      tags.add("Engineering");
    }
    if (majorLower.includes("data") || majorLower.includes("ai")) {
      tags.add("Data Science");
      tags.add("Artificial Intelligence");
    }
    if (majorLower.includes("entrepreneur") || majorLower.includes("innovation")) {
      tags.add("Startups");
      tags.add("Entrepreneurship");
    }
    if (majorLower.includes("law") || majorLower.includes("legal")) tags.add("Law");
    if (majorLower.includes("health") || majorLower.includes("medicine") || majorLower.includes("bio")) {
      tags.add("Healthcare");
    }
    if (majorLower.includes("design")) tags.add("Design");
  }

  return Array.from(tags);
}

/**
 * Maps an event/opportunity degree label (degree or major string) to career tags for matching.
 */
function getSingleLabelRelatedTags(label: string | null | undefined): string[] {
  if (!label?.trim()) return [];
  const degreeTags = DEGREE_TAG_MAP[label];
  if (degreeTags) return degreeTags;
  for (const [degree, majors] of Object.entries(UNSW_DEGREE_MAJORS)) {
    if (majors.includes(label)) {
      return getDegreeRelatedTags(degree, label);
    }
  }
  return getDegreeRelatedTags(label, label);
}

/**
 * Maps event/opportunity degreeLabels (array) to career tags for matching. Unions tags from all labels.
 */
export function getLabelRelatedTags(
  labels: string | string[] | null | undefined
): string[] {
  const arr = Array.isArray(labels) ? labels : labels ? [labels] : [];
  const seen = new Set<string>();
  for (const label of arr) {
    for (const t of getSingleLabelRelatedTags(label)) seen.add(t);
  }
  return [...seen];
}
