-- Migrate degreeLabel (single) to degreeLabels (array) on Event and Opportunity
-- Run in Supabase SQL Editor. Safe if degreeLabel doesn't exist (only adds degreeLabels).

ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "degreeLabels" TEXT[] DEFAULT '{}';
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "degreeLabels" TEXT[] DEFAULT '{}';

-- Migrate existing data if degreeLabel column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Event' AND column_name = 'degreeLabel') THEN
    UPDATE "Event" SET "degreeLabels" = ARRAY["degreeLabel"] WHERE "degreeLabel" IS NOT NULL AND "degreeLabel" != '';
    ALTER TABLE "Event" DROP COLUMN "degreeLabel";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Opportunity' AND column_name = 'degreeLabel') THEN
    UPDATE "Opportunity" SET "degreeLabels" = ARRAY["degreeLabel"] WHERE "degreeLabel" IS NOT NULL AND "degreeLabel" != '';
    ALTER TABLE "Opportunity" DROP COLUMN "degreeLabel";
  END IF;
END $$;
