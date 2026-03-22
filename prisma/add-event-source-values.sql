-- Add PWC and ENGINEERS_AUSTRALIA to EventSource enum
-- Run if events fail with "Value 'PWC' not found in enum 'EventSource'"

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PWC' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventSource')) THEN
    ALTER TYPE "EventSource" ADD VALUE 'PWC';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL; -- value already exists
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ENGINEERS_AUSTRALIA' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventSource')) THEN
    ALTER TYPE "EventSource" ADD VALUE 'ENGINEERS_AUSTRALIA';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
