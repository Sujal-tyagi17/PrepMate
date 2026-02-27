-- Fix interview type constraint to allow all types
-- Run this in your Supabase SQL Editor

-- First, check what constraint exists (if any)
-- SELECT * FROM pg_constraint WHERE conrelid = 'interviews'::regclass;

-- Drop any existing check constraint on type column
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'interviews'::regclass 
        AND conname LIKE '%type%'
    ) THEN
        EXECUTE 'ALTER TABLE interviews DROP CONSTRAINT ' || (
            SELECT conname FROM pg_constraint 
            WHERE conrelid = 'interviews'::regclass 
            AND conname LIKE '%type%'
            LIMIT 1
        );
    END IF;
END $$;

-- Add correct check constraint that allows all 4 interview types
ALTER TABLE interviews
DROP CONSTRAINT IF EXISTS interviews_type_check;

ALTER TABLE interviews
ADD CONSTRAINT interviews_type_check 
CHECK (type IN ('technical', 'behavioral', 'system-design', 'mixed'));

-- Verify it works
SELECT 'Constraint updated successfully' as status;
