-- Add interestTags column to Event and Opportunity tables
-- Run this in your database (e.g. Supabase SQL Editor) if the column doesn't exist yet.

ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "interestTags" TEXT[] DEFAULT '{}';
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "interestTags" TEXT[] DEFAULT '{}';
