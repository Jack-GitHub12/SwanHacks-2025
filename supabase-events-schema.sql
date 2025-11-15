-- Events and Voting System for Bookster Discussion Board
-- Run this AFTER supabase-discussions-schema.sql

-- Add event-specific fields to discussions table
ALTER TABLE discussions
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS event_time TEXT,
ADD COLUMN IF NOT EXISTS event_location TEXT,
ADD COLUMN IF NOT EXISTS event_end_time TEXT,
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0;

-- Create votes table for tracking user votes
CREATE TABLE IF NOT EXISTS discussion_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    UNIQUE(discussion_id, user_id)
);

-- Create index for votes
CREATE INDEX idx_discussion_votes_discussion_id ON discussion_votes(discussion_id);
CREATE INDEX idx_discussion_votes_user_id ON discussion_votes(user_id);

-- Enable RLS on votes
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;

-- Policies for votes
CREATE POLICY "Authenticated users can view votes"
ON discussion_votes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own votes"
ON discussion_votes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
ON discussion_votes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
ON discussion_votes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_discussion_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
    up_count INTEGER;
    down_count INTEGER;
BEGIN
    -- Get current counts
    SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'up'),
        COUNT(*) FILTER (WHERE vote_type = 'down')
    INTO up_count, down_count
    FROM discussion_votes
    WHERE discussion_id = COALESCE(NEW.discussion_id, OLD.discussion_id);
    
    -- Update discussion
    UPDATE discussions
    SET 
        upvotes = up_count,
        downvotes = down_count,
        vote_score = up_count - down_count,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.discussion_id, OLD.discussion_id);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote counts
DROP TRIGGER IF EXISTS update_vote_counts ON discussion_votes;
CREATE TRIGGER update_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON discussion_votes
FOR EACH ROW
EXECUTE FUNCTION update_discussion_vote_counts();

-- Create view for events feed (sorted by votes and date)
-- Note: Use user_profiles instead of auth.users to avoid exposing sensitive auth data
CREATE OR REPLACE VIEW events_feed
WITH (security_invoker = true) AS
SELECT 
    d.*,
    p.display_name as author_name,
    p.username as author_username
FROM discussions d
LEFT JOIN user_profiles p ON d.user_id = p.id
WHERE d.category = 'events' 
  AND d.status IN ('active', 'pinned')
  AND d.event_date IS NOT NULL
  AND d.event_date >= NOW()  -- Only show upcoming events
ORDER BY 
    CASE WHEN d.status = 'pinned' THEN 0 ELSE 1 END,
    d.vote_score DESC,  -- Sort by vote score
    d.event_date ASC;    -- Then by date

-- Create view for discussions with vote info
CREATE OR REPLACE VIEW discussions_with_votes
WITH (security_invoker = true) AS
SELECT 
    d.*,
    p.display_name as author_name,
    p.username as author_username
FROM discussions d
LEFT JOIN user_profiles p ON d.user_id = p.id
WHERE d.status IN ('active', 'pinned')
ORDER BY 
    CASE WHEN d.status = 'pinned' THEN 0 ELSE 1 END,
    d.vote_score DESC,
    d.updated_at DESC;

-- Function to get user's vote on a discussion
CREATE OR REPLACE FUNCTION get_user_vote(p_discussion_id UUID, p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    vote TEXT;
BEGIN
    SELECT vote_type INTO vote
    FROM discussion_votes
    WHERE discussion_id = p_discussion_id AND user_id = p_user_id;
    
    RETURN vote;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

