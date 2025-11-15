-- ==================================================================
-- DELETE VSA EVENTS FROM PRODUCTION DATABASE
-- ==================================================================
-- Run this SQL in your Supabase SQL Editor to remove VSA events
-- from the production database (if any exist)
-- ==================================================================

-- First, let's see if there are any VSA-related events
-- Uncomment this to check first:
-- SELECT id, title, created_at, author_username
-- FROM discussions
-- WHERE category = 'events' 
--   AND (title ILIKE '%VSA%' OR title ILIKE '%Vietnamese%' OR content ILIKE '%Vietnamese Student Association%');

-- Delete VSA events from discussions
DELETE FROM discussions
WHERE category = 'events'
  AND (
    title ILIKE '%VSA%' 
    OR title ILIKE '%Vietnamese Student Association%'
    OR content ILIKE '%Vietnamese Student Association%'
  );

-- ==================================================================
-- RESULTS
-- ==================================================================
-- This will delete:
-- 1. VSA Lunar New Year Celebration
-- 2. VSA Weekly Game Night
-- 3. Vietnamese Student Association: Phở Night Fundraiser
-- 4. VSA Cultural Exchange Dinner
--
-- Note: This also deletes all associated replies and votes due to
-- CASCADE delete constraints
-- ==================================================================

