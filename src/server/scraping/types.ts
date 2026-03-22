import type { EventCategory, EventSource, OpportunityType } from "../../../generated/prisma";

export interface ScrapedEvent {
  name: string;
  organiser: string;
  description: string | null;
  category: EventCategory;
  date: Date;
  endDate: Date | null;
  location: string | null;
  source: EventSource;
  sourceUrl: string;
  imageUrl: string | null;
}

export interface ScrapedSociety {
  name: string;
  imageUrl: string | null;
  rubricId?: number;
}

export interface ScrapedOpportunity {
  name: string;
  description: string | null;
  type: OpportunityType;
  applicationDeadline: Date | null;
  url: string;
  sourceUrl: string;
  source: string;
}
