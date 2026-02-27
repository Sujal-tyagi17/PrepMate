-- Add job_description column to interviews table
-- This allows storing job descriptions for AI to analyze and generate relevant questions

ALTER TABLE interviews 
ADD COLUMN IF NOT EXISTS job_description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN interviews.job_description IS 'Job description text for AI to analyze and generate targeted interview questions';
