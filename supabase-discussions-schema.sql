-- Discussion Board Schema for Bookster
-- Run this in the SQL Editor in your Supabase dashboard

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
    content TEXT NOT NULL CHECK (char_length(content) >= 10),
    category TEXT NOT NULL CHECK (category IN ('clubs', 'events', 'general', 'study-groups', 'housing', 'jobs')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pinned')),
    views INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    -- Event-specific fields
    event_date TEXT,
    event_time TEXT,
    event_end_time TEXT,
    event_location TEXT
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) >= 1),
    parent_reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_status ON discussions(status);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_user_id ON discussions(user_id);
CREATE INDEX idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_user_id ON discussion_replies(user_id);

-- Enable Row Level Security
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Policies for discussions
CREATE POLICY "Authenticated users can view active discussions"
ON discussions
FOR SELECT
TO authenticated
USING (status IN ('active', 'pinned'));

CREATE POLICY "Authenticated users can create discussions"
ON discussions
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    title IS NOT NULL AND
    content IS NOT NULL AND
    category IS NOT NULL
);

CREATE POLICY "Users can update their own discussions"
ON discussions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions"
ON discussions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Policies for replies
CREATE POLICY "Authenticated users can view replies"
ON discussion_replies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create replies"
ON discussion_replies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND content IS NOT NULL);

CREATE POLICY "Users can update their own replies"
ON discussion_replies
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies"
ON discussion_replies
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE discussions
    SET views = views + 1
    WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update reply count
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE discussions
        SET reply_count = reply_count + 1,
            updated_at = NOW()
        WHERE id = NEW.discussion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE discussions
        SET reply_count = GREATEST(reply_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.discussion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update reply count
CREATE TRIGGER update_discussion_reply_count
AFTER INSERT OR DELETE ON discussion_replies
FOR EACH ROW
EXECUTE FUNCTION update_reply_count();

-- Create view for discussions with user profile data
-- Note: Use user_profiles instead of auth.users to avoid exposing sensitive auth data
CREATE OR REPLACE VIEW discussions_with_user
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
    d.updated_at DESC;

-- Create view for replies with user profile data
CREATE OR REPLACE VIEW discussion_replies_with_user
WITH (security_invoker = true) AS
SELECT
    r.*,
    p.display_name as author_name,
    p.username as author_username
FROM discussion_replies r
LEFT JOIN user_profiles p ON r.user_id = p.id
ORDER BY r.created_at ASC;

