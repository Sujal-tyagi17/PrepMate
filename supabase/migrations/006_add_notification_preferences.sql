-- Add notification preferences and focus areas to users table

-- Add notification preference columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS notification_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_score_updates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_new_features BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_tips BOOLEAN DEFAULT true;

-- Add focus areas column (JSONB array to store user's selected focus areas)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}';

-- Add interview preferences columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS voice_speed DECIMAL(2,1) DEFAULT 1.0 CHECK (voice_speed >= 0.5 AND voice_speed <= 2.0),
ADD COLUMN IF NOT EXISTS strict_mode BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN users.notification_reminders IS 'Daily nudges when streak is at risk';
COMMENT ON COLUMN users.notification_score_updates IS 'Notify when analytics change significantly';
COMMENT ON COLUMN users.notification_new_features IS 'Product announcements and updates';
COMMENT ON COLUMN users.notification_tips IS 'Weekly interview tips from AI';
COMMENT ON COLUMN users.focus_areas IS 'Array of user selected focus areas for personalized content';
COMMENT ON COLUMN users.voice_speed IS 'AI voice speed preference (0.5 to 2.0)';
COMMENT ON COLUMN users.strict_mode IS 'Enable strict feedback mode for detailed critiques';
