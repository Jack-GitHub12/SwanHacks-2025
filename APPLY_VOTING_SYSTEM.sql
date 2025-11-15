-- ==================================================================
-- VOTING SYSTEM SETUP FOR BOOKSTER
-- ==================================================================
-- Run this SQL in your Supabase SQL Editor to enable the voting system
-- This will allow users to upvote/downvote events and discussions
-- ==================================================================

-- Step 1: Add voting columns to discussions table (if not already added)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='discussions' AND column_name='upvotes') THEN
        ALTER TABLE discussions ADD COLUMN upvotes INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='discussions' AND column_name='downvotes') THEN
        ALTER TABLE discussions ADD COLUMN downvotes INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='discussions' AND column_name='vote_score') THEN
        ALTER TABLE discussions ADD COLUMN vote_score INTEGER DEFAULT 0;
    END IF;
END $$;

-- Step 2: Create discussion_votes table (if not exists)
CREATE TABLE IF NOT EXISTS discussion_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    UNIQUE(discussion_id, user_id)
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_discussion_votes_discussion_id ON discussion_votes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_votes_user_id ON discussion_votes(user_id);

-- Step 4: Enable RLS on discussion_votes
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop old policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view votes" ON discussion_votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON discussion_votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON discussion_votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON discussion_votes;

-- Step 6: Create RLS policies for discussion_votes
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

-- Step 7: Create or replace the vote count update function
CREATE OR REPLACE FUNCTION update_discussion_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
    up_count INTEGER;
    down_count INTEGER;
    target_discussion_id UUID;
BEGIN
    -- Get the discussion_id from either NEW or OLD
    target_discussion_id := COALESCE(NEW.discussion_id, OLD.discussion_id);
    
    -- Get current vote counts
    SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'up'),
        COUNT(*) FILTER (WHERE vote_type = 'down')
    INTO up_count, down_count
    FROM discussion_votes
    WHERE discussion_id = target_discussion_id;
    
    -- Update the discussion with new counts
    UPDATE discussions
    SET 
        upvotes = up_count,
        downvotes = down_count,
        vote_score = up_count - down_count,
        updated_at = NOW()
    WHERE id = target_discussion_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Drop old trigger if exists and create new one
DROP TRIGGER IF EXISTS update_vote_counts ON discussion_votes;
CREATE TRIGGER update_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON discussion_votes
FOR EACH ROW
EXECUTE FUNCTION update_discussion_vote_counts();

-- Step 9: Initialize vote counts for existing discussions (set all to 0)
UPDATE discussions
SET 
    upvotes = COALESCE(upvotes, 0),
    downvotes = COALESCE(downvotes, 0),
    vote_score = COALESCE(vote_score, 0)
WHERE upvotes IS NULL OR downvotes IS NULL OR vote_score IS NULL;

-- ==================================================================
-- VERIFICATION QUERIES
-- ==================================================================
-- Run these queries to verify the voting system is set up correctly

-- Check if vote columns exist in discussions table
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'discussions' 
-- AND column_name IN ('upvotes', 'downvotes', 'vote_score');

-- Check if discussion_votes table exists
-- SELECT COUNT(*) as vote_records FROM discussion_votes;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'discussion_votes';

-- ==================================================================
-- SUCCESS!
-- ==================================================================
-- Your voting system is now ready!
-- Users can upvote/downvote discussions and events
-- Vote counts will automatically update when users vote
-- ==================================================================

