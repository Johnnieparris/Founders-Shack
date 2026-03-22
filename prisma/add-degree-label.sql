-- Add degreeLabel column to Event and Opportunity tables
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "degreeLabel" TEXT;
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "degreeLabel" TEXT;
